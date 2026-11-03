/* Fuad & Nisan — opening animation
   Two hands meet → heart → world map with five flight paths converging on Nairobi. */
(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const svg = document.getElementById('hero-map');
  const intro = hero.querySelector('.intro');
  const groom = hero.querySelector('.hand--groom');
  const bride = hero.querySelector('.hand--bride');
  const glow = hero.querySelector('.touch-glow');
  const heart = hero.querySelector('.touch-heart');
  const names = hero.querySelector('.intro__names');
  const skipBtn = hero.querySelector('[data-intro-skip]');
  const replayBtn = hero.querySelector('[data-intro-replay]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const ORIGINS = [
    ['canada', 'Canada'],
    ['italy', 'Italy'],
    ['greece', 'Greece'],
    ['egypt', 'Egypt'],
    ['uae', 'UAE'],
  ];

  let data = null;
  let routes = [];
  let planes = [];
  let token = 0;
  let cam = { from: null, to: null, t: 0 };
  let ambient = null;

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const el = (name, attrs = {}, parent) => {
    const n = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  };

  // ---------- camera ----------
  function boxAround(points, pad) {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad;
    const y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function toAspect(b, aspect) {
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    let w = b.w, h = b.h;
    if (w / h > aspect) h = w / aspect; else w = h * aspect;
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }
  function cameras() {
    const r = hero.getBoundingClientRect();
    const aspect = Math.max(0.45, r.width / Math.max(1, r.height));
    const portrait = aspect < 0.9;
    const P = data.points;
    const keys = portrait ? ORIGINS.filter(([k]) => k !== 'canada') : ORIGINS;
    const all = [P.nairobi, ...keys.map(([k]) => P[k])];
    const b = boxAround(all, portrait ? 110 : 150);
    if (!portrait) b.w += 90;
    const wide = toAspect(b, aspect);
    // final: tighter, with Nairobi resting below/right of the title
    const n = P.nairobi;
    const s = portrait ? 0.92 : 0.8;
    const w = wide.w * s, h = wide.h * s;
    const fx = portrait ? 0.5 : 0.7, fy = portrait ? 0.9 : 0.78;
    const close = { x: n[0] - fx * w, y: n[1] - fy * h, w, h };
    return { wide, close };
  }
  function setView(b) {
    svg.setAttribute('viewBox', `${b.x.toFixed(1)} ${b.y.toFixed(1)} ${b.w.toFixed(1)} ${b.h.toFixed(1)}`);
  }
  function lerpBox(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t };
  }

  // ---------- build map ----------
  function build() {
    const { wide } = cameras();
    const unit = wide.w / 900; // stroke & type scale
    svg.innerHTML = '';
    const defs = el('defs', {}, svg);
    const g = el('linearGradient', { id: 'route-g', x1: '0', y1: '0', x2: '1', y2: '0' }, defs);
    el('stop', { offset: '0', 'stop-color': '#e8d8b6' }, g);
    el('stop', { offset: '.6', 'stop-color': '#bf9b5f' }, g);
    el('stop', { offset: '1', 'stop-color': '#9c7c43' }, g);

    el('path', { d: data.land, class: 'land', 'stroke-width': (0.9 * unit).toFixed(2) }, svg);
    el('path', { d: data.borders, class: 'borders', 'stroke-width': (0.5 * unit).toFixed(2) }, svg);

    const routeLayer = el('g', {}, svg);
    const markerLayer = el('g', {}, svg);
    const planeLayer = el('g', {}, svg);
    const N = data.points.nairobi;
    routes = [];
    planes = [];

    ORIGINS.forEach(([key, label], i) => {
      const O = data.points[key];
      const dx = N[0] - O[0], dy = N[1] - O[1];
      const dist = Math.hypot(dx, dy);
      // perpendicular, bowed toward the north-east for an elegant arc
      let px = -dy / dist, py = dx / dist;
      if (py > 0) { px = -px; py = -py; }
      const bow = Math.min(0.32, 60 / dist + 0.16) * dist;
      const cx = (O[0] + N[0]) / 2 + px * bow;
      const cy = (O[1] + N[1]) / 2 + py * bow;
      const d = `M${O[0]} ${O[1]} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${N[0]} ${N[1]}`;
      el('path', { d, class: 'route-shadow', 'stroke-width': (5 * unit).toFixed(2) }, routeLayer);
      const p = el('path', { d, class: 'route', 'stroke-width': (1.8 * unit).toFixed(2), pathLength: '1', 'stroke-dasharray': '1 1', 'stroke-dashoffset': '1' }, routeLayer);
      routes.push(p);

      const og = el('g', { class: 'origin', opacity: '0' }, markerLayer);
      el('circle', { cx: O[0], cy: O[1], r: (4 * unit).toFixed(2) }, og);
      const t = el('text', { x: O[0], y: O[1] - 11 * unit, 'text-anchor': 'middle', 'font-size': (12 * unit).toFixed(2), 'stroke-width': (3 * unit).toFixed(2) }, og);
      t.textContent = label;
      if (key === 'egypt') { t.setAttribute('y', O[1] + 22 * unit); }
      if (key === 'uae') { t.setAttribute('text-anchor', 'start'); t.setAttribute('x', O[0] + 10 * unit); t.setAttribute('y', O[1] + 4 * unit); }
      if (key === 'italy') { t.setAttribute('text-anchor', 'end'); t.setAttribute('x', O[0] - 8 * unit); }
      if (key === 'greece') { t.setAttribute('text-anchor', 'start'); t.setAttribute('x', O[0] + 6 * unit); }

      const pl = el('g', { class: 'plane', opacity: '0' }, planeLayer);
      el('use', { href: '#i-plane', x: -12, y: -12, width: 24, height: 24 }, pl);
      planes.push({ g: pl, path: p, len: p.getTotalLength(), scale: 1.05 * unit, delay: i * 260 });
    });

    const dg = el('g', { class: 'dest', opacity: '0' }, markerLayer);
    el('circle', { cx: N[0], cy: N[1], r: 7 * unit, class: 'pulse', 'stroke-width': 1.4 * unit }, dg);
    el('circle', { cx: N[0], cy: N[1], r: 7 * unit, class: 'pulse pulse--2', 'stroke-width': 1.4 * unit }, dg);
    el('circle', { cx: N[0], cy: N[1], r: 5 * unit, class: 'dest-core', 'stroke-width': 2 * unit }, dg);
    const nt = el('text', { x: N[0], y: N[1] + 26 * unit, 'text-anchor': 'middle', 'font-size': 15 * unit, 'stroke-width': 3.5 * unit }, dg);
    nt.textContent = 'Nairobi';
    setView(wide);
  }

  function placePlane(pl, t) {
    const L = pl.len;
    const a = pl.path.getPointAtLength(Math.max(0, Math.min(L, t * L)));
    const b = pl.path.getPointAtLength(Math.max(0, Math.min(L, t * L + 1)));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    pl.g.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${pl.scale.toFixed(3)})`);
  }

  function fly(my, duration) {
    return new Promise((resolve) => {
      const start = performance.now();
      const total = duration + planes[planes.length - 1].delay;
      const frame = (now) => {
        if (my !== token) return resolve(false);
        const el0 = now - start;
        planes.forEach((pl, i) => {
          const t = Math.max(0, Math.min(1, (el0 - pl.delay) / duration));
          const e = easeInOut(t);
          routes[i].setAttribute('stroke-dashoffset', (1 - e).toFixed(4));
          pl.g.setAttribute('opacity', t <= 0 ? 0 : t >= 1 ? 0 : t > 0.92 ? ((1 - t) / 0.08).toFixed(2) : 1);
          if (t > 0 && t < 1) placePlane(pl, e);
        });
        if (el0 < total) requestAnimationFrame(frame); else resolve(true);
      };
      requestAnimationFrame(frame);
    });
  }

  function zoom(my, from, to, duration) {
    return new Promise((resolve) => {
      const start = performance.now();
      const frame = (now) => {
        if (my !== token) return resolve(false);
        const t = Math.min(1, (now - start) / duration);
        cam.t = t;
        setView(lerpBox(from, to, easeInOut(t)));
        if (t < 1) requestAnimationFrame(frame); else resolve(true);
      };
      requestAnimationFrame(frame);
    });
  }

  function fadeMarkers(sel, delayStep = 140) {
    svg.querySelectorAll(sel).forEach((n, i) => {
      n.style.transition = 'opacity .8s ease';
      setTimeout(() => n.setAttribute('opacity', '1'), i * delayStep);
    });
  }

  // ---------- ambient planes after the intro ----------
  function startAmbient() {
    if (reduce || ambient) return;
    let busy = false;
    ambient = setInterval(() => {
      if (busy || document.hidden || !hero.classList.contains('is-final')) return;
      const r = hero.getBoundingClientRect();
      if (r.bottom < 0) return;
      busy = true;
      const pl = planes[Math.floor(Math.random() * planes.length)];
      const start = performance.now();
      const dur = 7000;
      const frame = (now) => {
        const t = Math.min(1, (now - start) / dur);
        placePlane(pl, easeInOut(t));
        pl.g.setAttribute('opacity', t < 0.08 ? (t / 0.08).toFixed(2) : t > 0.9 ? ((1 - t) / 0.1).toFixed(2) : 0.85);
        if (t < 1 && hero.classList.contains('is-final')) requestAnimationFrame(frame);
        else { pl.g.setAttribute('opacity', 0); busy = false; }
      };
      requestAnimationFrame(frame);
    }, 5200);
  }

  // ---------- sequence ----------
  function resetIntro() {
    [groom, bride, glow, heart, names, intro].forEach((n) => n.getAnimations().forEach((a) => a.cancel()));
    hero.classList.remove('is-final', 'map-on', 'no-intro');
    intro.style.opacity = '';
    routes.forEach((r) => r.setAttribute('stroke-dashoffset', '1'));
    planes.forEach((p) => p.g.setAttribute('opacity', '0'));
    svg.querySelectorAll('.origin, .dest').forEach((n) => { n.style.transition = 'none'; n.setAttribute('opacity', '0'); });
    const { wide } = cameras();
    setView(wide);
    skipBtn.hidden = false;
    replayBtn.hidden = true;
  }

  function finish() {
    token++;
    [groom, bride, glow, heart, names, intro].forEach((n) => n.getAnimations().forEach((a) => a.cancel()));
    hero.classList.add('map-on', 'is-final');
    if (data) {
      routes.forEach((r) => r.setAttribute('stroke-dashoffset', '0'));
      planes.forEach((p) => p.g.setAttribute('opacity', '0'));
      svg.querySelectorAll('.origin, .dest').forEach((n) => n.setAttribute('opacity', '1'));
      setView(cameras().close);
      cam.t = 1;
    }
    skipBtn.hidden = true;
    replayBtn.hidden = false;
    startAmbient();
  }

  async function play() {
    const my = ++token;
    resetIntro();
    try { sessionStorage.setItem('fn-intro-seen', '1'); } catch (e) {}
    const E = 'cubic-bezier(.22,.61,.36,1)';
    const D = 2800;
    groom.animate([
      { transform: 'translateX(-80%)', opacity: 0 },
      { transform: 'translateX(-30%)', opacity: 1, offset: 0.35 },
      { transform: 'translateX(-2%) translateY(-2px)', opacity: 1, offset: 0.85 },
      { transform: 'translateX(0)', opacity: 1 },
    ], { duration: D, easing: E, fill: 'forwards' });
    bride.animate([
      { transform: 'translateX(80%)', opacity: 0 },
      { transform: 'translateX(30%)', opacity: 1, offset: 0.35 },
      { transform: 'translateX(2%) translateY(2px)', opacity: 1, offset: 0.85 },
      { transform: 'translateX(0)', opacity: 1 },
    ], { duration: D, easing: E, fill: 'forwards' });
    await wait(D - 80);
    if (my !== token) return;

    glow.animate([
      { opacity: 0, transform: 'scale(.2)' },
      { opacity: 1, transform: 'scale(1.1)', offset: 0.35 },
      { opacity: 0, transform: 'scale(1.9)' },
    ], { duration: 1800, easing: 'ease-out', fill: 'forwards' });
    heart.animate([
      { opacity: 0, transform: 'scale(0)' },
      { opacity: 1, transform: 'scale(1.25)', offset: 0.22 },
      { opacity: 1, transform: 'scale(.92)', offset: 0.36 },
      { opacity: 1, transform: 'scale(1.06)', offset: 0.5 },
      { opacity: 1, transform: 'scale(1)', offset: 0.7 },
      { opacity: 0, transform: 'translateY(-50px) scale(.9)' },
    ], { duration: 2200, easing: 'ease-out', fill: 'forwards' });
    names.animate([
      { opacity: 0, transform: 'translateY(12px)', letterSpacing: '.6em' },
      { opacity: 1, transform: 'none', letterSpacing: '.32em' },
    ], { duration: 1500, delay: 350, easing: E, fill: 'forwards' });
    await wait(2300);
    if (my !== token) return;

    intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000, easing: 'ease', fill: 'forwards' });
    if (!data) { finish(); return; }
    hero.classList.add('map-on');
    await wait(500);
    if (my !== token) return;
    fadeMarkers('.origin');
    const flew = await fly(my, 2900);
    if (!flew) return;
    fadeMarkers('.dest', 0);
    const { wide, close } = cameras();
    hero.classList.add('is-final');
    skipBtn.hidden = true;
    const zoomed = await zoom(my, wide, close, 2200);
    if (!zoomed) return;
    finish();
  }

  // ---------- wiring ----------
  skipBtn.addEventListener('click', () => finish());
  replayBtn.addEventListener('click', () => {
    play();
    hero.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      if (!data) return;
      const { wide, close } = cameras();
      if (hero.classList.contains('is-final') && cam.t >= 1) setView(close);
      else if (!hero.classList.contains('is-final')) setView(wide);
    }, 150);
  });

  let seen = false;
  try { seen = sessionStorage.getItem('fn-intro-seen') === '1'; } catch (e) {}
  if (reduce || seen) hero.classList.add('no-intro');

  fetch('/assets/data/world.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((json) => {
      data = json;
      build();
      if (reduce || seen) finish();
      else play();
    })
    .catch(() => {
      // static fallback: no map, just the final title card
      if (reduce || seen) finish();
      else play();
    });
})();
