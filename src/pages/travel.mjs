import { HOTELS, TRANSPORT, EXPLORE, SITE } from '../data.mjs';
import { pageHero, icon, placeholder, tbc, copyBtn, esc, tel, divider } from '../layout.mjs';

const hotelCards = HOTELS.map((h) => `
  <article class="card hotel reveal">
    ${placeholder('Photograph to come', h.name, 'hotel__ph')}
    <div class="hotel__top">
      ${h.area ? `<span class="hotel__area">${esc(h.area)}</span>` : ''}
      <h3>${esc(h.name)}</h3>
    </div>
    <div class="hotel__body">
      <p class="hotel__desc">${esc(h.desc)}</p>
      ${h.best ? `<p class="hotel__best">${esc(h.best)}</p>` : ''}
      <p class="hotel__rate">${esc(h.rate)} <small>${esc(h.rateNote)}</small></p>
      ${h.code ? `<div class="code-chip"><b>Wedding code</b><code>${SITE.discountCode}</code>${copyBtn(SITE.discountCode, 'Copy discount code')}</div>` : ''}
      ${h.contact ? `<p class="small mb-0"><span class="muted">Contact:</span> ${esc(h.contact)}</p>` : ''}
    </div>
    <div class="hotel__links">
      ${h.phone ? `<a class="chip-link" href="${tel(h.phone)}">${icon('phone')}${esc(h.phone)}</a>` : ''}
      ${h.website ? `<a class="chip-link" href="${h.website}" target="_blank" rel="noopener">${icon('globe')}${esc(h.websiteLabel)}</a>` : ''}
      ${!h.phone && !h.website ? tbc('Booking contact to be confirmed') : ''}
    </div>
  </article>`).join('');

