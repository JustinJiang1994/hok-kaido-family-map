"""Build readable, proportional SVGs; sources and years travel with every chart."""
from pathlib import Path
from html import escape
ROOT=Path(__file__).resolve().parents[1]
def t(x,y,s,size=26,color='#193e42',weight=500):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}">{escape(s)}</text>'
def start(title,h):return f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="{h}" viewBox="0 0 640 {h}"><title>{escape(title)}</title><rect width="640" height="{h}" rx="18" fill="#eff5f0"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif">'+t(28,50,title,32,weight=750)
def bar(y,width,color):return f'<rect x="28" y="{y}" width="{width}" height="38" rx="5" fill="{color}"/>'
def save(name,s):(ROOT/'src/assets/intro'/f'{name}.svg').write_text(s+'</g></svg>')
s=start('同样1平方公里，住多少人？',510)+t(28,94,'2020年人口密度 · 相同刻度比较',24)
for y,label,value,color in [(150,'北海道',67,'#236e67'),(285,'日本全国（含北海道）',338,'#9a532e')]:
 s+=t(28,y,label,27,weight=700)+t(28,y+38,f'{value} 人 / 平方公里',30,color,700)+bar(y+58,584*value/338,color)
s+=t(28,430,'全国平均约为北海道的5倍。',26)+t(28,468,'来源：北海道政府《数据册2026·人口》',20)+t(28,495,'采用官方密度值，不据行政总面积重新计算。',20);save('population-density',s)
s=start('把居民想成100个人',560)+t(28,94,'2020年 · 北海道年龄构成',24)
for y,label,value,color in [(150,'15岁以下',10.8,'#c07336'),(270,'15—64岁',57.0,'#236e67'),(390,'65岁及以上',32.2,'#67528c')]:
 s+=t(28,y,label,28,weight=650)+t(415,y,f'{value:.1f}%',32,color,750)+bar(y+20,584,'#dce5de')+bar(y+20,584*value/100,color)
s+=t(28,498,'每条浅色底带都表示全部人口100%。',23)+t(28,538,'来源：2020年国势调查／北海道政府数据册',20);save('population-age',s)
s=start('日本的海产，北海道占多少？',650)+t(28,94,'2024年 · 海面渔业及养殖业（属地统计）',23)
for y,label,value,pct in [(155,'产量','111万吨',30.9),(355,'产值','2,856亿日元',19.3)]:
 s+=t(28,y,label+' · 北海道'+value,29,weight=700)+bar(y+30,584,'#c8d5e4')+bar(y+30,584*pct/100,'#236e67')+t(28,y+112,f'北海道 {pct:.1f}%',29,'#236e67',750)+t(310,y+112,f'其他地区 {100-pct:.1f}%',27)+t(28,y+156,'整条色带＝日本全国100%',23)
s+=t(28,565,'重量与金额分别比较，不等同于利润。',24)+t(28,606,'来源：北海道政府《数据册2026·水产业》',20)+t(28,636,'其他地区＝全国占比100%减去北海道占比',20);save('fishery-comparison',s)
rows=[('1869','北海道命名；设立开拓使'),('1876—1888','农学校、铁路与红砖厅舍'),('1950','首届札幌雪祭'),('1971—1972','地铁开业；札幌冬奥会'),('1988','青函隧道通车；新千岁机场开港'),('2005','知床列入世界自然遗产'),('2016','北海道新干线首段开业'),('2020','Upopoy开放'),('2021','绳文遗址群列入世界文化遗产')]
s=start('从近代转折，走到今天',1070)+t(28,93,'城市 · 交通 · 自然保护 · 文化传承',24)+'<path d="M46 138V968" stroke="#b8d2c8" stroke-width="5"/>'
for n,(year,label) in enumerate(rows):
 y=145+n*98;s+=f'<circle cx="46" cy="{y}" r="9" fill="#ca6537"/>'+t(72,y+8,year,29,'#9a532e',750)+t(72,y+47,label,25)
s+=t(28,1030,'来源：北海道政府《数据册2026·历史年表》',20)+t(28,1058,'近代之前的文化与历史，见正文第一章。',20);save('history-timeline',s)
print('Built 4 reading charts')
