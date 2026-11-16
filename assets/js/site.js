/* Fuad & Nisan · scroll-driven scenes (A&A-style sticky stages) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const NS = 'http://www.w3.org/2000/svg';

  const progress = (el) => {
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span) : r.top < 0 ? 1 : 0;
  };

  // ---------- 1 · hands ----------
  const union = $('[data-scene="union"]');
  const unionStage = union && $('.stage', union);
  function updateUnion() {
    if (!unionStage) return;
    const p = reduce ? 1 : progress(union);
    const t = ease(clamp(p / 0.6));
    const g = clamp((p - 0.5) / 0.12) * (1 - 0.65 * clamp((p - 0.66) / 0.2));
    const v = ease(clamp((p - 0.58) / 0.2));
    unionStage.style.setProperty('--t', t.toFixed(4));
    unionStage.style.setProperty('--g', g.toFixed(3));
    unionStage.style.setProperty('--v', v.toFixed(3));
    // Bismillah fades away as the hands draw together
    unionStage.style.setProperty('--bz', (1 - ease(clamp((p - 0.04) / 0.42))).toFixed(3));
  }

  // ---------- 2 · welcome map ----------
  const welcome = $('[data-scene="welcome"]');
  const welcomeStage = welcome && $('.stage', welcome);
  const svg = $('#map');
  const ORIGINS = [['canada', 'Canada'], ['uk', 'UK'], ['italy', 'Italy'], ['greece', 'Greece'], ['egypt', 'Egypt'], ['uae', 'UAE'], ['tanzania', 'Tanzania']];
  let map = null;

  const el = (name, attrs, parent) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  function viewFor(data) {
    const r = welcomeStage.getBoundingClientRect();
    const aspect = Math.max(0.42, r.width / Math.max(1, r.height));
    const portrait = aspect < 0.95;
    const P = data.points;
    const keys = portrait ? ORIGINS.filter(([k]) => k !== 'canada') : ORIGINS;
    const pts = [P.nairobi, ...keys.map(([k]) => P[k])];
    const x0 = Math.min(...pts.map((p) => p[0])) - (portrait ? 70 : 140);
    const x1 = Math.max(...pts.map((p) => p[0])) + (portrait ? 70 : 180);
    const y0 = Math.min(...pts.map((p) => p[1])) - 50;
    const y1 = Math.max(...pts.map((p) => p[1])) + 60;
    // full-stage framing below the nav: the welcome later fades in on top
    const navFrac = 64 / Math.max(1, r.height);
    const cw = x1 - x0, ch = y1 - y0;
    const h = Math.max(ch / (1 - navFrac - 0.06), cw / aspect);
    const w = h * aspect;
    const cy = (y0 + y1) / 2 - (navFrac * h) / 2;
    return { x: (x0 + x1) / 2 - w / 2, y: cy - h / 2, w, h, portrait };
  }

  function buildMap(data) {
    const box = viewFor(data);
    const u = (box.w / 900) * (box.portrait ? 1.9 : 1);
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
    const defs = el('defs', {}, svg);
    const pat = el('pattern', { id: 'dots', width: 9, height: 9, patternUnits: 'userSpaceOnUse' }, defs);
    el('circle', { cx: 4.5, cy: 4.5, r: 1.75, fill: 'rgba(166,143,208,.55)' }, pat);
    el('path', { d: data.land, class: 'land' }, svg);

    // equator + tropic, as on the A&A map
    [[520, 'EQUATOR'], [369, 'TROPIC OF CANCER']].forEach(([y, label]) => {
      el('line', { x1: box.x - 50, y1: y, x2: box.x + box.w + 50, y2: y, class: 'lat' }, svg);
      const t = el('text', { x: box.x + 14 * u, y: y - 7 * u, class: 'lat-l', 'font-size': 10 * u }, svg);
      t.textContent = label;
    });

    const N = data.points.nairobi;
    const arcs = [];
    const keys = box.portrait ? ORIGINS.filter(([k]) => k !== 'canada') : ORIGINS;
    const arcLayer = el('g', {}, svg);
    const cityLayer = el('g', {}, svg);
    const planeLayer = el('g', {}, svg);
    keys.forEach(([key, label], i) => {
      const O = data.points[key];
      const dx = N[0] - O[0], dy = N[1] - O[1], dist = Math.hypot(dx, dy);
      let px = -dy / dist, py = dx / dist;
      if (py > 0) { px = -px; py = -py; }
      const bow = Math.min(0.3, 50 / dist + 0.14) * dist;
      const cx = (O[0] + N[0]) / 2 + px * bow, cy = (O[1] + N[1]) / 2 + py * bow;
      const d = `M${O[0]} ${O[1]} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${N[0]} ${N[1]}`;
      el('path', { d, class: 'arc-glow', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, arcLayer);
      const path = el('path', { d, class: 'arc', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, arcLayer);
      const g = el('g', { class: 'city' }, cityLayer);
      el('circle', { cx: O[0], cy: O[1], r: 3.6 * u }, g);
      const t = el('text', { x: O[0], y: O[1] - 9 * u, 'text-anchor': 'middle', 'font-size': 12.5 * u }, g);
      t.textContent = label;
      if (key === 'egypt') t.setAttribute('y', O[1] + 20 * u);
      if (key === 'italy') { t.setAttribute('text-anchor', 'end'); t.setAttribute('x', O[0] - 7 * u); }
      if (key === 'greece') { t.setAttribute('text-anchor', 'start'); t.setAttribute('x', O[0] + 6 * u); }
      if (key === 'uae') { t.setAttribute('text-anchor', 'start'); t.setAttribute('x', O[0] + 8 * u); t.setAttribute('y', O[1] + 4 * u); }
      if (key === 'uk') { t.setAttribute('text-anchor', 'end'); t.setAttribute('x', O[0] - 7 * u); t.setAttribute('y', O[1] + 4 * u); }
      if (key === 'tanzania') { t.setAttribute('y', O[1] + 19 * u); }
      const plane = el('path', { class: 'plane', d: 'M10 0c0-.7-.6-1.1-1.3-1.1H4.2L.2-7.6h-1.6l2.1 6.5h-4.5l-1.6-2.2h-1.3l1 3.3-1 3.3h1.3l1.6-2.2h4.5L-1.4 7.6H.2l4-6.5h4.5c.7 0 1.3-.4 1.3-1.1z', opacity: 0 }, planeLayer);
      arcs.push({ path, glow: path.previousSibling, plane, len: path.getTotalLength(), i });
    });
    const nb = el('g', { class: 'nbo' }, cityLayer);
    el('circle', { cx: N[0], cy: N[1], r: 6 * u, class: 'pulse' }, nb);
    el('circle', { cx: N[0], cy: N[1], r: 6 * u, class: 'pulse p2' }, nb);
    el('circle', { cx: N[0], cy: N[1], r: 5 * u, class: 'core' }, nb);
    // label sits to the left so the short Tanzania route stays clear
    const nt = el('text', { x: N[0] - 11 * u, y: N[1] + 4 * u, 'text-anchor': 'end', 'font-size': 13 * u }, nb);
    nt.textContent = 'NAIROBI';
    map = { data, box, arcs, u };
    updateWelcome();
  }

  // The map is now the opening page: the flights play on their own when it
  // loads (scrolling can't rewind them), and the text is visible from the start.
  let flightT = reduce ? 1 : 0;
  function revealWelcome() { if (welcomeStage) welcomeStage.classList.add('is-welcome'); }
  function playFlights() {
    if (reduce) { updateWelcome(); revealWelcome(); return; }
    const t0 = performance.now(), dur = 3200;
    const step = (now) => {
      flightT = clamp((now - t0) / dur);
      updateWelcome();
      if (flightT > 0.78) revealWelcome();
      if (flightT < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  window.addEventListener('scroll', () => { if (window.scrollY > 24) revealWelcome(); }, { passive: true });
  // if the map data never arrives, still show the welcome
  setTimeout(revealWelcome, 4500);

  function updateWelcome() {
    if (!welcomeStage || !map) return;
    const p = Math.max(flightT, reduce ? 1 : progress(welcome));
    const n = map.arcs.length;
    map.arcs.forEach((a) => {
      const start = 0.04 + a.i * (0.3 / n);
      const local = clamp((p - start) / 0.62);
      const e = easeIO(local);
      a.path.setAttribute('stroke-dashoffset', (1 - e).toFixed(4));
      a.glow.setAttribute('stroke-dashoffset', (1 - e).toFixed(4));
      if (local <= 0 || local >= 1) { a.plane.setAttribute('opacity', 0); return; }
      const L = a.len;
      const pt = a.path.getPointAtLength(e * L);
      const pt2 = a.path.getPointAtLength(Math.min(L, e * L + 1));
      const ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
      a.plane.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(1.35 * map.u).toFixed(3)})`);
      a.plane.setAttribute('opacity', local > 0.9 ? ((1 - local) / 0.1).toFixed(2) : 1);
    });
  }

  if (svg && welcomeStage) {
    fetch('/assets/data/world.json?v=2').then((r) => r.json()).then((d) => { buildMap(d); playFlights(); }).catch(() => {});
  }

  // ---------- 3 · cascading cards ----------
  const cards = $$('.stack .card');
  function updateCards() {
    if (reduce || window.matchMedia('(max-height: 700px) and (max-width: 820px)').matches) return;
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) { card.style.setProperty('--s', 1); card.style.setProperty('--b', 1); return; }
      const top = parseFloat(getComputedStyle(card).top) || 0;
      const nr = next.getBoundingClientRect().top;
      const q = clamp((window.innerHeight - nr) / Math.max(1, window.innerHeight - top - 22));
      card.style.setProperty('--s', (1 - 0.05 * q).toFixed(4));
      card.style.setProperty('--b', (1 - 0.22 * q).toFixed(3));
    });
  }

  // ---------- nav colour ----------
  const nav = $('#nav');
  const darks = [welcome, $('.guide__pane'), $('.foot')].filter(Boolean);
  function updateNav() {
    const y = nav.offsetHeight / 2;
    const onInk = darks.some((d) => { const r = d.getBoundingClientRect(); return r.top <= y && r.bottom >= y; });
    nav.classList.toggle('on-ink', onInk);
  }

  // ---------- loop ----------
  let ticking = false;
  const frame = () => { ticking = false; updateUnion(); updateWelcome(); updateCards(); updateNav(); };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', request, { passive: true });
  let rt;
  window.addEventListener('resize', () => { request(); clearTimeout(rt); rt = setTimeout(() => map && buildMap(map.data), 200); });
  frame();

  // ---------- falling violet blooms (guest-guide pane + welcome screen) ----------
  const rand = (a, b) => a + Math.random() * (b - a);
  const sow = (box, n, fresh) => {
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'fall';
      const dur = rand(9, 16);
      d.style.setProperty('--x', rand(-2, 98).toFixed(1) + '%');
      d.style.setProperty('--s', Math.round(rand(22, 46)) + 'px');
      d.style.setProperty('--dur', dur.toFixed(1) + 's');
      // fresh: the first wave starts at the top once revealed; otherwise already mid-fall
      d.style.setProperty('--delay', (fresh ? rand(0, dur * 0.75) : -rand(0, dur)).toFixed(1) + 's');
      d.style.setProperty('--drift', Math.round(rand(-90, 90)) + 'px');
      d.style.setProperty('--sw', rand(2.4, 4.2).toFixed(1) + 's');
      d.style.setProperty('--r', Math.round(rand(10, 35)) + 'deg');
      const img = document.createElement('img');
      img.src = '/assets/img/bloom-' + (1 + (i % 6)) + '.webp';
      img.alt = '';
      img.decoding = 'async';
      d.appendChild(img);
      box.appendChild(d);
    }
  };
  const liveWhenVisible = (el) => {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => el.classList.toggle('is-live', e.isIntersecting))).observe(el);
    } else el.classList.add('is-live');
  };
  const pane = $('.guide__pane');
  const fall = pane && $('.pane__fall', pane);
  if (fall && !reduce) {
    sow(fall, window.innerWidth < 700 ? 9 : 16, false);
    liveWhenVisible(pane);
  }
  const stageFall = $('.stage__fall');
  if (stageFall && !reduce) {
    sow(stageFall, window.innerWidth < 700 ? 10 : 18, true);
    liveWhenVisible(stageFall.parentElement);
  }

  // ---------- welcome letter: words fade in with a golden sparkle ----------
  const letter = $('[data-write]');
  if (letter && !reduce) {
    const words = [];
    $$('p', letter).forEach((p) => {
      const parts = p.textContent.split(/(\s+)/);
      p.textContent = '';
      parts.forEach((wd) => {
        if (!wd) return;
        if (/^\s+$/.test(wd)) { p.appendChild(document.createTextNode(wd)); return; }
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = wd;
        p.appendChild(w);
        words.push(w);
      });
    });
    const spark = (w) => {
      const b = letter.getBoundingClientRect(), r = w.getBoundingClientRect();
      const n = 1 + (Math.random() < 0.45 ? 1 : 0);
      for (let k = 0; k < n; k++) {
        const s = document.createElement('i');
        s.className = 'spark';
        s.style.left = (r.left - b.left + Math.random() * r.width) + 'px';
        s.style.top = (r.top - b.top + (Math.random() - 0.25) * r.height) + 'px';
        s.style.setProperty('--s', (0.6 + Math.random() * 0.8).toFixed(2));
        s.style.animationDelay = (k * 120) + 'ms';
        letter.appendChild(s);
        setTimeout(() => s.remove(), 1500);
      }
    };
    let started = false, done = false;
    const finish = () => { done = true; words.forEach((w) => w.classList.add('on')); };
    const play = () => {
      if (started) return;
      started = true;
      words.forEach((w, i) => setTimeout(() => {
        if (done) return;
        w.classList.add('on');
        spark(w);
      }, i * 75));
    };
    letter.addEventListener('click', finish);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); setTimeout(play, 300); } }), { threshold: 0.35 });
      io.observe(letter);
    } else play();
  }

  // ---------- RSVP (posts to the Google Form, stays on the page) ----------
  const RSVP_FORM = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSftawhB_k7jBuLx4e4x1CSg3SeNhkNmXlsHIwDi7_jLlI9kzA/formResponse',
    fields: { name: 'entry.451848803', email: 'entry.1220429755', mobile: 'entry.1535312045', attend: 'entry.2021702797' },
    attendValue: 'Yes, I will attend',
  };
  const modal = $('#rsvp');
  if (modal) {
    const form = $('#rsvp-form', modal);
    const err = $('.rsvp__err', modal);
    const stepForm = $('[data-step="form"]', modal), stepDone = $('[data-step="done"]', modal);
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      modal.hidden = false; document.body.classList.add('rsvp-open');
      setTimeout(() => (stepDone.hidden ? $('input', form) : stepDone).focus(), 60);
    };
    const close = () => { modal.hidden = true; document.body.classList.remove('rsvp-open'); if (lastFocus) lastFocus.focus(); };
    $$('[data-rsvp]').forEach((b) => b.addEventListener('click', open));
    $$('[data-rsvp-close]', modal).forEach((b) => b.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
    const showErr = (m) => { err.textContent = m; err.hidden = !m; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      showErr('');
      const f = form.elements;
      const name = f.name.value.trim(), email = f.email.value.trim();
      // combine the chosen country code with the number (drop a leading 0, keep a typed +code as-is)
      const raw = f.mobile.value.trim();
      const cc = f.cc.value;
      const mobile = raw.startsWith('+') || !cc ? raw : cc + ' ' + raw.replace(/^0+/, '');
      [f.name, f.mobile, f.email].forEach((i) => i.removeAttribute('aria-invalid'));
      if (name.length < 2) { f.name.setAttribute('aria-invalid', 'true'); f.name.focus(); return showErr('Please enter your full name.'); }
      if (mobile.replace(/[^0-9]/g, '').length < 7) { f.mobile.setAttribute('aria-invalid', 'true'); f.mobile.focus(); return showErr(f.cc.value ? 'Please enter your mobile number.' : 'Please enter your mobile number, starting with + and your country code.'); }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { f.email.setAttribute('aria-invalid', 'true'); f.email.focus(); return showErr('Please enter a valid email address.'); }
      if (!f.attend.checked) { f.attend.focus(); return showErr('Please tick the box to confirm your attendance.'); }
      if (!f.invited.checked) { f.invited.focus(); return showErr('Please confirm you have been asked to RSVP by Fuad, Nisan or an immediate family member.'); }
      if (!RSVP_FORM.action) return showErr('RSVP is opening shortly — please try again soon.');
      const btn = $('.rsvp__submit', form); btn.disabled = true; btn.textContent = 'Sending…';
      const body = new URLSearchParams();
      body.append(RSVP_FORM.fields.name, name);
      body.append(RSVP_FORM.fields.mobile, mobile);
      body.append(RSVP_FORM.fields.email, email);
      body.append(RSVP_FORM.fields.attend, RSVP_FORM.attendValue);
      try {
        await fetch(RSVP_FORM.action, { method: 'POST', mode: 'no-cors', body });
        stepForm.hidden = true; stepDone.hidden = false; stepDone.focus();
        try { localStorage.setItem('fn-rsvp', '1'); } catch (x) {}
      } catch (x) {
        showErr('We couldn’t send that — please check your connection and try again.');
      } finally { btn.disabled = false; btn.textContent = 'Confirm attendance'; }
    });
    // floating bottom button: shows after the opening screen, hides over the footer
    const float = $('.rsvp-float'), foot = $('.foot');
    const updFloat = () => {
      if (!float) return;
      const past = window.scrollY > window.innerHeight * 0.6;
      const footR = foot ? foot.getBoundingClientRect().top : Infinity;
      float.classList.toggle('show', past && footR > window.innerHeight - 40 && modal.hidden);
    };
    window.addEventListener('scroll', updFloat, { passive: true });
    window.addEventListener('resize', updFloat);
    updFloat();
  }

  // ---------- countdown ----------
  $$('[data-countdown]').forEach((box) => {
    const target = new Date(box.getAttribute('data-countdown')).getTime();
    const out = { d: $('[data-cd="d"]', box), h: $('[data-cd="h"]', box), m: $('[data-cd="m"]', box), s: $('[data-cd="s"]', box) };
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      let ms = Math.max(0, target - Date.now());
      const d = Math.floor(ms / 864e5); ms -= d * 864e5;
      const h = Math.floor(ms / 36e5); ms -= h * 36e5;
      const m = Math.floor(ms / 6e4); ms -= m * 6e4;
      const s = Math.floor(ms / 1e3);
      out.d.textContent = d; out.h.textContent = pad(h); out.m.textContent = pad(m); out.s.textContent = pad(s);
      box.setAttribute('aria-label', `${d} days, ${h} hours and ${m} minutes until the Henna Night`);
    };
    tick();
    setInterval(tick, 1000);
  });

  // ---------- reveal ----------
  const rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    rvs.forEach((r) => io.observe(r));
  } else rvs.forEach((r) => r.classList.add('in'));

  // ---------- copy ----------
  const toast = $('.toast');
  let tt;
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const v = b.getAttribute('data-copy');
    let ok = false;
    try { await navigator.clipboard.writeText(v); ok = true; } catch (err) {
      const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) {} ta.remove();
    }
    toast.textContent = ok ? `Copied ${v}` : 'Please copy the code manually';
    toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 2000);
  });
})();
