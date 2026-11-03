/* RSVP — submit, amend (via edit code), validation, calendar file. */
(() => {
  const api = window.fnApi;
  const form = document.getElementById('rsvp-form');
  if (!form || !api) return;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const lookupForm = document.getElementById('lookup-form');
  const done = document.getElementById('rsvp-done');
  const statusEl = $('[data-form-status]', form);
  const editingEl = $('[data-editing]', form);
  const submitBtn = $('[data-submit]', form);
  const EVENTS = [
    { id: 'henna', name: 'Yemeni Henna Night', start: '20261219T123000Z', end: '20261219T153000Z', where: 'Meraki House, Nyari Estate, Nairobi' },
    { id: 'nikah', name: 'Katb Al-Kitab (Nikah)', start: '20261220T090000Z', end: '20261220T130000Z', where: 'Gentlemen: Adams Arcade Mosque · Ladies: Meraki House, Nairobi' },
    { id: 'reception', name: 'Wedding Reception (Zifaf)', start: '20261223T110000Z', end: '20261223T210000Z', where: 'Emara Ole Sereni, Mombasa Road, Nairobi' },
  ];
  const STORE = 'fn-rsvp';
  let editCode = null;
  let lastSaved = null;

  const store = {
    get() { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch (e) {} },
  };

  if (!api.configured) {
    $('[data-api-off]').hidden = false;
    submitBtn.disabled = true;
    $('[data-show-lookup]').disabled = true;
  }

  // ---------- form behaviour ----------
  const partyInput = form.elements.party_size;
  const syncGuestMax = () => {
    const max = Math.max(1, Math.min(10, parseInt(partyInput.value, 10) || 1));
    EVENTS.forEach(({ id }) => {
      const inp = form.elements[id + '_guests'];
      inp.max = max;
      if ((parseInt(inp.value, 10) || 1) > max) inp.value = max;
    });
  };
  partyInput.addEventListener('input', syncGuestMax);

  EVENTS.forEach(({ id }) => {
    $$(`input[name="${id}_attending"]`, form).forEach((r) => r.addEventListener('change', () => {
      const yes = form.elements[id + '_attending'].value === 'true';
      const row = $(`[data-event="${id}"] [data-count]`, form);
      if (yes && row.hidden) form.elements[id + '_guests'].value = id === 'reception' ? 1 : Math.max(1, parseInt(partyInput.value, 10) || 1);
      row.hidden = !yes;
      setError(id + '_attending', '');
      syncGuestMax();
    }));
  });

  function setError(name, msg) {
    const el = $(`[data-error-for="${name}"]`, form);
    const input = form.elements[name];
    if (el) { el.textContent = msg; el.hidden = !msg; }
    if (input && input.setAttribute && !(input instanceof RadioNodeList)) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function showStatus(el, kind, msg) {
    el.className = 'alert alert--' + kind;
    el.textContent = msg;
    el.hidden = !msg;
  }

  function validate() {
    let first = null;
    const fail = (name, msg) => { setError(name, msg); if (!first) first = name; };
    ['full_name', 'email', 'phone', 'party_size'].forEach((n) => setError(n, ''));
    const v = (n) => (form.elements[n].value || '').trim();
    if (v('full_name').length < 2) fail('full_name', 'Please enter your full name.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) fail('email', 'Please enter a valid email address.');
    if (v('phone').replace(/[^\d]/g, '').length < 6) fail('phone', 'Please enter a phone number, including the country code.');
    const ps = parseInt(v('party_size'), 10);
    if (!(ps >= 1 && ps <= 10)) fail('party_size', 'Please enter a number between 1 and 10.');
    EVENTS.forEach(({ id }) => {
      if (form.elements[id + '_attending'].value === '') fail(id + '_attending', 'Please choose attending or declining.');
      else setError(id + '_attending', '');
    });
    if (first) {
      const el = form.elements[first];
      const target = el instanceof RadioNodeList ? el[0] : el;
      target && target.focus();
      target && target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    return !first;
  }

  function payload() {
    const f = form.elements;
    const p = {
      full_name: f.full_name.value.trim(),
      email: f.email.value.trim(),
      phone: f.phone.value.trim(),
      party_size: parseInt(f.party_size.value, 10),
      arrival_date: f.arrival_date.value || null,
      dietary: f.dietary.value.trim(),
      notes: f.notes.value.trim(),
      website: f.website.value,
    };
    EVENTS.forEach(({ id }) => {
      const yes = f[id + '_attending'].value === 'true';
      p[id + '_attending'] = yes;
      p[id + '_guests'] = yes ? Math.max(1, parseInt(f[id + '_guests'].value, 10) || 1) : 0;
    });
    if (editCode) p.edit_code = editCode;
    return p;
  }

  function fill(r) {
    const f = form.elements;
    f.full_name.value = r.full_name || '';
    f.email.value = r.email || '';
    f.phone.value = r.phone || '';
    f.party_size.value = r.party_size || 1;
    f.arrival_date.value = r.arrival_date || '';
    f.dietary.value = r.dietary || '';
    f.notes.value = r.notes || '';
    EVENTS.forEach(({ id }) => {
      const yes = !!r[id + '_attending'];
      $$(`input[name="${id}_attending"]`, form).forEach((x) => { x.checked = x.value === String(yes); });
      f[id + '_guests'].value = r[id + '_guests'] || 1;
      $(`[data-event="${id}"] [data-count]`, form).hidden = !yes;
    });
    syncGuestMax();
  }

  function summary(p) {
    return EVENTS.map(({ id, name }) => `${name}: ${p[id + '_attending'] ? `attending (${p[id + '_guests']})` : 'declining'}`).join(' · ');
  }

  function showDone(p, code, updated) {
    lastSaved = { ...p, edit_code: code };
    form.hidden = true;
    lookupForm.hidden = true;
    $('[data-mode-switch]').hidden = true;
    done.hidden = false;
    $('[data-done-title]', done).textContent = updated ? 'Your RSVP has been updated' : `Thank you, ${p.full_name.split(' ')[0]}!`;
    $('[data-done-summary]', done).textContent = summary(p);
    $('[data-done-code]', done).textContent = api.formatCode(code);
    $('[data-email-note]', done).hidden = !(window.FN_CONFIG && window.FN_CONFIG.emailConfirmations);
    $('[data-ics]', done).hidden = !EVENTS.some(({ id }) => p[id + '_attending']);
    done.focus();
    done.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showStatus(statusEl, 'info', '');
    if (!api.configured) return;
    if (!validate()) { showStatus(statusEl, 'error', 'Please check the highlighted answers.'); return; }
    const p = payload();
    submitBtn.disabled = true;
    submitBtn.textContent = editCode ? 'Saving…' : 'Sending…';
    try {
      const res = await api.rpc('submit_rsvp', { p });
      store.set({ code: res.edit_code, name: p.full_name });
      editCode = res.edit_code;
      showDone(p, res.edit_code, res.updated);
    } catch (err) {
      showStatus(statusEl, 'error', err.message);
      if (err.code === 'already_submitted') { lookupForm.hidden = false; $('#lookup-code').focus(); }
    } finally {
      submitBtn.disabled = !api.configured;
      submitBtn.textContent = editCode ? 'Update my RSVP' : 'Send my RSVP';
    }
  });

  // ---------- amend ----------
  async function load(code, quiet) {
    const st = $('.alert', lookupForm);
    showStatus(st, 'info', quiet ? '' : 'Looking up your RSVP…');
    try {
      const r = await api.rpc('get_rsvp', { p_code: code });
      if (!r) { if (!quiet) showStatus(st, 'error', 'We couldn’t find an RSVP with that edit code. Please check it and try again.'); return false; }
      editCode = code.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
      fill(r);
      lookupForm.hidden = true;
      done.hidden = true;
      form.hidden = false;
      editingEl.hidden = false;
      editingEl.textContent = `You are editing the RSVP for ${r.full_name} (code ${api.formatCode(editCode)}). Make your changes and press “Update my RSVP”.`;
      submitBtn.textContent = 'Update my RSVP';
      showStatus(st, 'info', '');
      return true;
    } catch (err) {
      if (!quiet) showStatus(st, 'error', err.message);
      return false;
    }
  }

  $('[data-show-lookup]').addEventListener('click', () => {
    lookupForm.hidden = false;
    const saved = store.get();
    if (saved && saved.code) $('#lookup-code').value = api.formatCode(saved.code);
    $('#lookup-code').focus();
  });
  $('[data-cancel-lookup]').addEventListener('click', () => { lookupForm.hidden = true; });
  lookupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = $('#lookup-code').value.trim();
    if (code.replace(/[^0-9A-Za-z]/g, '').length !== 12) {
      showStatus($('.alert', lookupForm), 'error', 'Edit codes are 12 letters and numbers, like ABCD-1234-EF56.');
      return;
    }
    load(code);
  });

  // ---------- success actions ----------
  $('[data-copy-code]', done).addEventListener('click', async () => {
    const ok = await window.fnCopy(api.formatCode(editCode));
    window.fnToast(ok ? 'Edit code copied' : 'Please copy the code manually');
  });
  $('[data-copy-link]', done).addEventListener('click', async () => {
    const ok = await window.fnCopy(`${location.origin}/rsvp/?code=${api.formatCode(editCode)}`);
    window.fnToast(ok ? 'Edit link copied — keep it private' : 'Please copy the link manually');
  });
  $('[data-edit-again]', done).addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    $('[data-mode-switch]').hidden = false;
    if (lastSaved) fill(lastSaved);
    editingEl.hidden = false;
    editingEl.textContent = `You are editing your RSVP (code ${api.formatCode(editCode)}).`;
    form.scrollIntoView({ behavior: 'smooth' });
  });
  $('[data-ics]', done).addEventListener('click', () => {
    if (!lastSaved) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const esc = (s) => s.replace(/([,;\\])/g, '\\$1');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//fnwedding.com//RSVP//EN', 'CALSCALE:GREGORIAN'];
    EVENTS.filter(({ id }) => lastSaved[id + '_attending']).forEach((ev) => {
      lines.push('BEGIN:VEVENT', `UID:${ev.id}-2026@fnwedding.com`, `DTSTAMP:${stamp}`, `DTSTART:${ev.start}`, `DTEND:${ev.end}`,
        `SUMMARY:${esc('Fuad & Nisan · ' + ev.name)}`, `LOCATION:${esc(ev.where)}`, 'URL:https://fnwedding.com/celebrations/', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fuad-nisan-wedding.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  // ---------- auto-load an existing reply ----------
  if (api.configured) {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('code');
    const saved = store.get();
    if (fromUrl) {
      load(fromUrl).then((ok) => { if (!ok) lookupForm.hidden = false; });
      history.replaceState(null, '', location.pathname);
    } else if (saved && saved.code) {
      load(saved.code, true);
    }
  }
})();
