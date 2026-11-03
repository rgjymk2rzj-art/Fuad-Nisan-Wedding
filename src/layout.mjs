import { NAV, SITE } from './data.mjs';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const tel = (n) => 'tel:' + String(n).replace(/[^+\d]/g, '');
export const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
export const bf = (tone = 'violet', cls = '') => `<svg class="bf bf--${tone} ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#bf" width="100" height="100"></use></svg>`;
export const divider = () => `<div class="divider" aria-hidden="true">${bf('violet')}${bf('lavender')}${bf('white')}</div>`;
export const qamariya = (cls = '') => `<svg class="qamariya ${cls}" viewBox="0 0 200 108" aria-hidden="true" focusable="false"><use href="#qamariya" width="200" height="108"></use></svg>`;

export const placeholder = (label, desc, extra = '') => `
  <div class="ph ${extra}" role="img" aria-label="Photograph placeholder: ${esc(desc)}">
    <svg class="bf-big" viewBox="0 0 100 100" aria-hidden="true"><use href="#bf" width="100" height="100"></use></svg>
    <div class="ph__inner">
      <span class="ph__label">${esc(label)}</span>
      <span class="ph__desc">${esc(desc)}</span>
    </div>
  </div>`;

export const tbc = (text = 'To be confirmed') => `<span class="tbc">${icon('info')}${esc(text)}</span>`;

export const copyBtn = (value, label = 'Copy') =>
  `<button type="button" class="copy-btn" data-copy="${esc(value)}" aria-label="${esc(label)}: ${esc(value)}">${icon('copy')}<span>Copy</span></button>`;

const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <defs>
    <path id="bfp" d="M0 -5 C-13 -9 -27 -22 -25 -35 C-23 -46 -9 -50 0 -43 C9 -50 23 -46 25 -35 C27 -22 13 -9 0 -5 Z"/>
    <path id="bfv" d="M0 -9 L0 -34"/>
    <symbol id="bf" viewBox="-50 -50 100 100">
      <g fill="currentColor" stroke="rgba(71,48,107,.22)" stroke-width=".8">
        <use href="#bfp"/><use href="#bfp" transform="rotate(72)"/><use href="#bfp" transform="rotate(144)"/><use href="#bfp" transform="rotate(216)"/><use href="#bfp" transform="rotate(288)"/>
      </g>
      <g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1">
        <use href="#bfv"/><use href="#bfv" transform="rotate(72)"/><use href="#bfv" transform="rotate(144)"/><use href="#bfv" transform="rotate(216)"/><use href="#bfv" transform="rotate(288)"/>
      </g>
      <circle r="8.5" fill="#fffdfa" fill-opacity=".92"/>
      <circle r="4.2" fill="#e8d8b6"/>
      <circle r="1.8" fill="#9c7c43"/>
    </symbol>
    <symbol id="qamariya" viewBox="0 0 200 108">
      <path d="M8 104 A92 92 0 0 1 192 104 Z" fill="#fffdfa" stroke="#bf9b5f" stroke-width="2.5"/>
      <g stroke="#fffdfa" stroke-width="3">
        <path d="M100 104 L18 104 A82 82 0 0 1 24.6 71.6 Z" fill="#ddd0ee"/>
        <path d="M100 104 L24.6 71.6 A82 82 0 0 1 43.2 44.6 Z" fill="#a993d3"/>
        <path d="M100 104 L43.2 44.6 A82 82 0 0 1 70 27.6 Z" fill="#e8d8b6"/>
        <path d="M100 104 L70 27.6 A82 82 0 0 1 100 22 Z" fill="#5e3f8c"/>
        <path d="M100 104 L100 22 A82 82 0 0 1 130 27.6 Z" fill="#8b9a7d"/>
        <path d="M100 104 L130 27.6 A82 82 0 0 1 156.8 44.6 Z" fill="#e8d8b6"/>
        <path d="M100 104 L156.8 44.6 A82 82 0 0 1 175.4 71.6 Z" fill="#a993d3"/>
        <path d="M100 104 L175.4 71.6 A82 82 0 0 1 182 104 Z" fill="#ddd0ee"/>
      </g>
      <path d="M58 104 A42 42 0 0 1 142 104 Z" fill="#fffdfa" stroke="#bf9b5f" stroke-width="2"/>
      <g transform="translate(100 88) scale(.3)" fill="#5e3f8c">
        <use href="#bfp"/><use href="#bfp" transform="rotate(72)"/><use href="#bfp" transform="rotate(144)"/><use href="#bfp" transform="rotate(216)"/><use href="#bfp" transform="rotate(288)"/>
        <circle r="8" fill="#e8d8b6"/>
      </g>
      <g fill="none" stroke="#bf9b5f" stroke-width="1" stroke-dasharray="2 3"><path d="M18 104 A82 82 0 0 1 182 104"/></g>
    </symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 1 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></symbol>
    <symbol id="i-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.2c2.3.2 4 1.6 4.5 4.3"/></symbol>
    <symbol id="i-sparkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5z"/><path d="M18.5 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M6.6 3.5h3l1.4 4-2 1.4a11 11 0 0 0 6.1 6.1l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/></symbol>
    <symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.6 5.2 3.6 8.5s-1.1 6.1-3.6 8.5c-2.5-2.4-3.6-5.2-3.6-8.5S9.5 5.9 12 3.5z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
    <symbol id="i-share" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/></symbol>
    <symbol id="i-whatsapp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M4 20l1.2-4.1A8.5 8.5 0 1 1 8.4 19z"/><path d="M9 8.5c.2 2.9 3.6 6.3 6.5 6.5l1-1.4-2-1-1 .9c-1-.4-2.6-2-3-3l.9-1-1-2z" stroke-width="1.2"/></symbol>
    <symbol id="i-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 7.5h16M4 12h16M4 16.5h16"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></symbol>
    <symbol id="i-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></symbol>
    <symbol id="i-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></symbol>
    <symbol id="i-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01"/></symbol>
    <symbol id="i-plane" viewBox="0 0 24 24"><path fill="currentColor" d="M21.5 12c0-.8-.7-1.3-1.5-1.3h-5.1L10.3 3.2H8.4l2.4 7.5H5.6L3.8 8.2H2.3l1.1 3.8-1.1 3.8h1.5l1.8-2.5h5.2l-2.4 7.5h1.9l4.6-7.5H20c.8 0 1.5-.5 1.5-1.3z"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></symbol>
  </defs>
