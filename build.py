"""Build the standalone HTML with Python's standard library only."""
import argparse
import base64
import re
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def build(output=None):
    source = ROOT / 'src'
    html = (source / 'index.html').read_text(encoding='utf-8')
    for name in ['vendor/leaflet.css', 'style.css']:
        html = html.replace(f'<link rel="stylesheet" href="{name}">',
                            '<style>' + (source / name).read_text(encoding='utf-8') + '</style>')
    for name in ['vendor/leaflet.js', 'data.js', 'media.js', 'outline.js', 'location.js', 'images.js', 'app.js', 'intro.js', 'journey-photos.js', 'weather.js']:
        html = html.replace(f'<script src="{name}"></script>',
                            '<script>\n' + (source / name).read_text(encoding='utf-8') + '\n</script>')
    manifest=json.loads((ROOT/'content/image-assets.json').read_text())
    target = Path(output) if output else ROOT / 'dist' / 'index.html'
    asset_dir='hokkaido-assets/photos' if output else 'assets/photos'
    manifest=json.loads(json.dumps(manifest).replace('assets/photos/',asset_dir+'/'))
    html=html.replace('// Versioned same-origin photos.', 'const IMAGE_ASSETS='+json.dumps(manifest,ensure_ascii=False)+';\n// Versioned same-origin photos.',1)
    def responsive(match):
        tag=match.group(0)
        found=re.search(r'src="(https://[^" ]+)"',tag)
        if not found or found.group(1).replace('&amp;','&') not in manifest:return tag
        asset=manifest[found.group(1).replace('&amp;','&')];variants=asset['variants']
        tag=tag.replace(found.group(0),'src="'+asset['placeholder']+'" data-photo-src="'+variants[-1]['src']+'" data-photo-srcset="'+', '.join(v['src']+' '+str(v['width'])+'w' for v in variants)+'" sizes="(max-width:600px) calc(100vw - 40px), 800px" class="progressive-photo"')
        return tag
    html=re.sub(r'<img\b[^>]*>',responsive,html)
    dest=target.parent/asset_dir
    dest.mkdir(parents=True,exist_ok=True)
    for file in (source/'assets/photos').glob('*.webp'):shutil.copy2(file,dest/file.name)
    # Embed local topic images so the delivered HTML remains a single file.
    def embed(match):
        asset = (source / match.group(1)).resolve()
        if not asset.is_relative_to(source.resolve()):
            raise ValueError('Asset must remain inside src')
        return 'src="data:image/svg+xml;base64,' + base64.b64encode(asset.read_bytes()).decode('ascii') + '"'
    html = re.sub(r'src="(assets/intro/[^"\s]+\.svg)"', embed, html)
    target = Path(output) if output else ROOT / 'dist' / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding='utf-8')
    print(f'Built {target}')
    return target

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', help='Optional standalone HTML output path')
    build(parser.parse_args().output)
