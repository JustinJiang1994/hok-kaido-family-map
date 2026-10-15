"""Generate topic covers and independent reading templates from sourced content."""
from pathlib import Path
import json, html
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'content/hokkaido.json').read_text())
e=html.escape
cards=[];templates=[]
for c in DATA['cards']:
 im=c['image'];key=c['id'];name=c['kicker'].split('/ ')[-1]
 picture=f'<img src="{e(im["src"])}" alt="{e(im["caption"])}" width="{im["width"]}" height="{im["height"]}" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
 cards.append(f'<button class="reading-cover" data-topic="{key}" aria-haspopup="dialog"><span class="cover-picture">{picture}<span class="cover-name">{name}</span></span><span class="cover-copy"><strong>{e(c["summary"])}</strong><span>{len(c["sections"])} 个章节 · 点击阅读 →</span></span></button>')
 chapters=''
 for section in c['sections']:
  chunk='<section class="reading-chapter"><h3>'+e(section['title'])+'</h3>'
  if section.get('image'):
   q=section['image']
   chunk+=f'<figure class="region-photo"><img src="{e(q["src"])}" alt="{e(q["caption"])}" width="{q["width"]}" height="{q["height"]}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><figcaption>{e(q["caption"])}<small>图片：{e(q["credit"])}</small></figcaption></figure>'
   chunk+='<div class="region-position"><strong>在北海道的位置</strong><p>'+e(section['position'])+'</p><strong>区域特色 · '+e(section['role'])+'</strong></div>'
  chunk+=''.join('<p>'+e(p)+'</p>' for p in section['paragraphs'])
  if section.get('spots'):
   chunk+='<h4>有哪些特色景点？</h4><dl class="region-spots">'+''.join('<div><dt>'+e(name)+'</dt><dd>'+e(desc)+'</dd></div>' for name,desc in section['spots'])+'</dl><p class="region-trip">'+e(section['trip'])+'</p>'
  chapters+=chunk+'</section>'
 sources='；'.join(s[0] for s in c['sources'])
 templates.append(f'<template id="reading-{key}" data-title="{e(c["title"])}"><figure class="reading-hero">{picture}<figcaption>{e(im["caption"])}<small>图片：{e(im["credit"])}</small></figcaption></figure><div class="reading-copy"><p class="reading-lead">{e(c["summary"])}</p>{chapters}<aside>{e(c["note"])}</aside><p class="reading-source">资料：{e(sources)}。核对：{DATA["checkedOn"]}。</p><button class="reading-back-bottom">返回主题</button></div></template>')
article='<article id="hokkaidoIntro" hidden><div class="intro-opening"><p class="intro-eyebrow">北海道读本 / HOKKAIDO</p><h2>想先了解哪一面？</h2><p>点开感兴趣的封面，慢慢读。每个主题都可以单独看。</p></div><div class="reading-covers">'+''.join(cards)+'</div>'+''.join(templates)+'</article>'
p=ROOT/'src/index.html';s=p.read_text();a=s.index('<article id="hokkaidoIntro"');b=s.index('</article>',a)+len('</article>');s=s[:a]+article+s[b:]
if '<script src="intro.js"></script>' not in s:s=s.replace('</body>','<script src="intro.js"></script></body>')
p.write_text(s)
print('Generated seven topic covers and chaptered readers')
