import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = f => fs.readFileSync(new URL(f, root), 'utf8');
for (const f of ['app.js', 'data.js', 'media.js']) new vm.Script(read('src/' + f), {filename:f});
new vm.Script(['data.js','media.js','outline.js','app.js'].map(f => read('src/' + f)).join('\n'), {filename:'combined-app'});
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
// Overview padding and fractional zoom must never leak into regional maps.
const fitSource = read('src/app.js').split('function fitRegion(){')[1].split('\nfunction render(){')[0];
for (const width of [390, 1200]) {
  const calls = [];
  const context = {region:'札幌',innerWidth:width,bounds:[],map:{options:{zoomSnap:0.1},fitBounds:(b,o)=>calls.push(o)},drawOverviewLabels:()=>{throw Error('Overview leaked');}};
  vm.runInNewContext('function fitRegion(){'+fitSource+'\nfitRegion();', context);
  assert.equal(context.map.options.zoomSnap,1);
  assert.equal(JSON.stringify(calls[0].padding),JSON.stringify(width<560?[40,55]:[65,65]));
  assert(!('paddingTopLeft' in calls[0]) && !('paddingBottomRight' in calls[0]));
}
console.log('Regional zoom and padding isolation checked.');
