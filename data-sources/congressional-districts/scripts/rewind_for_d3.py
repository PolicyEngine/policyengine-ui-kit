"""Wind polygon rings the way d3-geo needs them: exterior rings clockwise, holes counterclockwise.

d3-geo measures polygons on the sphere, so the direction of a ring decides which side is inside.
A counterclockwise exterior ring (the RFC 7946 order, which mapshaper writes) encloses the rest
of the globe instead of the district, and the map draws each district as a rectangle covering
the whole canvas. The 119th files already use the clockwise order.

Winding is measured in the plane of longitude and latitude, which matches d3-geo for these
files: no ring spans more than 180 degrees of longitude.

Usage: python rewind_for_d3.py FILE [FILE ...]
Rewrites each GeoJSON file in place and keeps its layout: one feature per line for mapshaper's
output, a single line otherwise.
"""

import json
import sys

MAPSHAPER_HEAD = '{"type":"FeatureCollection", "features": [\n'


def signed_area(ring):
    """Twice the planar area, positive for counterclockwise rings."""
    return sum(x1 * y2 - x2 * y1 for (x1, y1, *_), (x2, y2, *_) in zip(ring, ring[1:] + ring[:1]))


def rewind_polygon(rings):
    out = []
    for i, ring in enumerate(rings):
        clockwise = signed_area(ring) < 0
        want_clockwise = i == 0
        out.append(ring if clockwise == want_clockwise else ring[::-1])
    return out


def rewind_geometry(geometry):
    if geometry["type"] == "Polygon":
        return {**geometry, "coordinates": rewind_polygon(geometry["coordinates"])}
    if geometry["type"] == "MultiPolygon":
        return {**geometry, "coordinates": [rewind_polygon(p) for p in geometry["coordinates"]]}
    return geometry


def rewind_file(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    collection = json.loads(text)
    changed = 0
    for feature in collection["features"]:
        new = rewind_geometry(feature["geometry"])
        if new != feature["geometry"]:
            feature["geometry"] = new
            changed += 1
    compact = {"separators": (",", ":"), "ensure_ascii": False}
    if text.startswith(MAPSHAPER_HEAD):
        rest = {k: v for k, v in collection.items() if k not in ("type", "features")}
        assert not rest, f"{path}: unexpected top-level keys {sorted(rest)}"
        body = ",\n".join(json.dumps(feature, **compact) for feature in collection["features"])
        out = MAPSHAPER_HEAD + body + "\n]}"
    else:
        out = json.dumps(collection, **compact)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(out)
    print(f"{path}: rewound {changed} of {len(collection['features'])} features")


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        rewind_file(arg)
