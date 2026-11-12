#!/usr/bin/env python3
"""Randgevallen aanwijzen (iPad liggend 1180x820): dichtbij, overlap, marges, kleine vlakken.

Elke regel: gevraagd item, waar getikt wordt, en of dat goed of fout moet zijn.
Gebruik: python3 scripts/fr/test-edges.py
"""
import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright
from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[2]
M = json.loads((ROOT / "data/fr/map.json").read_text("utf-8"))["items"]


def geom(d):
    polys, lines = [], []
    for seg in re.findall(r"M[^M]+", d):
        pts = [tuple(map(float, p.split())) for p in seg.strip("MZ").split("L")]
        (polys if seg.endswith("Z") and len(pts) > 2 else lines).append(pts)
    if polys:
        g = None
        for p in polys:
            pg = Polygon(p).buffer(0)
            g = pg if g is None else g.symmetric_difference(pg)
        return g
    return unary_union([LineString(p) for p in lines])


G = {k: (Point(v["x"], v["y"]) if v["type"] == "stad" else geom(v["d"])) for k, v in M.items()}


def pt(g):
    p = g.representative_point()
    return p.x, p.y


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1180, "height": 820})
    pg.goto((ROOT / "output/fr/TOPO-Frankrijk-oefenkaart.html").as_uri())
    u = pg.evaluate("unitsPerPx()")  # SVG-eenheden per CSS-pixel
    px = lambda n: n * u
    C = lambda k: (M[k]["x"], M[k]["y"])
    cases = [
        ("metz", C("nancy"), False, "Metz gevraagd, tik op Nancy"),
        ("nancy", C("metz"), False, "Nancy gevraagd, tik op Metz"),
        ("metz", (M["metz"]["x"] + px(10), M["metz"]["y"]), True, "Metz, 10 px ernaast"),
        ("dordogne", pt(G["dordogne"].buffer(px(8)).difference(G["dordogne"].buffer(px(3)))), True, "Dordogne, net buiten de rand (≈ 3–8 px)"),
        ("dordogne", pt(G["dordogne"].buffer(px(40)).difference(G["dordogne"].buffer(px(25)))), False, "Dordogne, 25–40 px ernaast"),
        ("luxemburg", pt(G["belgie"].intersection(G["luxemburg"].buffer(px(8)))), True, "Luxemburg, net in België naast de grens (klein land)"),
        ("belgie", pt(G["luxemburg"].buffer(-px(4))), False, "België gevraagd, tik midden in Luxemburg"),
        ("nauw-van-calais", pt(G["het-kanaal"].intersection(G["nauw-van-calais"].buffer(px(6)))), True, "Nauw van Calais, net in Het Kanaal"),
        ("het-kanaal", pt(G["nauw-van-calais"].buffer(-px(1))), False, "Het Kanaal gevraagd, tik midden in het Nauw"),
        ("atlantische-oceaan", pt(G["golf-van-biskaje"]), True, "Atlantische Oceaan, tik in de Golf van Biskaje (hoort erbij)"),
        ("golf-van-biskaje", pt(G["atlantische-oceaan"]), False, "Golf van Biskaje gevraagd, tik in open oceaan"),
        ("elzas", pt(G["elzas"].intersection(G["vogezen"])), True, "Elzas, tik waar Vogezen eroverheen ligt"),
        ("vogezen", pt(G["elzas"].intersection(G["vogezen"])), True, "Vogezen, tik waar de Elzas eronder ligt"),
        ("alpen", pt(G["provence"].intersection(G["alpen"])), True, "Alpen, tik waar de Provence overlapt"),
        ("provence", pt(G["provence"].intersection(G["alpen"])), True, "Provence, tik waar de Alpen overlappen"),
        ("seine", C("parijs"), True, "Seine, tik op Parijs (stad aan de rivier)"),
        ("parijs", (M["parijs"]["x"] + px(4), M["parijs"]["y"] + px(4)), True, "Parijs, tik net naast de stip, op de Seine"),
        ("loire", C("nantes"), True, "Loire, tik op Nantes"),
        ("garonne", C("bordeaux"), True, "Garonne, tik op Bordeaux"),
        ("rhone", C("lyon"), True, "Rhône, tik op Lyon"),
        ("rijn", C("straatsburg"), True, "Rijn, tik op Straatsburg"),
        ("marseille", pt(G["middellandse-zee"].intersection(G["marseille"].buffer(px(10)))), True, "Marseille, tik in zee vlak voor de kust"),
        ("middellandse-zee", C("marseille"), True, "Middellandse Zee, tik op Marseille aan de kust"),
        ("het-kanaal", C("le-havre"), True, "Het Kanaal, tik op Le Havre aan de kust"),
        ("noordzee", pt(G["noordzee"].intersection(G["nauw-van-calais"].buffer(px(6)))), True, "Noordzee, tik naast het Nauw"),
        ("monaco", C("nice"), True, "Monaco, tik op Nice (7 km, niet uit elkaar te houden)"),
        ("nice", (M["monaco"]["x"], M["monaco"]["y"]), True, "Nice, tik op het Monaco-ruitje (dichtstbijzijnde stad)"),
        ("andorra", (M["andorra"]["x"] + px(6), M["andorra"]["y"]), True, "Andorra, 6 px naast het ruitje"),
        ("spanje", (M["andorra"]["x"], M["andorra"]["y"]), False, "Spanje gevraagd, tik op Andorra"),
        ("corsica", pt(G["corsica"]), True, "Corsica"),
        ("italie", pt(G["corsica"].buffer(-px(3))), False, "Italië gevraagd, tik op Corsica (Frans)"),
        ("pyreneeen", C("toulouse"), False, "Pyreneeën gevraagd, tik op Toulouse (te ver)"),
    ]
    fails = 0
    for ask, (x, y), want, desc in cases:
        r = pg.evaluate("([id,x,y])=>grade(id,x,y)", [ask, x, y])
        ok = r["ok"] == want
        fails += not ok
        print(("ok   " if ok else "FOUT ") + f"{desc}: {'goed' if r['ok'] else 'fout'}" + ("" if r["ok"] else f" (aangetikt: {r['got']})"))
    b.close()
print(f"\n{len(cases) - fails}/{len(cases)} randgevallen zoals bedoeld")
sys.exit(1 if fails else 0)
