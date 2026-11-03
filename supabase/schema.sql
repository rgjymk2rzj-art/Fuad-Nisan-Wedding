-- ============================================================================
-- Fuad & Nisan wedding — Supabase schema
-- Run once in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run: objects are created or replaced.
--
-- Security model
--   * Guests (anon role) never touch tables directly. They can only call three
--     functions: submit_rsvp, get_rsvp (needs the private edit code) and
--     leave_note. Row Level Security blocks every direct read/write.
--   * The couple sign in on /admin/ with a Supabase Auth user whose email is
--     listed in public.admins. Only they can read or delete responses.
-- ============================================================================

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  edit_code text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  party_size smallint not null,
  arrival_date date,
  henna_attending boolean not null,
  henna_guests smallint not null default 0,
  nikah_attending boolean not null,
  nikah_guests smallint not null default 0,
  reception_attending boolean not null,
  reception_guests smallint not null default 0,
  dietary text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  update_count integer not null default 0,
  constraint rsvps_party_size check (party_size between 1 and 10),
  constraint rsvps_guests check (
    henna_guests between 0 and party_size
    and nikah_guests between 0 and party_size
    and reception_guests between 0 and party_size),
  constraint rsvps_name check (char_length(full_name) between 2 and 120),
  constraint rsvps_email check (char_length(email) <= 200 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint rsvps_phone check (char_length(phone) between 6 and 40),
  constraint rsvps_dietary check (dietary is null or char_length(dietary) <= 500),
  constraint rsvps_notes check (notes is null or char_length(notes) <= 2000)
);
create unique index if not exists rsvps_email_unique on public.rsvps (lower(email));

create table if not exists public.gift_notes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text check (email is null or char_length(email) <= 200),
  message text not null check (char_length(message) between 1 and 2000),
  amount numeric(12, 2) check (amount is null or (amount >= 0 and amount < 10000000)),
  method text check (method is null or char_length(method) <= 60),
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  email text primary key
);

alter table public.rsvps enable row level security;
alter table public.gift_notes enable row level security;
alter table public.admins enable row level security;

-- No direct writes from the browser — everything goes through the functions.
revoke all on public.rsvps, public.gift_notes, public.admins from anon;
revoke insert, update, truncate, references, trigger on public.rsvps, public.gift_notes, public.admins from authenticated;
grant select, delete on public.rsvps, public.gift_notes to authenticated;

-- ---------------------------------------------------------------------------
-- Admin check
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "admins read rsvps" on public.rsvps;
create policy "admins read rsvps" on public.rsvps for select to authenticated using (public.is_admin());
drop policy if exists "admins delete rsvps" on public.rsvps;
create policy "admins delete rsvps" on public.rsvps for delete to authenticated using (public.is_admin());
drop policy if exists "admins read notes" on public.gift_notes;
create policy "admins read notes" on public.gift_notes for select to authenticated using (public.is_admin());
drop policy if exists "admins delete notes" on public.gift_notes;
create policy "admins delete notes" on public.gift_notes for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._clean(t text, max_len integer)
returns text language sql immutable
as $$ select nullif(left(btrim(coalesce(t, '')), max_len), '') $$;

create or replace function public._rsvp_json(r public.rsvps)
returns jsonb language sql stable
as $$
  select jsonb_build_object(
    'full_name', r.full_name, 'email', r.email, 'phone', r.phone,
    'party_size', r.party_size, 'arrival_date', r.arrival_date,
    'henna_attending', r.henna_attending, 'henna_guests', r.henna_guests,
    'nikah_attending', r.nikah_attending, 'nikah_guests', r.nikah_guests,
    'reception_attending', r.reception_attending, 'reception_guests', r.reception_guests,
    'dietary', r.dietary, 'notes', r.notes, 'updated_at', r.updated_at);
$$;

-- ---------------------------------------------------------------------------
-- submit_rsvp(p jsonb)
--   New response: omit edit_code. Returns { ok, edit_code, updated:false }.
--   Amend:        include edit_code.   Returns { ok, edit_code, updated:true }.
--   Errors (exception messages): already_submitted, invalid_code, email_taken,
--   invalid_<field>, busy.
-- ---------------------------------------------------------------------------
create or replace function public.submit_rsvp(p jsonb)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_code text := upper(regexp_replace(coalesce(p ->> 'edit_code', ''), '[^0-9A-Za-z]', '', 'g'));
  v_name text := public._clean(p ->> 'full_name', 120);
  v_email text := lower(public._clean(p ->> 'email', 200));
  v_phone text := public._clean(p ->> 'phone', 40);
  v_party integer;
  v_arrival date;
  v_h boolean; v_n boolean; v_r boolean;
  v_hg integer; v_ng integer; v_rg integer;
  v_diet text := public._clean(p ->> 'dietary', 500);
  v_notes text := public._clean(p ->> 'notes', 2000);
  v_row public.rsvps;