</svg>`;

export function layout({ path, title, description, body, scripts = [], bodyClass = '', noindex = false, head = '' }) {
  const fullTitle = title ? `${title} · Fuad & Nisan` : 'Fuad & Nisan · Yesterday, Today & Tomorrow';
  const desc = description || SITE.description;
  const canonical = SITE.url + path;
  const navItems = NAV.map(
    (n) => `<li><a href="${n.href}"${n.href === path ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`
  ).join('');
  const footNav = NAV.concat([{ href: '/rsvp/', label: 'RSVP' }])
    .map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('');

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#fbf7f0">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Fuad & Nisan">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="64x64" href="/assets/img/favicon-64.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v=__V__">
<script>document.documentElement.classList.add('js');try{if(sessionStorage.getItem('fn-nav'))document.documentElement.classList.add('page-enter');sessionStorage.removeItem('fn-nav')}catch(e){}</script>
${head}
</head>
<body class="${bodyClass}">
${SPRITE}
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" id="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Fuad & Nisan — home">
      <img src="/assets/img/monogram.png" alt="" width="24" height="46">
      <span>Fuad &amp; Nisan</span>
    </a>
    <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">${icon('menu')}</button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <button class="nav-toggle nav-close" type="button" aria-label="Close menu">${icon('close')}</button>
      <ul class="nav-list">
        ${navItems}
        <li><a class="btn nav-rsvp" href="/rsvp/"${path === '/rsvp/' ? ' aria-current="page"' : ''}>RSVP</a></li>
      </ul>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="weave weave--thin" aria-hidden="true"></div>
  <div class="wrap">
    <img class="site-footer__mono" src="/assets/img/monogram-gold.png" alt="" width="64" height="124" loading="lazy">
    <div class="site-footer__names">Fuad &amp; Nisan</div>
    <div class="site-footer__dates">19 – 23 December 2026 · Nairobi, Kenya</div>
    <p class="site-footer__thanks">Mahadsanid · <span class="arabic" lang="ar">شكراً</span> · Asante · Thank you</p>
    <div class="bf-row" aria-hidden="true">${bf('violet', 'bf-cycle')}${bf('lavender')}${bf('white')}</div>
    <ul class="footer-nav">${footNav}</ul>
    <div class="share" data-share>
      <button type="button" data-share-native hidden>${icon('share')}Share</button>
      <a data-share-whatsapp href="https://wa.me/?text=${encodeURIComponent('Fuad & Nisan · 19–23 December 2026 · Nairobi — ' + SITE.url)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
      <button type="button" data-copy="${SITE.url}" data-copy-msg="Link copied">${icon('link')}Copy link</button>
    </div>
    <small>With love, the Abdulkaders · fnwedding.com</small>
  </div>
</footer>
<div class="toast" role="status" aria-live="polite"></div>
<div class="veil" aria-hidden="true">${bf('lavender', 'bf-spin')}</div>
<script src="/assets/js/site.js?v=__V__" defer></script>
${scripts.map((s) => `<script src="${s}?v=__V__" defer></script>`).join('\n')}
</body>
</html>
`;
}

export function pageHero({ eyebrow, title, lede, titleTag = 'h1' }) {
  return `
<section class="page-hero">
  <img class="page-hero__floral page-hero__floral--l" src="/assets/img/floral-branch.webp" alt="" width="700" height="986">
  <img class="page-hero__floral page-hero__floral--r" src="/assets/img/floral-cluster.webp" alt="" width="287" height="228">
  <div class="wrap">
    <span class="eyebrow">${eyebrow}</span>
    <${titleTag}>${title}</${titleTag}>
    ${divider()}
    ${lede ? `<p class="lede">${lede}</p>` : ''}
  </div>
</section>`;
}
