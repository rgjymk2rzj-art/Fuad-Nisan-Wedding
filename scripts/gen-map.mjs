// Generates projected SVG path data for the homepage world map.
import fs from 'node:fs';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

const W = 2000, H = 1040;
const projection = geoNaturalEarth1().fitSize([W, H], { type: 'Sphere' });
const path = geoPath(projection).digits(1);

const land110 = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'));
const countries110 = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const land50 = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'));

const places = {
  nairobi: [36.8219, -1.2921],
  italy: [12.4964, 41.9028],
  canada: [-79.3832, 43.6532],
  uae: [55.2708, 25.2048],
  egypt: [31.2357, 30.0444],
  greece: [23.7275, 37.9838],
};
const points = Object.fromEntries(Object.entries(places).map(([k, v]) => [k, projection(v).map(n => +n.toFixed(1))]));

// 50m land clipped roughly to East Africa for the close-up zoom
const out = {
  width: W, height: H,
  sphere: path({ type: 'Sphere' }),
  land: path(feature(land110, land110.objects.land)),
  borders: path(mesh(countries110, countries110.objects.countries, (a, b) => a !== b)),
  land50: path(feature(land50, land50.objects.land)),
  points,
};
fs.mkdirSync('assets/data', { recursive: true });
fs.writeFileSync('assets/data/world.json', JSON.stringify(out));
console.log('land', out.land.length, 'borders', out.borders.length, 'land50', out.land50.length, points);
