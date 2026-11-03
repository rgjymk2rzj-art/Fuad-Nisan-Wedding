import { EVENTS } from '../data.mjs';
import { pageHero, icon, placeholder, tbc, qamariya, esc, divider } from '../layout.mjs';

const media = {
  henna: placeholder('Photograph to come', 'A traditional Yemeni henna night — intricate henna, bridal jewellery and dress'),
  nikah: placeholder('Photograph to come', 'The Katb Al-Kitab — the marriage contract and the blessing of the Nikah'),
  reception: `<img src="/assets/img/invite-reception.webp" alt="The printed reception invitation: a fan-shaped card with pomegranates, figs, Yemeni tower houses and a leopard, inviting guests to Fuad and Nisan's reception on 23 December 2026 at Emara Ole Sereni" width="1400" height="740" loading="lazy" style="object-fit:cover;object-position:center">`,
};

const venues = (e) => {
  if (e.venues.length > 1) {
    return `<div class="venue-split">${e.venues.map((v) => `
      <div class="card">
        <span class="eyebrow" style="margin-bottom:.4rem">${esc(v.who)}</span>
        <h5>${esc(v.name)}</h5>
        <p class="small muted" style="margin-bottom:.8em">${esc(v.address)}</p>
        <a class="chip-link" href="${v.map}" target="_blank" rel="noopener">${icon('pin')}Open in Maps</a>
      </div>`).join('')}</div>`;
  }
  const v = e.venues[0];
  return `<p class="mb-0"><strong>${esc(v.name)}</strong><br><span class="muted">${esc(v.address)}</span></p>
    <p style="margin-top:12px"><a class="chip-link" href="${v.map}" target="_blank" rel="noopener">${icon('pin')}Open in Maps</a></p>`;
};

const programme = (e) => e.programme
  ? `<ol class="programme">${e.programme.map(([t, item]) => `<li><time>${t}</time><span class="dot" aria-hidden="true"></span><span class="item">${esc(item)}</span></li>`).join('')}</ol>`
  : `<p>${tbc('Programme to be shared closer to the day')}</p>`;

const extras = {
  henna: `
    <div class="event__block">
      <h4>Good to know</h4>
      <ul class="facts">
        <li>${icon('users')}<div><b>Who</b>This is a ladies-only celebration with the bride.</div></li>
        <li>${icon('sparkle')}<div><b>Atmosphere</b>Music, laughter, traditional dress and heartfelt prayers as family and friends bless the bride.</div></li>
      </ul>
    </div>`,
  nikah: `
    <div class="event__block">
      <h4>Separate arrangements</h4>
      <p>Gentlemen will gather at <strong>Adams Arcade Mosque</strong> and ladies at <strong>Meraki House</strong>. This ceremony is by invitation only.</p>
    </div>
    <div class="dua">
      <span class="arabic" lang="ar">بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ</span>
      <p>“May Allah bless you both, shower His blessings upon you, and unite you in goodness.”</p>
    </div>`,
  reception: `
    <div class="event__block">
      <h4>Please note</h4>
      <ul class="facts">
        <li>${icon('users')}<div><b>Invitation access only</b>Each invitation admits one guest. We kindly ask that the reception is an adults-only celebration — no children.</div></li>
        <li>${icon('clock')}<div><b>Arrival</b>Doors open at 2:00pm. Bites and refreshments are served from 3:00pm, and the bride enters at 4:30pm.</div></li>
      </ul>
    </div>
    <div class="event__block">
      <h4>The order of the day</h4>
      <a class="arch" style="display:block;border-radius:18px" href="/assets/img/reception-programme.webp" target="_blank" rel="noopener">
        <img src="/assets/img/reception-programme.webp" alt="The printed order of the day for the reception: a fan-shaped card listing the programme" width="1400" height="741" loading="lazy">
      </a>
    </div>`,
};

const sections = EVENTS.map((e, i) => `
<section class="event ${i % 2 ? 'event--flip' : ''}" id="${e.id}" aria-labelledby="${e.id}-title">
  <div class="wrap event__grid">
    <div class="event__media reveal">
      <div class="arch">${media[e.id]}</div>
    </div>
    <div class="reveal reveal-d1">
      <div style="max-width:220px;margin-bottom:10px">${qamariya()}</div>
      <span class="event__num">Celebration ${e.num} · ${e.weekday} ${e.day} ${e.month} 2026</span>
      <h2 id="${e.id}-title">${esc(e.title)}</h2>
      <span class="event__title-ar" lang="ar">${e.titleAr}</span>
      <p>
        <span class="event__badge">${icon('users', '')} ${esc(e.audience)}</span>
        <span class="event__badge event__badge--soft">${esc(e.access === e.audience ? e.time : e.access)}</span>
      </p>
      <p class="event__intro">${esc(e.intro)}</p>

      <div class="event__block">
        <h4>Details</h4>
        <ul class="facts">
          <li>${icon('calendar')}<div><b>Date</b>${e.weekday} ${e.day} ${e.month} 2026</div></li>
          <li>${icon('clock')}<div><b>Time</b>${esc(e.time)}</div></li>
          <li>${icon('sparkle')}<div><b>Dress code</b>${e.dressCode ? esc(e.dressCode) : tbc('Dress code to be confirmed')}</div></li>
        </ul>
      </div>

      <div class="event__block">
        <h4>${e.venues.length > 1 ? 'Venues' : 'Venue'}</h4>
        ${venues(e)}
      </div>

      <div class="event__block">
        <h4>Programme</h4>
        ${programme(e)}
      </div>
      ${extras[e.id] || ''}
      <p style="margin-top:30px"><a class="btn btn--sm" href="/rsvp/">RSVP for this celebration</a></p>
    </div>
  </div>
</section>`).join('<div class="weave weave--thin" aria-hidden="true"></div>');

export default {
  path: '/celebrations/',
  title: 'The Celebrations',
  description: 'The Yemeni Henna Night (19 Dec), the Katb Al-Kitab / Nikah (20 Dec) and the Zifaf wedding reception at Emara Ole Sereni (23 Dec 2026), Nairobi.',
  body: `
${pageHero({
  eyebrow: 'The wedding · key dates',
  title: 'The Celebrations',
  lede: 'Three celebrations across one beautiful week — honouring Somali and Yemeni tradition, faith and family.',
})}
<nav class="wrap" aria-label="Celebrations" style="margin-top:28px;margin-bottom:0">
  <div class="filters" style="margin-bottom:0">
    ${EVENTS.map((e) => `<a class="chip-link" href="#${e.id}">${e.day} Dec · ${esc(e.title.split(' · ')[0])}</a>`).join('')}
  </div>
</nav>
${sections}
<section class="cta">
  <div class="wrap">
    <span class="eyebrow">Two cultures · two families · one beautiful beginning</span>
    <h2>Celebrate with us</h2>
    ${divider()}
    <p>Please confirm your attendance for each celebration individually.</p>
    <div class="btn-row"><a class="btn" href="/rsvp/">RSVP now</a><a class="btn btn--ghost" href="/guest-info/">Guest information</a></div>
  </div>
</section>`,
};
