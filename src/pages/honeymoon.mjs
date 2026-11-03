import { HONEYMOON as H } from '../data.mjs';
import { pageHero, copyBtn, divider, icon } from '../layout.mjs';

const row = (label, value, copyLabel) => `
  <div class="pay-row">
    <div><dt>${label}</dt><dd>${value}</dd></div>
    ${copyBtn(value, copyLabel)}
  </div>`;

export default {
  path: '/honeymoon/',
  title: 'Our Honeymoon Fund',
  description: 'For those who have kindly asked how to gift Fuad & Nisan from near and far — our honeymoon pot.',
  scripts: ['/assets/js/config.js', '/assets/js/api.js', '/assets/js/honeymoon.js'],
  body: `
${pageHero({
  eyebrow: 'From near & far',
  title: 'Our Honeymoon Fund',
  lede: '',
})}
<section class="section" style="padding-top:clamp(20px,4vw,40px)">
  <div class="wrap">
    <div class="hm-message reveal">
      <h2>Our Adventure Begins</h2>
      <span class="emoji" role="img" aria-label="aeroplane and mosque">✈️🕌</span>
      <p><strong>Hello lovely friends &amp; family! 💕</strong></p>
      <p>As we begin this new chapter together, your love, prayers, and presence mean the world to us. For those who’ve kindly asked how they can gift us from near and far — we’ve set up a little honeymoon pot to help send us off on the adventure of a lifetime.</p>
      <p>Every contribution, big or small, will go toward creating memories we’ll cherish forever — and we can’t wait to send you postcards from around the world!</p>
    </div>

    <div class="pay-grid">
      <article class="pay-card reveal">
        <div class="pay-card__head"><h3>🌍✨💳 BANK TRANSFER (UK — MONZO)</h3></div>
        <dl class="pay-card__body">
          ${row('Name', H.uk.name, 'Copy account name')}
          ${row('Account number', H.uk.account, 'Copy account number')}
          ${row('Sort code', H.uk.sort, 'Copy sort code')}
        </dl>
      </article>
      <article class="pay-card reveal reveal-d1">
        <div class="pay-card__head"><h3>🌍 INTERNATIONAL TRANSFER</h3></div>
        <dl class="pay-card__body">
          ${row('IBAN', H.intl.iban, 'Copy IBAN')}
          ${row('BIC / SWIFT', H.intl.bic, 'Copy BIC / SWIFT')}
        </dl>
      </article>
      <article class="pay-card reveal reveal-d2">
        <div class="pay-card__head"><h3>📱 M-PESA (KENYA)</h3></div>
        <dl class="pay-card__body">
          ${row('M-Pesa', H.mpesa, 'Copy M-Pesa number')}
        </dl>
      </article>
    </div>

    <div class="hm-message reveal" style="margin-top:50px">
      <p>Your prayers, and love are the greatest gifts of all.</p>
      <p>Thank you for being part of our story. ❤️</p>
      <p style="margin-bottom:0">With all our love,</p>
      <p class="letter__sign" style="margin-top:0">Nisan &amp; Fuad</p>
      ${divider()}
    </div>
  </div>
</section>

<section class="section section--cream" id="note">
  <div class="wrap wrap--narrow">
    <div class="section-head reveal">
      <span class="eyebrow">Optional</span>
      <h2>Leave a note for the couple</h2>
      <p>Send a message with your gift, if you’d like. This form does not take or process any payment — please use the bank transfer or M-Pesa details above.</p>
    </div>
    <div class="alert alert--info" data-api-off hidden>Notes will open shortly. In the meantime, your prayers and kind words are always welcome in person.</div>
    <form class="form card reveal" id="note-form" novalidate>
      <div class="form-row">
        <div class="field"><label for="n-name">Your name</label><input id="n-name" name="name" type="text" autocomplete="name" required maxlength="120"></div>
        <div class="field"><label for="n-email">Email <span class="muted">(optional)</span></label><input id="n-email" name="email" type="email" autocomplete="email" maxlength="200"></div>
      </div>
      <div class="field"><label for="n-message">Your message</label><textarea id="n-message" name="message" required maxlength="2000" placeholder="Wishing you both…"></textarea></div>
      <fieldset class="field">
        <legend>Gift <span class="muted">(optional — for the couple’s records only)</span></legend>
        <div class="choice" style="margin:4px 0 10px" role="radiogroup" aria-label="Suggested amount">
          ${['50', '100', '250', '500'].map((a) => `<label><input type="radio" name="preset" value="${a}"><span>${a}</span></label>`).join('')}
          <label><input type="radio" name="preset" value="custom"><span>Other</span></label>
        </div>
        <div class="form-row">
          <div class="field"><label for="n-amount">Amount</label><input id="n-amount" name="amount" type="number" min="0" step="1" inputmode="decimal"></div>
          <div class="field"><label for="n-currency">Currency &amp; method</label>
            <select id="n-currency" name="currency">
              <option value="">—</option>
              <option value="GBP · UK bank transfer">GBP · UK bank transfer</option>
              <option value="International transfer">International transfer</option>
              <option value="KES · M-Pesa">KES · M-Pesa</option>
            </select>
          </div>
        </div>
      </fieldset>
      <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="alert" role="status" aria-live="polite" hidden></div>
      <div><button class="btn" type="submit">${icon('heart')}Send our note</button></div>
    </form>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="flight-strip" aria-hidden="false">
      <svg id="hm-map" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g id="hm-land" opacity=".9"></g>
        <path id="hm-route" d="M80 170 C 360 20, 840 20, 1120 150" fill="none" stroke="#bf9b5f" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>
        <g class="hm-plane" style="color:var(--violet)">
          <use href="#i-plane" x="-16" y="-16" width="32" height="32"/>
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1">
            <mpath href="#hm-route"/>
          </animateMotion>
        </g>
      </svg>
      <p>Our next adventure starts with you. ❤️</p>
    </div>
  </div>
</section>`,
};
