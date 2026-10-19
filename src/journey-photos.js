// Overview destination photos reuse the existing verified, optimized image assets.
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
 document.addEventListener('journeychange',e=>updatePhoto(e.detail));
 document.querySelector('#days').addEventListener('click',()=>updatePhoto(dayIndex));
 updatePhoto(dayIndex);
})();
