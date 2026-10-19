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
    # Inline comparison charts so individual bars can animate without moving labels.
    def inline_chart(match):
        rel=match.group(1)
        svg=(source/rel).read_text(encoding='utf-8')
        def bar(m):
            tag=m.group(0)
            height=re.search(r'height="([0-9.]+)"',tag)
            if height and float(height.group(1))<=80 and ' x="' in tag:
                return tag.replace('<rect ', '<rect class="chart-bar" ',1)
            return tag
        svg=re.sub(r'<rect\b[^>]*>',bar,svg)
        return re.sub(r' role="[^"]*"','',svg,count=1).replace('<svg ', '<svg class="animated-data-chart" role="img" ',1)
    chart_names='(?:population-(?:age|density|total)|agriculture-(?:area|value)|fishery-(?:quantity|value))'
    html=re.sub(r'<img\b[^>]*src="(assets/intro/'+chart_names+r'\.svg)"[^>]*>',inline_chart,html)
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
