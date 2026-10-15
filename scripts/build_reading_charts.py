"""Build readable, proportional SVGs; sources and years travel with every chart."""
from pathlib import Path
from html import escape
ROOT=Path(__file__).resolve().parents[1]
def t(x,y,s,size=26,color='#193e42',weight=500):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}">{escape(s)}</text>'
def start(title,h):return f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="{h}" viewBox="0 0 640 {h}"><title>{escape(title)}</title><rect width="640" height="{h}" rx="18" fill="#eff5f0"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif">'+t(28,50,title,32,weight=750)
def bar(y,width,color):return f'<rect x="28" y="{y}" width="{width}" height="38" rx="5" fill="{color}"/>'
def save(name,s):(ROOT/'src/assets/intro'/f'{name}.svg').write_text(s+'</g></svg>')
# Keep populations, areas and densities from the same 2020 census table.
import json
population=json.loads((ROOT/'content/population-comparison.json').read_text())
for metric in ['total','density']:
 density=metric=='density';height=1120
 s=start('同样1平方公里，住多少人？' if density else '人口相近，土地有多不同？',height)
 s+=t(28,94,'2020年10月1日 · 都道府县比较',24)
 s+=t(28,137,'东京约为北海道的96倍密度' if density else '北海道522万人，福冈514万人',28,weight=700)
 s+=t(28,173,'大阪约为北海道的70倍密度' if density else '北海道表列面积约为福冈的17倍',25)
 maximum=max(row[3 if density else 1] for row in population['rows'])
 for n,(name,count,area,people_per_km) in enumerate(population['rows']):
  y=231+n*125;value=people_per_km if density else count
  color='#236e67' if n==0 else '#617b99'
  s+=t(28,y,name,29,weight=750)
  s+=t(258,y,f'{people_per_km:,.1f} 人/km²' if density else f'{count/10000:,.2f} 万人',28,color,700)
  s+=bar(y+17,584*value/maximum,color)
  s+=t(28,y+83,f'约为北海道的 {people_per_km/66.6:.1f} 倍密度' if density else f'人口 {count:,} 人 · 面积 {area:,.2f} km²',21)
 lines=(['各条均从0起，同一线性刻度；不是人口占比。','密度采用官方公布值；北海道计算时扣除','齿舞、色丹、国后、择捉面积。'] if density else ['面积为普查表列参考面积，非可居住面积。','均为整个都道府县，不是市区或都市圈。','人口按万人显示，同时列出原始人数。'])
 for n,line in enumerate(lines):s+=t(28,1010+n*28,line,21)
 s+=t(28,1100,'来源：日本统计局2020年国势调查 表Ⅰ－２－１',20)
 save('population-density' if density else 'population-total',s)
s=start('把居民想成100个人',560)+t(28,94,'2020年 · 北海道年龄构成',24)
for y,label,value,color in [(150,'15岁以下',10.8,'#c07336'),(270,'15—64岁',57.0,'#236e67'),(390,'65岁及以上',32.2,'#67528c')]:
 s+=t(28,y,label,28,weight=650)+t(415,y,f'{value:.1f}%',32,color,750)+bar(y+20,584,'#dce5de')+bar(y+20,584*value/100,color)
s+=t(28,498,'每条浅色底带都表示全部人口100%。',23)+t(28,538,'来源：2020年国势调查／北海道政府数据册',20);save('population-age',s)
# Keep all cross-prefecture figures on the same national statistical basis.
import json
fish=json.loads((ROOT/'content/fishery-comparison.json').read_text())
for key,heading,unit,divisor in [('quantity','海产产量：看看各地有多少','万吨',10000),('value','海产产出额：看看各地有多少','亿日元',100)]:
 metric=fish[key];rows=metric['rows'];total=metric['total']
 rest=total-sum(v for _,v in rows)
 height=285+(len(rows)+1)*92+150
 s=start(heading,height)+t(28,92,'2024年 · 海面捕捞＋养殖 · 全国统一口径',23)
 s+=t(28,133,f'全国合计 {total/divisor:,.2f} {unit}',27,weight=700)
 s+=t(28,172,'逐行标出地区、数值及全国占比',23)
 maxval=max([v for _,v in rows]+[rest])
 for n,(name,value) in enumerate(rows+[['未单列地区合计',rest]]):
  y=222+n*92;col='#236e67' if n==0 else '#617b99' if n<len(rows) else '#b6c2ce'
  s+=t(28,y,name,28,weight=700)+t(320,y,f'{value/divisor:,.2f} {unit}',26)
  s+=f'<rect x="28" y="{y+17}" width="{440*value/maxval:.3f}" height="28" rx="4" fill="{col}"/>'
  s+=t(490,y+40,f'{value/total*100:.1f}%',27,weight=700)
 y=240+(len(rows)+1)*92
 if key=='quantity':
  lines=['展示6个主要地区，非完整排名。','茨城县海面合计保密，归入未单列地区；','其公开的捕捞量为23.19万吨（不含养殖）。']
 else:lines=['具名地区为全国前五位。','未单列地区包括静冈、兵库、高知等。','两图口径相同，产量与金额不能视作利润。']
 for n,line in enumerate(lines):s+=t(28,y+n*30,line,22)
 s+=t(28,height-35,'来源：日本水产厅2024年都道府县统计表3-15',19)+t(28,height-10,'全国减去具名地区＝未单列地区；占比四舍五入。',19)
 save('fishery-'+key,s)
rows=[('1869','北海道命名；设立开拓使'),('1876—1888','农学校、铁路与红砖厅舍'),('1950','首届札幌雪祭'),('1971—1972','地铁开业；札幌冬奥会'),('1988','青函隧道通车；新千岁机场开港'),('2005','知床列入世界自然遗产'),('2016','北海道新干线首段开业'),('2020','Upopoy开放'),('2021','绳文遗址群列入世界文化遗产')]
s=start('从近代转折，走到今天',1070)+t(28,93,'城市 · 交通 · 自然保护 · 文化传承',24)+'<path d="M46 138V968" stroke="#b8d2c8" stroke-width="5"/>'
for n,(year,label) in enumerate(rows):
 y=145+n*98;s+=f'<circle cx="46" cy="{y}" r="9" fill="#ca6537"/>'+t(72,y+8,year,29,'#9a532e',750)+t(72,y+47,label,25)
s+=t(28,1030,'来源：北海道政府《数据册2026·历史年表》',20)+t(28,1058,'近代之前的文化与历史，见正文第一章。',20);save('history-timeline',s)
print('Built 6 reading charts')
