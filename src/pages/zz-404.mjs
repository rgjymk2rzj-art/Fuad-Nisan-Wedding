import { bf } from '../layout.mjs';

export default {
  path: '/404.html',
  output: '404.html',
  title: 'Page not found',
  noindex: true,
  body: `
<section class="page-hero" style="min-height:80vh;display:flex;align-items:center">
  <div class="wrap center">
    <div style="display:flex;justify-content:center;gap:10px;margin-bottom:20px;font-size:40px">${bf('violet')}${bf('lavender')}${bf('white')}</div>
    <span class="eyebrow">Lost along the way</span>
    <h1>This page has drifted off</h1>
    <p class="lede">Like a petal on the breeze. Let’s get you back to the celebrations.</p>
    <div class="btn-row"><a class="btn" href="/">Home</a><a class="btn btn--ghost" href="/rsvp/">RSVP</a></div>
  </div>
</section>`,
};
