"""Build the standalone HTML with Python's standard library only."""
import argparse
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def build(output=None):
    source = ROOT / 'src'
    html = (source / 'index.html').read_text(encoding='utf-8')
    for name in ['vendor/leaflet.css', 'style.css']:
        html = html.replace(f'<link rel="stylesheet" href="{name}">',
                            '<style>' + (source / name).read_text(encoding='utf-8') + '</style>')
    for name in ['vendor/leaflet.js', 'data.js', 'media.js', 'outline.js', 'app.js']:
        html = html.replace(f'<script src="{name}"></script>',
                            '<script>\n' + (source / name).read_text(encoding='utf-8') + '\n</script>')
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
