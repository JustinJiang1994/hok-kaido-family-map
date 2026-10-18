'use strict';
const $=s=>document.querySelector(s),esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let region='行程总览',placeTypes=new Set(['sight']),current=[],markers=[],bounds,selectedId=null;
let userPosition=null,nearbyMode=false,locationRequest=0,locationWatch=null,locationEnabled=false,locationFocus=null,locationDeadline=null;
const PLACE_TYPES={sight:'景点',food:'餐厅',shop:'购物'};
function updatePlaceFilter(){
 $('#mapTitle').textContent=nearbyMode?'我的附近':region==='行程总览'?'北海道全览':region+'地图';
 current=PLACES.filter(p=>placeTypes.has(p.type)&&(nearbyMode&&userPosition?Nearby.distance(userPosition,p)<=Nearby.radius:p.city===region));
 if(nearbyMode)current.sort((a,b)=>Nearby.distance(userPosition,a)-Nearby.distance(userPosition,b));
 document.querySelectorAll('[data-place-type]').forEach(b=>b.setAttribute('aria-pressed',String(placeTypes.has(b.dataset.placeType))));
 const typeLabel=Object.keys(PLACE_TYPES).filter(t=>placeTypes.has(t)).map(t=>PLACE_TYPES[t]).join('、');
 if(!placeTypes.size){$('#mapHint').textContent='请选择要显示的类型 · 可多选';return;}
 if(nearbyMode){$('#mapHint').textContent=current.length?'附近5公里内已收录'+current.length+'个'+typeLabel+' · 点圆点查看':'附近5公里内暂无已收录的'+typeLabel+'，可选择其他类型';return;}
 if(region!=='行程总览')$('#mapHint').textContent=current.length?'显示'+typeLabel+' · 可多选 · 点圆点查看介绍':'暂未添加'+region+'的'+typeLabel+'地点，可切换其他类型';
}

const map=L.map('map',{zoomAnimation:false,fadeAnimation:false,scrollWheelZoom:false,zoomControl:true,minZoom:5,maxZoom:18}).setView([43.2,142.1],7);
map.attributionControl.setPrefix('');
const tiles=L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',{minZoom:5,maxZoom:18,attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'}).addTo(map);
let tileSuccess=0;tiles.on('loading',()=>{tileSuccess=0;$('#mapStatus').textContent='正在加载这一片区域的道路地图…';});tiles.on('tileload',()=>{tileSuccess++;$('#mapStatus').className='';$('#mapStatus').textContent='浅色道路底图 · 放大可看街区';});tiles.on('tileerror',()=>{if(!tileSuccess){$('#mapStatus').className='error';$('#mapStatus').textContent='道路底图暂未加载，请检查网络；请稍后刷新重试。';}});
setTimeout(()=>{if(!tileSuccess){$('#mapStatus').className='error';$('#mapStatus').textContent='底图加载较慢，请检查网络；点圆点仍可查看介绍。';}},12000);
const routeLayer=L.layerGroup().addTo(map),markerLayer=L.layerGroup().addTo(map);
const userLayer=L.layerGroup().addTo(map);
function drawUserLocation(){userLayer.clearLayers();if(!userPosition||region==='行程总览')return;L.circle([userPosition.lat,userPosition.lon],{radius:userPosition.accuracy,color:'#1769d2',weight:1,fillOpacity:.08,interactive:false}).addTo(userLayer);L.circleMarker([userPosition.lat,userPosition.lon],{radius:8,color:'white',weight:3,fillColor:'#1769d2',fillOpacity:1,interactive:false}).addTo(userLayer);}
function placeLocationInfo(p){return `<a class="place-navigation" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.navigationDestination||`${p.name} 日本 北海道 ${p.city}`)}" aria-label="用 Google 地图导航到${esc(p.name)}">用 Google 地图导航 ↗</a>`;}
const placeColor=p=>p.type==='food'?'#c65c18':p.type==='shop'?'#6351b5':p.type==='hub'?'#54677c':'#c02570';
function renderMarkers(){
 if(region==='行程总览')return;
 markerLayer.clearLayers();routeLayer.clearLayers();markers=[];const size=map.getSize(),used=[];
 if(userPosition)used.push(map.latLngToContainerPoint([userPosition.lat,userPosition.lon]));
 current.forEach(p=>{const actual=map.latLngToContainerPoint([p.lat,p.lon]);if(actual.x<0||actual.y<0||actual.x>size.x||actual.y>size.y)return;
 let best=null;for(let y=26;y<=size.y-38;y+=6)for(let x=26;x<=size.x-26;x+=6){if(x<78&&y<126)continue;if(used.some(q=>Math.abs(x-q.x)<46&&Math.abs(y-q.y)<46))continue;const d=(x-actual.x)**2+(y-actual.y)**2;if(!best||d<best.d)best={x,y,d};}
 const pt=best||actual;used.push(pt);const pos=map.containerPointToLatLng([pt.x,pt.y]);if(best&&best.d>100)L.polyline([[p.lat,p.lon],pos],{color:placeColor(p),weight:1.5,opacity:.65,interactive:false}).addTo(routeLayer);
 const m=L.marker(pos,{icon:L.divIcon({className:'category-pin',html:`<span style="background:${placeColor(p)}"></span>`,iconSize:[44,44],iconAnchor:[22,22]}),title:p.name,alt:p.name,keyboard:true}).addTo(markerLayer);m.on('click',()=>showPlace(p));markers.push({m,ps:[p]});});}
