// DOM logic only; not a browser layout or real-device test. Requires linkedom (or HOKKAIDO_DOM_MODULE).
const {parseHTML}=require(process.env.HOKKAIDO_DOM_MODULE||'linkedom'),fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').resolve(__dirname,'../dist/index.html'),'utf8');
const {window,document}=parseHTML(html);let frames=new Map(),id=0,observers=[];
const context=vm.createContext({document,IntersectionObserver:class{constructor(fn){this.fn=fn;this.nodes=[];observers.push(this)}observe(n){this.nodes.push(n)}unobserve(){}disconnect(){this.disconnected=true}},requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:i=>frames.delete(i),matchMedia:()=>({matches:false})});
const src=fs.readFileSync(require('node:path').resolve(__dirname,'../src/intro.js'),'utf8');vm.runInContext(src.slice(src.indexOf('function enhanceReading')),context);
const dialog=document.createElement('dialog');dialog.innerHTML='<div class="reader-scroll"><div id="readerContent"></div></div>';document.body.append(dialog);
const content=dialog.querySelector('#readerContent');
for(const topic of ['history','specialties','population','industry','specialties']){
 content.replaceChildren(document.getElementById('reading-'+topic).content.cloneNode(true));
 const paragraphs=[...content.querySelectorAll('p')].map(e=>e.textContent),images=content.querySelectorAll('img').length;
 const cleanup=context.enhanceReading(dialog,topic);
 for(const text of paragraphs)assert.ok(content.textContent.includes(text),'lost paragraph '+text.slice(0,25));
 assert.equal(content.querySelectorAll('img').length,images);
 if(topic==='history')assert.equal(content.querySelectorAll('.history-step').length,9);
 if(topic==='specialties'){
  assert.equal(content.querySelectorAll('.souvenir-gallery').length,1);
  const cards=[...content.querySelectorAll('.souvenir-card')];assert.equal(cards.length,6);
  for(const c of cards){assert.ok(c.querySelector(':scope > figure img'));assert.ok(c.querySelector(':scope > details summary'));assert.ok(c.querySelector('details p'));}
  const rail=content.querySelector('.souvenir-rail');rail.dispatchEvent(new window.Event('scroll'));
 }
 cleanup();assert.equal(observers.at(-1).disconnected,true);
 assert.equal(frames.size,0,'pending souvenir frame remains after closing');
}
console.log('DOM chapters: original paragraphs/images preserved, 9 history nodes, 6 souvenir cards, repeated open/close clean.');
