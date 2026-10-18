"""Add a photo-only cache location to this site's existing TLS configuration."""
from pathlib import Path
import subprocess,time
p=Path('/etc/nginx/conf.d/hokkaido-family-map.conf')
old=p.read_text()
block='''    location ^~ /hokkaido/assets/photos/ {
        alias /srv/hokkaido-family-map/dist/assets/photos/;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
'''
if block in old:
 print('Photo cache already configured')
else:
 anchor='    location = /hokkaido/ {'
 if old.count(anchor)!=1 or 'location ^~ /hokkaido/assets/photos/' in old:
  raise SystemExit('Unexpected site configuration; review before changing')
 backup=Path('/etc/nginx/hokkaido.before-photo-cache-'+str(time.time_ns())+'.backup')
 backup.write_text(old)
 try:
  p.write_text(old.replace(anchor,block+anchor,1))
  subprocess.run(['nginx','-t'],check=True)
  subprocess.run(['systemctl','reload','nginx'],check=True)
 except Exception:
  p.write_text(old)
  subprocess.run(['nginx','-t'],check=True)
  subprocess.run(['systemctl','reload','nginx'],check=True)
  raise
 print('Photo cache enabled; backup:',backup)
