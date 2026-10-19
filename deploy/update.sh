#!/usr/bin/env bash
# Run on the server; optionally pass a verified, uploaded Git bundle path.
set -euo pipefail
cd /srv/hokkaido-family-map
test -z "$(git status --porcelain)"
git fetch "${1:-origin}" main
revision=$(git rev-parse FETCH_HEAD)
release="/srv/hokkaido-releases/$revision"
mkdir -p "$release"
git archive "$revision" | tar -x -C "$release"
python3 "$release/build.py"
test -s "$release/dist/index.html"
previous=$(git rev-parse HEAD)
cp dist/index.html "dist/index.html.backup-$previous"
# Content-hashed filenames allow old and new HTML to share this directory safely.
mkdir -p dist/assets/photos
cp -n "$release"/dist/assets/photos/*.webp dist/assets/photos/
if [ -d "$release/dist/assets/vendor" ]; then
  mkdir -p dist/assets/vendor
  cp -R "$release/dist/assets/vendor/." dist/assets/vendor/
fi
python3 "$release/deploy/enable-photo-cache.py"
git merge --ff-only "$revision"
install -m 644 "$release/dist/index.html" dist/index.html.next
mv dist/index.html.next dist/index.html
printf 'Published %s\n' "$revision"
