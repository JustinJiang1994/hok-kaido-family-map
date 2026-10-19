import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const events={},card={querySelector:()=>({})},days={addEventListener(){}},stage={after(){}};
let selected;
const ctx=vm.createContext({document:{querySelector:s=>s==='.map-stage'?stage:days,createElement:()=>card,addEventListener:(k,fn)=>events[k]=fn},PhotoLoader:{markup:()=>'<img>',load(){}},showPlace:p=>selected=p,esc:s=>s});
vm.runInContext(fs.readFileSync('src/data.js','utf8')+fs.readFileSync('src/media.js','utf8'),ctx);
vm.runInContext("let region='行程总览',dayIndex=0;const JOURNEY=[{points:['airport','sapporo']},{points:['sapporo','asahi']},{points:['asahi','biei']},{points:['asahi','airport']}];",ctx);
vm.runInContext(fs.readFileSync('src/journey-photos.js','utf8'),ctx);
for(const [index,city] of ['札幌','旭川','美瑛'].entries()){
 const count=vm.runInContext(`PLACES.filter(p=>p.city==='${city}'&&p.type==='sight'&&PLACE_MEDIA[p.id]?.photos?.length).length`,ctx);
 const seen=new Set();let previous;
 for(let i=0;i<count*3;i++){events.journeychange({detail:index});card.onclick();assert.equal(selected.city,city);assert.equal(selected.type,'sight');assert.notEqual(selected.id,previous);previous=selected.id;seen.add(selected.id);assert.ok(card.innerHTML.includes(selected.name));}
 assert.equal(seen.size,count);
}
events.journeychange({detail:3});assert.equal(card.disabled,true);assert.equal(card.onclick,null);
vm.runInContext("region='札幌'",ctx);events.journeychange({detail:0});assert.equal(card.hidden,true);
const rgb=h=>h.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
const lum=h=>rgb(h).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast=(lum('fff2d6')+.05)/(lum('193e42')+.05);assert.ok(contrast>7);
console.log(`Photo shuffle covers all three cities, avoids consecutive repeats, opens matching details; active label contrast ${contrast.toFixed(1)}:1.`);
