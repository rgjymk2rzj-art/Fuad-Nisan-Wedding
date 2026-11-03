import { pageHero, bf, placeholder, divider } from '../layout.mjs';

const milestones = [
  ['Yesterday', 'Two journeys begin', 'Milestone to add: where each of your stories starts — your families, homes and the places that shaped you.'],
  ['Yesterday', 'Our paths cross', 'Milestone to add: how and where you met.'],
  ['Today', 'Two families meet', 'Milestone to add: the moment your families came together.'],
  ['Today', 'The proposal', 'Milestone to add: the proposal story.'],
  ['Today', 'Nairobi · December 2026', 'Henna, Nikah and Zifaf — surrounded by family and friends from around the world.'],
  ['Tomorrow', 'A shared future', 'New adventures, family traditions and memories yet to be created.'],
];

export default {
  path: '/our-story/',
  title: 'Our Story',
  description: 'The story of Fuad and Nisan — two journeys, two cultures and one beautiful beginning, told through the Brunfelsia: yesterday, today and tomorrow.',
  body: `
${pageHero({
  eyebrow: 'A Somali-Yemeni love story',
  title: 'Our Story',
  lede: 'Two lives, two cultures and two families — told through the flower that carries our family’s memory: yesterday, today and tomorrow.',
})}

<section class="section" style="padding-top:clamp(40px,6vw,70px)">
  <div class="wrap wrap--narrow center reveal">
    <span class="eyebrow">Why the Brunfelsia</span>
    <p class="lede">The Brunfelsia ‘yesterday, today, tomorrow’ flower was found growing upon the resting place of a family member who shaped, raised and inspired Nisan. Since then, the bloom has carried a quiet kind of meaning for the family — a reminder of those we honour yesterday, today and tomorrow.</p>
    <p class="muted">It opens in deep violet, softens to lavender and fades to white; a living portrait of life’s changing seasons, the love that endures through them, and the people who continue to bloom inside us.</p>
    ${divider()}
  </div>

  <div class="wrap">
    <article class="chapter">
      <div class="chapter__media reveal">${placeholder('Photograph to come', 'Fuad and Nisan as children, or a family photograph from each side')}</div>
      <div class="reveal reveal-d1">
        <div class="chapter__label">${bf('violet')}<span>Chapter one</span></div>
        <h2>Yesterday</h2>
        <p class="lede">Two individual journeys, two cultural backgrounds — one Somali, one Yemeni — and all the people and places that shaped them.</p>
        <p class="muted">This chapter is waiting for your words: where you each grew up, the traditions you carry, and the people you honour.</p>
      </div>
    </article>

    <article class="chapter chapter--flip">
      <div class="chapter__media reveal"><div class="arch" style="aspect-ratio:4/5"><img src="/assets/img/couple-quran.webp" alt="Fuad and Nisan seated side by side, in black and white" width="1100" height="1100" loading="lazy" style="filter:grayscale(1)"></div></div>
      <div class="reveal reveal-d1">
        <div class="chapter__label">${bf('lavender')}<span>Chapter two</span></div>
        <h2>Today</h2>
        <p class="lede">The union of Fuad and Nisan — a celebration of Somali and Yemeni heritage, and two families coming together through love, faith and marriage.</p>
        <p class="arabic" lang="ar" style="font-size:1.8rem;color:var(--mauve);margin-bottom:.2em">وَخَلَقْنَاكُمْ أَزْوَاجًا</p>
        <p class="muted"><em>“We created you in pairs.”</em> — Quran 78:8</p>
      </div>
    </article>

    <article class="chapter">
      <div class="chapter__media reveal">${placeholder('Photograph to come', 'A favourite photograph of the two of you together')}</div>
      <div class="reveal reveal-d1">
        <div class="chapter__label">${bf('white')}<span>Chapter three</span></div>
        <h2>Tomorrow</h2>
        <p class="lede">A shared future — new adventures, family traditions and memories yet to be created.</p>
        <p class="muted">And, God willing, postcards from the honeymoon to everyone who helped send us on our way.</p>
        <p><a class="btn btn--ghost btn--sm" href="/honeymoon/">Our honeymoon fund</a></p>
      </div>
    </article>
  </div>
</section>

<section class="section section--cream">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Milestones</span>
      <h2>The journey so far</h2>
      <p>A timeline of the moments that brought us here. Personal milestones will be added soon.</p>
    </div>
    <ol class="timeline">
      ${milestones.map(([phase, title, text], i) => `
      <li class="reveal">
        ${bf(phase === 'Yesterday' ? 'violet' : phase === 'Today' ? 'lavender' : 'white')}
        <span class="when">${phase}</span>
        <h4>${title}</h4>
        <p class="muted small">${text}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>`,
};
