import { icon } from '../layout.mjs';

export default {
  path: '/admin/',
  title: 'Guest management',
  description: 'Private guest management for the couple.',
  noindex: true,
  scripts: ['/assets/js/config.js', '/assets/js/api.js', '/assets/js/admin.js'],
  body: `
<section class="section" style="padding-top:calc(var(--header-h) + 50px)">
  <div class="wrap">
    <div class="alert alert--info" data-api-off hidden>
      The database is not connected yet. Add your Supabase URL and anon key to <code>assets/js/config.js</code> — see <code>docs/SETUP.md</code>.
    </div>

    <form class="card form" id="login" style="max-width:460px;margin:0 auto" novalidate>
      <span class="eyebrow" style="margin:0">Private</span>
      <h1 style="font-size:2.4rem;margin:0">Guest management</h1>
      <p class="muted" style="margin:0">For Fuad, Nisan and the family. Sign in with your admin account.</p>
      <div class="field"><label for="a-email">Email</label><input id="a-email" type="email" autocomplete="username" required></div>
      <div class="field"><label for="a-pass">Password</label><input id="a-pass" type="password" autocomplete="current-password" required></div>
      <div class="alert" role="alert" hidden></div>
      <div><button class="btn btn--violet" type="submit">Sign in</button></div>
    </form>

    <div id="dash" hidden>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:26px">
        <div>
          <span class="eyebrow" style="margin-bottom:.3rem">Guest management</span>
          <h1 style="font-size:2.6rem;margin:0">RSVPs</h1>
          <p class="muted small mb-0" data-who></p>
        </div>
        <div class="btn-row" style="margin:0">
          <button class="btn btn--sm btn--ghost" type="button" data-refresh>Refresh</button>
          <button class="btn btn--sm" type="button" data-export="all">${icon('copy')}Export all (CSV)</button>
          <button class="btn btn--sm btn--ghost" type="button" data-signout>Sign out</button>
        </div>
      </div>

      <div class="grid grid--4 admin-stats" data-stats></div>

      <div class="card" style="margin-top:28px;padding:0;overflow:hidden">
        <div class="admin-tools">
          <input type="search" placeholder="Search name, email, phone…" aria-label="Search guests" data-search>
          <select aria-label="Filter by celebration" data-filter>
            <option value="">All responses</option>
            <option value="henna">Attending · Henna Night</option>
            <option value="nikah">Attending · Nikah</option>
            <option value="reception">Attending · Reception</option>
            <option value="none">Declined everything</option>
          </select>
          <button class="btn btn--sm btn--ghost" type="button" data-export="view">Export this view</button>
        </div>
        <div class="table-wrap">
          <table class="admin-table">
            <thead><tr>
              <th>Guest</th><th>Contact</th><th>Party</th><th>Henna</th><th>Nikah</th><th>Reception</th><th>Arrival</th><th>Dietary / notes</th><th>Updated</th><th></th>
            </tr></thead>
            <tbody data-rows></tbody>
          </table>
        </div>
        <p class="muted small" data-empty hidden style="padding:20px">No responses match.</p>
      </div>

      <div style="margin-top:50px">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap">
          <h2 style="font-size:2rem;margin:0">Honeymoon notes</h2>
          <button class="btn btn--sm btn--ghost" type="button" data-export="notes">Export notes (CSV)</button>
        </div>
        <p class="muted small">Messages left on the honeymoon page. Amounts are what guests chose to mention — they are not payment confirmations; please check your bank and M-Pesa statements.</p>
        <div class="grid grid--3" data-notes></div>
      </div>
    </div>
  </div>
</section>`,
};
