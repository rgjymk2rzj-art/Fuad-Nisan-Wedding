/* Private guest management dashboard (Supabase Auth + RLS). */
(() => {
  const api = window.fnApi;
  const login = document.getElementById('login');
  const dash = document.getElementById('dash');
  if (!login || !api) return;
  const $ = (s, c = document) => c.querySelector(s);
  const KEY = 'fn-admin-session';
  const EV = [['henna', 'Henna Night'], ['nikah', 'Nikah'], ['reception', 'Reception']];
  let session = null;
  let rows = [];
  let notes = [];

  const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—');
  const fmtDateTime = (d) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');

  if (!api.configured) {
    $('[data-api-off]').hidden = false;
    login.querySelector('button').disabled = true;
  }

  const saveSession = (s) => { session = s; try { s ? sessionStorage.setItem(KEY, JSON.stringify(s)) : sessionStorage.removeItem(KEY); } catch (e) {} };
  try { session = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (session && session.expires_at && session.expires_at * 1000 < Date.now()) saveSession(null);

  login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alert = $('.alert', login);
    alert.hidden = true;
    const email = $('#a-email').value.trim();
    const pass = $('#a-pass').value;
    if (!email || !pass) { alert.className = 'alert alert--error'; alert.textContent = 'Please enter your email and password.'; alert.hidden = false; return; }
    const btn = login.querySelector('button');
    btn.disabled = true;
    try {
      const s = await api.signIn(email, pass);
      saveSession({ access_token: s.access_token, expires_at: s.expires_at || Math.floor(Date.now() / 1000) + (s.expires_in || 3600), email: (s.user && s.user.email) || email });
      $('#a-pass').value = '';
      await open();
    } catch (err) {
      alert.className = 'alert alert--error';
      alert.textContent = err.status === 400 ? 'That email and password didn’t match.' : err.message;
      alert.hidden = false;
    } finally {
      btn.disabled = false;
    }
  });

  async function open() {
    try {
      const ok = await api.rpc('is_admin', {}, session.access_token);
      if (ok !== true) throw Object.assign(new Error('This account is signed in but is not on the admin list. Add its email to the admins table (docs/SETUP.md).'), { code: 'not_admin' });
      await load();
      login.hidden = true;
      dash.hidden = false;
      $('[data-who]').textContent = 'Signed in as ' + session.email;
    } catch (err) {
      if (err.status === 401) saveSession(null);
      login.hidden = false;
      dash.hidden = true;
      const alert = $('.alert', login);
      alert.className = 'alert alert--error';
      alert.textContent = err.status === 401 ? 'Your session has expired — please sign in again.' : err.message;
      alert.hidden = false;
    }
  }

  async function load() {
    [rows, notes] = await Promise.all([
      api.select('rsvps', 'select=*&order=created_at.desc', session.access_token),
      api.select('gift_notes', 'select=*&order=created_at.desc', session.access_token),
    ]);
    render();
  }

  function stats() {
    const box = $('[data-stats]');
    const total = rows.length;
    const cards = [`<div class="card"><span class="stat__label">Responses</span><span class="stat__num">${total}</span><span class="stat__sub">${rows.reduce((a, r) => a + r.party_size, 0)} guests across all parties</span></div>`];
    EV.forEach(([id, name]) => {
      const yes = rows.filter((r) => r[id + '_attending']);
      const guests = yes.reduce((a, r) => a + (r[id + '_guests'] || 0), 0);
      cards.push(`<div class="card"><span class="stat__label">${name}</span><span class="stat__num">${guests}</span><span class="stat__sub">guests · ${yes.length} attending · ${total - yes.length} declined</span></div>`);
    });
    box.innerHTML = cards.join('');
  }

  function filtered() {
    const q = ($('[data-search]').value || '').toLowerCase().trim();
    const f = $('[data-filter]').value;
    return rows.filter((r) => {
      if (q && ![r.full_name, r.email, r.phone, r.notes, r.dietary].some((v) => String(v || '').toLowerCase().includes(q))) return false;
      if (f === 'none') return !EV.some(([id]) => r[id + '_attending']);
      if (f) return r[f + '_attending'];
      return true;
    });
  }

  function render() {
    stats();
    const list = filtered();
    const cell = (r, id) => (r[id + '_attending'] ? `<span class="yes">✓ ${r[id + '_guests']}</span>` : '<span class="no">—</span>');
    $('[data-rows]').innerHTML = list.map((r) => `
      <tr>
        <td><b>${escHtml(r.full_name)}</b></td>
        <td><a href="mailto:${escHtml(r.email)}">${escHtml(r.email)}</a><br><a href="tel:${escHtml(String(r.phone).replace(/[^+\d]/g, ''))}">${escHtml(r.phone)}</a></td>
        <td>${r.party_size}</td>
        <td>${cell(r, 'henna')}</td><td>${cell(r, 'nikah')}</td><td>${cell(r, 'reception')}</td>
        <td>${fmtDate(r.arrival_date)}</td>
        <td>${r.dietary ? `<b>Diet:</b> ${escHtml(r.dietary)}<br>` : ''}${escHtml(r.notes || '')}</td>
        <td>${fmtDateTime(r.updated_at)}${r.update_count ? `<br><span class="muted small">edited ${r.update_count}×</span>` : ''}</td>
        <td><button type="button" class="del-btn" data-del="${r.id}">Delete</button></td>
      </tr>`).join('');
    $('[data-empty]').hidden = list.length > 0;
    $('[data-notes]').innerHTML = notes.length
      ? notes.map((n) => `<div class="card note-card"><span class="stat__label">${fmtDateTime(n.created_at)}</span><h3 style="font-size:1.4rem;margin:6px 0 0">${escHtml(n.name)}</h3>${n.amount != null ? `<p class="small"><b>${escHtml(n.amount)}</b> ${escHtml(n.method || '')}</p>` : ''}<p>${escHtml(n.message)}</p>${n.email ? `<p class="small muted">${escHtml(n.email)}</p>` : ''}</div>`).join('')
      : '<p class="muted">No notes yet.</p>';
  }

  // CSV (UTF-8 with BOM so Excel opens it cleanly)
  function csv(name, header, data) {
    // quote fields; prefix values that spreadsheet apps could treat as formulas
    const q = (v) => {
      let s = String(v ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const body = [header.map(q).join(','), ...data.map((r) => r.map(q).join(','))].join('\r\n');
    const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  const rsvpCsv = (list, name) => csv(name,
    ['Full name', 'Email', 'Phone', 'Party size', 'Arrival date', 'Henna attending', 'Henna guests', 'Nikah attending', 'Nikah guests', 'Reception attending', 'Reception guests', 'Dietary', 'Notes', 'Submitted', 'Last updated'],
    list.map((r) => [r.full_name, r.email, r.phone, r.party_size, r.arrival_date || '', r.henna_attending ? 'Yes' : 'No', r.henna_guests, r.nikah_attending ? 'Yes' : 'No', r.nikah_guests, r.reception_attending ? 'Yes' : 'No', r.reception_guests, r.dietary || '', r.notes || '', r.created_at, r.updated_at]));

  document.addEventListener('click', async (e) => {
    const exp = e.target.closest('[data-export]');
    if (exp) {
      const k = exp.getAttribute('data-export');
      const day = new Date().toISOString().slice(0, 10);
      if (k === 'all') rsvpCsv(rows, `fn-wedding-rsvps-${day}.csv`);
      if (k === 'view') rsvpCsv(filtered(), `fn-wedding-rsvps-filtered-${day}.csv`);
      if (k === 'notes') csv(`fn-wedding-honeymoon-notes-${day}.csv`, ['Name', 'Email', 'Message', 'Amount mentioned', 'Method', 'Sent'], notes.map((n) => [n.name, n.email || '', n.message, n.amount ?? '', n.method || '', n.created_at]));
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      if (!del.classList.contains('is-armed')) {
        del.classList.add('is-armed');
        del.textContent = 'Confirm delete';
        setTimeout(() => { del.classList.remove('is-armed'); del.textContent = 'Delete'; }, 4000);
        return;
      }
      try {
        await api.remove('rsvps', 'id=eq.' + encodeURIComponent(del.getAttribute('data-del')), session.access_token);
        rows = rows.filter((r) => r.id !== del.getAttribute('data-del'));
        render();
        window.fnToast('Response deleted');
      } catch (err) { window.fnToast(err.message); }
    }
  });
  $('[data-search]').addEventListener('input', render);
  $('[data-filter]').addEventListener('change', render);
  $('[data-refresh]').addEventListener('click', () => load().then(() => window.fnToast('Up to date')).catch((err) => window.fnToast(err.message)));
  $('[data-signout]').addEventListener('click', async () => {
    if (session) await api.signOut(session.access_token);
    saveSession(null);
    rows = []; notes = [];
    dash.hidden = true;
    login.hidden = false;
  });

  if (session && api.configured) open();
})();