begin
  if public._clean(p ->> 'website', 200) is not null then
    raise exception 'invalid_request';
  end if;
  if v_name is null or char_length(v_name) < 2 then raise exception 'invalid_name'; end if;
  if v_email is null or v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'invalid_email'; end if;
  if v_phone is null or char_length(v_phone) < 6 then raise exception 'invalid_phone'; end if;

  begin
    v_party := (p ->> 'party_size')::integer;
    v_arrival := nullif(p ->> 'arrival_date', '')::date;
    v_h := (p ->> 'henna_attending')::boolean;
    v_n := (p ->> 'nikah_attending')::boolean;
    v_r := (p ->> 'reception_attending')::boolean;
    v_hg := coalesce(nullif(p ->> 'henna_guests', '')::integer, 0);
    v_ng := coalesce(nullif(p ->> 'nikah_guests', '')::integer, 0);
    v_rg := coalesce(nullif(p ->> 'reception_guests', '')::integer, 0);
  exception when others then
    raise exception 'invalid_values';
  end;

  if v_party is null or v_party < 1 or v_party > 10 then raise exception 'invalid_party_size'; end if;
  if v_h is null or v_n is null or v_r is null then raise exception 'invalid_events'; end if;
  if v_arrival is not null and (v_arrival < date '2026-01-01' or v_arrival > date '2027-12-31') then raise exception 'invalid_arrival_date'; end if;
  v_hg := case when v_h then greatest(1, least(v_hg, v_party)) else 0 end;
  v_ng := case when v_n then greatest(1, least(v_ng, v_party)) else 0 end;
  v_rg := case when v_r then greatest(1, least(v_rg, v_party)) else 0 end;

  if v_code <> '' then
    begin
      update public.rsvps set
        full_name = v_name, email = v_email, phone = v_phone, party_size = v_party, arrival_date = v_arrival,
        henna_attending = v_h, henna_guests = v_hg, nikah_attending = v_n, nikah_guests = v_ng,
        reception_attending = v_r, reception_guests = v_rg, dietary = v_diet, notes = v_notes,
        updated_at = now(), update_count = update_count + 1
      where edit_code = v_code
      returning * into v_row;
    exception when unique_violation then
      raise exception 'email_taken';
    end;
    if v_row.id is null then raise exception 'invalid_code'; end if;
    return jsonb_build_object('ok', true, 'updated', true, 'edit_code', v_row.edit_code);
  end if;

  if (select count(*) from public.rsvps where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'busy';
  end if;

  begin
    insert into public.rsvps (
      edit_code, full_name, email, phone, party_size, arrival_date,
      henna_attending, henna_guests, nikah_attending, nikah_guests,
      reception_attending, reception_guests, dietary, notes)
    values (
      upper(left(replace(gen_random_uuid()::text, '-', ''), 12)), v_name, v_email, v_phone, v_party, v_arrival,
      v_h, v_hg, v_n, v_ng, v_r, v_rg, v_diet, v_notes)
    returning * into v_row;
  exception when unique_violation then
    raise exception 'already_submitted';
  end;

  return jsonb_build_object('ok', true, 'updated', false, 'edit_code', v_row.edit_code);
end;
$$;

-- get_rsvp(p_code) → the guest's own response, or null.
create or replace function public.get_rsvp(p_code text)
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^0-9A-Za-z]', '', 'g'));
  v_row public.rsvps;
begin
  if char_length(v_code) <> 12 then return null; end if;
  select * into v_row from public.rsvps where edit_code = v_code;
  if v_row.id is null then return null; end if;
  return public._rsvp_json(v_row);
end;
$$;

-- leave_note(p jsonb) → stores an optional message for the couple (no payment).
create or replace function public.leave_note(p jsonb)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_name text := public._clean(p ->> 'name', 120);
  v_email text := lower(public._clean(p ->> 'email', 200));
  v_msg text := public._clean(p ->> 'message', 2000);
  v_method text := public._clean(p ->> 'method', 60);
  v_amount numeric;
begin
  if public._clean(p ->> 'website', 200) is not null then raise exception 'invalid_request'; end if;
  if v_name is null then raise exception 'invalid_name'; end if;
  if v_msg is null then raise exception 'invalid_message'; end if;
  begin
    v_amount := nullif(p ->> 'amount', '')::numeric;
  exception when others then raise exception 'invalid_amount';
  end;
  if v_amount is not null and (v_amount < 0 or v_amount >= 10000000) then raise exception 'invalid_amount'; end if;
  if (select count(*) from public.gift_notes where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'busy';
  end if;
  insert into public.gift_notes (name, email, message, amount, method)
  values (v_name, v_email, v_msg, round(v_amount, 2), v_method);
  return jsonb_build_object('ok', true);
end;
$$;

-- Function permissions
revoke execute on function public.submit_rsvp(jsonb), public.get_rsvp(text), public.leave_note(jsonb),
  public.is_admin(), public._clean(text, integer), public._rsvp_json(public.rsvps) from public;
grant execute on function public.submit_rsvp(jsonb), public.get_rsvp(text), public.leave_note(jsonb) to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Add the couple's admin logins (edit the emails, then run).
-- Also create matching users in Authentication → Users → Add user.
-- ---------------------------------------------------------------------------
-- insert into public.admins (email) values ('nisan@example.com'), ('fuad@example.com') on conflict do nothing;
