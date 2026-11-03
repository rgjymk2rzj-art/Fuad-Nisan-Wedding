// Generates assets/data/world.json (projected SVG paths for the homepage map).
// Run via the 'Generate map data' GitHub Action, or locally:
//   npm i --no-save world-atlas@2 d3-geo@3 topojson-client@3 && node scripts/gen-map.mjs
import fs from 'node:fs';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

const W = 2000, H = 1040;
const projection = geoNaturalEarth1().fitSize([W, H], { type: 'Sphere' });
const path = geoPath(projection).digits(1);

const land110 = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'));
const countries110 = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));

const places = {
  nairobi: [36.8219, -1.2921],
  italy: [12.4964, 41.9028],
  canada: [-79.3832, 43.6532],
  uae: [55.2708, 25.2048],
  egypt: [31.2357, 30.0444],
  greece: [23.7275, 37.9838],
};
const points = Object.fromEntries(Object.entries(places).map(([k, v]) => [k, projection(v).map(n => +n.toFixed(1))]));

const out = {
  width: W, height: H,
  sphere: path({ type: 'Sphere' }),
  land: path(feature(land110, land110.objects.land)),
  borders: path(mesh(countries110, countries110.objects.countries, (a, b) => a !== b)),
  points,
};
fs.mkdirSync('assets/data', { recursive: true });
fs.writeFileSync('assets/data/world.json', JSON.stringify(out));
console.log('land', out.land.length, 'borders', out.borders.length, points);
