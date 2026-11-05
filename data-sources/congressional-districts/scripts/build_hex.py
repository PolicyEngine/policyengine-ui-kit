"""120th Congress hex map, written to src/visualization/data/congressionalDistrictsHex120.json.

Starts from the 119th hex file (The Downballot hexmap v3.1, via PolicyEngine/snap-district-map)
and replaces the shapes of the seven states The Downballot moved in hexmap v3.2 (2026):
CA, FL, NC, OH, TN, TX and UT. Its notes say Alabama, Louisiana and Missouri were not changed,
and DC (from the delegate-district layer) is unchanged too. Properties keep the 119th file's schema.

The Downballot's hexmap is CC BY 4.0: credit "The Downballot" wherever it is shown.
"""

import json
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.environ.get("WORK", os.path.join(HERE, "..", "work"))
DATA = os.path.join(HERE, "..", "..", "..", "src", "visualization", "data")
MOVED_IN_V32 = {"CA", "FL", "NC", "OH", "TN", "TX", "UT"}


def posix(path):
    # mapshaper rejects Windows separators when it names layers
    return os.path.abspath(path).replace("\\", "/")


v32_path = posix(os.path.join(WORK, "hex", "HexCDv32.geojson"))
subprocess.run(
    f'npx --yes mapshaper@0.7.101 -i "{posix(os.path.join(WORK, "hex", "HexCDv32", "HexCDv32.shp"))}" name=hexcd '
    f'-o "{v32_path}" format=geojson precision=0.000001',
    shell=True, check=True,
)
v32 = {f["properties"]["GEOID"]: f for f in json.load(open(v32_path))["features"]}
current = json.load(open(os.path.join(DATA, "congressionalDistrictsHex.json")))

replaced = 0
for feature in current["features"]:
    props = feature["properties"]
    if props["STATEAB"] in MOVED_IN_V32:
        new = v32[props["GEOID"]]
        assert new["properties"]["CDLABEL"] == props["CDLABEL"], props["GEOID"]
        feature["geometry"] = new["geometry"]
        replaced += 1

assert len(current["features"]) == 436
json.dump(current, open(os.path.join(DATA, "congressionalDistrictsHex120.json"), "w"), separators=(",", ":"))
print(f"replaced {replaced} hexes in {', '.join(sorted(MOVED_IN_V32))}")
