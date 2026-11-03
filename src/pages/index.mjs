import { EVENTS, SITE } from '../data.mjs';
import { bf, divider, qamariya, icon } from '../layout.mjs';

// Groom's hand: darker complexion, crisp white blazer, pointing right.
// Fingertip sits at (700,150) so two half-width panels meet in the middle.
const HAND_PATH = 'M0 -42 C40 -46 100 -48 150 -40 C200 -34 255 -26 292 -20 C304 -18 306 -2 294 0 C255 4 210 6 178 8 C190 14 192 34 178 40 C168 46 150 44 140 40 C150 50 146 62 128 62 C100 62 60 54 0 46 Z';
const THUMB_PATH = 'M112 30 C136 20 164 15 182 19 C192 21 191 33 180 34 C162 35 140 39 116 44 Z';

const groomHand = `
<svg viewBox="0 0 700 300" class="hand-svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="g-skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#76503a"/><stop offset=".5" stop-color="#553524"/><stop offset="1" stop-color="#3b241a"/>
    </linearGradient>
    <linearGradient id="g-blazer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f4f2ed"/><stop offset="1" stop-color="#d8d3c8"/>
    </linearGradient>
    <linearGradient id="g-cuff" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e5e1d8"/>
    </linearGradient>
  </defs>
  <g transform="translate(396 160)">
    <path d="${HAND_PATH}" fill="url(#g-skin)"/>
    <path d="${THUMB_PATH}" fill="#4a2e21" stroke="rgba(0,0,0,.18)" stroke-width="1"/>
    <path d="M150 -40 C200 -34 255 -26 292 -20" fill="none" stroke="rgba(255,235,215,.22)" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="283" cy="-14" rx="10" ry="4.2" fill="#8d6652" opacity=".55"/>
    <g fill="none" stroke="rgba(0,0,0,.22)" stroke-width="1.2" stroke-linecap="round">
      <path d="M214 -30 q4 6 0 12"/><path d="M220 -29 q4 6 0 12"/>
      <path d="M176 14 q6 10 2 20"/><path d="M134 48 q6 6 2 12"/>
    </g>
  </g>
  <rect x="356" y="98" width="52" height="134" rx="9" fill="url(#g-cuff)" stroke="#dcd7cc"/>
  <circle cx="384" cy="196" r="6.5" fill="#c9a86a" stroke="#9c7c43" stroke-width="1.2"/>
  <path d="M0 82 C120 74 262 76 372 88 L380 236 C262 244 120 248 0 244 Z" fill="url(#g-blazer)"/>
  <path d="M0 82 C120 74 262 76 372 88 L380 236" fill="none" stroke="#e1ddd3" stroke-width="2"/>
  <g fill="none" stroke="#e4e0d7" stroke-width="2" stroke-linecap="round">
    <path d="M60 120 C130 112 200 116 260 128"/><path d="M110 190 C170 196 230 196 300 186"/><path d="M40 210 C90 214 150 216 200 212"/>
  </g>
  <path d="M352 90 L360 236" stroke="#d7d2c6" stroke-width="2"/>
  <g fill="#ebe7df" stroke="#cbc5b8" stroke-width="1.2">
    <circle cx="334" cy="222" r="5"/><circle cx="317" cy="224" r="5"/><circle cx="300" cy="226" r="5"/>
  </g>
</svg>`;

