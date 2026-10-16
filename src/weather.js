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
 const select=root.querySelector('select'),button=root.querySelector('button'),status=root.querySelector('[role=status]'),grid=root.querySelector('.weather-days');
 let controller,lastFetch=0;
 async function refresh(){
  controller?.abort();controller=new AbortController();const active=controller;const today=TripWeather.day();
  const key=select.value;const [name,lat,lon]=TripWeather.places[key];
  button.disabled=true;grid.replaceChildren();
  const cards=TripWeather.dates.map((date,i)=>{
   const card=document.createElement('article');const title=document.createElement('h3');title.textContent=`12/${17+i} · 第${i+1}天`;card.append(title);
   const body=document.createElement('p');card.append(body);grid.append(card);
   const state=TripWeather.state(date,today);
   body.textContent=state==='past'?'日期已过，不显示为预报':state==='future'?'尚未进入逐日预报范围':'正在获取…';
   return {date,body,state};
  });
  const pending=cards.filter(c=>c.state==='available');
  grid.hidden=!pending.length;
  root.querySelector('.weather-unit').hidden=!pending.length;
  if(!pending.length){status.textContent=today>TripWeather.dates[5]?'这次旅行日期已过。':`${name} · 尚无旅行日期预报。预计12月2日起逐天开放；可先点开历史参考。`;button.disabled=false;lastFetch=Date.now();return;}
  status.textContent=`正在获取${name}的最新预报…`;
  const timeout=setTimeout(()=>active.abort(),12000);
  try{
   const q=new URLSearchParams({latitude:lat,longitude:lon,timezone:'Asia/Tokyo',forecast_days:16,daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum'});
   const response=await fetch('https://api.open-meteo.com/v1/forecast?'+q,{signal:active.signal,cache:'no-store'});if(!response.ok)throw Error('weather');
   const data=await response.json();if(active!==controller)return;
   let count=0;
   pending.forEach(c=>{const d=TripWeather.row(data.daily,c.date);c.body.replaceChildren();if(!d){c.body.textContent='服务暂未提供这一天的数据';return;}count++;
    const range=document.createElement('small');range.className='forecast-range';range.textContent=TripWeather.distance(c.date,today)>7?'远期 · 变化较大':'临近预报';c.body.append(range);
    for(const text of [TripWeather.condition(d.weather_code),`${TripWeather.value(d.temperature_2m_min,'')}～${TripWeather.value(d.temperature_2m_max,'')}℃`,`降水概率 ${TripWeather.value(d.precipitation_probability_max,'%')}`,`预计新降雪 ${TripWeather.value(d.snowfall_sum,'cm')}`]){const line=document.createElement('span');line.textContent=text;c.body.append(line);}
   });
   status.textContent=`${name} · 已获取 ${count} 天 · 获取时间 ${new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}（日本时间）`;
  }catch(e){if(active!==controller)return;pending.forEach(c=>c.body.textContent='暂时无法获取，请联网后重试');status.textContent='天气服务连接失败，未显示旧预报。';}
  finally{clearTimeout(timeout);if(active===controller){button.disabled=false;lastFetch=Date.now();}}
 }
 button.addEventListener('click',refresh);select.addEventListener('change',refresh);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastFetch>3600000)refresh();});
 setInterval(()=>{if(!document.hidden&&Date.now()-lastFetch>3600000)refresh();},60000);
 refresh();
})();
