/* Live forecast, fixed trip dates; no long-range daily guesses. */
const TripWeather = (() => {
 const dates=Array.from({length:6},(_,i)=>`2026-12-${17+i}`);
 const places={sapporo:['札幌',43.0618,141.3545],asahikawa:['旭川',43.7706,142.365],biei:['美瑛',43.5883,142.4668],airport:['新千岁机场',42.7752,141.6923]};
 const day=(now=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 const distance=(a,b)=>Math.round((Date.parse(a+'T00:00:00Z')-Date.parse(b+'T00:00:00Z'))/86400000);
 const state=(date,today)=>distance(date,today)<0?'past':distance(date,today)>15?'future':'available';
 const condition=code=>({0:'晴',1:'大致晴朗',2:'局部多云',3:'阴',45:'雾',48:'冻雾',51:'小毛毛雨',53:'毛毛雨',55:'强毛毛雨',56:'冻毛毛雨',57:'冻毛毛雨',61:'小雨',63:'中雨',65:'大雨',66:'冻雨',67:'强冻雨',71:'小雪',73:'中雪',75:'大雪',77:'雪粒',80:'阵雨',81:'阵雨',82:'强阵雨',85:'阵雪',86:'强阵雪',95:'雷雨',96:'雷雨伴冰雹',99:'雷雨伴冰雹'}[code]||'天气数据待补充');
 const value=(v,unit)=>typeof v==='number'&&Number.isFinite(v)?`${Math.round(v*10)/10}${unit}`:'暂缺';
 const row=(daily,date)=>{const i=daily?.time?.indexOf(date)??-1;return i<0?null:Object.fromEntries(Object.entries(daily).map(([k,v])=>[k,v[i]]));};
 return {dates,places,day,distance,state,condition,value,row};
})();

(() => {
 const root=document.getElementById('tripWeather');if(!root)return;
 const list=root.querySelector('.weather-regions');
 const climate={sapporo:['札幌',-4,2,113,'白天接近冰点，早晚更冷','羽绒外套、手套围巾、防滑冬靴'],asahikawa:['旭川',-8,-0.8,158,'白天也常在零下','厚羽绒、保暖内层、遮耳帽'],biei:['美瑛',-10.8,-1.6,182,'早晚寒冷，户外多备一层','厚羽绒、防风裤、防水防滑冬靴']};
 const keys={札幌:'sapporo',旭川:'asahikawa',美瑛:'biei'};
 let region=document.querySelector('#days [aria-pressed="true"]')?.dataset.region||'行程总览',controller,lastFetch=0;
 const el=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;};

 function comparison(results,today){
  const panel=el('section','weather-comparison');
  panel.append(el('p','comparison-note','六天预报对比 · 气温为最低～最高（℃）'));
  const table=el('table','forecast-comparison');const caption=el('caption','sr-weather','札幌、旭川、美瑛六天预报');table.append(caption);
  const head=el('thead','');const hr=el('tr','');
  for(const name of ['日期','札幌','旭川','美瑛']){const th=el('th','',name);th.scope='col';hr.append(th);}head.append(hr);table.append(head);
  const body=el('tbody','');
  for(const date of TripWeather.dates){const tr=el('tr','');const th=el('th','',`12/${date.slice(-2)}`);th.scope='row';tr.append(th);
   for(const key of Object.keys(climate)){
    const td=el('td','');const d=TripWeather.row(results[key]?.daily,date);const state=TripWeather.state(date,today);
    if(state!=='available'||!d){td.append(el('span','comparison-unavailable',state==='past'?'已过去':state==='future'?'未到预报期':results[key]?.error?'暂未连上':'暂无数据'));}
    else{td.append(el('span','comparison-condition',TripWeather.condition(d.weather_code)),el('strong','comparison-temperature',`${TripWeather.value(d.temperature_2m_min,'')}～${TripWeather.value(d.temperature_2m_max,'')}`),el('small','comparison-snow',`新雪 ${TripWeather.value(d.snowfall_sum,'cm')}`));}
    tr.append(td);
   }body.append(tr);
  }table.append(body);panel.append(table);
  const times=el('p','comparison-update');
  times.textContent=Object.keys(climate).map(k=>`${climate[k][0]} ${results[k]?.time||'未更新'}`).join(' · ')+'（日本时间）';panel.append(times);
  panel.append(el('p','comparison-note','预报会变化；超过7天的日期仅作远期参考。'));
  const outfits=el('div','comparison-outfits');for(const c of Object.values(climate)){const line=el('p','');line.append(el('strong','',c[0]+' '),document.createTextNode(c[5]));outfits.append(line);}panel.append(outfits);
  list.replaceChildren(panel);list.classList.add('is-comparison');
 }
 async function render(){
  controller?.abort();controller=new AbortController();const active=controller;list.replaceChildren();list.classList.remove('is-comparison');
  const overview=!keys[region],results={};
  const today=TripWeather.day();const pending=TripWeather.dates.filter(d=>TripWeather.state(d,today)==='available');
  await Promise.all((keys[region]?[keys[region]]:Object.keys(climate)).map(async key=>{
   const [name,low,high,snow,feel,clothes]=climate[key];
   const card=el('article','weather-region-card');card.append(el('h3','',name));
   const history=el('div','weather-history-overview');
   history.append(el('small','weather-history-badge','往年12月 · 非今年预报'),el('div','weather-big-temperature',`${low}～${high}°C`),el('p','weather-lowhigh','平均低温～平均高温'),el('strong','weather-feel',feel),el('p','weather-snow',`❄ 全月累计新降雪约 ${snow} cm`));
   const forecast=el('div','region-forecast');const status=el('p','region-forecast-status');card.append(forecast,history,el('p','weather-outfit','🧥 '+clothes),status);list.append(card);
   if(!pending.length){status.textContent=today>TripWeather.dates[5]?'旅行日期已过':'临近出发，自动显示每日预报';return;}
   status.textContent='正在更新预报…';
   const [,lat,lon]=TripWeather.places[key];const timeout=setTimeout(()=>local.abort(),12000);const local=new AbortController();active.signal.addEventListener('abort',()=>local.abort(),{once:true});
   try{
    const q=new URLSearchParams({latitude:lat,longitude:lon,timezone:'Asia/Tokyo',forecast_days:16,daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum'});
    const response=await fetch('https://api.open-meteo.com/v1/forecast?'+q,{signal:local.signal,cache:'no-store'});if(!response.ok)throw Error('weather');const data=await response.json();if(active!==controller)return;
    results[key]={daily:data.daily,time:new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())};
    if(overview)return;
    let count=0;forecast.append(el('p','forecast-label','旅行日期预报 · 最低～最高'));
    for(const date of TripWeather.dates){const d=TripWeather.row(data.daily,date);const row=el('div','forecast-row');row.append(el('strong','',`12/${date.slice(-2)}`));
     if(!pending.includes(date)||!d){row.append(el('span','',TripWeather.state(date,today)==='past'?'日期已过':'暂无预报'));}else{
      count++;row.append(el('span','',TripWeather.condition(d.weather_code)),el('strong','',`${TripWeather.value(d.temperature_2m_min,'')}～${TripWeather.value(d.temperature_2m_max,'')}℃`));
      row.append(el('small','forecast-extra',`降水 ${TripWeather.value(d.precipitation_probability_max,'%')} · 新雪 ${TripWeather.value(d.snowfall_sum,'cm')}${TripWeather.distance(date,today)>7?' · 远期参考':''}`));
     }forecast.append(row);
    }
    history.classList.toggle('has-live-forecast',count>0);
    status.textContent=`${count}天预报 · ${new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())} 更新（日本时间）`;
   }catch(e){results[key]={error:true};if(active===controller)status.textContent='预报暂未连上，稍后自动重试；上方为历史参考';}finally{clearTimeout(timeout);}
  }));
  if(active===controller){if(overview&&pending.length)comparison(results,today);lastFetch=Date.now();}
 }
 document.getElementById('days')?.addEventListener('click',event=>{const tab=event.target.closest('[data-region]');if(tab&&tab.dataset.region!==region){region=tab.dataset.region;render();}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastFetch>3600000)render();});
 setInterval(()=>{if(!document.hidden&&Date.now()-lastFetch>3600000)render();},60000);render();
})();
