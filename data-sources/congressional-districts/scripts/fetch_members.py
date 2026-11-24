"""Members-elect of the 120th Congress, written to
src/visualization/data/congressionalDistrictMembers120.json.

Source: Wikipedia's "2026 United States House of Representatives elections" page, which
records race calls as news organizations make them. Each district row in its per-state tables
(and DC's row under "Non-voting delegates") starts with {{ushr|ST|N|X}} ("AL" for at-large),
and the candidate a race has been called for is marked {{Aye}}. A district with no marked
candidate is "not_yet_called". The output records the page revision it read.

Rerun this until every race is called and certified. After the 120th Congress is sworn in on
January 3, 2027, switch to the sitting members in unitedstates/congress-legislators.

Usage: python fetch_members.py [--wikitext saved_api_response.json]
"""

import argparse
import csv
import json
import os
import re
import urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "..", "..", "src", "visualization", "data")
KEYS = os.path.join(HERE, "..", "cd120", "district_keys_cd120.csv")
PAGE = "2026_United_States_House_of_Representatives_elections"
API = (
    "https://en.wikipedia.org/w/api.php?action=parse&page=" + PAGE
    + "&prop=wikitext|revid&format=json&formatversion=2"
)
STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
]
DELEGATES = "Non-voting delegates"
# Party letter shown in labels, and the party's own name. Minnesota's Democratic–Farmer–Labor
# Party is the state's Democratic Party, so it shows as D.
PARTIES = {
    "Democratic": ("D", "Democratic"),
    "DFL": ("D", "Democratic–Farmer–Labor"),
    "Democratic–Farmer–Labor": ("D", "Democratic–Farmer–Labor"),
    "Republican": ("R", "Republican"),
    "Independent": ("I", "Independent"),
    "Libertarian": ("L", "Libertarian"),
    "Green": ("G", "Green"),
}
# Races the page marks as won that no news organization has called yet. They stay
# "not_yet_called" until a call or the certified result; remove an entry once that happens.
HOLD = {
    "MN-01": "the page marks Jake Johnson (DFL) as the winner, 50.0% to 49.9%, but the AP has not "
    "called it and a recount is scheduled for November 30, 2026 (checked November 24, 2026)",
}
ROW = re.compile(r"\{\{ushr\|([A-Z]{2})\|([A-Za-z0-9]+)\|X\}\}")
WINNER = re.compile(r"\{\{\s*aye\s*\}\}", flags=re.I)


def read_page(saved):
    if saved:
        return json.load(open(saved, encoding="utf-8"))["parse"]
    req = urllib.request.Request(API, headers={"User-Agent": "PolicyEngine data build (hello@policyengine.org)"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)["parse"]


def sections(wikitext):
    """Each state's section, and "Non-voting delegates".

    The page has had these at level 2 (== Alabama ==) and, since November 24, 2026, at level 3
    under "Elections in individual states". A section runs to the next heading at its own level
    or higher.
    """
    heads = [
        (m.start(), len(m.group(1)), m.group(2).strip())
        for m in re.finditer(r"^(={2,6})\s*([^=].*?)\s*\1\s*$", wikitext, flags=re.M)
    ]
    out = {}
    for i, (start, level, name) in enumerate(heads):
        if name in STATES or name == DELEGATES:
            end = next((s for s, lv, _ in heads[i + 1:] if lv <= level), len(wikitext))
            out[name] = wikitext[start:end]
    missing = [s for s in STATES + [DELEGATES] if s not in out]
    assert not missing, f"no section for {missing}"
    return out


def winner_name(line):
    after = WINNER.split(line, maxsplit=1)[1]
    m = re.search(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", after)
    if m:
        return (m.group(2) or m.group(1)).strip()
    m = re.match(r"\s*'*\s*([^'(<{]+?)\s*'*\s*\(", after)
    return m.group(1).strip() if m else None


def winner_party(line):
    # The party in parentheses is followed by a vote share, a reference, a template, an italic
    # note such as ''Uncontested'', or the end of the line.
    m = re.search(r"\(([^()]+?)\)\s*(?:[\d.]+%|<|\{|''|$)", line.strip() + " ")
    return m.group(1).strip() if m else None


def main_party(label):
    """The candidate's own party from a fusion ticket label.

    New York and Connecticut candidates can run on several party lines, and the page writes
    them as "Democratic/WFP" or "Republican/Cons.", with the candidate's own party first.
    """
    return label.split("/")[0].strip() if label else label


def parse(wikitext):
    members, problems = {}, []
    for name, body in sections(wikitext).items():
        rows = list(ROW.finditer(body))
        for i, m in enumerate(rows):
            st, num = m.group(1), m.group(2)
            if name == DELEGATES and st != "DC":
                continue
            district_id = f"{st}-01" if num.upper() == "AL" else f"{st}-{int(num):02d}"
            if district_id in members:
                problems.append(f"{district_id}: row appears twice")
                continue
            chunk = body[m.end(): rows[i + 1].start() if i + 1 < len(rows) else len(body)]
            winners = [line for line in chunk.splitlines() if WINNER.search(line)]
            if not winners:
                members[district_id] = {"status": "not_yet_called", "name": None, "party": None, "party_name": None}
                continue
            if len(winners) > 1:
                problems.append(f"{district_id}: {len(winners)} candidates marked as winners")
            person, party_word = winner_name(winners[0]), main_party(winner_party(winners[0]))
            letter, party_name = PARTIES.get(party_word, (None, party_word))
            if not person or not letter:
                problems.append(f"{district_id}: could not read the winner from {winners[0][:140]!r}")
            members[district_id] = {"status": "called", "name": person, "party": letter, "party_name": party_name}
    return members, problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--wikitext", help="a saved API response to parse instead of fetching")
    args = ap.parse_args()
    page = read_page(args.wikitext)
    members, problems = parse(page["wikitext"])
    keys = {r["district_id"]: r for r in csv.DictReader(open(KEYS, encoding="utf-8"))}
    assert set(members) == set(keys), (sorted(set(keys) - set(members)), sorted(set(members) - set(keys)))
    if problems:
        raise SystemExit("\n".join(problems))
    for d, why in HOLD.items():
        if members[d]["status"] == "called":
            print(f"holding {d} as not yet called: {why}")
            members[d] = {"status": "not_yet_called", "name": None, "party": None, "party_name": None}
    districts = {
        d: {"label": keys[d]["label"], **members[d]}
        for d in sorted(members)
    }
    called = [v for v in districts.values() if v["status"] == "called"]
    out = {
        "congress": 120,
        "as_of": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ"),
        "source": "Wikipedia, \"2026 United States House of Representatives elections\", race calls as reported there",
        "source_url": f"https://en.wikipedia.org/w/index.php?title={PAGE}&oldid={page['revid']}",
        "called": len(called),
        "not_yet_called": len(districts) - len(called),
        "districts": districts,
    }
    path = os.path.join(DATA, "congressionalDistrictMembers120.json")
    json.dump(out, open(path, "w", encoding="utf-8", newline="\n"), indent=1, ensure_ascii=False)
    by_party = {}
    for v in called:
        by_party[v["party"]] = by_party.get(v["party"], 0) + 1
    print(f"revision {page['revid']}: {len(called)} called {dict(sorted(by_party.items()))}, "
          f"{len(districts) - len(called)} not yet called")
    print("not yet called:", ", ".join(d for d, v in districts.items() if v["status"] != "called"))


if __name__ == "__main__":
    main()