const providers = TRANSPORT.map((p) => `
  <article class="card provider reveal">
    <img class="provider__logo" src="${p.logo}" alt="${esc(p.name)} logo" width="96" height="96" loading="lazy">
    <div>
      <span class="hotel__area">${esc(p.kind)}</span>
      <h3>${esc(p.name)}</h3>
      ${p.services.length ? `<ul class="services">${p.services.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      ${p.note ? `<p class="small" style="margin:6px 0 10px"><em>${esc(p.note)}</em></p>` : ''}
      <ul class="contact-list">
        ${p.contacts.map((c) => `<li><a href="${tel(c.tel)}">${icon('phone')}<span><span class="muted">${esc(c.who)}:</span> ${esc(c.tel)}</span></a></li>`).join('')}
        ${p.email ? `<li><a href="mailto:${p.email}">${icon('mail')}${esc(p.email)}</a></li>` : ''}
        ${p.website ? `<li><a href="${p.website}" target="_blank" rel="noopener">${icon('globe')}${esc(p.websiteLabel)}</a></li>` : ''}
      </ul>
      ${p.extra ? `<p class="small muted" style="margin:10px 0 0">${esc(p.extra)}</p>` : ''}
    </div>
  </article>`).join('');

const explore = EXPLORE.map((g) => `
  <div class="explore reveal">
    <h3>${esc(g.title)}</h3>
    <ul class="explore-list">${g.items.map(([n, d]) => `<li><b>${esc(n)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
  </div>`).join('');

export default {
  path: '/travel/',
  title: 'Travelling to Nairobi',
  description: 'Hotels, the FuN2026 wedding discount code, Kenya eTA entry notes, airport transfers, car hire and things to do in Nairobi for Fuad & Nisan’s wedding guests.',
  body: `
${pageHero({
  eyebrow: 'Karibu Kenya',
  title: 'Travelling to Nairobi',
  lede: 'Whether you are flying in from Italy, Canada, the Emirates, Egypt, Greece or just across town — everything you need for an easy, beautiful stay.',
})}

<section class="section" id="stay" style="padding-top:clamp(40px,6vw,70px)">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Accommodation</span>
      <h2>Where to stay</h2>
      <p>Our recommended hotels and residences. Rates are indicative nightly ranges in US dollars, as shared in our guest guide.</p>
    </div>
    <div class="code-banner reveal">
      <div>
        <h3>Wedding accommodation code</h3>
        <p>Quote this code when booking at Gemsuites Riverside or Emara Ole Sereni.</p>
      </div>
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <span class="big-code">${SITE.discountCode}</span>
        ${copyBtn(SITE.discountCode, 'Copy discount code')}
      </div>
    </div>
    <div class="grid grid--3">${hotelCards}</div>
    <p class="small muted center" style="margin-top:26px">Booking deadlines and any special wedding rates will be added here once confirmed with each hotel.</p>
  </div>
</section>

<div class="weave weave--thin" aria-hidden="true"></div>

<section class="section section--cream" id="entry">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Travel notes · immigration</span>
      <h2>Before you travel</h2>
    </div>
    <div class="grid grid--2">
      <div class="card reveal">
        <h3>Entering Kenya</h3>
        <p>For most guests, entry to Kenya is managed through the <strong>Electronic Travel Authorisation (eTA)</strong> system. Because requirements vary by nationality, please check your eligibility carefully and apply in good time.</p>
        <ul class="facts" style="margin:20px 0">
          <li>${icon('check')}<div>Ensure your passport is valid for at least <strong>6 months</strong>.</div></li>
          <li>${icon('check')}<div>Have your travel itinerary and accommodation details ready.</div></li>
          <li>${icon('check')}<div>Plan your airport pickup or first-night transport in advance.</div></li>
          <li>${icon('check')}<div>Allow extra time for Nairobi traffic.</div></li>
        </ul>
        <div class="btn-row" style="justify-content:flex-start;margin-top:10px">
          <a class="chip-link" href="https://etakenya.go.ke/" target="_blank" rel="noopener">${icon('globe')}Official Kenya eTA website</a>
          <a class="chip-link" href="https://etakenya.go.ke/how-to-apply" target="_blank" rel="noopener">${icon('link')}How to apply</a>
        </div>
      </div>
      <div class="card reveal reveal-d1">
        <h3>Helpful local notes</h3>
        <p>Once you arrive, Nairobi is very manageable with a little planning. <strong>Uber</strong> and <strong>Bolt</strong> are widely used for getting around, and <strong>Safaricom</strong> shops in the major malls are wonderful for a local SIM card and easy connectivity.</p>
        <p>We recommend confirming accommodation, arrival transport and event-day movements with a little time to spare.</p>
        <div class="note note--verify">
          <strong>Please verify independently.</strong> Some travellers — including certain East African nationals and other exempt nationalities — may not require an eTA. Entry rules change, so please rely on official government guidance for the latest requirements before you travel.
        </div>
      </div>
    </div>

    <div class="grid grid--3" style="margin-top:34px">
      <div class="card reveal">
        <span class="hotel__area">Arriving by air</span>
        <h3>Jomo Kenyatta International Airport</h3>
        <p class="small">Most international guests will arrive at Jomo Kenyatta International Airport (NBO), south-east of the city centre along Mombasa Road. The reception venue, Emara Ole Sereni, is also off Mombasa Road.</p>
        <p class="small mb-0">Pre-arrange your transfer with one of the transport providers below.</p>
      </div>
      <div class="card reveal reveal-d1">
        <span class="hotel__area">Money</span>
        <h3>Currency &amp; payments</h3>
        <p class="small">Kenya’s currency is the Kenyan shilling (KES). Mobile money — M-Pesa — is used almost everywhere, and cards are widely accepted at hotels, malls and larger restaurants.</p>
        <p class="small mb-0 muted">General guidance only — please check with your bank about card use abroad.</p>
      </div>
      <div class="card reveal reveal-d2">
        <span class="hotel__area">Weather</span>
        <h3>Nairobi in December</h3>
        <p class="small">December days in Nairobi are typically warm and bright, with cooler mornings and evenings thanks to the city’s altitude. Occasional showers are possible.</p>
        <p class="small mb-0 muted">Pack a light layer or wrap for the evenings.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="transport">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Travel resources</span>
      <h2>Getting around Kenya</h2>
      <p>Airport transfers, private chauffeurs and car hire from providers we recommend. Tap a number to call.</p>
    </div>
    <div class="grid grid--2">${providers}</div>
    <div class="card reveal" style="margin-top:30px">
      <div class="grid grid--2" style="align-items:center">
        <div>
          <span class="hotel__area">Taxi &amp; ride-hailing</span>
          <h3 style="margin-top:6px">Uber &amp; Bolt</h3>
          <p class="mb-0">Both are widely used across Nairobi and are an easy way to move between your hotel, the venues and the city.</p>
        </div>
        <div class="btn-row" style="justify-content:flex-start;margin:0">
          <a class="chip-link" href="https://www.uber.com" target="_blank" rel="noopener">${icon('globe')}uber.com</a>
          <a class="chip-link" href="https://bolt.eu" target="_blank" rel="noopener">${icon('globe')}bolt.eu</a>
          <a class="chip-link" href="https://www.safaricom.co.ke" target="_blank" rel="noopener">${icon('phone')}Safaricom SIM cards</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--lilac" id="explore">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Nairobi…</span>
      <h2>Where to dine, unwind &amp; explore</h2>
      <p>The options are endless. A few of our favourites — from slow mornings to sunset dinners, wildlife and wellness.</p>
      ${divider()}
    </div>
    ${explore}
  </div>
</section>`,
};
