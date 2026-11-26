import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context=vm.createContext({});
vm.runInContext(fs.readFileSync('src/data.js','utf8')+fs.readFileSync('src/media.js','utf8')+';this.places=PLACES;this.media=PLACE_MEDIA;',context);
const restaurants=context.places.filter(p=>p.source==='tabelog');
assert.equal(new Set(restaurants.map(p=>p.url)).size,restaurants.length,'duplicate restaurant URL');
for(const city of ['札幌','旭川','美瑛']){
 const rows=restaurants.filter(p=>p.city===city);
 assert.ok(rows.length>=20,city+' needs 20 researched entries');
 for(const p of rows){
  assert.ok(p.rating>=1&&p.rating<=5);
  assert.match(p.url,/^https:\/\/tabelog\.com\/hokkaido\/A\d+\/A\d+\/\d+\/$/);
  assert.ok(p.lat>42.8&&p.lat<44&&p.lon>141&&p.lon<143);
  assert.match(p.coordinateSource,/google_badge_frame\?rcd=\d+$/);
  assert.ok(p.navigationDestination&&p.selectionReason&&p.checkedOn&&p.visitStatus);
  const m=context.media[p.id];assert.ok(m?.informationSources.some(s=>s.url===p.url));
  assert.ok(m.note&&m.details.length&&m.facts.length);
  if(p.rating<3.25)assert.match(p.selectionReason,/备选|线索/,'low rating must not be advertised as high-rated');
 }
}
for(const id of ['1005335','1004122','1014057','1015055'])assert.ok(!restaurants.some(p=>p.id==='tabelog-'+id),'closed/adult-only restaurant included');
assert.equal(restaurants.find(p=>p.id==='tabelog-1001341').visitStatus,'本次不适用');
for(const id of ['1045263','1047659','1004114','1012652'])assert.equal(restaurants.find(p=>p.id==='tabelog-'+id).visitStatus,'日期冲突');
console.log('60 researched restaurants: city counts, unique sources, coordinates, details and trip restrictions passed.');
