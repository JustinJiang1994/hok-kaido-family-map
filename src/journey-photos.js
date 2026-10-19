// Overview destination photos reuse the existing verified, optimized image assets.
(() => {
 const stage=document.querySelector('.map-stage');
 const card=document.createElement('button');card.id='journeyPhoto';card.type='button';card.hidden=true;stage.after(card);
 const destinations={sapporo:'札幌',asahi:'旭川',biei:'美瑛'},bags={},last={};
 function nextPlace(city){
  if(!bags[city]?.length){
   bags[city]=PLACES.filter(p=>p.city===city&&p.type==='sight'&&PLACE_MEDIA[p.id]?.photos?.length);
   for(let i=bags[city].length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bags[city][i],bags[city][j]]=[bags[city][j],bags[city][i]];}
   if(bags[city].length>1&&bags[city].at(-1).id===last[city]){const a=bags[city];[a[0],a[a.length-1]]=[a[a.length-1],a[0]];}
  }
  const place=bags[city].pop();if(place)last[city]=place.id;return place;
 }
 function updatePhoto(index){
  card.hidden=region!=='行程总览';if(card.hidden)return;
  const key=JOURNEY[index].points[1],city=destinations[key];
  if(!city){card.innerHTML='<span class="airport-photo-symbol" aria-hidden="true">✈</span><span><strong>返回新千岁机场</strong><small>结束北海道旅行，搭机回上海</small></span>';card.onclick=null;card.disabled=true;return;}
  const place=nextPlace(city);if(!place){card.hidden=true;return;}
  const {id}=place,title=city+' · '+place.name,photo=PLACE_MEDIA[id].photos[0];card.disabled=false;
  card.innerHTML=`<span class="journey-thumb">${PhotoLoader.markup(photo,0)}</span><span><strong>${esc(title)}</strong><small>当地景点 · 点开看介绍</small><small class="journey-photo-credit">${esc(photo.caption)} · ${esc(photo.credit)}</small></span><span aria-hidden="true">›</span>`;
  card.onclick=()=>showPlace(PLACES.find(p=>p.id===id));PhotoLoader.load(card.querySelector('img'));
 }
 document.addEventListener('journeychange',e=>updatePhoto(e.detail));
 document.querySelector('#days').addEventListener('click',()=>updatePhoto(dayIndex));
 updatePhoto(dayIndex);
})();
