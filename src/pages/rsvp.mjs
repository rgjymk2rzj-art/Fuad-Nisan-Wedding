import { EVENTS } from '../data.mjs';
import { pageHero, icon, bf, esc } from '../layout.mjs';

const notes = {
  henna: 'Ladies only. Please count the ladies in your party.',
  nikah: 'By invitation only. Gentlemen at Adams Arcade Mosque, ladies at Meraki House.',
  reception: 'Invitation access only. Each invitation admits one — no children.',
};

const eventBlock = (e) => `
  <fieldset class="event-rsvp" data-event="${e.id}">
    <legend class="event-rsvp__head"><h3>${esc(e.title.split(' · ')[0])}</h3><small>${e.weekday} ${e.day} Dec · ${esc(e.time.split(' · ')[0])}</small></legend>
    <p class="event-rsvp__note">${esc(notes[e.id])}</p>
    <div class="choice" role="radiogroup" aria-label="${esc(e.title)} attendance">
      <label><input type="radio" name="${e.id}_attending" value="true" required><span>Joyfully attending</span></label>
      <label><input type="radio" name="${e.id}_attending" value="false"><span>Regretfully declining</span></label>
    </div>
    <div class="count-row" data-count hidden>
      <label for="${e.id}_guests" class="label">Guests attending</label>
      <input id="${e.id}_guests" name="${e.id}_guests" type="number" min="1" max="10" value="1" inputmode="numeric">
    </div>
    <p class="field-error" data-error-for="${e.id}_attending" hidden></p>
  </fieldset>`;

export default {
  path: '/rsvp/',
  title: 'RSVP',
  description: 'Wedding week registration for Fuad & Nisan — RSVP for the Henna Night, Nikah and reception in Nairobi, December 2026.',
  scripts: ['/assets/js/config.js', '/assets/js/api.js', '/assets/js/rsvp.js'],
  body: `
${pageHero({
  eyebrow: 'Wedding week registration',
  title: 'RSVP',
  lede: 'Please let us know which celebrations you will be joining — each one individually. You can update your reply at any time with your edit code.',
})}
<section class="section" style="padding-top:clamp(30px,5vw,60px)">
  <div class="wrap wrap--narrow">
    <div class="alert alert--info" data-api-off hidden>
      <strong>RSVP opens soon.</strong> Our registration is being prepared — please check back shortly.
    </div>

    <div class="btn-row" style="margin:0 0 26px;justify-content:flex-start" data-mode-switch>
      <button type="button" class="chip-link" data-show-lookup>${icon('link')}Already replied? Update my RSVP</button>
    </div>

    <form class="card form" id="lookup-form" hidden novalidate>
      <h2 style="font-size:1.8rem;margin:0">Update my RSVP</h2>
      <p class="muted" style="margin:0">Enter the edit code you received when you first replied.</p>
      <div class="field">
        <label for="lookup-code">Edit code</label>
        <input id="lookup-code" name="code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXX-XXXX-XXXX" required>
      </div>
      <div class="alert" role="status" aria-live="polite" hidden></div>
      <div class="btn-row" style="justify-content:flex-start;margin:0">
        <button class="btn" type="submit">Find my RSVP</button>
        <button class="btn btn--ghost" type="button" data-cancel-lookup>Cancel</button>
      </div>
    </form>

    <form class="form" id="rsvp-form" novalidate>
      <div class="alert alert--info" data-editing hidden></div>
      <div class="card form">
        <h2 style="font-size:1.9rem;margin:0">Your details</h2>
        <div class="field">
          <label for="full_name">Full name</label>
          <input id="full_name" name="full_name" type="text" autocomplete="name" required minlength="2" maxlength="120">
          <p class="field-error" data-error-for="full_name" hidden></p>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="email">Email address</label>
            <input id="email" name="email" type="email" autocomplete="email" required maxlength="200">
            <p class="field-error" data-error-for="email" hidden></p>
          </div>
          <div class="field">
            <label for="phone">Phone (with country code)</label>
            <input id="phone" name="phone" type="tel" autocomplete="tel" required minlength="6" maxlength="40" placeholder="+254 …">
            <p class="field-error" data-error-for="phone" hidden></p>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="party_size">Number of guests</label>
            <input id="party_size" name="party_size" type="number" min="1" max="10" value="1" required inputmode="numeric">
            <span class="hint">Including you — subject to your invitation allocation.</span>
            <p class="field-error" data-error-for="party_size" hidden></p>
          </div>
          <div class="field">
            <label for="arrival_date">Arrival date in Nairobi</label>
            <input id="arrival_date" name="arrival_date" type="date" min="2026-11-01" max="2026-12-31">
            <span class="hint">Leave blank if you live in Nairobi.</span>
          </div>
        </div>
      </div>

      <div class="form">
        <h2 style="font-size:1.9rem;margin:10px 0 0">The celebrations</h2>
        ${EVENTS.map(eventBlock).join('')}
      </div>

      <div class="card form">
        <div class="field">
          <label for="dietary">Dietary requirements</label>
          <input id="dietary" name="dietary" type="text" maxlength="500" placeholder="Allergies or requirements for anyone in your party">
        </div>
        <div class="field">
          <label for="notes">Additional notes</label>
          <textarea id="notes" name="notes" maxlength="2000" placeholder="Anything else we should know"></textarea>
        </div>
        <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <p class="small muted mb-0">Your details are only used by the couple and their families to plan the wedding, and are visible only to them.</p>
      </div>

      <div class="alert" data-form-status role="alert" hidden></div>
      <div><button class="btn btn--violet" type="submit" data-submit>Send my RSVP</button></div>
    </form>

    <div class="card success-panel" id="rsvp-done" hidden tabindex="-1">
      ${bf('lavender', 'bf-spin')}
      <span class="eyebrow">Jazakum Allahu khayran</span>
      <h2 data-done-title>Thank you!</h2>
      <p class="lede" data-done-summary></p>
      <p class="muted">Keep your personal edit code safe — you’ll need it to change your reply.</p>
      <div><span class="edit-code" data-done-code></span></div>
      <div class="btn-row" style="margin-top:6px">
        <button type="button" class="btn btn--sm" data-copy-code>${icon('copy')}Copy code</button>
        <button type="button" class="btn btn--sm btn--ghost" data-copy-link>${icon('link')}Copy my edit link</button>
        <button type="button" class="btn btn--sm btn--ghost" data-ics>${icon('calendar')}Add to calendar</button>
      </div>
      <p class="small muted" data-email-note hidden style="margin-top:18px">A confirmation has been sent to your email.</p>
      <div class="btn-row"><button type="button" class="chip-link" data-edit-again>Edit my reply</button><a class="chip-link" href="/travel/">Plan your travel →</a></div>
    </div>
  </div>
</section>`,
};
