#!/usr/bin/env bash
# Download every source file for the 120th Congress district data into $WORK (default: work/)
# and check it against ../sources.json.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${WORK:-$HERE/work}"
mkdir -p "$WORK"/{bef,pl,geo,hex}
cd "$WORK"

python - "$HERE/sources.json" <<'EOF'
import hashlib, json, os, sys, urllib.request, zipfile
sources = json.load(open(sys.argv[1]))
for entry in sources["files"]:
    path = entry["path"]
    if not os.path.exists(path):
        print("downloading", entry["url"], flush=True)
        req = urllib.request.Request(entry["url"], headers={"User-Agent": "PolicyEngine data build"})
        with urllib.request.urlopen(req, timeout=900) as r, open(path, "wb") as f:
            while chunk := r.read(1 << 20):
                f.write(chunk)
    if "contents" in entry:
        # Census republishes shapefile zips with new timestamps and the same files inside,
        # so these entries pin the files inside the zip.
        with zipfile.ZipFile(path) as zf:
            for member, want in entry["contents"].items():
                digest = hashlib.sha256(zf.read(member)).hexdigest()
                if digest != want:
                    sys.exit(f"{path}: {member} SHA-256 {digest} does not match {want}")
    else:
        digest = hashlib.sha256(open(path, "rb").read()).hexdigest()
        if digest != entry["sha256"]:
            sys.exit(f"{path}: SHA-256 {digest} does not match {entry['sha256']}")
print(f"{len(sources['files'])} source files present and verified")
EOF

for z in geo/*.zip; do unzip -o -q "$z" -d "${z%.zip}"; done
unzip -o -q bef/cd120.zip NationalCD120.txt -d bef
unzip -o -q bef/cd119.zip NationalCD119.txt -d bef
unzip -o -q hex/hexcd_v32.zip -d hex
unzip -o -q geo/2020_Gaz_tracts_national.zip -d geo
