"""Render one sourced image and explanatory text per homepage topic."""
from pathlib import Path
import json, html
ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'content/hokkaido.json').read_text())
esc = html.escape
blocks = []
for c in DATA['cards']:
    image = c['image']
    figure = f'<figure class="topic-figure"><img class="topic-image" src="{esc(image["src"])}" alt="{esc(image["caption"])}" width="{image["width"]}" height="{image["height"]}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><figcaption>{esc(image["caption"])}<span>图片来源：{esc(image["credit"])}</span></figcaption></figure>'
    if c['id'] == 'geography':
        figure += '<div class="region-key"><span style="--region:#c5627c">道央</span><span style="--region:#b58a20">道南</span><span style="--region:#3487af">道北</span><span style="--region:#398457">道东</span></div>'
    copy = ''.join('<p>' + esc(p) + '</p>' for p in c['paragraphs'])
    sources = '；'.join(s[0] for s in c['sources'])
    blocks.append(f'<section class="topic-card" id="topic-{c["id"]}"><header class="topic-heading"><span>{esc(c["kicker"])}</span><h3>{esc(c["title"])}</h3></header>{figure}<div class="topic-copy">{copy}<p class="topic-note">{esc(c["note"])}</p><p class="topic-source">资料：{esc(sources)}。核对：{DATA["checkedOn"]}。</p></div></section>')
article = '<article id="hokkaidoIntro" hidden><div class="intro-opening"><p class="intro-eyebrow">北海道读本 / HOKKAIDO</p><h2>先读懂风景，再出发</h2><p>从四大分区开始，用图片认识北海道的历史、人和生活。</p></div>' + '\n'.join(blocks) + '</article>'
p = ROOT / 'src/index.html'
s = p.read_text(); a = s.index('<article id="hokkaidoIntro"'); b = s.index('</article>', a) + len('</article>')
p.write_text(s[:a] + article + s[b:])
print(f'Rendered {len(blocks)} illustrated topics')
