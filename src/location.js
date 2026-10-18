'use strict';
const Nearby={
 radius:5000,
 distance(a,b){const rad=Math.PI/180,dlat=(b.lat-a.lat)*rad,dlon=(b.lon-a.lon)*rad;const h=Math.sin(dlat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dlon/2)**2;return 6371000*2*Math.asin(Math.sqrt(Math.min(1,h)));},
 format(m){return m<1000?Math.max(10,Math.round(m/10)*10)+'米':(m/1000).toFixed(1)+'公里';},
 valid(c){return c&&Number.isFinite(c.latitude)&&Math.abs(c.latitude)<=90&&Number.isFinite(c.longitude)&&Math.abs(c.longitude)<=180&&Number.isFinite(c.accuracy)&&c.accuracy>=0;},
 error(code){return ({1:'未获得定位权限，可在微信或浏览器的权限设置中允许定位后重试。',2:'暂时无法确定位置，请到信号较好的地方重试。',3:'定位超时，请重试；也可继续手动查看地图。'})[code]||'定位暂不可用，请重试或手动查看地图。';}
};
