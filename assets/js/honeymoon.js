/* Honeymoon page — optional note form + the little aeroplane strip. */
(() => {
  const api = window.fnApi;
  const form = document.getElementById('note-form');
  if (form && api) {
    const status = form.querySelector('.alert');
    const btn = form.querySelector('button[type="submit"]');
    const amount = form.elements.amount;
    if (!api.configured) {
      document.querySelector('[data-api-off]').hidden = false;
      btn.disabled = true;
    }
    form.querySelectorAll('input[name="preset"]').forEach((r) => r.addEventListener('change', () => {
      if (r.value === 'custom') { amount.value = ''; amount.focus(); } else amount.value = r.value;
    }));
    amount.addEventListener('input', () => {
      form.querySelectorAll('input[name="preset"]').forEach((r) => { r.checked = r.value === amount.value || (r.value === 'custom' && amount.value && !['50', '100', '250', '500'].includes(amount.value)); });
    });
    const show = (kind, msg) => { status.className = 'alert alert--' + kind; status.textContent = msg; status.hidden = !msg; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!api.configured) return;
      const f = form.elements;
      if (!f.name.value.trim()) { show('error', 'Please add your name.'); f.name.focus(); return; }
      if (!f.message.value.trim()) { show('error', 'Please write a short message.'); f.message.focus(); return; }
      btn.disabled = true;
      try {
        await api.rpc('leave_note', { p: {
          name: f.name.value.trim(), email: f.email.value.trim(), message: f.message.value.trim(),
          amount: f.amount.value, method: f.currency.value, website: f.website.value,
        } });
        form.reset();
        show('success', 'Thank you — your note has been delivered to Nisan & Fuad. ❤️');
      } catch (err) {
        show('error', err.message);
      } finally {
        btn.disabled = false;
      }
    });
  }

  // Flight strip: soft world map behind the route
  const land = document.getElementById('hm-land');
  if (land) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const svg = document.getElementById('hm-map');
      svg.pauseAnimations && svg.pauseAnimations();
    }
    fetch('/assets/data/world.json').then((r) => r.json()).then((d) => {
      const svg = document.getElementById('hm-map');
      // frame Europe → Africa → Asia in a wide strip
      svg.setAttribute('viewBox', '760 200 1100 220');
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d.land);
      p.setAttribute('fill', 'rgba(169,147,211,.22)');
      p.setAttribute('stroke', 'rgba(191,155,95,.5)');
      p.setAttribute('stroke-width', '1');
      land.appendChild(p);
      const route = document.getElementById('hm-route');
      route.setAttribute('d', 'M840 380 C 1050 200, 1450 200, 1780 330');
      const plane = svg.querySelector('.hm-plane use');
      plane.setAttribute('x', '-15'); plane.setAttribute('y', '-15'); plane.setAttribute('width', '30'); plane.setAttribute('height', '30');
    }).catch(() => {});
  }
})();
