"""Regional agriculture comparisons, with consistent denominators and source data."""
from pathlib import Path
import json,html
ROOT=Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'content/agriculture-comparison.json').read_text())
def text(x,y,s,size=26,color='#193e42',weight=500):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}">{html.escape(s)}</text>'
for m in d['metrics']:
 rows=m['rows'];rest=m['total']-sum(v for _,v in rows);unit=m['displayUnit'];div=m['divisor'];height=1000
 fmt=lambda v:f'{v/div:,.2f}' if div!=1 else f'{v:,}'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="{height}" viewBox="0 0 640 {height}" role="img"><title>2024年{m["label"]}前五地区比较</title><rect width="640" height="{height}" rx="20" fill="#f0f5ef"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif">'
 svg+=text(28,50,m['label']+'：主要地区逐一比较',31,weight=750)+text(28,92,m['scope'],23)
 svg+=text(28,133,('全国耕地合计 ' if m['id']=='area' else '47个都道府县合计 ')+fmt(m['total'])+' '+unit,26,weight=700)
 svg+=text(28,174,'地区与数值                         全国占比',23)
 maxval=max(rest,max(v for _,v in rows))
 for n,(name,v) in enumerate(rows+[['其余42个都府县',rest]]):
  y=222+n*92;color='#236e67' if n==0 else '#617b99' if n<5 else '#b6c2ce'
  svg+=text(28,y,name,27,weight=700)+text(325,y,fmt(v)+' '+unit,25)
  svg+=f'<rect x="28" y="{y+17}" width="{440*v/maxval:.3f}" height="28" rx="4" fill="{color}"/>'+text(490,y+40,f'{v/m["total"]*100:.1f}%',27,weight=700)
 lines= ['具名地区为全国前五位。','其余42个都府县包括秋田、福岛、千叶等。','同一图中柱长按数值同比例绘制。'] if m['id']=='area' else ['具名地区为全国前五位。','其余42个都府县包括熊本、宫崎、新潟等。','占比以47地合计为分母，不是全国独立推计。']
 for n,line in enumerate(lines):svg+=text(28,820+n*32,line,22)
 svg+=text(28,940,'来源：农林水产省2024年'+m['label']+'统计',20)+text(28,974,'占比按公布值计算并四舍五入；面积不等于产值。',19)+'</g></svg>'
 (ROOT/'src/assets/intro'/('agriculture-'+m['id']+'.svg')).write_text(svg)
print('Built 2 regional agriculture charts')
