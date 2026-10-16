'use strict';
const $=s=>document.querySelector(s),esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let region='行程总览',current=[],markers=[],bounds,selectedId=null;
const map=L.map('map',{zoomAnimation:false,fadeAnimation:false,scrollWheelZoom:false,zoomControl:true,minZoom:5,maxZoom:18}).setView([43.2,142.1],7);
map.attributionControl.setPrefix('');
const tiles=L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',{minZoom:5,maxZoom:18,attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'}).addTo(map);
let tileSuccess=0;tiles.on('loading',()=>{tileSuccess=0;$('#mapStatus').textContent='正在加载这一片区域的道路地图…';});tiles.on('tileload',()=>{tileSuccess++;$('#mapStatus').className='';$('#mapStatus').textContent='浅色道路底图 · 放大可看街区';});tiles.on('tileerror',()=>{if(!tileSuccess){$('#mapStatus').className='error';$('#mapStatus').textContent='道路底图暂未加载，请检查网络；请稍后刷新重试。';}});
setTimeout(()=>{if(!tileSuccess){$('#mapStatus').className='error';$('#mapStatus').textContent='底图加载较慢，请检查网络；点圆点仍可查看介绍。';}},12000);
const routeLayer=L.layerGroup().addTo(map),markerLayer=L.layerGroup().addTo(map);
const placeColor=p=>p.type==='food'?'#c65c18':p.type==='hub'?'#54677c':'#c02570';
function renderMarkers(){
 if(region==='行程总览')return;
 markerLayer.clearLayers();routeLayer.clearLayers();markers=[];const size=map.getSize(),used=[];
 current.forEach(p=>{const actual=map.latLngToContainerPoint([p.lat,p.lon]);if(actual.x<0||actual.y<0||actual.x>size.x||actual.y>size.y)return;
 let best=null;for(let y=26;y<=size.y-38;y+=6)for(let x=26;x<=size.x-26;x+=6){if(x<78&&y<126)continue;if(used.some(q=>Math.abs(x-q.x)<46&&Math.abs(y-q.y)<46))continue;const d=(x-actual.x)**2+(y-actual.y)**2;if(!best||d<best.d)best={x,y,d};}
 const pt=best||actual;used.push(pt);const pos=map.containerPointToLatLng([pt.x,pt.y]);if(best&&best.d>100)L.polyline([[p.lat,p.lon],pos],{color:placeColor(p),weight:1.5,opacity:.65,interactive:false}).addTo(routeLayer);
 const m=L.marker(pos,{icon:L.divIcon({className:'category-pin',html:`<span style="background:${placeColor(p)}"></span>`,iconSize:[44,44],iconAnchor:[22,22]}),title:p.name,alt:p.name,keyboard:true}).addTo(markerLayer);m.on('click',()=>showPlace(p));markers.push({m,ps:[p]});});}
