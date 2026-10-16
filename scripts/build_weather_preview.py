"""Generate an isolated, visibly labelled weather simulation; never a release build."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
fixture=r'''<script>
(() => {
 const RealDate=Date;let clock=RealDate.parse('2026-12-16T01:00:00Z');
 window.Date=class extends RealDate {constructor(...a){super(...(a.length?a:[clock]));}static now(){return clock;}};
 const original=window.fetch.bind(window);
 window.fetch=async (url,options={})=>{
  if(!String(url).startsWith('https://api.open-meteo.com/v1/forecast?'))return original(url,options);
  clock+=60000;
  const u=new URL(url),lat=Number(u.searchParams.get('latitude'));
  const region=lat===43.0618?'札幌':lat===43.7706?'旭川':lat===43.5883?'美瑛':'新千岁机场';
  const testMode=document.querySelector('#testMode')?.value||'normal';
  const record={region,lat,lon:Number(u.searchParams.get('longitude')),cache:options.cache,time:new Date().toISOString(),mode:testMode};
  const log=document.querySelector('#testLog');if(log)log.textContent=JSON.stringify(record);
  if(testMode==='failure')throw Error('SIMULATED NETWORK FAILURE');
  // Deliberately ignore abort in this mode to test protection against late responses.
  if(testMode==='race'&&region==='札幌')await new Promise(r=>setTimeout(r,3000));
  const low=region==='札幌'?-4:region==='旭川'?-11:region==='美瑛'?-14:-6;
  const code=region==='札幌'?3:region==='旭川'?71:73;
  const daily={time:[],weather_code:[],temperature_2m_min:[],temperature_2m_max:[],precipitation_probability_max:[],snowfall_sum:[]};
  for(let i=0;i<6;i++){daily.time.push('2026-12-'+(17+i));daily.weather_code.push(i===1?0:i===2?2:i===3?61:code);daily.temperature_2m_min.push(low-i);daily.temperature_2m_max.push(low+5-i);daily.precipitation_probability_max.push(20+i*10);daily.snowfall_sum.push(i);}
  if(testMode==='missing'){for(const k in daily)daily[k].pop();daily.temperature_2m_min[0]=null;}
  return {ok:true,json:async()=>({daily,timezone:'Asia/Tokyo'})};
 };
})();
</script>'''
controls='''<details id="weatherTestBanner" style="padding:16px;background:#7c153a;color:white;font-size:17px;line-height:1.6"><summary>模拟预报测试设置</summary><strong>仅测试 · 模拟日期2026年12月16日</strong><br>天气数值全部为虚构，不是实际预报。每次请求模拟时间推进1分钟。<label>测试场景 <select id="testMode"><option value="normal">正常预报</option><option value="missing">缺失日期和温度</option><option value="failure">网络失败</option><option value="race">札幌慢响应（3秒）</option></select></label><output id="testLog" style="display:block;overflow-wrap:anywhere;font-size:12px"></output></details>'''
page=(ROOT/'dist/index.html').read_text().replace('</head>',fixture+'</head>').replace('<article id="hokkaidoIntro"',controls+'<article id="hokkaidoIntro"')
# Persistent watermark makes every screenshot unambiguously simulated.
page=page.replace('</body>','<div style="position:fixed;bottom:0;left:0;right:0;background:#7c153a;color:white;text-align:center;font-size:15px;padding:6px;z-index:99999;pointer-events:none">模拟预报测试 · 非真实天气</div></body>')
p=ROOT/'local-archive/weather-preview/index.html';p.parent.mkdir(parents=True,exist_ok=True);p.write_text(page)
print(p)
