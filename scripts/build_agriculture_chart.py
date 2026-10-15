"""Reproducible, proportional chart from the official 2024 agriculture figures."""
from pathlib import Path
import json,html
ROOT=Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'content/agriculture-comparison.json').read_text())
def text(x,y,s,size=28,color='#193e42',weight=500):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}">{html.escape(s)}</text>'
svg='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="720" viewBox="0 0 640 720" role="img"><title>2024年北海道与日本其他地区的农业对比</title><rect width="640" height="720" rx="20" fill="#f0f5ef"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif">'
svg+=text(28,48,'北海道的农业，占日本多少？',32,weight=750)+text(28,87,'2024年 · 每条完整色带＝日本全国100%',23)
svg+='<rect x="28" y="113" width="18" height="18" rx="4" fill="#236e67"/>'+text(55,130,'北海道',23)+'<rect x="180" y="113" width="18" height="18" rx="4" fill="#c8d5e4"/>'+text(207,130,'其余46个都府县合计',23)
for y,row in zip([185,410],d['metrics']):
 pct=row['hokkaidoPercent'];other=round(100-pct,1)
 svg+=text(28,y,row['label'],30,weight=700)+text(28,y+42,'北海道 '+row['hokkaidoValue'],26)
 svg+=f'<rect x="28" y="{y+64}" width="584" height="40" rx="6" fill="#c8d5e4"/><rect x="28" y="{y+64}" width="{584*pct/100}" height="40" fill="#236e67"/>'
 svg+=text(28,y+145,f'北海道 {pct:.1f}%',30,'#236e67',750)+text(300,y+145,f'其他地区 {other:.1f}%',27)
 svg+=text(28,y+185,row['takeaway'],25)
svg+=text(28,650,'两项指标分别比较，不代表土地生产效率。',23)+text(28,684,'来源：北海道政府《数据册2026·农业》',20)+text(28,710,'其他地区占比＝100%－北海道占比（按公布数计算）',18)+'</g></svg>'
(ROOT/'src/assets/intro/agriculture-comparison.svg').write_text(svg)
print('Built agriculture comparison chart')
