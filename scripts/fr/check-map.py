#!/usr/bin/env python3
"""Geometriecheck schoolkaart Frankrijk: leest alleen data/fr/map.json en items.draft.json.

Controleert per lesitem een geografische relatie die je op het schoolblad kunt nazien
(stad aan rivier of kust, stad in streek, rivier door land, enz.). Exit 1 bij een fout.
Gebruik: python3 scripts/fr/check-map.py
"""
import json
import re
import sys
from pathlib import Path

from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[2]
M = json.loads((ROOT / "data/fr/map.json").read_text("utf-8"))
ITEMS = json.loads((ROOT / "data/fr/items.draft.json").read_text("utf-8"))["items"]
W, H = M["viewBox"][2], M["viewBox"][3]
KM = W / 19 / (111.32 * 0.6884)  # SVG-eenheden per km (oost-west, op 46.6 graden)


def parts(d):
    for seg in re.findall(r"M[^M]+", d):
        closed = seg.endswith("Z")
        pts = [tuple(map(float, p.split())) for p in seg.strip("MZ").split("L")]
        yield closed, pts


def geom(d):
    polys, lines = [], []
    for closed, pts in parts(d):
        (polys if closed and len(pts) > 2 else lines).append(pts)
    if polys:
        # even-odd: gaten zitten als eigen ring in het pad
        g = None
        for p in polys:
            pg = Polygon(p).buffer(0)
            g = pg if g is None else g.symmetric_difference(pg)
        return g
    return unary_union([LineString(p) for p in lines])


I = M["items"]
G = {k: (Point(v["x"], v["y"]) if v["type"] == "stad" else geom(v["d"])) for k, v in I.items()}
FR = geom(M["context"]["france"])
errors = []


def check(ok, msg):
    print(("ok   " if ok else "FOUT ") + msg)
    if not ok:
        errors.append(msg)


def near(a, b, km):
    return G[a].distance(G[b]) <= km * KM


check(set(I) == {i["id"] for i in ITEMS} and len(I) == 44, "44 lesitems, gelijk aan items.draft.json")
for k, v in I.items():
    inside = 0 <= (v.get("x", v.get("lx", 0))) <= W and 0 <= (v.get("y", v.get("ly", 0))) <= H
    check(inside, f"{k}: binnen de kaart")
for c in ["bordeaux", "calais", "le-havre", "lille", "lyon", "marseille", "metz", "montpellier", "nancy",
          "nantes", "nice", "parijs", "straatsburg", "toulouse"]:
    check(FR.buffer(2 * KM).contains(G[c]), f"{c}: in Frankrijk (kust tot 2 km)")
for city, river, km in [("parijs", "seine", 3), ("nantes", "loire", 3), ("bordeaux", "garonne", 3),
                        ("toulouse", "garonne", 3), ("lyon", "rhone", 3), ("straatsburg", "rijn", 5)]:
    check(near(city, river, km), f"{city} ligt aan de {river} (< {km} km)")
for city, sea, km in [("calais", "nauw-van-calais", 4), ("le-havre", "het-kanaal", 4),
                      ("marseille", "middellandse-zee", 4), ("nice", "middellandse-zee", 4)]:
    check(near(city, sea, km), f"{city} ligt aan {sea} (< {km} km)")
for city, area in [("le-havre", "normandie"), ("straatsburg", "elzas"), ("marseille", "provence")]:
    check(G[area].contains(G[city]), f"{city} ligt in {area}")
check(not G["bretagne"].contains(G["nantes"]), "nantes ligt niet in bretagne (regio Bretagne, zoals Natural Earth)")
check(near("nice", "monaco", 20), "monaco ligt bij nice (< 20 km)")
check(G["pyreneeen"].intersects(G["andorra"]), "andorra ligt in de pyreneeen")
check(G["vogezen"].distance(G["elzas"]) < 1, "vogezen grenzen aan de elzas")
check(G["alpen"].intersects(G["zwitserland"]) and G["alpen"].intersects(G["italie"]), "alpen liggen in zwitserland en italie")
check(G["rijn"].intersects(G["duitsland"].buffer(1)) and G["rijn"].intersects(G["zwitserland"].buffer(1)), "rijn loopt langs duitsland en zwitserland")
check(G["maas"].intersects(G["belgie"]), "maas stroomt door belgie")
check(G["seine"].distance(G["het-kanaal"]) < 6 * KM, "seine mondt uit in het kanaal (< 6 km van het kanaalvlak)")
check(G["loire"].intersects(G["golf-van-biskaje"].buffer(6 * KM)) or G["loire"].intersects(G["atlantische-oceaan"].buffer(6 * KM)), "loire mondt uit in de atlantische kust")
check(G["rhone"].intersects(G["middellandse-zee"].buffer(6 * KM)), "rhone mondt uit in de middellandse zee")
check(G["corsica"].area > 300 and FR.intersects(G["corsica"]), "corsica is een eiland van frankrijk")
for a in ["noordzee", "atlantische-oceaan", "middellandse-zee", "het-kanaal", "nauw-van-calais", "golf-van-biskaje"]:
    check(not G[a].intersects(FR.buffer(-1)), f"{a}: geen water over Frankrijk")
check(G["nauw-van-calais"].distance(G["het-kanaal"]) < 1 and G["nauw-van-calais"].distance(G["noordzee"]) < 1,
      "nauw van calais ligt tussen het kanaal en de noordzee")
print(f"\n{len(errors)} fout(en)")
sys.exit(1 if errors else 0)
