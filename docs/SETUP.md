# Fuad & Nisan — setup, testing and deployment

The site is a static website served by **GitHub Pages** at **https://fnwedding.com**.
RSVPs, the couple's dashboard and honeymoon notes use **Supabase** (free tier is enough).

---

## 1. Connect the RSVP database (≈10 minutes)

1. Create a free project at <https://supabase.com> (any region; *Frankfurt* or *London* are close to Nairobi and Europe).
2. In the project: **SQL Editor → New query**, paste the whole of `supabase/schema.sql`, press **Run**.
3. **Authentication → Providers → Email**: keep Email enabled. **Authentication → Sign In / Up**: turn **off** “Allow new users to sign up” (only the couple should have logins).
4. **Authentication → Users → Add user → Create new user** for each person who should see the guest list (e.g. Nisan, Fuad). Tick **Auto confirm user**.
5. Back in **SQL Editor**, add the same emails to the admin list:
   ```sql
   insert into public.admins (email) values ('nisan@…'), ('fuad@…') on conflict do nothing;
   ```
6. **Project Settings → API**: copy the **Project URL** and the **anon / publishable key**. Put them in `assets/js/config.js`:
   ```js
   window.FN_CONFIG = {
     supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
     supabaseAnonKey: 'eyJ…',
     emailConfirmations: false,
   };
   ```
   The anon key is meant to be public. **Never** paste the `service_role` / secret key anywhere in this repository.
7. Commit and push — the RSVP form, honeymoon notes and `/admin/` go live automatically.

### How guest data is protected
* Guests never read or write tables directly. They can only call three functions:
  `submit_rsvp`, `get_rsvp` (requires the guest's private 12-character edit code) and `leave_note`.
* Row Level Security means only signed-in users whose email is in `public.admins` can read or delete responses.
* One RSVP per email address (case-insensitive). A second submission with the same email is refused and the guest is pointed to their edit code.
* A honeypot field and a per-minute cap slow down spam.

## 2. Optional: confirmation emails

`supabase/functions/rsvp-confirmation/index.ts` emails each guest a copy of their reply and edit code, via [Resend](https://resend.com).

1. Create a Resend account, verify the `fnwedding.com` domain (Resend shows the DNS records to add in Cloudflare), and create an API key.
2. Install the Supabase CLI, then:
   ```bash
   supabase link --project-ref YOUR-PROJECT-REF
   supabase secrets set RESEND_API_KEY=re_… FROM_EMAIL="Fuad & Nisan <rsvp@fnwedding.com>" WEBHOOK_SECRET=choose-a-long-random-string
   supabase functions deploy rsvp-confirmation --no-verify-jwt
   ```
3. **Database → Webhooks → Create**: table `rsvps`, events *Insert* and *Update*, type *Supabase Edge Functions* → `rsvp-confirmation`, header `x-webhook-secret: <your WEBHOOK_SECRET>`.
4. Set `emailConfirmations: true` in `assets/js/config.js`.
5. Send yourself a test RSVP. *This function has not been run in automated tests — please confirm the email arrives.*

## 3. Testing the RSVP system

After step 1:

1. Open <https://fnwedding.com/rsvp/>, submit a reply with your own email. You should see a thank-you panel with an edit code like `ABCD-1234-EF56`.
2. Refresh the page — your reply loads for editing. Change an answer and press **Update my RSVP**.
3. In a private/incognito window, try submitting the same email again — it is refused with guidance.
4. In that private window choose **Already replied? Update my RSVP** and enter the code — your reply loads.
5. Open <https://fnwedding.com/admin/>, sign in with an admin user. Check the counts, search, **Export all (CSV)** (opens in Excel), then delete the test reply (click **Delete** twice).
6. On <https://fnwedding.com/honeymoon/> leave a test note; it appears at the bottom of `/admin/`.

## 4. Editing content

All wording and facts live in `src/`:

| What | File |
|---|---|
| Event dates, times, venues, programmes, dress codes | `src/data.mjs` → `EVENTS` |
| Hotels, discount code, transport providers, Nairobi recommendations | `src/data.mjs` → `HOTELS`, `TRANSPORT`, `EXPLORE` |
| Honeymoon bank / M-Pesa details | `src/data.mjs` → `HONEYMOON` |
| Page text | `src/pages/*.mjs` |
| Shared header, footer, icons | `src/layout.mjs` |
| Styles | `assets/css/site.css` |

To fill a “To be confirmed” field, set it in `src/data.mjs` (e.g. `dressCode: 'Elegant traditional or formal'`).

After editing `src/`, rebuild the pages (needs Node.js 18+, no packages to install):

```bash
node src/build.mjs
git add -A && git commit -m "Update wedding details" && git push
```

### Replacing photo placeholders
Placeholders are marked “Photograph to come”. Add optimised images (WebP or JPG, ~1600px wide) to `assets/img/`, then swap the `placeholder(...)` call for an `<img>` in the relevant page under `src/pages/`.

## 5. Deployment

GitHub Pages deploys automatically from the `main` branch root. The `CNAME` file holds `fnwedding.com`; DNS is in Cloudflare (four A records to GitHub Pages + `www` CNAME, DNS only). Nothing else is needed.

The homepage world map comes from `assets/data/world.json`, generated by `scripts/gen-map.mjs` (Natural Earth data via `world-atlas`). To regenerate it, push to the `tools-map` branch — the **Generate map data** workflow builds and commits it.
