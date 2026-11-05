#!/usr/bin/env bash
# 120th Congress district boundaries for web maps, written to
# src/visualization/data/congressionalDistrictsGeo120.json.
#
# - The nine redrawn states (AL CA FL LA NC OH TN TX UT) come from TIGER/Line 2026 cd120,
#   clipped to the shoreline with the 2024 cartographic boundary state outlines (1:500k).
# - All other states, DC and Puerto Rico come from the 2024 cartographic boundary 119th
#   districts (1:500k); the block equivalency files show they are unchanged for the 120th.
# - The combined layer is cleaned and simplified as one topology, so shared borders stay aligned.
#
# Properties match the 119th file's conventions: DISTRICT_ID is "ST-NN", with at-large
# states and DC as "-01" and Puerto Rico as "PR-98".
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${WORK:-$HERE/work}"
OUT="${OUT:-$HERE/../../src/visualization/data/congressionalDistrictsGeo120.json}"
SIMPLIFY="${SIMPLIFY:-2%}"
PRECISION="${PRECISION:-0.0001}"
MAPSHAPER="npx --yes mapshaper@0.7.101"
REDRAWN="['01','06','12','22','37','39','47','48','49']"
G="$WORK/geo"
cd "$G"

$MAPSHAPER \
  -i tl_2026_01_cd120/tl_2026_01_cd120.shp tl_2026_06_cd120/tl_2026_06_cd120.shp tl_2026_12_cd120/tl_2026_12_cd120.shp \
     tl_2026_22_cd120/tl_2026_22_cd120.shp tl_2026_37_cd120/tl_2026_37_cd120.shp tl_2026_39_cd120/tl_2026_39_cd120.shp \
     tl_2026_47_cd120/tl_2026_47_cd120.shp tl_2026_48_cd120/tl_2026_48_cd120.shp tl_2026_49_cd120/tl_2026_49_cd120.shp \
     combine-files \
  -merge-layers name=redrawn \
  -i cb_2024_us_state_500k/cb_2024_us_state_500k.shp name=states \
  -filter "$REDRAWN.includes(STATEFP)" target=states + name=outline \
  -clip outline target=redrawn \
  -filter-fields STATEFP,CD120FP,NAMELSAD target=redrawn \
  -i cb_2024_us_cd119_500k/cb_2024_us_cd119_500k.shp name=unchanged \
  -filter "!$REDRAWN.includes(STATEFP) && (+STATEFP < 60 || STATEFP === '72')" target=unchanged \
  -each 'CD120FP = CD119FP' target=unchanged \
  -filter-fields STATEFP,CD120FP,NAMELSAD target=unchanged \
  -merge-layers target=redrawn,unchanged name=districts force \
  -join states keys=STATEFP,STATEFP fields=STUSPS,NAME target=districts \
  -each 'GEOID = STATEFP + CD120FP; GEOIDFQ = "5002000US" + GEOID; CDSESSN = "120"; CONGRESS = 120; DISTRICT_ID = STUSPS + "-" + ((CD120FP === "00" || (CD120FP === "98" && STATEFP === "11")) ? "01" : CD120FP); STATE_NAME = NAME; delete NAME' target=districts \
  -dissolve DISTRICT_ID copy-fields=STATEFP,CD120FP,GEOID,GEOIDFQ,CDSESSN,CONGRESS,STUSPS,STATE_NAME,NAMELSAD target=districts \
  -clean gap-fill-area=20km2 target=districts \
  -simplify "$SIMPLIFY" keep-shapes target=districts \
  -clean target=districts \
  -sort 'DISTRICT_ID' target=districts \
  -o "$OUT" format=geojson precision="$PRECISION" target=districts
