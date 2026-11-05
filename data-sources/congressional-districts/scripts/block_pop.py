"""Every 2020 tabulation block's total population (P1_001N), from the PL 94-171 files in $WORK/pl.

Reads each state's zip in place: the geoheader gives each block-level record's
LOGRECNO and 15-digit GEOCODE (SUMLEV 750, GEOCOMP 00), and segment 1 gives
P0010001 by LOGRECNO.
"""

import glob
import os
import time
import zipfile

import numpy as np
import pandas as pd

WORK = os.environ.get("WORK", os.path.join(os.path.dirname(__file__), "..", "work"))
t = time.time()
geoids, pops, by_state = [], [], {}
for path in sorted(glob.glob(os.path.join(WORK, "pl", "*2020.pl.zip"))):
    st = os.path.basename(path)[:2]
    with zipfile.ZipFile(path) as z:
        parts = []
        with z.open(f"{st}geo2020.pl") as f:
            for chunk in pd.read_csv(
                f, sep="|", header=None, usecols=[2, 4, 7, 9], dtype=str,
                encoding="latin-1", chunksize=500_000,
            ):
                chunk.columns = ["sumlev", "geocomp", "logrecno", "geocode"]
                keep = chunk[(chunk.sumlev == "750") & (chunk.geocomp == "00")]
                parts.append(keep[["logrecno", "geocode"]])
        geo = pd.concat(parts)
        geo["logrecno"] = geo["logrecno"].astype(np.int64)
        seg = []
        with z.open(f"{st}000012020.pl") as f:
            for chunk in pd.read_csv(
                f, sep="|", header=None, usecols=[4, 5], dtype={4: np.int64, 5: np.int64},
                chunksize=500_000,
            ):
                chunk.columns = ["logrecno", "pop"]
                seg.append(chunk[chunk.logrecno.isin(geo.logrecno)])
        seg = pd.concat(seg)
    merged = geo.merge(seg, on="logrecno", how="left", validate="one_to_one")
    assert merged["pop"].notna().all(), st
    assert merged["geocode"].str.len().eq(15).all(), st
    geoids.append(merged["geocode"].astype(np.int64).to_numpy())
    pops.append(merged["pop"].astype(np.int64).to_numpy())
    by_state[st] = (len(merged), int(merged["pop"].sum()))
    print(f"{st}: {len(merged):,} blocks, {by_state[st][1]:,} people", flush=True)

g = np.concatenate(geoids)
p = np.concatenate(pops)
order = np.argsort(g)
g, p = g[order], p[order]
assert len(np.unique(g)) == len(g)
print(f"total: {len(g):,} blocks, {int((p > 0).sum()):,} populated, {int(p.sum()):,} people; {time.time() - t:.0f} s")
np.savez_compressed(os.path.join(WORK, "block_pop_2020.npz"), geoid=g, pop=p)
