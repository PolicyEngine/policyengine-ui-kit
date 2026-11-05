# Congressional district data: 120th Congress

This folder builds the 120th Congress district files. The 120th Congress is seated January 3, 2027. This folder isn't part of the npm package.

The scripts write three files into `src/visualization/data/`, which ship with the package:

- `congressionalDistrictsGeo120.json`: district boundaries for web maps. `loadCongressionalDistrictsGeo(120)` and `<USDistrictChoroplethMap congress={120} />` read it.
- `congressionalDistrictsHex120.json`: the equal-area hex map. `loadCongressionalDistrictsHex(120)` reads it.
- `congressionalDistrictMembers120.json`: each district's member-elect (name and party) or "not yet called". `loadCongressionalDistrictMembers120()` reads it.

They also write tables to `cd120/`, for analyses that need to allocate county or tract data to districts. Every table uses 2020 Census populations.

## What changed from the 119th Congress

Nine states drew new maps for the 2026 elections:

| State | Seats | Districts with exactly the same blocks and number | People (2020) whose district number changed |
|---|---|---|---|
| Alabama | 7 | 3 | 660,496 |
| California | 52 | 4 | 9,214,062 |
| Florida | 28 | 5 | 6,265,306 |
| Louisiana | 6 | 0 | 1,497,479 |
| North Carolina | 14 | 12 | 543,381 |
| Ohio | 15 | 2 | 1,478,290 |
| Tennessee | 9 | 1 | 2,400,948 |
| Texas | 38 | 1 | 10,448,258 |
| Utah | 4 | 0 | 2,260,487 |

Together these states hold 173 of the 435 seats.

- **Every other state and DC:** each block is in the same district for the 120th as for the 119th.
- **Missouri:** it keeps its 2022 map. The U.S. Supreme Court required that map for the 2026 election, and the November 2026 referendum on the 2025 map failed. Census regenerated its 120th file on October 7, 2026 to match.
- **Virginia:** its new map was struck down, so its previous map stands.

Each district ID follows its state's new numbering. In the 120th files, `TX-35` is the area Texas's new map numbers 35.

- **The list of IDs doesn't change.** Seat counts come from the 2020 apportionment, so each state's IDs still run from 01 to its seat count: 436 in all, counting DC's delegate.
- **In the nine states, an ID now names a different area.** 40% of the new TX-35's 2020 population was in the old TX-28, and only 10% was in the old TX-35.

**Draw results on the boundaries they were computed with:**

- `congress={119}` (the default) for results from 119th-Congress data;
- `congress={120}` for results from 120th-Congress data.

## Sources

`sources.json` lists every input with its URL and SHA-256. `scripts/download_sources.sh` downloads them and checks the hashes. The inputs are:

- **Census block equivalency files** for the 119th and 120th Congresses: every 2020 block's district. The 120th file is the October 7, 2026 version.
- **2020 Census redistricting data (P.L. 94-171), all 50 states and DC:** every block's total population (P1_001N). The national total is 331,449,281 people in 5,769,942 populated blocks.
- **TIGER/Line 2026 120th Congress shapefiles** for the nine redrawn states. They cover state plans confirmed by May 31, 2026, and the tract check below shows they match the block files, including Alabama's map enacted on June 2.
- **Census 2024 cartographic boundary files (1:500k):** state outlines, for clipping to the shoreline, and the 119th districts, used for the states that didn't change. Census hasn't yet published a 120th cartographic boundary file. When it does, rebuild from it.
- **The Downballot's congressional district hexmap v3.2 (2026),** CC BY 4.0. It moves the hexes for CA, FL, NC, OH, TN, TX and UT. The Downballot left Alabama, Louisiana and Missouri as they were. **Credit "The Downballot" wherever the hex map is shown.**
- **The 2020 Census tract Gazetteer,** for tract internal points. It is used only for the boundary check.

## How to rebuild

The scripts need Python 3.11+ with numpy and pandas, and Node (they use `npx mapshaper@0.7.101`). The downloads total about 1.4 GB, kept in `work/`, which is git-ignored.

```bash
cd data-sources/congressional-districts/scripts
bash download_sources.sh   # downloads and verifies every source
python compare_bef.py      # 119th vs 120th, block by block
python block_pop.py        # 2020 block populations
python build_tables.py     # cd120/*.csv
bash build_geometry.sh     # src/visualization/data/congressionalDistrictsGeo120.json
python build_hex.py        # src/visualization/data/congressionalDistrictsHex120.json
python check_geometry.py   # cd120/geometry_check.json
python fetch_members.py    # src/visualization/data/congressionalDistrictMembers120.json
```

