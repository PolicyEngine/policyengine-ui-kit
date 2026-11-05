"""Check the 120th boundaries against Census's block assignments, writing ../cd120/geometry_check.json.

For every 2020 tract that lies wholly inside one 120th district (all its blocks are assigned to
that district), the tract's internal point (2020 Gazetteer) should fall inside that district's
shape. The same test is run on the 119th file and 119th assignments as a baseline: the share
of points that land in another district measures how much the simplified boundaries move
lines, not an error in the districts.
"""

import json
import os
import subprocess

import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.environ.get("WORK", os.path.join(HERE, "..", "work"))
DATA = os.path.join(HERE, "..", "..", "..", "src", "visualization", "data")
OUT = os.path.join(HERE, "..", "cd120")
FIPS_ABBR = {
    1: "AL", 2: "AK", 4: "AZ", 5: "AR", 6: "CA", 8: "CO", 9: "CT", 10: "DE", 11: "DC", 12: "FL", 13: "GA",
    15: "HI", 16: "ID", 17: "IL", 18: "IN", 19: "IA", 20: "KS", 21: "KY", 22: "LA", 23: "ME", 24: "MD",
    25: "MA", 26: "MI", 27: "MN", 28: "MS", 29: "MO", 30: "MT", 31: "NE", 32: "NV", 33: "NH", 34: "NJ",
    35: "NM", 36: "NY", 37: "NC", 38: "ND", 39: "OH", 40: "OK", 41: "OR", 42: "PA", 44: "RI", 45: "SC",
    46: "SD", 47: "TN", 48: "TX", 49: "UT", 50: "VT", 51: "VA", 53: "WA", 54: "WV", 55: "WI", 56: "WY",
}
REDRAWN = {"AL", "CA", "FL", "LA", "NC", "OH", "TN", "TX", "UT"}

bef = np.load(os.path.join(WORK, "bef_119_120.npz"))
pop = np.load(os.path.join(WORK, "block_pop_2020.npz"))["pop"]
keep = (bef["geoid"] // 10**13) != 72
geoid = bef["geoid"][keep]
gaz = pd.read_csv(os.path.join(WORK, "geo", "2020_Gaz_tracts_national.txt"), sep="\t", dtype={"GEOID": str})
gaz.columns = [c.strip() for c in gaz.columns]


def whole_tracts(plan):
    cd = bef[plan][keep].astype(np.int64)
    df = pd.DataFrame({"tract": geoid // 10**4, "cd": cd, "pop": pop})[cd >= 0]
    t = df.groupby(["tract", "cd"])["pop"].sum().reset_index()
    t["share"] = t["pop"] / t.groupby("tract")["pop"].transform("sum")
    w = t[t.share >= 0.999999].copy()
    st = (w.tract // 10**9).astype(int)
    w["expected"] = [f"{FIPS_ABBR[s]}-{1 if d in (0, 98) else d:02d}" for s, d in zip(st, w.cd)]
    w["GEOID"] = w.tract.map(lambda x: f"{x:011d}")
    pts = gaz.merge(w[["GEOID", "expected"]], on="GEOID")[["GEOID", "INTPTLAT", "INTPTLONG", "expected"]]
    pts.columns = ["GEOID", "lat", "lon", "expected"]
    pts["GEOID"] = "t" + pts["GEOID"]  # keeps leading zeros through mapshaper
    return pts


def posix(path):
    # mapshaper rejects Windows separators when it names layers
    return os.path.abspath(path).replace("\\", "/")


def check(plan, geojson):
    pts_path = posix(os.path.join(WORK, f"tract_points_{plan}.csv"))
    joined_path = posix(os.path.join(WORK, f"tract_points_{plan}_joined.csv"))
    whole_tracts(plan).to_csv(pts_path, index=False)
    subprocess.run(
        f'npx --yes mapshaper@0.7.101 -i "{pts_path}" name=points -points x=lon y=lat '
        f'-join "{posix(geojson)}" fields=DISTRICT_ID -o "{joined_path}"',
        shell=True, check=True, capture_output=True,
    )
    j = pd.read_csv(joined_path, dtype=str)
    j["state"] = j.GEOID.str[1:3].astype(int).map(FIPS_ABBR)
    j["wrong"] = j.DISTRICT_ID.notna() & (j.DISTRICT_ID != j.expected)
    j["outside"] = j.DISTRICT_ID.isna()
    red = j.state.isin(REDRAWN)
    by_state = j[red].groupby("state").agg(tracts=("wrong", "size"), wrong=("wrong", "sum"), outside=("outside", "sum"))
    return {
        "tracts_checked": int(len(j)),
        "wrong_share_unchanged_states": round(float(j[~red].wrong.mean()), 5),
        "wrong_share_redrawn_states": round(float(j[red].wrong.mean()), 5),
        "outside_every_shape": int(j.outside.sum()),
        "redrawn_states": {s: {k: int(v) for k, v in r.items()} for s, r in by_state.iterrows()},
    }


result = {
    "method": __doc__.strip(),
    "cd120": check("cd120", os.path.join(DATA, "congressionalDistrictsGeo120.json")),
    "cd119_baseline": check("cd119", os.path.join(DATA, "congressionalDistrictsGeo.json")),
}
json.dump(result, open(os.path.join(OUT, "geometry_check.json"), "w"), indent=1)
for k in ("cd120", "cd119_baseline"):
    r = result[k]
    print(k, {x: r[x] for x in ("tracts_checked", "wrong_share_unchanged_states", "wrong_share_redrawn_states", "outside_every_shape")})
