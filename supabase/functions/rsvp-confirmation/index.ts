// Optional: emails each guest a confirmation (with their edit code) when they RSVP.
// Deploy:  supabase functions deploy rsvp-confirmation --no-verify-jwt
// Secrets: supabase secrets set RESEND_API_KEY=... FROM_EMAIL="Fuad & Nisan <rsvp@fnwedding.com>" WEBHOOK_SECRET=...
// Trigger: Database → Webhooks → new webhook on table public.rsvps, events INSERT + UPDATE,
//          type "Supabase Edge Functions" → rsvp-confirmation, add HTTP header
//          x-webhook-secret: <same WEBHOOK_SECRET>.
// NOTE: not exercised in automated tests — send yourself a test RSVP after deploying.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? '';
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') ?? '';

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const code = (c: string) => c.replace(/(.{4})(?=.)/g, '$1-');
const line = (name: string, yes: boolean, n: number) => `<tr><td style="padding:6px 12px 6px 0">${name}</td><td style="padding:6px 0">${yes ? `Attending (${n})` : 'Not attending'}</td></tr>`;

Deno.serve(async (req) => {
  if (!WEBHOOK_SECRET || req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) return new Response('forbidden', { status: 403 });
  if (!RESEND_API_KEY || !FROM_EMAIL) return new Response('email not configured', { status: 500 });
  const payload = await req.json();
  const r = payload?.record;
  if (!r?.email || !r?.edit_code) return new Response('ignored', { status: 200 });
  const updated = payload.type === 'UPDATE';

  const html = `
  <div style="font-family:Georgia,serif;color:#2b2231;max-width:560px;margin:auto;padding:24px;background:#fbf7f0">
    <p style="letter-spacing:.3em;text-transform:uppercase;font-size:11px;color:#9c7c43;text-align:center">Fuad &amp; Nisan · Nairobi · December 2026</p>
    <h1 style="font-weight:400;text-align:center;color:#2f1f3d">${updated ? 'Your RSVP has been updated' : 'Thank you for your RSVP'}</h1>
    <p>Dear ${esc(r.full_name)},</p>
    <p>${updated ? 'We have saved the changes to your reply.' : 'We have received your reply — thank you.'}</p>
    <table style="border-collapse:collapse;margin:12px 0">
      ${line('Yemeni Henna Night · Sat 19 Dec', r.henna_attending, r.henna_guests)}
      ${line('Katb Al-Kitab (Nikah) · Sun 20 Dec', r.nikah_attending, r.nikah_guests)}
      ${line('Wedding Reception · Wed 23 Dec', r.reception_attending, r.reception_guests)}
    </table>
    <p>Your personal edit code is <strong style="font-size:18px;letter-spacing:.12em;color:#5e3f8c">${esc(code(r.edit_code))}</strong>.
    To change your reply, visit <a href="https://fnwedding.com/rsvp/?code=${esc(code(r.edit_code))}">fnwedding.com/rsvp</a>. Please keep this email private.</p>
    <p>Travel, accommodation and transport details: <a href="https://fnwedding.com/travel/">fnwedding.com/travel</a></p>
    <p style="text-align:center;margin-top:28px">With love,<br>the Abdulkaders</p>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [r.email], subject: updated ? 'Your RSVP has been updated · Fuad & Nisan' : 'Thank you for your RSVP · Fuad & Nisan', html }),
  });
  return new Response(res.ok ? 'sent' : await res.text(), { status: res.ok ? 200 : 502 });
});