const detail=document.createElement('dialog');detail.id='placeDetail';detail.setAttribute('aria-labelledby','detailTitle');document.body.append(detail);
function renderSections(p,info){
 if(!info?.tagline)return `<p>${esc(p.desc||p.note)}</p>`;
 const section=(title,body)=>`<section class="info-section"><h3>${title}</h3>${body}</section>`;
 return section('一句话介绍',`<p class="place-tagline">${esc(info.tagline)}</p>`)
 +section('景点看点',`<ul>${info.highlights.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`)
 +section('景点详细介绍',info.details.map(x=>`<p>${esc(x)}</p>`).join(''))
 +(info.history?section('历史背景',`<p>${esc(info.history)}</p>`):'')
 +section('营业时间等景点信息',`<dl class="place-facts">${info.facts.map(x=>`<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl><p class="info-checked">核对日期：${esc(info.checkedOn)} · 时间均为日本当地时间。临时调整以现场公告为准。</p>`);
}
function showPlace(p){
 highlight(p.id);const info=PLACE_MEDIA[p.id],photos=info?.photos||[];
 detail.innerHTML=`<div class="detail-head"><h2 id="detailTitle">${esc(info?.title||p.name)}</h2><button id="closeDetail" aria-label="关闭地点介绍">关闭 ×</button></div><div class="detail-body">${photos.length?`<section class="photo-section" aria-label="${esc(p.name)}照片"><div class="photo-track" tabindex="0" aria-label="左右滑动查看照片">${photos.map((im,i)=>`<figure class="photo-slide"><div class="photo-frame"><img src="${esc(im.src)}" alt="${esc(im.caption)}" loading="${i===0?'eager':'lazy'}" decoding="async"><div class="photo-error" hidden>照片暂未加载<br><button type="button">重新加载</button></div></div><figcaption>${esc(im.caption)}<small>照片：${esc(im.credit)}</small></figcaption></figure>`).join('')}</div><div class="photo-controls"><button id="prevPhoto" aria-label="上一张照片">‹</button><span id="photoCount" aria-live="polite">1 / ${photos.length}</span><span class="swipe-tip">左右滑动看照片</span><button id="nextPhoto" aria-label="下一张照片">›</button></div></section>`:''}<div class="place-copy"><p class="place-city">${esc(p.city)} · ${p.type==='hub'?'交通枢纽':'景点'}</p>${renderSections(p,info)}${info?.note?'<div class="visit-note"><strong>看图与到访提示</strong><p>'+esc(info.note)+'</p></div>':p.detail?'<p>'+esc(p.detail)+'</p>':''}${photos.length?'<p class="photo-footnote">图片来自上述景点官方或当地官方旅游页面，为资料照片，季节、天气与现场布置可能不同。图片需联网加载。</p>':''}</div></div>`;
 $('#closeDetail').onclick=()=>detail.close();if(!detail.open)detail.showModal();
 const track=detail.querySelector('.photo-track');if(!track)return;
 let index=0;const update=()=>{index=Math.max(0,Math.min(photos.length-1,Math.round(track.scrollLeft/track.clientWidth)));$('#photoCount').textContent=(index+1)+' / '+photos.length;$('#prevPhoto').disabled=index===0;$('#nextPhoto').disabled=index===photos.length-1;};
 const go=step=>track.scrollTo({left:Math.max(0,Math.min(photos.length-1,index+step))*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 $('#prevPhoto').onclick=()=>go(-1);$('#nextPhoto').onclick=()=>go(1);track.addEventListener('scroll',update,{passive:true});track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowLeft'?-1:1);}});update();
 detail.querySelectorAll('.photo-frame img').forEach(img=>{const fallback=img.parentElement.querySelector('.photo-error');img.onload=()=>{img.dataset.loaded='true';fallback.hidden=true;img.style.visibility='visible';};img.onerror=()=>{img.dataset.loaded='error';fallback.hidden=false;img.style.visibility='hidden';};fallback.querySelector('button').onclick=()=>{fallback.hidden=true;img.removeAttribute('data-loaded');img.src=img.getAttribute('src');};if(img.complete&&img.naturalWidth)img.dataset.loaded='true';});
}
detail.addEventListener('click',e=>{if(e.target===detail){const r=detail.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)detail.close();}});
function highlight(id){selectedId=id;}
const MAP_REGIONS=['行程总览','札幌','旭川','美瑛'];
const REGION_DATES={'行程总览':['12月17—22日','第1—6天'],'札幌':['12月17—19日','第1—3天'],'旭川':['12月19—22日','第3—6天'],'美瑛':['12月21日','第5天']};
const JOURNEY_HUBS={airport:[42.787,141.681],sapporo:[43.062,141.354],asahi:[43.768,142.365],biei:[43.588,142.467],zoo:[43.768,142.480]};
const JOURNEY=[
 {title:'第1天 · 12月17日',route:'新千岁机场 → 札幌',note:'抵达北海道；第1—3天在札幌。',points:['airport','sapporo']},
 {title:'第3天 · 12月19日',route:'札幌 → 旭川',note:'预计16:00左右离开札幌；第4天在旭川游览动物园。',points:['sapporo','asahi']},
 {title:'第5天 · 12月21日',route:'旭川 → 美瑛',note:'前往美瑛看雪景、青池与白须瀑布。',points:['asahi','biei']},
 {title:'第5天 · 12月21日',route:'美瑛 → 旭川',note:'结束美瑛游览，返回旭川。',points:['biei','asahi']},
 {title:'第6天 · 12月22日',route:'旭川 → 新千岁机场',note:'前往机场，搭机返回上海。',points:['asahi','airport']}
];
const overviewLayer=L.layerGroup().addTo(map),hubLabels=L.layerGroup().addTo(map);
let dayIndex=0,playing=false,animation=0,started=0,elapsed=0,traveler,activeLine;
function stopJourney(){if(playing)elapsed=performance.now()-started;playing=false;cancelAnimationFrame(animation);}
function drawOverviewLabels(){
 hubLabels.clearLayers();if(region!=='行程总览')return;
 const size=map.getSize();
 [['airport','新千岁机场',-85,57],['sapporo','札幌',-88,-12],['asahi','旭川',75,-45],['biei','美瑛',85,20]].forEach(([id,name,dx,dy])=>{
 const actual=map.latLngToContainerPoint(JOURNEY_HUBS[id]);
 const target=map.containerPointToLatLng([Math.max(55,Math.min(size.x-55,actual.x+dx)),actual.y+dy]);
 L.polyline([JOURNEY_HUBS[id],target],{color:'#486b70',weight:1,opacity:.7,interactive:false}).addTo(hubLabels);
 L.marker(target,{interactive:false,icon:L.divIcon({className:'overview-label'+(JOURNEY[dayIndex].points.includes(id)?' is-current':''),html:esc(name),iconSize:[100,30],iconAnchor:[50,15]})}).addTo(hubLabels);
 });
}
function drawDay(index){
 dayIndex=index;const day=JOURNEY[index];
 $('#journeyTitle').textContent=day.title;$('#journeyRoute').textContent=day.route;drawOverviewLabels();
 started=performance.now();elapsed=0;
}
function setupJourney(){
 overviewLayer.clearLayers();
 L.polygon([[[30,125],[55,125],[55,165],[30,165]],HOKKAIDO_OUTLINE],{stroke:false,fillColor:'#e4f0f1',fillOpacity:.96,interactive:false}).addTo(overviewLayer);
 L.polygon(HOKKAIDO_OUTLINE,{color:'#287875',weight:2,fillColor:'#d1ebde',fillOpacity:.18,interactive:false}).addTo(overviewLayer);
 const path=['airport','sapporo','asahi','biei','asahi','airport'].map(k=>JOURNEY_HUBS[k]);
 L.polyline(path,{color:'white',weight:9,opacity:.95,interactive:false}).addTo(overviewLayer);
 activeLine=L.polyline([path[0]],{color:'#e75019',weight:6,opacity:1,interactive:false}).addTo(overviewLayer);
 Object.values(JOURNEY_HUBS).slice(0,4).forEach(pos=>L.circleMarker(pos,{radius:5,color:'white',weight:2,fillColor:'#193e42',fillOpacity:1,interactive:false}).addTo(overviewLayer));
 traveler=L.circleMarker(path[0],{radius:10,color:'white',weight:3,fillColor:'#e75019',fillOpacity:1,interactive:false}).addTo(overviewLayer);
 drawOverviewLabels();drawDay(0);
}
function tickJourney(now){
 if(!playing||region!=='行程总览')return;
 const t=Math.min(1,(now-started)/2200),points=JOURNEY[dayIndex].points.map(k=>JOURNEY_HUBS[k]);
 const u=Math.min(1,t/0.8),pos=[points[0][0]+(points[1][0]-points[0][0])*u,points[0][1]+(points[1][1]-points[0][1])*u];
 traveler.setLatLng(pos);activeLine.setLatLngs([...JOURNEY.slice(0,dayIndex+1).map(d=>JOURNEY_HUBS[d.points[0]]),pos]);
 if(t>=1){if(dayIndex===JOURNEY.length-1){activeLine.setLatLngs([JOURNEY_HUBS.airport]);drawDay(0);}else drawDay(dayIndex+1);}
 animation=requestAnimationFrame(tickJourney);
}
function startJourney(){playing=true;started=performance.now()-elapsed;animation=requestAnimationFrame(tickJourney);}
function fitRegion(){
 if(region==='行程总览'){
  map.options.zoomSnap=0.1;
  map.fitBounds(bounds,{paddingTopLeft:[16,80],paddingBottomRight:[16,28],maxZoom:14,animate:false});
  drawOverviewLabels();
 }else{
  // Preserve the regional maps' original integer zoom and edge padding.
  map.options.zoomSnap=1;
  map.fitBounds(bounds,{padding:innerWidth<560?[40,55]:[65,65],maxZoom:14,animate:false});
 }
}
function render(){
 stopJourney();overviewLayer.clearLayers();hubLabels.clearLayers();markerLayer.clearLayers();routeLayer.clearLayers();
 const overview=region==='行程总览';if(overview&&innerWidth<560)map.dragging.disable();else map.dragging.enable();document.body.classList.toggle('overview-mode',overview);
 $('#journeyPanel').hidden=!overview;$('#islandCaption').hidden=!overview;$('#hokkaidoIntro').hidden=!overview;$('#placeLegend').hidden=overview;
 $('#mapHint').textContent=overview?'动线为示意 · 下滑认识北海道 ↓':'双指缩放 · 点圆点查看 · 密集圆点以细线连接实际位置';
 current=PLACES.filter(p=>p.city===region);
 $('#days').innerHTML=MAP_REGIONS.map(name=>`<button data-region="${name}" class="${region===name?'active':''}" aria-pressed="${region===name}"><strong>${name}</strong><small><span class="tab-date-full">${REGION_DATES[name][0]}</span><span class="tab-date-short">${REGION_DATES[name][0].replace("月","/").replace("日","")}</span></small><small>${REGION_DATES[name][1]}</small></button>`).join('');
 $('#mapTitle').textContent=overview?'北海道全览':region+'地图';
 bounds=L.latLngBounds(overview?[[41.35,139.35],[45.6,145.9]]:current.map(p=>[p.lat,p.lon]));
 map.invalidateSize({animate:false});fitRegion();
 if(overview){setupJourney();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)startJourney();}else renderMarkers();
 $('main').scrollTop=0;
}
$('#days').onclick=e=>{const b=e.target.closest('[data-region]');if(b){region=b.dataset.region;render();}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopJourney();else if(region==='行程总览'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)startJourney();});
$('#fit').onclick=fitRegion;map.on('moveend',()=>{if(region==='行程总览')drawOverviewLabels();else renderMarkers();});map.on('resize',()=>{if(bounds)fitRegion();});
render();
