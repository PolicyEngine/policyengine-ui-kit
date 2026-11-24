"""Compare Census's 119th and 120th Congress block equivalency files block by block.

Reads $WORK/bef/NationalCD119.txt and NationalCD120.txt, prints which states have any block
in a different district, and saves every block's two districts to $WORK/bef_119_120.npz
(-1 = ZZ, unassigned water).
"""

import os

import numpy as np
import pandas as pd

WORK = os.environ.get("WORK", os.path.join(os.path.dirname(__file__), "..", "work"))


def load(path):
    geo, cd = [], []
    for chunk in pd.read_csv(path, usecols=["GEOID", "CDFP"], dtype=str, chunksize=1_000_000):
        geo.append(chunk["GEOID"].astype(np.int64).to_numpy())
        cd.append(chunk["CDFP"].replace({"ZZ": "-1"}).astype(np.int16).to_numpy())
    g, c = np.concatenate(geo), np.concatenate(cd)
    order = np.argsort(g, kind="stable")
    g, c = g[order], c[order]
    assert (g[1:] != g[:-1]).all(), f"{path}: duplicate block IDs"
    return g, c


g19, c19 = load(os.path.join(WORK, "bef", "NationalCD119.txt"))
g20, c20 = load(os.path.join(WORK, "bef", "NationalCD120.txt"))
assert np.array_equal(g19, g20), "the two files list different blocks"
state = g19 // 10**13
changed = c19 != c20
print(f"{len(g19):,} blocks in both files")
print("blocks in a different district, by state FIPS:",
      {f"{s:02d}": int(n) for s, n in zip(*np.unique(state[changed], return_counts=True))})
np.savez_compressed(os.path.join(WORK, "bef_119_120.npz"), geoid=g19, cd119=c19, cd120=c20)
