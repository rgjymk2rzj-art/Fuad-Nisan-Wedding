import { EVENTS, SITE } from '../data.mjs';
import { pageHero, tbc, esc, copyBtn } from '../layout.mjs';

const q = (title, body, open = false) => `
  <details${open ? ' open' : ''}>
    <summary>${title}</summary>
    <div class="faq__body">${body}</div>
  </details>`;

const [henna, nikah, reception] = EVENTS;

export default {
  path: '/guest-info/',
  title: 'Guest Information',
  description: 'Dates, venues, timings, dress codes, arrival notes, accommodation, transport and RSVP guidance for Fuad & Nisan’s wedding week in Nairobi.',
  body: `
${pageHero({
  eyebrow: 'Everything in one place',
  title: 'Guest Information',
  lede: 'Answers to the questions we are asked most. If you can’t find what you need, please reach out to the family.',
})}
<section class="section" style="padding-top:clamp(30px,5vw,60px)">
  <div class="faq">
    <h2 class="faq-group-title">The wedding week</h2>
    ${q('When is the wedding?', `
      <p>The celebrations run from <strong>Saturday 19 to Wednesday 23 December 2026</strong> in Nairobi, Kenya.</p>
      <ul>
        <li><strong>Sat 19 Dec</strong> — ${esc(henna.title)} · ${esc(henna.time)} · ${esc(henna.audience)}</li>
        <li><strong>Sun 20 Dec</strong> — ${esc(nikah.title)} · ${esc(nikah.time)} · ${esc(nikah.access)}</li>
        <li><strong>Wed 23 Dec</strong> — ${esc(reception.title)} · ${esc(reception.time)}</li>
      </ul>
      <p><a href="/celebrations/">See the full celebrations page →</a></p>`, true)}
    ${q('Where are the venues?', `
      <ul>
        <li><strong>Meraki House</strong> — Waiyaki Way – Red Hill Link Road, Nyari, Ngecha Rd (Nyari Estate). Henna Night (ladies) and the ladies’ Nikah gathering. <a href="${henna.venues[0].map}" target="_blank" rel="noopener">Map</a></li>
        <li><strong>Adams Arcade Mosque</strong> — the gentlemen’s Nikah. <a href="${nikah.venues[0].map}" target="_blank" rel="noopener">Map</a></li>
        <li><strong>Emara Ole Sereni</strong> (Mara Ballroom) — off Mombasa Road at the Southern Bypass junction. Wedding reception. <a href="${reception.venues[0].map}" target="_blank" rel="noopener">Map</a></li>
      </ul>`)}
    ${q('What are the event timings?', `
      <p><strong>Henna Night:</strong> 3:30pm EAT.<br>
      <strong>Katb Al-Kitab (Nikah):</strong> 12pm – 4pm EAT.<br>
      <strong>Reception:</strong> 2pm – 12am EAT. Doors open at 2:00pm; bites &amp; refreshments 3:00pm; bride’s entrance 4:30pm; groom’s entrance &amp; co. 6:30pm; dinner 7:00pm; dances, speeches &amp; vibes from 8:00pm.</p>
      <p class="small muted">All times are East Africa Time (EAT, UTC+3).</p>`)}
    ${q('Is there a dress code?', `<p>${tbc('Dress codes for each celebration will be shared soon')}</p><p class="small muted">The Henna Night and the ladies’ Nikah gathering are for women only.</p>`)}
    ${q('Who is invited to each celebration?', `
      <p>The <strong>Henna Night</strong> is for ladies only. The <strong>Nikah</strong> is by invitation only, with gentlemen at Adams Arcade Mosque and ladies at Meraki House. The <strong>reception</strong> is by invitation access only — each invitation admits one, and children are not invited.</p>`)}

    <h2 class="faq-group-title">RSVP</h2>
    ${q('How do I RSVP?', `
      <p>Please use our <a href="/rsvp/">RSVP page</a> and respond to each celebration separately. When you submit, you will receive a personal <strong>edit code</strong> so you can update your response at any time.</p>
      <p>Please only include the guests named on your invitation.</p>
      <p>RSVP deadline: ${tbc('To be confirmed')}</p>`)}
    ${q('Can I change my RSVP?', `<p>Yes — on the <a href="/rsvp/">RSVP page</a> choose “Update my RSVP” and enter the edit code you received when you first replied. If this browser was used to reply, your response is remembered here too.</p>`)}

    <h2 class="faq-group-title">Travel &amp; stay</h2>
    ${q('Where should I stay?', `
      <p>We recommend Gemsuites Riverside, JW Marriott, Emara Ole Sereni, Sankara Nairobi, Villa Rosa Kempinski, or an Airbnb in Westlands, Kilimani, Lavington, Kileleshwa or Karen.</p>
      <p>Use code <strong>${SITE.discountCode}</strong> ${copyBtn(SITE.discountCode, 'Copy discount code')} at Gemsuites Riverside and Emara Ole Sereni.</p>
      <p><a href="/travel/#stay">See all accommodation →</a></p>`)}
    ${q('Do I need a visa or eTA for Kenya?', `
      <p>For most guests, entry to Kenya is through the Electronic Travel Authorisation (eTA). Requirements vary by nationality, so please check your eligibility and apply in good time at <a href="https://etakenya.go.ke/" target="_blank" rel="noopener">etakenya.go.ke</a>. Your passport should be valid for at least six months.</p>
      <p class="small muted">Some travellers, including certain East African nationals, may be exempt — please verify individually with official government sources.</p>`)}
    ${q('Which airport should I fly into?', `<p>Jomo Kenyatta International Airport (NBO), Nairobi. Please plan your airport pickup or first-night transport in advance and allow extra time for traffic. <a href="/travel/#transport">Transfer providers →</a></p>`)}
    ${q('How do I get around?', `
      <p>Uber and Bolt are widely used. For airport transfers, chauffeurs or car hire, contact The Travel Lounge, Flex Drive and Car Rentals, Hire N’ Drive Kenya or Paw Print Adventures — mention you are guests of the Fuad / Nisan wedding. <a href="/travel/#transport">All contacts →</a></p>
      <p>For a local SIM, visit a Safaricom shop — every major mall has one.</p>`)}

    <h2 class="faq-group-title">Contact</h2>
    ${q('Who do I contact with questions?', `<p>${tbc('Family contact details will be added soon')}</p><p>In the meantime, please reach out to the family member who shared your invitation.</p>`)}
  </div>
</section>`,
};
