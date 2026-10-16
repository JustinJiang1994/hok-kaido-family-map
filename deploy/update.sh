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
git merge --ff-only "$revision"
cp dist/index.html "dist/index.html.backup-$previous"
install -m 644 "$release/dist/index.html" dist/index.html.next
mv dist/index.html.next dist/index.html
printf 'Published %s\n' "$revision"
