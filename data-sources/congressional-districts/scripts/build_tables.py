"""120th Congress district tables from Census's block equivalency files and 2020 block populations.

Inputs (in $WORK, from compare_bef.py and block_pop.py):
- bef_119_120.npz: every 2020 block's 119th and 120th district (Census NationalCD119/120.txt;
  -1 = ZZ, unassigned water).
- block_pop_2020.npz: every block's 2020 population (PL 94-171 P1_001N).

Outputs (in ../cd120/):
- district_keys_cd120.csv: every district's keys in each format PolicyEngine uses, its label and
  its 2020 population.
- district_population_cd120.csv: each district's 2020 population and its deviation from its state's ideal.
- county_cd120.csv, tract_cd120.csv.gz: population of each county/tract in each 120th district, with shares.
- cd119_cd120_overlap.csv: population and block count of each 119th district in each 120th district.
- cd120_changes.csv: per state, how many districts kept exactly the same blocks and how many people
  are in a different district.

District IDs follow PolicyEngine's convention: "ST-NN", with at-large states (Census 00) and
DC (Census 98) as "-01". Census's own code is kept as cd120fp.
"""

import gzip
import json
import os

import numpy as np
import pandas as pd

FIPS = {
    1: "AL", 2: "AK", 4: "AZ", 5: "AR", 6: "CA", 8: "CO", 9: "CT", 10: "DE", 11: "DC", 12: "FL",
    13: "GA", 15: "HI", 16: "ID", 17: "IL", 18: "IN", 19: "IA", 20: "KS", 21: "KY", 22: "LA",
    23: "ME", 24: "MD", 25: "MA", 26: "MI", 27: "MN", 28: "MS", 29: "MO", 30: "MT", 31: "NE",
    32: "NV", 33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC", 38: "ND", 39: "OH", 40: "OK",
    41: "OR", 42: "PA", 44: "RI", 45: "SC", 46: "SD", 47: "TN", 48: "TX", 49: "UT", 50: "VT",
    51: "VA", 53: "WA", 54: "WV", 55: "WI", 56: "WY",
}
REDRAWN = {1, 6, 12, 22, 37, 39, 47, 48, 49}
STATE_NAMES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado",
    "CT": "Connecticut", "DE": "Delaware", "DC": "District of Columbia", "FL": "Florida", "GA": "Georgia",
    "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
    "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts",
    "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana",
    "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico",
    "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota",
    "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington",
    "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
}

WORK = os.environ.get("WORK", os.path.join(os.path.dirname(__file__), "..", "work"))
OUT = os.path.join(os.path.dirname(__file__), "..", "cd120")
os.makedirs(OUT, exist_ok=True)
bef = np.load(os.path.join(WORK, "bef_119_120.npz"))
bp = np.load(os.path.join(WORK, "block_pop_2020.npz"))

