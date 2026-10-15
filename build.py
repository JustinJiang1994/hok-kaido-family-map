"""Build the standalone HTML with Python's standard library only."""
import argparse
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
    target = Path(output) if output else ROOT / 'dist' / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding='utf-8')
    print(f'Built {target}')
    return target

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', help='Optional standalone HTML output path')
    build(parser.parse_args().output)
