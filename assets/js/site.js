/* Fuad & Nisan — shared interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- toast ----------
  const toastEl = $('.toast');
  let toastT;
  window.fnToast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  };

  // ---------- header ----------
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- mobile nav ----------
  const nav = $('#site-nav');
  const openBtn = $('.site-header > .wrap > .nav-toggle');
  const closeBtn = $('.nav-close');
  const setNav = (open) => {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    openBtn && openBtn.setAttribute('aria-expanded', String(open));
    if (open) { const first = $('a', nav); first && first.focus(); } else { openBtn && openBtn.focus(); }
  };
  openBtn && openBtn.addEventListener('click', () => setNav(true));
  closeBtn && closeBtn.addEventListener('click', () => setNav(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) setNav(false); });
  nav && $$('a', nav).forEach((a) => a.addEventListener('click', () => { if (nav.classList.contains('is-open')) { nav.classList.remove('is-open'); document.body.classList.remove('nav-open'); } }));

  // ---------- reveal on scroll ----------
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add('is-in'));
  }

  // ---------- countdown ----------
  $$('[data-countdown]').forEach((box) => {
    const target = new Date(box.getAttribute('data-countdown')).getTime();
    const parts = { d: $('[data-cd="d"]', box), h: $('[data-cd="h"]', box), m: $('[data-cd="m"]', box), s: $('[data-cd="s"]', box) };
    const done = box.parentElement && $('[data-countdown-done]', box.parentElement);
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      parts.d.textContent = d; parts.h.textContent = pad(h); parts.m.textContent = pad(m); parts.s.textContent = pad(s);
      box.setAttribute('aria-label', `${d} days, ${h} hours and ${m} minutes to go`);
      if (target - Date.now() <= 0) { clearInterval(iv); if (done) done.hidden = false; }
    };
    const iv = setInterval(tick, 1000);
    tick();
  });

  // ---------- copy to clipboard ----------
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) {}
      ta.remove();
      return ok;
    }
  }
  window.fnCopy = copyText;
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const val = btn.getAttribute('data-copy');
    const ok = await copyText(val);
    window.fnToast(ok ? (btn.getAttribute('data-copy-msg') || `Copied: ${val}`) : 'Could not copy — please select and copy manually');
    if (ok && btn.classList.contains('copy-btn')) {
      btn.classList.add('is-copied');
      const span = $('span', btn);
      const old = span ? span.textContent : '';
      if (span) span.textContent = 'Copied';
      setTimeout(() => { btn.classList.remove('is-copied'); if (span) span.textContent = old; }, 1800);
    }
  });

  // ---------- native share ----------
  $$('[data-share-native]').forEach((b) => {
    if (navigator.share) {
      b.hidden = false;
      b.addEventListener('click', () => {
        navigator.share({ title: document.title, text: 'Fuad & Nisan · 19–23 December 2026 · Nairobi', url: location.origin + location.pathname }).catch(() => {});
      });
    }
  });

  // ---------- petals ----------
  $$('.petals').forEach((wrap) => {
    if (reduce) return;
    const tones = ['#5e3f8c', '#a993d3', '#efe8f7'];
    const n = window.innerWidth < 640 ? 5 : 9;
    for (let i = 0; i < n; i++) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 100 100');
      s.setAttribute('class', 'petal');
      s.innerHTML = '<use href="#bf" width="100" height="100"></use>';
      s.style.color = tones[i % 3];
      s.style.left = Math.random() * 100 + '%';
      const size = 18 + Math.random() * 18;
      s.style.width = s.style.height = size + 'px';
      s.style.animationDuration = 14 + Math.random() * 12 + 's';
      s.style.animationDelay = -Math.random() * 20 + 's';
      s.style.setProperty('--drift', (Math.random() * 160 - 80).toFixed(0) + 'px');
      s.style.setProperty('--spin', (Math.random() * 600 - 300).toFixed(0) + 'deg');
      wrap.appendChild(s);
    }
  });

  // ---------- gallery filters + lightbox ----------
  const filters = $('.filters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-filter]');
      if (!b) return;
      $$('button', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.getAttribute('data-filter');
      $$('.masonry figure').forEach((fig) => { fig.hidden = f !== 'all' && !fig.dataset.cat.split(' ').includes(f); });
    });
  }
  const lb = $('.lightbox');
  if (lb) {
    const img = $('img', lb);
    const cap = $('.lightbox__cap', lb);
    let items = [];
    let idx = 0;
    let lastFocus = null;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      img.src = it.getAttribute('data-full');
      img.alt = it.getAttribute('data-alt') || '';
      cap.textContent = it.getAttribute('data-caption') || '';
    };
    const open = (btn) => {
      items = $$('.masonry figure:not([hidden]) .g-open');
      lastFocus = btn;
      show(items.indexOf(btn));
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      $('.lb-close', lb).focus();
    };
    const close = () => { lb.classList.remove('is-open'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
    document.addEventListener('click', (e) => { const b = e.target.closest('.g-open'); if (b) open(b); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // ---------- subtle page transitions ----------
  const veil = $('.veil');
  if (veil && !reduce) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || a.target === '_blank' || a.hasAttribute('download')) return;
      if (url.pathname === location.pathname) return; // in-page anchors
      if (/\.(pdf|jpg|png|webp|csv)$/i.test(url.pathname)) return;
      e.preventDefault();
      veil.classList.add('is-on');
      try { sessionStorage.setItem('fn-nav', '1'); } catch (err) {}
      setTimeout(() => { location.href = url.href; }, 380);
    });
    window.addEventListener('pageshow', () => veil.classList.remove('is-on'));
  }
})();
