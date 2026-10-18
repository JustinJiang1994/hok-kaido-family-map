"""Verify every referenced photograph has local responsive assets."""
import hashlib,json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'content/image-assets.json').read_text())
media=(root/'src/media.js').read_text();media=json.loads(media[media.index('{'):].strip().rstrip(';'))
urls={p['src'] for v in media.values() for p in v.get('photos',[])}
urls.update(re.findall(r'"src":\s*"(https[^\"]+)"',(root/'content/hokkaido.json').read_text()))
assert urls==m.keys(),urls-m.keys()
for url,a in m.items():
 for v in a['variants']:
  data=(root/'src'/v['src']).read_bytes()
  assert len(data)==v['bytes'] and v['width']<=1200
  assert hashlib.sha256(data).hexdigest().startswith(Path(v['src']).stem)
  assert data[:4]==b'RIFF' and data[8:12]==b'WEBP'
  assert (root/'dist'/v['src']).is_file()
html=(root/'dist/index.html').read_text()
assert not re.search(r'<img\b[^>]*\bsrc="https://',html)
assert 'id="locate"' not in html and 'id="clearLocation"' not in html
assert "watchPosition" in html
print(f'Checked {len(m)} photographs, hashes, WebP files, local paths, and automatic location build')
