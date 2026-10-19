// Local, pinned renderer; public terrain is loaded only when this panel is visible.
(() => {
 const stage=document.querySelector('.map-stage');
 const card=document.createElement('button');card.id='journeyPhoto';card.type='button';card.hidden=true;stage.after(card);
 const destinations={sapporo:['odori','札幌 · 大通公园','圣诞灯光与城市漫步'],asahi:['zoo','旭川 · 旭山动物园','代表景点：雪地里的企鹅'],biei:['blue','美瑛 · 白金青池','代表景点：冬季青池灯光']};
 function updatePhoto(index){
  const key=JOURNEY[index].points[1],entry=destinations[key];card.hidden=region!=='行程总览';
  if(!entry){card.innerHTML='<span class="airport-photo-symbol" aria-hidden="true">✈</span><span><strong>返回新千岁机场</strong><small>结束北海道旅行，搭机回上海</small></span>';card.onclick=null;card.disabled=true;return;}
  const [id,title,note]=entry,photo=PLACE_MEDIA[id].photos[0];card.disabled=false;
  card.innerHTML=`<span class="journey-thumb">${PhotoLoader.markup(photo,0)}</span><span><strong>${esc(title)}</strong><small>${esc(note)} · 点开看介绍</small><small class="journey-photo-credit">资料照片 · ${esc(photo.credit)}</small></span><span aria-hidden="true">›</span>`;
  card.onclick=()=>showPlace(PLACES.find(p=>p.id===id));PhotoLoader.load(card.querySelector('img'));
 }
 const panel=document.createElement('section');panel.id='terrainPanel';panel.innerHTML='<div class="terrain-heading"><div><h2>从山脉看北海道</h2><p>大雪山与美瑛 · 真实高程，起伏放大 2 倍</p></div><button id="terrainView" type="button" disabled>靠近山脉</button></div><div id="terrainMap" aria-label="北海道山地立体地图"></div><p id="terrainStatus" role="status">滑到这里加载山地视角</p><p class="terrain-note">双指缩放 · 连线仅表示旅行方向，不代表实际道路</p>';
 document.querySelector('.map-panel').after(panel);
 let terrain,loaded=false,starting=false,inView=false,failed=false,closeup=false,timeout,labels=[];
 const status=panel.querySelector('#terrainStatus'),button=panel.querySelector('button');
 const line=coords=>({type:'Feature',geometry:{type:'LineString',coordinates:coords}});
 const coords=keys=>keys.map(k=>[JOURNEY_HUBS[k][1],JOURNEY_HUBS[k][0]]);
 function fit(){
  if(!terrain||!loaded)return;terrain.resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(closeup)terrain.easeTo({center:[142.7,43.58],zoom:9.2,pitch:58,bearing:-18,padding:{top:30,bottom:30,left:20,right:20},duration:reduced?0:1200});
  else terrain.fitBounds([[141.12,42.6],[143.15,44.03]],{padding:{top:40,bottom:45,left:40,right:40},pitch:48,bearing:-12,duration:reduced?0:1000});
 }
 function updateTerrain(index){if(!loaded)return;terrain.getSource('active-trip').setData(line(coords(JOURNEY[index].points)));labels.forEach(([id,el])=>el.classList.toggle('current',JOURNEY[index].points.includes(id)));}
 function fail(){
  if(failed)return;failed=true;clearTimeout(timeout);loaded=false;starting=false;
  if(terrain){terrain.remove();terrain=null;}
  status.textContent='山地视角暂不可用，上方全览地图仍可正常查看。';button.disabled=false;button.textContent='重新加载';
 }
 async function init(){
  if(starting||loaded)return;starting=true;failed=false;status.textContent='正在加载山地与高程…';button.disabled=true;timeout=setTimeout(fail,25000);
  try{
   if(!window.maplibregl){
    await new Promise((resolve,reject)=>{const css=document.createElement('link');css.rel='stylesheet';css.href=TERRAIN_VENDOR_BASE+'maplibre-gl.css';document.head.append(css);const script=document.createElement('script');script.src=TERRAIN_VENDOR_BASE+'maplibre-gl.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});
   }
   if(failed)return;
   if(!maplibregl.supported())throw Error('WebGL unavailable');
   terrain=new maplibregl.Map({container:'terrainMap',center:[142.25,43.3],zoom:7.4,pitch:48,bearing:-12,maxPitch:65,maxZoom:12,minZoom:6,attributionControl:true,renderWorldCopies:false,cooperativeGestures:true,style:{version:8,sources:{base:{type:'raster',tiles:['https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'],tileSize:256,attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'},dem:{type:'raster-dem',tiles:['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],tileSize:512,encoding:'terrarium',maxzoom:12,attribution:'<a href="https://mapterhorn.com/attribution">© Mapterhorn</a>'},shade:{type:'raster-dem',tiles:['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],tileSize:512,encoding:'terrarium',maxzoom:12}},layers:[{id:'base',type:'raster',source:'base',paint:{'raster-saturation':-.65}},{id:'shade',type:'hillshade',source:'shade',paint:{'hillshade-exaggeration':.65,'hillshade-shadow-color':'#35504a','hillshade-highlight-color':'#fff6db'}}],terrain:{source:'dem',exaggeration:2}}});
   terrain.on('error',e=>{if(!loaded)fail();else status.textContent='部分地形未加载，网络恢复后可继续查看。';});
   terrain.on('webglcontextlost',fail);
   terrain.on('load',()=>{
    if(failed)return;clearTimeout(timeout);loaded=true;starting=false;
    terrain.addSource('trip',{type:'geojson',data:line(coords(['airport','sapporo','asahi','biei']))});
    terrain.addLayer({id:'trip-halo',type:'line',source:'trip',paint:{'line-color':'white','line-width':7}});
    terrain.addLayer({id:'trip-line',type:'line',source:'trip',paint:{'line-color':'#376766','line-width':3}});
    terrain.addSource('active-trip',{type:'geojson',data:line(coords(JOURNEY[dayIndex].points))});
    terrain.addLayer({id:'active-trip',type:'line',source:'active-trip',paint:{'line-color':'#e75019','line-width':5}});
    labels=[];
    [['airport','新千岁机场',[0,22]],['sapporo','札幌',[-30,-14]],['asahi','旭川',[0,-20]],['biei','美瑛',[30,18]]].forEach(([id,name,offset])=>{const el=document.createElement('span');el.className='terrain-label';el.textContent=name;new maplibregl.Marker({element:el,offset}).setLngLat(coords([id])[0]).addTo(terrain);labels.push([id,el]);});
    status.textContent='真实山地高程 · 可切换全程与山脉近景';button.disabled=false;button.textContent='靠近山脉';fit();updateTerrain(dayIndex);
    if(region!=='行程总览'||!inView)terrain.stop();
   });
  }catch(e){fail();}
 }
 button.onclick=()=>{if(failed){init();return;}closeup=!closeup;button.textContent=closeup?'看旅行全程':'靠近山脉';fit();};
 function sync(){const overview=region==='行程总览';panel.hidden=!overview;card.hidden=!overview;if(!overview){terrain?.stop();return;}updatePhoto(dayIndex);if(inView&&!document.hidden){init();if(loaded)terrain.resize();}}
 document.addEventListener('journeychange',e=>{updatePhoto(e.detail);updateTerrain(e.detail);});
 document.querySelector('#days').addEventListener('click',sync);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)terrain?.stop();else sync();});
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView&&region==='行程总览'&&!document.hidden)init();else terrain?.stop();},{rootMargin:'0px'}).observe(panel);
 new ResizeObserver(()=>{if(loaded&&!panel.hidden)terrain.resize();}).observe(panel);
 sync();
})();
