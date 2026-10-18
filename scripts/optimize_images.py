"""Create versioned responsive images from the project's existing photo sources.
Run with Pillow installed; normal production builds need only the stdlib.
Original URLs and attribution remain in src/media.js and content/hokkaido.json.
"""
import base64, concurrent.futures, hashlib, io, json, os, time, urllib.request, urllib.parse
from pathlib import Path
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/assets/photos'; OUT.mkdir(parents=True,exist_ok=True)
CACHE=Path('/tmp/hokkaido-original-photos'); CACHE.mkdir(exist_ok=True)
s=(ROOT/'src/media.js').read_text(); media=json.loads(s[s.index('{'):].strip().rstrip(';'))
urls={p['src'] for v in media.values() for p in v.get('photos',[])}
def collect(o):
 if isinstance(o,dict):
  if isinstance(o.get('src'),str) and o['src'].startswith('https://'): urls.add(o['src'])
  for v in o.values(): collect(v)
 elif isinstance(o,list):
  for v in o: collect(v)
collect(json.loads((ROOT/'content/hokkaido.json').read_text()))
def convert(url):
 key=hashlib.sha256(url.encode()).hexdigest()[:16]; cache=CACHE/key
 start=time.monotonic()
 if cache.exists(): raw=cache.read_bytes()
 else:
  req=urllib.request.Request(urllib.parse.quote(url,safe=':/?=&%'),headers={'User-Agent':'Mozilla/5.0'})
  with urllib.request.urlopen(req,timeout=45) as r: raw=r.read(20*1024*1024)
  cache.write_bytes(raw)
 im=ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
 im=im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
 variants=[]
 for width in sorted(set([min(640,im.width),min(1200,im.width)])):
  thumb=im.copy();thumb.thumbnail((width,10000),Image.Resampling.LANCZOS)
  buf=io.BytesIO();thumb.save(buf,'WEBP',quality=82,method=6)
  rawout=buf.getvalue();name=hashlib.sha256(rawout).hexdigest()[:20]+'.webp';(OUT/name).write_bytes(rawout)
  variants.append({'src':'assets/photos/'+name,'width':thumb.width,'height':thumb.height,'bytes':len(rawout)})
 tiny=im.copy();tiny.thumbnail((24,24),Image.Resampling.LANCZOS);buf=io.BytesIO();tiny.save(buf,'WEBP',quality=35)
 return url,{'variants':variants,'placeholder':'data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode(),'originalBytes':len(raw),'originalWidth':im.width,'originalHeight':im.height,'fetchSeconds':round(time.monotonic()-start,2)}
result={};errors={}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 futures={pool.submit(convert,u):u for u in sorted(urls)}
 for f in concurrent.futures.as_completed(futures):
  u=futures[f]
  try:
   k,v=f.result();result[k]=v;print('OK',len(result),u,flush=True)
  except Exception as e:errors[u]=str(e);print('FAILED',u,str(e),flush=True)
(ROOT/'content/image-assets.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(ROOT/'research/image-optimization-report.json').write_text(json.dumps({'images':len(result),'errors':errors,'originalBytes':sum(v['originalBytes'] for v in result.values()),'mobileBytes':sum(v['variants'][0]['bytes'] for v in result.values())},indent=2)+'\n')
print('DONE',len(result),'errors',len(errors))