// Bride's hand: henna-adorned (Yemeni), gold bangles, sheer lilac dirac sleeve.
const brideHand = `
<svg viewBox="0 0 700 300" class="hand-svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="b-skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9a882"/><stop offset=".55" stop-color="#c38e68"/><stop offset="1" stop-color="#a87352"/>
    </linearGradient>
    <linearGradient id="b-sleeve" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c9b8e6" stop-opacity=".95"/><stop offset=".5" stop-color="#a993d3" stop-opacity=".9"/><stop offset="1" stop-color="#7f66ae" stop-opacity=".95"/>
    </linearGradient>
    <pattern id="b-emb" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="1.6" fill="#e8d8b6"/><path d="M19 15 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z" fill="#e8d8b6" opacity=".85"/>
    </pattern>
  </defs>
  <g transform="translate(419 158) scale(.93)">
    <path d="${HAND_PATH}" fill="url(#b-skin)"/>
    <path d="${THUMB_PATH}" fill="#b98360" stroke="rgba(90,40,20,.18)" stroke-width="1"/>
    <path d="M150 -40 C200 -34 255 -26 292 -20" fill="none" stroke="rgba(255,240,225,.35)" stroke-width="3" stroke-linecap="round"/>
    <g fill="#3d1a10" fill-opacity=".9">
      <path d="M266 -24 C283 -22 300 -20 303 -12 C305 -4 301 0 294 0 C285 1 276 2 266 3 Z"/>
      <circle cx="252" cy="-10" r="2.4"/><circle cx="244" cy="-11" r="1.6"/><circle cx="236" cy="-12" r="1.6"/>
    </g>
    <g fill="none" stroke="#3d1a10" stroke-opacity=".88" stroke-width="2.2" stroke-linecap="round">
      <path d="M258 -25 L258 2"/><path d="M228 -29 L228 4"/><path d="M222 -30 L222 5"/>
      <path d="M30 -8 C60 -30 92 -18 116 -32 C132 -42 148 -36 162 -28"/>
      <path d="M48 20 C80 6 104 22 132 10"/>
      <path d="M14 -38 L22 -30 L14 -22 L22 -14 L14 -6 L22 2 L14 10 L22 18 L14 26 L22 34"/>
    </g>
    <g fill="#3d1a10" fill-opacity=".88">
      <g transform="translate(78 -20)"><circle r="4"/><circle cx="0" cy="-8" r="3"/><circle cx="7.6" cy="-2.5" r="3"/><circle cx="4.7" cy="6.5" r="3"/><circle cx="-4.7" cy="6.5" r="3"/><circle cx="-7.6" cy="-2.5" r="3"/></g>
      <g transform="translate(126 -34) scale(.7)"><circle r="4"/><circle cx="0" cy="-8" r="3"/><circle cx="7.6" cy="-2.5" r="3"/><circle cx="4.7" cy="6.5" r="3"/><circle cx="-4.7" cy="6.5" r="3"/><circle cx="-7.6" cy="-2.5" r="3"/></g>
      <circle cx="100" cy="-10" r="1.8"/><circle cx="108" cy="-6" r="1.8"/><circle cx="148" cy="-22" r="1.6"/><circle cx="60" cy="12" r="1.8"/><circle cx="92" cy="18" r="1.8"/>
      <path d="M150 6 c10 -10 24 -2 18 8 c-4 6 -14 4 -18 -8z"/>
    </g>
  </g>
  <g fill="none" stroke-width="5">
    <ellipse cx="404" cy="160" rx="7" ry="56" stroke="#d4b678"/>
    <ellipse cx="394" cy="160" rx="7" ry="58" stroke="#bf9b5f"/>
    <ellipse cx="384" cy="160" rx="7" ry="60" stroke="#e3c98f"/>
  </g>
  <path d="M0 66 C140 56 282 64 372 90 L380 232 C282 256 140 262 0 256 Z" fill="url(#b-sleeve)"/>
  <path d="M0 66 C140 56 282 64 372 90 L380 232 C282 256 140 262 0 256 Z" fill="url(#b-emb)" opacity=".7"/>
  <g fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-linecap="round">
    <path d="M40 100 C140 90 230 100 330 120"/><path d="M20 200 C120 214 220 214 320 200"/><path d="M80 150 C160 146 240 150 300 158"/>
  </g>
  <path d="M370 88 L380 234" stroke="#e8d8b6" stroke-width="7" stroke-linecap="round"/>
  <path d="M362 86 L371 236" stroke="#bf9b5f" stroke-width="2" stroke-dasharray="3 5"/>
</svg>`;

const eventCards = EVENTS.map((e, i) => `
  <a class="event-card reveal reveal-d${i + 1}" href="/celebrations/#${e.id}">
    <div class="arch">
      ${qamariya()}
      <span class="event-card__month">${e.weekday}</span>
      <span class="event-card__date">${e.day}</span>
      <span class="event-card__month">${e.month} 2026</span>
      <h3>${e.title.split(' · ')[0]}</h3>
      <span class="event-card__ar" lang="ar">${e.titleAr.split(' · ')[0]}</span>
      <p class="event-card__meta">${e.time}<br>${e.audience}</p>
      <span class="event-card__link">Details →</span>
    </div>
  </a>`).join('');

