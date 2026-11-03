// Builds the static site into the repository root (served by GitHub Pages).
// Usage: node src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout } from './layout.mjs';
import { SITE } from './data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = path.join(root, 'src', 'pages');
const version = Date.now().toString(36);

const pages = [];
for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.mjs')).sort()) {
  const mod = await import(path.join(pagesDir, file));
  pages.push(mod.default);
}

for (const page of pages) {
  const html = layout(page).replaceAll('__V__', version);
  const out = page.output || (page.path === '/' ? 'index.html' : path.join(page.path.replace(/^\/|\/$/g, ''), 'index.html'));
  const dest = path.join(root, out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log('built', out);
}

const urls = pages.filter((p) => !p.noindex && !p.output).map((p) => `  <url><loc>${SITE.url}${p.path}</loc></url>`).join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nDisallow: /admin/\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('built sitemap.xml, robots.txt');
