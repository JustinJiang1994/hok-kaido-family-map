// Independent reader: does not change map state, zoom or place details.
(() => {
 const dialog=document.createElement('dialog');dialog.id='topicReader';dialog.setAttribute('aria-labelledby','readerTitle');
 dialog.innerHTML='<div class="reader-bar"><button type="button" id="readerClose">← 返回主题</button><span>北海道读本</span></div><div class="reader-scroll"><h2 id="readerTitle"></h2><div id="readerContent"></div></div>';
 document.body.append(dialog);
 let opener,photoObserver,enhancementCleanup;
 const close=()=>dialog.close();
 dialog.querySelector('#readerClose').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('.reading-back-bottom'))close();});
 dialog.addEventListener('close',()=>{photoObserver?.disconnect();enhancementCleanup?.();document.body.classList.remove('reading-open');opener?.focus({preventScroll:true});});
 document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{
  const template=document.getElementById('reading-'+button.dataset.topic);
  opener=button;dialog.querySelector('#readerTitle').textContent=template.dataset.title;
  dialog.querySelector('#readerContent').replaceChildren(template.content.cloneNode(true));
  enhancementCleanup?.();enhancementCleanup=enhanceReading(dialog,button.dataset.topic);document.body.classList.add('reading-open');dialog.showModal();dialog.querySelector('.reader-scroll').scrollTop=0;photoObserver?.disconnect();photoObserver=PhotoLoader.observe(dialog.querySelector('.reader-scroll'));
 }));
})();

// Reveal each cover once; weather movement pauses off-screen and in background tabs.
(() => {
 const covers=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('motion-seen');covers.unobserve(entry.target);}
 }),{threshold:.12});
 document.querySelectorAll('[data-topic]').forEach(card=>covers.observe(card));
 const weather=document.querySelector('#tripWeather');
 if(weather)new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('weather-motion-visible',entry.isIntersecting))).observe(weather);
 const visibility=()=>document.body.classList.toggle('motion-page-hidden',document.hidden);
 document.addEventListener('visibilitychange',visibility);visibility();
})();

function enhanceReading(dialog,topic){
 const root=dialog.querySelector('.reader-scroll'),content=dialog.querySelector('#readerContent');
 if(topic==='history'){
  const dates=['历史概览','名称出现以前','港口与贸易','1869年以后','铁路与煤矿','20世纪前半','战后—1972年','1988年至今','带着历史旅行'];
  content.querySelectorAll('.reading-chapter').forEach((section,i)=>{section.classList.add('history-step');const date=document.createElement('div');date.className='history-date';date.textContent=dates[i]||'';section.prepend(date);});
 }
 if(topic==='specialties'){
  const brands=['白色恋人','六花亭','ROYCE','KINOTOYA','LeTAO','薯条三兄弟'];
  const chapters=[...content.querySelectorAll('.reading-chapter')].filter(s=>brands.some(b=>s.querySelector('h3')?.textContent.startsWith(b)));
  if(chapters.length){
   const group=document.createElement('section');group.className='souvenir-gallery';group.setAttribute('aria-label','北海道伴手礼');
   const heading=document.createElement('h3');heading.textContent='挑一份北海道带回家';
   const hint=document.createElement('p');hint.className='souvenir-hint';hint.textContent='左右滑动挑选 · 点开查看商品和购买地点';
   const rail=document.createElement('div');rail.className='souvenir-rail';rail.tabIndex=0;
   chapters[0].before(group);group.append(heading,hint,rail);
   chapters.forEach((chapter,i)=>{chapter.classList.add('souvenir-card');chapter.classList.toggle('current',i===0);const title=chapter.querySelector('h3'),photo=chapter.querySelector('figure');const more=document.createElement('details'),summary=document.createElement('summary');summary.textContent='商品特色与购买地点';more.append(summary);for(const child of [...chapter.childNodes])if(child!==title&&child!==photo)more.append(child);chapter.replaceChildren(...[title,photo,more].filter(Boolean));rail.append(chapter);});
   let frame;
   const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const center=rail.getBoundingClientRect().left+rail.clientWidth/2;let nearest=0,distance=Infinity;chapters.forEach((c,i)=>{const r=c.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-center);if(d<distance){distance=d;nearest=i;}});chapters.forEach((c,i)=>c.classList.toggle('current',i===nearest));hint.textContent=(nearest+1)+' / '+chapters.length+' · 左右滑动挑选';});};
   rail.addEventListener('scroll',update,{passive:true});
   rail.addEventListener('keydown',e=>{if(e.target!==rail||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();rail.scrollBy({left:(chapters[0].getBoundingClientRect().width+14)*(e.key==='ArrowLeft'?-1:1),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
  }
 }
 const observed=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reading-visible');observed.unobserve(entry.target);}}),{root,threshold:.15});
 content.querySelectorAll('.history-step,.chart-bar').forEach(node=>observed.observe(node));
 return ()=>observed.disconnect();
}