export default {
  path: '/',
  title: '',
  description: SITE.description,
  bodyClass: 'has-hero home',
  scripts: ['/assets/js/intro.js'],
  head: '<link rel="preload" href="/assets/data/world.json" as="fetch" crossorigin>',
  body: `
<section class="hero" id="hero" aria-label="Fuad and Nisan — opening">
  <div class="hero__bg" aria-hidden="true"></div>
  <svg class="hero__map" id="hero-map" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice"></svg>
  <div class="petals" aria-hidden="true"></div>

  <div class="intro" aria-hidden="true">
    <div class="hands">
      <div class="hand hand--groom">${groomHand}</div>
      <div class="hand hand--bride">${brideHand}</div>
      <div class="touch-glow"></div>
      <svg class="touch-heart" viewBox="0 0 24 24"><defs><linearGradient id="heart-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8d8b6"/><stop offset=".45" stop-color="#bf9b5f"/><stop offset="1" stop-color="#8f6fc4"/></linearGradient></defs><path fill="url(#heart-g)" stroke="#fffdfa" stroke-width=".6" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </div>
    <div class="intro__names"><span>Fuad</span><em>&amp;</em><span>Nisan</span></div>
  </div>

  <div class="hero__final">
    <img class="hero__mono" src="/assets/img/monogram-gold.png" alt="" width="70" height="136">
    <h1 class="hero__title"><span class="sr-only">Fuad and Nisan</span><span aria-hidden="true">Fuad <em>&amp;</em> Nisan</span></h1>
    <p class="hero__tag">Two lives, many journeys, one beautiful destination.</p>
    <p class="hero__date">Nairobi, Kenya <span aria-hidden="true">|</span> December 2026</p>
    <div class="hero__actions">
      <a class="btn" href="/rsvp/">RSVP</a>
      <a class="btn btn--ghost" href="/celebrations/">The celebrations</a>
    </div>
  </div>

  <div class="hero__controls">
    <button type="button" class="intro-skip" data-intro-skip>Skip intro</button>
    <button type="button" class="intro-replay" data-intro-replay hidden>${icon('plane')}Replay the journey</button>
  </div>
  <a class="scroll-cue" href="#welcome" aria-label="Scroll to welcome"><span></span></a>
</section>

<section class="section" id="welcome">
  <div class="wrap welcome-grid">
    <div class="reveal">
      <div class="greetings" aria-label="Welcome in Swahili, Somali and Arabic">
        <span>Karibu</span><span>Ku soo dhowaada</span><span class="arabic" lang="ar">أهلاً وسهلاً</span>
      </div>
      <h2>Karibu Nairobi</h2>
      <div class="letter">
        <p><em>To our beloved family and friends,</em></p>
        <p>Thank you for being part of this beautiful season with us. Whether you're joining us from Nairobi or travelling from afar, having the people we love gathered together is one of our greatest joys.</p>
        <p>We hope you'll take a little time to enjoy Nairobi with us — from slow mornings and beautiful dinners to sunset views, wildlife and, if time allows, the magic of the Kenyan coast. We can't wait to celebrate, laugh and make beautiful memories together.</p>
        <p class="letter__sign">With love, the Abdulkaders</p>
      </div>
    </div>
    <div class="reveal reveal-d1 center">
      <span class="eyebrow">Counting down to the Henna Night</span>
      <div class="countdown" data-countdown="${SITE.countdownTo}" aria-live="off">
        <div class="countdown__unit"><span class="countdown__num" data-cd="d">--</span><span class="countdown__lbl">Days</span></div>
        <div class="countdown__unit"><span class="countdown__num" data-cd="h">--</span><span class="countdown__lbl">Hours</span></div>
        <div class="countdown__unit"><span class="countdown__num" data-cd="m">--</span><span class="countdown__lbl">Minutes</span></div>
        <div class="countdown__unit"><span class="countdown__num" data-cd="s">--</span><span class="countdown__lbl">Seconds</span></div>
      </div>
      <p class="muted small" data-countdown-done hidden>The celebrations have begun — alhamdulillah.</p>
      <p class="lede" style="margin-top:20px">19 – 23 December 2026<br><span class="muted">Nairobi, Kenya</span></p>
    </div>
  </div>
</section>

<div class="weave" aria-hidden="true"></div>

<section class="section section--lilac" id="theme">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Our theme</span>
      <h2>Yesterday, Today &amp; Tomorrow</h2>
      <p>The Brunfelsia ‘yesterday, today, tomorrow’ flower was found growing upon the resting place of a family member who shaped, raised and inspired Nisan. Since then, the bloom has carried a quiet kind of meaning for the family — a reminder of those we honour yesterday, today and tomorrow.</p>
    </div>
    <div class="trio">
      <div class="trio__item reveal">${bf('violet')}<h3>Yesterday</h3><p>The Brunfelsia opens in deep violet — for those who came before us, and the roots that hold us.</p></div>
      <div class="trio__item reveal reveal-d1">${bf('lavender')}<h3>Today</h3><p>It softens to lavender — for this season of love, faith and two families becoming one.</p></div>
      <div class="trio__item reveal reveal-d2">${bf('white')}<h3>Tomorrow</h3><p>And fades to white — a living portrait of life’s changing seasons, and the love that endures through them.</p></div>
    </div>
  </div>
</section>

<section class="section" id="celebrations">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">The wedding · key dates</span>
      <h2>Three celebrations</h2>
      <p>Two cultures. Two families. One beautiful beginning — a Somali-Yemeni wedding week in Nairobi.</p>
    </div>
    <div class="grid grid--3">${eventCards}</div>
  </div>
</section>

<section class="section section--cream">
  <div class="wrap quote-block">
    <div class="arch reveal"><img src="/assets/img/couple-quran.webp" alt="Fuad and Nisan seated together, in black and white" width="1100" height="1100" loading="lazy"></div>
    <div class="reveal reveal-d1">
      <span class="arabic" lang="ar">وَخَلَقْنَاكُمْ أَزْوَاجًا</span>
      <blockquote>“We created you in pairs”</blockquote>
      <cite>Quran 78:8</cite>
      ${divider()}
    </div>
  </div>
</section>

<section class="cta">
  <div class="wrap">
    <span class="eyebrow">Wedding week registration</span>
    <h2>Will you celebrate with us?</h2>
    <p>Please let us know which celebrations you’ll be joining. If you’re travelling from afar, our travel guide has hotels, transport and entry notes for Nairobi.</p>
    <div class="btn-row">
      <a class="btn" href="/rsvp/">RSVP now</a>
      <a class="btn btn--ghost" href="/travel/">Travelling to Nairobi</a>
    </div>
  </div>
</section>
`,
};