const detail=document.createElement('dialog');detail.id='placeDetail';detail.setAttribute('aria-labelledby','detailTitle');document.body.append(detail);
function renderSections(p,info){
 if(!info?.tagline)return `<p>${esc(p.desc||p.note)}</p>`;
 const noun=p.type==='food'?'餐厅':p.type==='shop'?'购物地点':'景点';
 const section=(title,body)=>`<section class="info-section"><h3>${title}</h3>${body}</section>`;
 return section('一句话介绍',`<p class="place-tagline">${esc(info.tagline)}</p>`)
 +section(p.type==='food'?'吃什么':p.type==='shop'?'逛什么':'景点看点',`<ul>${info.highlights.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`)
 +section(noun+'详细介绍',info.details.map(x=>`<p>${esc(x)}</p>`).join(''))
 +(info.history?section('历史背景',`<p>${esc(info.history)}</p>`):'')
 +section('营业时间与到访信息',`<dl class="place-facts">${info.facts.map(x=>`<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl><p class="info-checked">核对日期：${esc(info.checkedOn)} · 时间均为日本当地时间。临时调整以现场公告为准。</p>`);
}
function showPlace(p){
 highlight(p.id);const info=PLACE_MEDIA[p.id],photos=info?.photos||[];
 detail.innerHTML=`<div class="detail-head"><h2 id="detailTitle">${esc(info?.title||p.name)}</h2><button id="closeDetail" aria-label="关闭地点介绍">关闭 ×</button></div><div class="detail-body">${photos.length?`<section class="photo-section" aria-label="${esc(p.name)}照片"><div class="photo-track" tabindex="0" aria-label="左右滑动查看照片">${photos.map((im,i)=>`<figure class="photo-slide"><div class="photo-frame">${PhotoLoader.markup(im,i)}<div class="photo-error" hidden>照片暂未加载<br><button type="button">重新加载</button></div></div><figcaption>${esc(im.caption)}<small>照片：${esc(im.credit)}</small></figcaption></figure>`).join('')}</div><div class="photo-controls"><button id="prevPhoto" aria-label="上一张照片">‹</button><span id="photoCount" aria-live="polite">1 / ${photos.length}</span><span class="swipe-tip">左右滑动看照片</span><button id="nextPhoto" aria-label="下一张照片">›</button></div></section>`:''}<div class="place-copy"><p class="place-city">${esc(p.city)} · ${p.type==='hub'?'交通枢纽':p.type==='food'?'餐厅':p.type==='shop'?'购物':'景点'}</p>${placeLocationInfo(p)}${renderSections(p,info)}${info?.note?'<div class="visit-note"><strong>看图与到访提示</strong><p>'+esc(info.note)+'</p></div>':p.detail?'<p>'+esc(p.detail)+'</p>':''}${photos.length?'<p class="photo-footnote">图片来自上述地点官方或当地官方旅游页面，为资料照片，季节、天气与现场布置可能不同。图片已压缩，首次查看需联网加载。</p>':''}</div></div>`;
 $('#closeDetail').onclick=()=>detail.close();if(!detail.open)detail.showModal();
 const track=detail.querySelector('.photo-track');if(!track)return;
 let index=0;const update=()=>{index=Math.max(0,Math.min(photos.length-1,Math.round(track.scrollLeft/track.clientWidth)));$('#photoCount').textContent=(index+1)+' / '+photos.length;$('#prevPhoto').disabled=index===0;$('#nextPhoto').disabled=index===photos.length-1;PhotoLoader.near(track,index);};
 const go=step=>track.scrollTo({left:Math.max(0,Math.min(photos.length-1,index+step))*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 $('#prevPhoto').onclick=()=>go(-1);$('#nextPhoto').onclick=()=>go(1);track.addEventListener('scroll',update,{passive:true});track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowLeft'?-1:1);}});update();

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
 updatePlaceFilter();
 $('#days').innerHTML=MAP_REGIONS.map(name=>`<button data-region="${name}" class="${region===name?'active':''}" aria-pressed="${region===name}"><strong>${name}</strong><small><span class="tab-date-full">${REGION_DATES[name][0]}</span><span class="tab-date-short">${REGION_DATES[name][0].replace("月","/").replace("日","")}</span></small><small>${REGION_DATES[name][1]}</small></button>`).join('');
 $('#mapTitle').textContent=overview?'北海道全览':region+'地图';
 bounds=L.latLngBounds(overview?[[41.35,139.35],[45.6,145.9]]:PLACES.filter(p=>p.city===region).map(p=>[p.lat,p.lon]));
 map.invalidateSize({animate:false});fitRegion();
 if(overview){setupJourney();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)startJourney();}else renderMarkers();
 drawUserLocation();$('main').scrollTop=0;
}
$('#days').onclick=e=>{const b=e.target.closest('[data-region]');if(b){locationFocus=null;nearbyMode=false;region=b.dataset.region;placeTypes=new Set(['sight']);render();}};
$('#placeLegend').onclick=e=>{const b=e.target.closest('[data-place-type]');if(!b||region==='行程总览')return;const type=b.dataset.placeType;if(placeTypes.has(type))placeTypes.delete(type);else placeTypes.add(type);selectedId=null;if(detail.open)detail.close();updatePlaceFilter();renderMarkers();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopJourney();else if(region==='行程总览'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)startJourney();});
$('#fit').onclick=()=>{locationFocus=null;nearbyMode=false;updatePlaceFilter();fitRegion();renderMarkers();};map.on('moveend',()=>{if(region==='行程总览')drawOverviewLabels();else renderMarkers();});map.on('resize',()=>{if(bounds)fitRegion();});
render();

// Continuous foreground tracking; never save coordinates or send them to our server.
function stopLocationWatch(){
 locationRequest++;clearTimeout(locationDeadline);
 if(locationWatch!==null)navigator.geolocation.clearWatch(locationWatch);
 locationWatch=null;
}
function startLocationWatch(focus=null){
 const status=$('#locationStatus');locationFocus=focus;
 if(!window.isSecureContext){status.textContent='请通过 HTTPS 网站打开后使用定位。';return;}
 if(!navigator.geolocation){status.textContent='此浏览器不支持定位，请在 Safari 或其他浏览器中打开。';return;}
 stopLocationWatch();locationEnabled=true;
 const request=locationRequest;
 status.textContent='正在获取位置，允许定位后自动更新。';
 locationDeadline=setTimeout(()=>{if(request===locationRequest&&!userPosition)status.textContent='尚未获取位置，可检查浏览器定位权限后刷新；也可继续浏览地图。';},20000);
 const fail=code=>{
  if(request!==locationRequest)return;
  clearTimeout(locationDeadline);
  if(code===1){locationEnabled=false;stopLocationWatch();}
  status.textContent=Nearby.error(code)+(userPosition?' 当前显示上次位置。':'');
 };
 try{locationWatch=navigator.geolocation.watchPosition(pos=>{
  if(request!==locationRequest)return;if(!Nearby.valid(pos.coords)){fail(2);return;}
  clearTimeout(locationDeadline);
  const located={lat:pos.coords.latitude,lon:pos.coords.longitude,accuracy:pos.coords.accuracy,time:pos.timestamp||Date.now()};
  const nearest=PLACES.filter(p=>p.type!=='hub').reduce((a,b)=>Nearby.distance(located,a)<Nearby.distance(located,b)?a:b);
  const focusNow=locationFocus==='auto'&&Nearby.distance(located,nearest)<50000;
  locationFocus=null;
  userPosition=located;
  if(focusNow){
   const requestedTypes=new Set(placeTypes);
   document.querySelector('[data-region="'+nearest.city+'"]').click();
   placeTypes=requestedTypes;nearbyMode=true;
   map.setView([located.lat,located.lon],14,{animate:false});
  }
  status.textContent='● 定位已开启 · '+new Date(located.time).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+'更新 · 精度约'+Nearby.format(located.accuracy);
  drawUserLocation();
  if(region!=='行程总览'){updatePlaceFilter();renderMarkers();}
 },err=>fail(err.code),{enableHighAccuracy:true,timeout:15000,maximumAge:0});}catch(e){fail(2);}
}
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){stopLocationWatch();if(locationEnabled)$('#locationStatus').textContent='定位已暂停 · 返回页面后继续更新';}
 else if(locationEnabled)startLocationWatch(locationFocus);
});
window.addEventListener('pagehide',stopLocationWatch);
window.addEventListener('pageshow',e=>{if(e.persisted&&locationEnabled&&!document.hidden)startLocationWatch(null);});
// Defer until all region/weather listeners are installed.
setTimeout(()=>{if(!document.hidden)startLocationWatch('auto');else locationEnabled=true;},0);