## Members-elect

`fetch_members.py` reads Wikipedia's "2026 United States House of Representatives elections" page, which records race calls as news organizations make them.

- **Called races.** A candidate marked as the winner gives the district its name and party letter: D, R, I, L or G. Minnesota's Democratic–Farmer–Labor Party shows as D, and `party_name` keeps its full name.
- **Uncalled races.** A district with no marked winner is `not_yet_called`.
- **Provenance.** The file records when the page was read and which revision it read.

The first snapshot, read November 5, 2026, has 406 races called (253 D, 153 R) and 30 not yet called. News totals that morning were 252 D, 158 R and 25 uncalled.

- **Until certification:** rerun the script until every race is called and certified.
- **From January 3, 2027:** switch to the sitting members in [unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators) (CC0).
- **Spot checks:** check close races against the state's certified results.

## How the boundary file is built

1. **Redrawn states:** the nine states' TIGER/Line 2026 districts are clipped to the 1:500k state outlines.
2. **Other states:** every other state, DC and Puerto Rico keep their 1:500k 119th districts.
3. **Simplification:** the combined layer has gaps of up to 20 km² filled, and is simplified to 2% of its vertices as one topology, so state borders shared with unchanged neighbors stay aligned. Coordinates are rounded to 4 decimal places, about 11 m.

The result has the 119th file's properties and keys:

- `DISTRICT_ID` is `ST-NN`, with at-large states and DC as `-01` and Puerto Rico as `PR-98`.
- It adds `CD120FP`, `GEOID`, `GEOIDFQ` (`5002000US` + GEOID), `CDSESSN` ("120"), `CONGRESS` (120), `STUSPS`, `STATE_NAME` and `NAMELSAD`.
- It has 437 features: 436 districts and Puerto Rico.

**The boundary check (`cd120/geometry_check.json`):**

- **The test.** Take each tract wholly inside one district, by its blocks. Its 2020 internal point should fall in that district's shape.
- **Results for the 120th file.** 1.02% of points in the redrawn states land in another district, and 0.94% elsewhere.
- **Baseline.** The same test on the 119th file this package already ships gives 2.51% and 1.97%.
- **What the misses mean.** They are points near district lines that simplification moved. They are not wrong districts.

| Redrawn state | Tracts checked | In another district: 120th file | Same test, 119th file |
|---|---|---|---|
| AL | 1,382 | 2 | 8 of 1,373 |
| CA | 8,242 | 167 | 301 of 8,401 |
| FL | 4,883 | 15 | 92 of 4,908 |
| LA | 1,280 | 19 | 34 of 1,223 |
| NC | 2,509 | 6 | 15 of 2,510 |
| OH | 3,046 | 19 | 30 of 3,068 |
| TN | 1,597 | 3 | 5 of 1,609 |
| TX | 6,394 | 74 | 252 of 6,280 |
| UT | 687 | 0 | 18 of 671 |

## Tables in `cd120/`

| File | Contents |
|---|---|
| `district_keys_cd120.csv` | Each district's keys and label, plus its 2020 population. The keys are `district_id` ("TX-35"), `census_geoid` ("4835", "0200", "1198") and `model_geoid` (policyengine-us's `congressional_district_geoid`: state FIPS × 100 + district, 0 for at-large and DC). The label follows the API's form, e.g. "Texas's 35th congressional district". |
| `district_population_cd120.csv` | 2020 population per district and its deviation from the state's ideal. The deviations are small, except in states that count incarcerated people at their home address when they draw districts. California's largest is +2.34%, against +2.88% for the 119th map; Maryland, Virginia, New Jersey, Washington and Nevada are 0.3–0.7%. |
| `county_cd120.csv` | Population of each county in each district, with the share of the county and of the district. |
| `tract_cd120.csv.gz` | The same for tracts. |
| `cd119_cd120_overlap.csv` | Population and block count of each 119th district in each 120th district. |
| `cd120_changes.csv` | Per state: how many districts kept exactly the same blocks and number, and how many people's district number changed. |
| `summary.json`, `geometry_check.json` | Build summary and boundary check results. |
