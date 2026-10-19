import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const nodes={},listeners={},observers=[];
const element=()=>({hidden:false,disabled:false,className:'',classList:{toggle(){}},set innerHTML(v){this.html=v},get innerHTML(){return this.html},querySelector(sel){return nodes[sel]??=(element())},after(){},append(){},addEventListener(k,f){this[k]=f}});
let config,instance;
class MapMock{constructor(c){config=c;instance=this;this.sources={};this.events={};this.stops=0;}on(k,f){this.events[k]=f}addSource(k,s){this.sources[k]={...s,setData(d){this.data=d}}}addLayer(){}getSource(k){return this.sources[k]}resize(){}fitBounds(){}easeTo(){}stop(){this.stops++}remove(){this.removed=true}}
const c=vm.createContext({document:{hidden:false,createElement:element,querySelector:sel=>nodes[sel]??=(element()),addEventListener(k,f){listeners[k]=f}},window:{maplibregl:true},maplibregl:{Map:MapMock,supported:()=>true,Marker:class{setLngLat(){return this}addTo(){return this}}},IntersectionObserver:class{constructor(f){observers.push(f)}observe(){}},ResizeObserver:class{observe(){}},matchMedia:()=>({matches:true}),setTimeout:()=>1,clearTimeout(){},PhotoLoader:{markup:()=>'<img>',load(){}},esc:s=>s,showPlace(){},TERRAIN_VENDOR_BASE:'assets/vendor/'});
vm.runInContext(fs.readFileSync('src/data.js','utf8')+fs.readFileSync('src/media.js','utf8'),c);
const app=fs.readFileSync('src/app.js','utf8');vm.runInContext(app.slice(app.indexOf('const JOURNEY_HUBS='),app.indexOf('const overviewLayer='))+"let region='行程总览',dayIndex=0;",c);
vm.runInContext(fs.readFileSync('src/terrain.js','utf8'),c);
observers[0]([{isIntersecting:true}]);assert.equal(config.style.terrain.exaggeration,2);assert.equal(config.style.sources.dem.encoding,'terrarium');assert.equal(config.cooperativeGestures,true);
instance.events.load();listeners.journeychange({detail:2});assert.deepEqual(Array.from(instance.sources['active-trip'].data.geometry.coordinates[1]),[142.467,43.588]);
vm.runInContext("region='札幌'",c);nodes['#days'].click();assert.ok(instance.stops>0);
instance.events.error({});assert.match(nodes['#terrainStatus'].textContent,/部分地形/);
console.log('Terrain configuration, Biei route synchronization, regional isolation and error status passed.');
