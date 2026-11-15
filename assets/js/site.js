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

  // ---------- falling blooms on the guest-guide pane ----------
  const pane = $('.guide__pane');
  const fall = pane && $('.pane__fall', pane);
  if (fall && !reduce) {
    const n = window.innerWidth < 700 ? 9 : 16;
    const rand = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'fall';
      const dur = rand(9, 16);
      d.style.setProperty('--x', rand(-2, 98).toFixed(1) + '%');
      d.style.setProperty('--s', Math.round(rand(22, 46)) + 'px');
      d.style.setProperty('--dur', dur.toFixed(1) + 's');
      d.style.setProperty('--delay', (-rand(0, dur)).toFixed(1) + 's');
      d.style.setProperty('--drift', Math.round(rand(-90, 90)) + 'px');
      d.style.setProperty('--sw', rand(2.4, 4.2).toFixed(1) + 's');
      d.style.setProperty('--r', Math.round(rand(10, 35)) + 'deg');
      const img = document.createElement('img');
      img.src = '/assets/img/bloom-' + (1 + (i % 6)) + '.webp';
      img.alt = '';
      img.decoding = 'async';
      d.appendChild(img);
      fall.appendChild(d);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => pane.classList.toggle('is-live', e.isIntersecting))).observe(pane);
    } else pane.classList.add('is-live');
  }

  // ---------- handwritten letter: a pen writes it out ----------
  const letter = $('[data-write]');
  if (letter && !reduce) {
    const pen = $('.pen', letter);
    const chars = [];
    $$('p', letter).forEach((p) => {
      const words = p.textContent.split(/(\s+)/);
      p.textContent = '';
      words.forEach((wd) => {
        if (/^\s+$/.test(wd)) { p.appendChild(document.createTextNode(wd)); return; }
        const w = document.createElement('span');
        w.className = 'w';
        for (const c of wd) {
          const sp = document.createElement('span');
          sp.className = 'ch';
          sp.textContent = c;
          w.appendChild(sp);
          chars.push(sp);
        }
        p.appendChild(w);
      });
    });
    let started = false;
    const finish = () => { chars.forEach((c) => c.classList.add('on')); letter.classList.remove('writing'); };
    const write = () => {
      if (started) return;
      started = true;
      letter.classList.add('writing');
      let i = 0;
      const box = () => letter.getBoundingClientRect();
      const perFrame = 1; // one character per frame (~60 a second), like handwriting
      const step = () => {
        for (let k = 0; k < perFrame && i < chars.length; k++, i++) chars[i].classList.add('on');
        const cur = chars[Math.min(i, chars.length - 1)];
        const r = cur.getBoundingClientRect(), b = box();
        pen.style.left = (r.right - b.left) + 'px';
        pen.style.top = (r.bottom - b.top) + 'px';
        if (i < chars.length) requestAnimationFrame(step);
        else setTimeout(() => letter.classList.remove('writing'), 500);
      };
      requestAnimationFrame(step);
    };
    letter.addEventListener('click', finish);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); setTimeout(write, 400); } }), { threshold: 0.35 });
      io.observe(letter);
    } else write();
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
