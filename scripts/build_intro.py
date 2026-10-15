"""Generate editable SVG topic cards and the homepage article from sourced content."""
from pathlib import Path
import json, html
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'content/hokkaido.json').read_text())
def text(x,y,value,size=30,fill='#193e42',weight=500):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}">{html.escape(value)}</text>'
def graphic(c):
 color=c['color'];v=c['visual'];out=''
 if v=='map':
  raw=(ROOT/'src/outline.js').read_text().split('const HOKKAIDO_OUTLINE=')[1].rstrip(';\n');coords=json.loads(raw)
  pts=' '.join(f'{40+(lon-139.7)*36:.1f},{330-(lat-41.4)*42:.1f}' for lat,lon in coords)
  out=f'<polygon points="{pts}" fill="#bad8cb" stroke="{color}" stroke-width="3"/>'
  for y,label in zip([200,265,330],c['labels']):out+=text(325,y,label,30,color,650)
 elif v=='timeline':
  out=f'<path d="M70 180V350" stroke="{color}" stroke-width="5"/>'
  for y,label in zip([190,265,340],c['labels']):out+=f'<circle cx="70" cy="{y-10}" r="10" fill="{color}"/>'+text(110,y,label,32,color,650)
 elif v=='population':
  out=text(36,220,'522.46',82,color,750)+text(365,217,'万人',38,color,650)+text(38,263,'2020年人口普查',27,color)
  out+=f'<rect x="38" y="295" width="560" height="24" rx="12" fill="#d4ddc8"/><rect x="38" y="295" width="462" height="24" rx="12" fill="{color}"/>'+text(38,360,'市部人口占比 82.5%',31,color,650)
 elif v=='food':
  out=f'<ellipse cx="145" cy="230" rx="98" ry="31" fill="#efbe73"/><path d="M47 230Q65 330 145 330Q225 330 243 230" fill="{color}"/><ellipse cx="145" cy="230" rx="91" ry="23" fill="#e9b160"/><path d="M82 220Q140 180 209 220M92 237Q147 200 194 239" stroke="#fff4d8" stroke-width="8" fill="none"/><path d="M110 182Q90 160 112 139M161 180Q143 157 164 134" stroke="{color}" stroke-width="5" fill="none" stroke-linecap="round"/>'
  for y,label in zip([200,270,340],c['labels']):out+=text(290,y,label,30,color,650)
 elif v=='landscape':
  out=f'<circle cx="515" cy="170" r="40" fill="#edbd64"/><path d="M20 300L160 140L295 300L395 193L620 320" fill="#709ca1"/><path d="M105 204L160 140L217 208L165 185Z" fill="white"/><path d="M20 307Q170 260 340 310T620 310V385H20Z" fill="#b7dae2"/>'
  out+=text(35,355,'山岳',30,color,700)+text(250,355,'火山湖',30,color,700)+text(470,355,'海岸',30,color,700)
 elif v=='industry':
  out=text(35,225,'26.6%',88,color,750)+text(370,200,'全国耕地',29,color,600)+text(370,240,'面积占比',29,color,600)
  out+=text(38,280,'2024年 · 北海道 / 日本全国',26,color)
  for x,label in [(38,'农牧渔业'),(240,'食品加工'),(443,'餐桌')]:out+=f'<rect x="{x}" y="315" width="160" height="55" rx="12" fill="{color}"/>'+text(x+16,352,label,28,'white',650)
  out+=text(205,352,'→',26,color)+text(409,352,'→',26,color)
 else:
  out=f'<path d="M45 165Q95 140 150 165Q200 140 255 165V315Q200 290 150 315Q95 290 45 315Z" fill="white" stroke="{color}" stroke-width="5"/><path d="M150 165V315M65 200H125M65 228H125M177 200H235M177 228H235" stroke="{color}" stroke-width="4"/>'
  for y,label in zip([200,270,340],c['labels']):out+=text(290,y,label,28,color,650)
 return out
blocks=[]
for c in DATA['cards']:
 title=c['headline'] if c['visual'] not in ['population','industry'] else ('人口与生活' if c['visual']=='population' else '田地背后的产业链')
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420" role="img"><title>{html.escape(c['title'])}</title><rect width="640" height="420" rx="20" fill="{c['bg']}"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif">{text(36,53,c['kicker'],24,c['color'],650)}{text(36,105,title,35,c['color'],750)}{graphic(c)}{text(36,400,'北海道读本 · 原创信息图',18,c['color'])}</g></svg>'''
 (ROOT/f'src/assets/intro/{c["id"]}.svg').write_text(svg)
 blocks.append(f'''<section class="topic-card" id="topic-{c['id']}"><img class="topic-image" src="assets/intro/{c['id']}.svg" alt="{html.escape(c['headline']+'；'+'；'.join(c['labels']))}" width="640" height="420" loading="lazy"><div class="topic-copy"><h3>{html.escape(c['title'])}</h3>{''.join('<p>'+html.escape(p)+'</p>' for p in c['paragraphs'])}<p class="topic-note">{html.escape(c['note'])}</p><p class="topic-source">资料：{html.escape('；'.join(s[0] for s in c['sources']))}。核对：{DATA['checkedOn']}。</p></div></section>''')
article='''<article id="hokkaidoIntro" hidden><div class="intro-opening"><p class="intro-eyebrow">北海道读本 / HOKKAIDO</p><h2>先读懂风景，再出发</h2><p>七张主题信息图，认识这片土地的历史、人和生活。图下有详细说明，慢慢往下看就好。</p><p class="intro-foot">信息图为原创示意，不是景点实拍；人口等数字均标明统计年份。</p></div>'''+''.join(blocks)+'</article>'
p=ROOT/'src/index.html';s=p.read_text();a=s.index('<article id="hokkaidoIntro"');b=s.index('</article>',a)+len('</article>');p.write_text(s[:a]+article+s[b:])
print(f'Generated {len(blocks)} topic images and article sections')
