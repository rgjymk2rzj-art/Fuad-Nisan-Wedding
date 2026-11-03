import { pageHero, placeholder, icon, esc } from '../layout.mjs';

const photos = [
  { cat: 'couple', src: '/assets/img/couple-quran.webp', w: 1100, h: 1100, alt: 'Fuad and Nisan seated together, in black and white', cap: 'Fuad & Nisan', style: 'filter:grayscale(1)' },
  { cat: 'wedding', src: '/assets/img/invite-reception.webp', w: 1400, h: 740, alt: 'The fan-shaped reception invitation with pomegranates, figs, Yemeni tower houses and a leopard', cap: 'The reception invitation' },
  { cat: 'wedding', src: '/assets/img/reception-programme.webp', w: 1400, h: 741, alt: 'The fan-shaped order of the day card for the reception', cap: 'Order of the day' },
  { cat: 'wedding floral', src: '/assets/img/guest-guide-cover.webp', w: 900, h: 1273, alt: 'Cover of the wedding guest guide with lilac magnolias and the Fuad and Nisan monogram', cap: 'The guest guide' },
  { cat: 'floral', src: '/assets/img/floral-frame.webp', w: 1200, h: 1002, alt: 'Watercolour lilac and blush magnolias', cap: 'Florals' },
  { cat: 'floral', src: '/assets/img/petals.webp', w: 900, h: 936, alt: 'Scattered violet blooms', cap: 'Violet blooms' },
];

const placeholders = [
  ['couple', 'Engagement photographs'],
  ['family', 'Family photographs'],
  ['somali', 'Somali inspiration — the Dirac, garbasaar and gold'],
  ['yemeni', 'Yemeni inspiration — henna, jewellery and Sana’a architecture'],
  ['bridal', 'Traditional bridal styling'],
  ['floral', 'The Brunfelsia in bloom'],
  ['couple', 'Couple portraits'],
  ['family', 'Two families together'],
];

const filters = [
  ['all', 'All'], ['couple', 'Couple'], ['family', 'Family'], ['somali', 'Somali'], ['yemeni', 'Yemeni'], ['bridal', 'Bridal styling'], ['wedding', 'Wedding'], ['floral', 'Brunfelsia & florals'],
];

const figs = [];
photos.forEach((p, i) => {
  figs.push(`<figure data-cat="${p.cat}">
    <button type="button" class="g-open" data-full="${p.src}" data-alt="${esc(p.alt)}" data-caption="${esc(p.cap)}" aria-label="Open image: ${esc(p.cap)}">
      <img src="${p.src}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy" style="${p.style || ''}">
    </button>
    <figcaption>${esc(p.cap)}</figcaption>
  </figure>`);
  const ph = placeholders[i];
  if (ph) figs.push(`<figure data-cat="${ph[0]}">${placeholder('Photograph to come', ph[1], i % 2 ? 'ph--wide' : '')}</figure>`);
});
placeholders.slice(photos.length).forEach((ph) => figs.push(`<figure data-cat="${ph[0]}">${placeholder('Photograph to come', ph[1])}</figure>`));

export default {
  path: '/gallery/',
  title: 'Gallery',
  description: 'Photographs of Fuad & Nisan, their invitations, Somali and Yemeni inspiration and the Brunfelsia flower.',
  body: `
${pageHero({
  eyebrow: 'Moments & inspiration',
  title: 'Gallery',
  lede: 'Our photographs, the details we love, and the Somali and Yemeni traditions that inspire our celebrations. More to come.',
})}
<section class="section" style="padding-top:clamp(30px,5vw,60px)">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter photographs">
      ${filters.map(([k, l], i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}
    </div>
    <div class="masonry">${figs.join('')}</div>
  </div>
</section>
<div class="lightbox" role="dialog" aria-modal="true" aria-label="Photograph viewer">
  <button type="button" class="lb-close" aria-label="Close">${icon('close')}</button>
  <button type="button" class="lb-prev" aria-label="Previous">${icon('left')}</button>
  <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="">
  <button type="button" class="lb-next" aria-label="Next">${icon('right')}</button>
  <p class="lightbox__cap"></p>
</div>`,
};
