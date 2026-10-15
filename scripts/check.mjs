import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = f => fs.readFileSync(new URL(f, root), 'utf8');
for (const f of ['app.js', 'data.js', 'media.js']) new vm.Script(read('src/' + f), {filename:f});
const places = vm.runInNewContext(read('src/data.js') + '\nPLACES');
const media = vm.runInNewContext(read('src/media.js') + '\nPLACE_MEDIA');
assert.equal(new Set(places.map(p => p.id)).size, places.length, 'Duplicate place ids');
for (const p of places) {
  assert(Number.isFinite(p.lat) && Number.isFinite(p.lon), `Coordinates: ${p.id}`);
  assert(['札幌','旭川','美瑛','新千岁','新千岁机场'].includes(p.city), `Region: ${p.id}`);
  if (p.type !== 'sight') continue;
  const m = media[p.id];
  assert(m?.tagline && m.highlights?.length && m.details?.length && m.facts?.length, `Incomplete details: ${p.id}`);
  assert(m.checkedOn && m.informationSources?.length, `Missing sources: ${p.id}`);
  for (const image of m.photos) assert(image.src.startsWith('https://') && image.caption && image.credit && image.sourceUrl, `Image provenance: ${p.id}`);
}
assert.equal(Object.keys(media).length, places.filter(p => p.type === 'sight').length, 'Orphaned media');
console.log(`Checked ${places.length} places and ${Object.values(media).reduce((n,m)=>n+m.photos.length,0)} photos.`);