# Drop Puerto Rico (not one of the 436) and align the BEF to the population file.
keep = (bef["geoid"] // 10**13) != 72
geoid, cd119, cd120 = bef["geoid"][keep], bef["cd119"][keep].astype(np.int64), bef["cd120"][keep].astype(np.int64)
assert np.array_equal(geoid, bp["geoid"]), "block sets differ"
pop = bp["pop"]
state = geoid // 10**13
assert pop[cd120 == -1].sum() == 0 and pop[cd119 == -1].sum() == 0, "people in ZZ blocks"
a = cd120 >= 0
assert np.array_equal(a, cd119 >= 0), "ZZ blocks differ between plans"

df = pd.DataFrame({
    "state": state[a], "county": geoid[a] // 10**10, "tract": geoid[a] // 10**4,
    "k119": state[a] * 100 + cd119[a], "k120": state[a] * 100 + cd120[a], "population": pop[a],
})
del bef, bp, geoid, cd119, cd120, pop, state


def did(key):
    st, cd = divmod(int(key), 100)
    return f"{FIPS[st]}-{1 if cd in (0, 98) else cd:02d}"


# 1. District populations and deviation from each state's ideal.
dist = df.groupby("k120", as_index=False).agg(population=("population", "sum"), blocks=("population", "size"))
dist["state_fips"] = (dist.k120 // 100).map(lambda s: f"{s:02d}")
dist["cd120fp"] = (dist.k120 % 100).map(lambda c: f"{c:02d}")
dist["district_id"] = dist.k120.map(did)
seats = dist.groupby("state_fips").district_id.transform("count")
dist["ideal_population"] = (dist.groupby("state_fips").population.transform("sum") / seats).round(1)
dist["deviation_pct"] = ((dist.population / dist.ideal_population - 1) * 100).round(4)
dist = dist[["district_id", "state_fips", "cd120fp", "population", "blocks", "ideal_population", "deviation_pct"]]
dist.to_csv(f"{OUT}/district_population_cd120.csv", index=False)


def ordinal(n):
    return f"{n}{'th' if 11 <= n % 100 <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')}"


keys = dist[["district_id", "state_fips", "cd120fp", "population"]].copy()
keys["state_abbr"] = keys.district_id.str[:2]
keys["state_name"] = keys.state_abbr.map(STATE_NAMES)
keys["census_geoid"] = keys.state_fips + keys.cd120fp
at_large = keys.cd120fp.isin(["00", "98"])
keys["district_number"] = np.where(at_large, 1, keys.cd120fp.astype(int))
# policyengine.py's congressional_district_geoid: state FIPS x 100 + district, 0 for at-large and DC
keys["model_geoid"] = keys.state_fips.astype(int) * 100 + np.where(at_large, 0, keys.cd120fp.astype(int))
keys["label"] = [
    f"{STATE_NAMES[a]}'s at-large congressional district" if al else f"{STATE_NAMES[a]}'s {ordinal(n)} congressional district"
    for a, al, n in zip(keys.state_abbr, at_large, keys.district_number)
]
keys = keys.rename(columns={"population": "population_2020"})
keys[["district_id", "state_abbr", "state_name", "state_fips", "cd120fp", "census_geoid", "model_geoid",
      "district_number", "label", "population_2020"]].to_csv(f"{OUT}/district_keys_cd120.csv", index=False)
assert len(dist) == 436, len(dist)
assert dist.population.sum() == 331_449_281
assert dist.district_id.is_unique


def shares(key, name, width):
    t = df.groupby([key, "k120"], as_index=False).population.sum()
    t[name] = t[key].map(lambda v: f"{v:0{width}d}")
    t["district_id"] = t.k120.map(did)
    tot = t.groupby(key).population.transform("sum")
    t[f"share_of_{name.split('_')[0]}"] = np.where(tot > 0, t.population / tot.where(tot > 0, 1), np.nan)
    t["share_of_district"] = t.population / t.groupby("k120").population.transform("sum")
    return t[[name, "district_id", "population", f"share_of_{name.split('_')[0]}", "share_of_district"]]


county = shares("county", "county_fips", 5)
county.to_csv(f"{OUT}/county_cd120.csv", index=False, float_format="%.6f")
tract = shares("tract", "tract_geoid", 11)
with gzip.open(f"{OUT}/tract_cd120.csv.gz", "wt", newline="") as f:
    tract.to_csv(f, index=False, float_format="%.6f")

# 4. 119th -> 120th overlap, by people and by blocks (zero-population blocks included).
ov = df.groupby(["k119", "k120"], as_index=False).agg(population=("population", "sum"), blocks=("population", "size"))
ov["state_fips"] = (ov.k120 // 100).map(lambda s: f"{s:02d}")
ov["district_id_119"] = ov.k119.map(did)
ov["district_id_120"] = ov.k120.map(did)
ov["share_of_119"] = ov.population / ov.groupby("k119").population.transform("sum")
ov["share_of_120"] = ov.population / ov.groupby("k120").population.transform("sum")
ov[["state_fips", "district_id_119", "district_id_120", "population", "blocks", "share_of_119", "share_of_120"]].to_csv(
    f"{OUT}/cd119_cd120_overlap.csv", index=False, float_format="%.6f")

# 5. What changed, by state. A 120th district is identical to a 119th one when exactly one
# (119th, 120th) pair covers all of both districts' blocks.
pairs_per_119 = ov.groupby("k119").k120.transform("count")
pairs_per_120 = ov.groupby("k120").k119.transform("count")
ov["identical_blocks"] = (pairs_per_119 == 1) & (pairs_per_120 == 1)
ov["same_number"] = ov.k119 == ov.k120
ov["state"] = ov.k120 // 100
rows = []
for st, g in ov.groupby("state"):
    rows.append({
        "state": FIPS[int(st)], "state_fips": f"{int(st):02d}", "redrawn": int(st) in REDRAWN,
        "districts": int(g.k120.nunique()),
        "districts_with_identical_blocks": int(g.identical_blocks.sum()),
        "districts_identical_with_same_number": int((g.identical_blocks & g.same_number).sum()),
        "people_whose_district_number_changed": int(g.population[~g.same_number].sum()),
        "state_population": int(g.population.sum()),
    })
ch = pd.DataFrame(rows)
ch.to_csv(f"{OUT}/cd120_changes.csv", index=False)
unchanged = ch[~ch.redrawn]
assert (unchanged.people_whose_district_number_changed == 0).all()
assert (unchanged.districts_identical_with_same_number == unchanged.districts).all()

dev = dist.assign(a=dist.deviation_pct.abs()).groupby("state_fips").a.max()
summary = {
    "districts": int(len(dist)),
    "population": int(dist.population.sum()),
    "largest_district_deviation_pct": {k: round(float(v), 4) for k, v in dev.sort_values(ascending=False).head(8).items()},
    "redrawn_states": ch[ch.redrawn].drop(columns=["redrawn"]).to_dict("records"),
    "rows": {"county": len(county), "tract": len(tract), "overlap": len(ov)},
    "seats_in_redrawn_states": int(ch[ch.redrawn].districts.sum()),
}
json.dump(summary, open(f"{OUT}/summary.json", "w"), indent=1)
print(json.dumps(summary, indent=1))
