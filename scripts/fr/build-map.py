#!/usr/bin/env python3
"""Schoolkaart Frankrijk (V4, spoor B): Natural Earth 10m -> geprojecteerde SVG-geometrie.

Gebruik:  python3 scripts/fr/build-map.py <map-met-natural-earth-geojson>
Uitvoer:  data/fr/map.json (geometrie per lesitem + context), data/fr/schoolkaart.svg (controlebeeld)
Bron, versie, hashes en zones: docs/v4/fr-geo.md. Lesstof: data/fr/items.draft.json.
Vereist: pip install shapely
"""
import json
import math
import sys
from pathlib import Path

from shapely.geometry import LineString, MultiLineString, Point, Polygon, box, mapping, shape
from shapely.ops import linemerge, transform, unary_union

ROOT = Path(__file__).resolve().parents[2]
NE = Path(sys.argv[1] if len(sys.argv) > 1 else "ne")

# Uitsnede zoals het leerblad (IMG_0801): Zuid-Engeland tot Corsica, Bretagne tot Noord-Italie.
LON0, LON1, LAT0, LAT1 = -7.6, 13.6, 40.8, 52.4  # opgemeten op IMG_0801 (punt Bretagne, Corsica)
PHI = 46.6  # middenbreedte voor de equirectangulaire projectie
W = 1000.0
K = W / (LON1 - LON0)
KY = K / math.cos(math.radians(PHI))
H = round((LAT1 - LAT0) * KY, 1)
TOL = 0.25  # vereenvoudiging in SVG-eenheden (onder een halve pixel bij 1000 px breed)


def proj(lon, lat, z=None):
    return ((lon - LON0) * K, (LAT1 - lat) * KY)


def P(g):
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        return transform(lambda x, y, z=None: proj(x, y), g)


EXT = box(LON0 - 1, LAT0 - 1, LON1 + 1, LAT1 + 1)
FRAME = box(0, 0, W, H)


def load(name):
    return json.load(open(NE / f"{name}.geojson", encoding="utf-8"))["features"]


def clip(g):
    return g.buffer(0).intersection(EXT)


def d_of(g):
    """SVG-pad van een (multi)polygoon of (multi)lijn, 1 decimaal."""
    g = g.simplify(TOL, preserve_topology=True)
    out = []

    def ring(coords, close):
        pts = [f"{x:.1f} {y:.1f}" for x, y in coords]
        if not pts:
            return
        out.append("M" + "L".join(pts) + ("Z" if close else ""))

    def walk(h):
        t = h.geom_type
        if t == "Polygon":
            ring(h.exterior.coords[:-1], True)
            for r in h.interiors:
                ring(r.coords[:-1], True)
        elif t == "LineString":
            ring(h.coords, False)
        elif t in ("MultiPolygon", "MultiLineString", "GeometryCollection"):
            for p in h.geoms:
                walk(p)

    walk(g)
    return "".join(out)


countries = {f["properties"]["ADMIN"]: clip(shape(f["geometry"])) for f in load("ne_10m_admin_0_countries")
             if shape(f["geometry"]).intersects(EXT)}
deps = {f["properties"]["name"]: shape(f["geometry"]).buffer(0) for f in load("ne_10m_admin_1_states_provinces")
        if f["properties"]["admin"] == "France"}
regions = {f["properties"]["NAME"]: clip(shape(f["geometry"])) for f in load("ne_10m_geography_regions_polys")
           if shape(f["geometry"]).intersects(EXT)}
marine = {}
for f in load("ne_10m_geography_marine_polys"):
    g = shape(f["geometry"])
    if g.intersects(EXT):
        marine.setdefault(f["properties"]["name"], []).append(clip(g))
marine = {k: unary_union(v) for k, v in marine.items()}
lakes = unary_union([clip(shape(f["geometry"])) for n in ("ne_10m_lakes", "ne_10m_lakes_europe")
                     for f in load(n) if shape(f["geometry"]).intersects(EXT)])
places = {f["properties"]["NAME"]: (f["properties"]["LONGITUDE"], f["properties"]["LATITUDE"])
          for f in load("ne_10m_populated_places") if f["properties"]["ADM0NAME"] == "France"}
rivers_all = load("ne_10m_rivers_lake_centerlines")

LAND = unary_union(list(countries.values()))
WATER = EXT.difference(LAND)


def uni(names, src):
    miss = [n for n in names if n not in src]
    assert not miss, miss
    return unary_union([src[n] for n in names])


def river(names):
    parts = [shape(f["geometry"]) for f in rivers_all if f["properties"].get("name") in names
             and shape(f["geometry"]).intersects(EXT)]
    assert parts, names
    g = unary_union(parts).intersection(EXT)
    return linemerge(g) if g.geom_type == "MultiLineString" else g


def sea(names):
    return uni(names, marine).intersection(WATER)


# Nauw van Calais: geen eigen Natural Earth-vlak. Zone = water tussen de grenslijnen
# Dungeness-Cap Gris-Nez (naar Het Kanaal) en Leathercoat Point-Walde (naar de Noordzee),
# ruim over land getrokken en daarna met het land afgesneden.
STRAIT_ZONE = Polygon([(0.97, 50.91), (1.40, 51.17), (1.92, 51.00), (1.58, 50.87)]).intersection(WATER)

# Open oceaan: water ten westen van de IHO-grenzen van de Golf van Biskaje (Pointe de Penmarch - Cap Ortegal)
# en van Het Kanaal (Ouessant - Land's End). Natural Earth rekent dat water tot Biskaje en het Kanaal,
# waardoor de Atlantische Oceaan in deze uitsnede bijna zou verdwijnen.
ATL_WEST = Polygon([(LON0 - 3, LAT0 - 3), (-7.87, 43.77), (-4.37, 47.80), (-5.10, 48.45), (-5.70, 50.07),
                    (-5.70, LAT1 + 3), (LON0 - 3, LAT1 + 3)])

GEO = {
    # gebieden
    "corsica": uni(["Haute-Corse", "Corse-du-Sud"], deps),
    "alpen": regions["ALPS"],
    "pyreneeen": regions["PYRENEES"],
    "vogezen": regions["Vosges"],
    "bretagne": uni(["Côtes-d'Armor", "Finistère", "Ille-et-Vilaine", "Morbihan"], deps),
    "dordogne": deps["Dordogne"],
    "elzas": uni(["Bas-Rhin", "Haute-Rhin"], deps),  # 'Haute-Rhin' = Haut-Rhin (spelling in Natural Earth)
    "normandie": uni(["Calvados", "Eure", "Manche", "Orne", "Seine-Maritime"], deps),
    "provence": uni(["Bouches-du-Rhône", "Var", "Vaucluse", "Alpes-de-Haute-Provence"], deps),
    # landen
    "andorra": countries["Andorra"], "belgie": countries["Belgium"], "duitsland": countries["Germany"],
    "groot-brittannie": countries["United Kingdom"], "italie": countries["Italy"],
    "luxemburg": countries["Luxembourg"], "monaco": countries["Monaco"], "spanje": countries["Spain"],
    "zwitserland": countries["Switzerland"],
    # wateren
    "noordzee": sea(["North Sea"]).difference(STRAIT_ZONE),
    "atlantische-oceaan": WATER.intersection(ATL_WEST).difference(unary_union([marine[n] for n in ("North Sea", "Irish Sea", "Bristol Channel") if n in marine])),
    "middellandse-zee": sea([n for n in ("Mediterranean Sea", "Golfe du Lion", "Ligurian Sea", "Balearic Sea",
                                         "Tyrrhenian Sea") if n in marine]),
    "het-kanaal": sea(["English Channel"]).difference(STRAIT_ZONE).difference(ATL_WEST),
    "nauw-van-calais": STRAIT_ZONE,
    "golf-van-biskaje": sea(["Bay of Biscay"]).difference(ATL_WEST),
    "garonne": river({"Garonne"}), "loire": river({"Loire"}), "maas": river({"Maas", "Meuse"}),
    "rhone": river({"Rhône", "Rhone"}), "rijn": river({"Rhine", "Rhin"}), "seine": river({"Seine"}),
}
CITY = {"bordeaux": "Bordeaux", "calais": "Calais", "le-havre": "Le Havre", "lille": "Lille", "lyon": "Lyon",
        "marseille": "Marseille", "metz": "Metz", "montpellier": "Montpellier", "nancy": "Nancy",
        "nantes": "Nantes", "nice": "Nice", "parijs": "Paris", "straatsburg": "Strasbourg", "toulouse": "Toulouse"}
for k, n in CITY.items():
    GEO[k] = Point(places[n])

ZONES = {  # geen gemeten grens: educatieve zone of bron-'Range/mtn'-vlak
    "alpen": "Natural Earth geography_regions_polys 'ALPS' (Range/mtn), geen gemeten grens",
    "pyreneeen": "Natural Earth geography_regions_polys 'PYRENEES' (Range/mtn), geen gemeten grens",
    "vogezen": "Natural Earth geography_regions_polys 'Vosges' (Range/mtn), geen gemeten grens",
    "provence": "historische streek, benaderd met de departementen Bouches-du-Rhone, Var, Vaucluse, Alpes-de-Haute-Provence",
    "dordogne": "streek gelijkgesteld aan het departement Dordogne",
    "nauw-van-calais": "zone tussen de lijnen Dungeness-Cap Gris-Nez en Leathercoat Point-Walde (benaderd)",
    "atlantische-oceaan": "zone: open water ten westen van de IHO-lijnen Penmarch-Cap Ortegal en Ouessant-Land's End",
    "golf-van-biskaje": "Natural Earth 'Bay of Biscay' oostelijk van de IHO-lijn Penmarch-Cap Ortegal",
    "het-kanaal": "Natural Earth 'English Channel' oostelijk van Ouessant-Land's End, zonder Nauw van Calais",
    "middellandse-zee": "Natural Earth Mediterranean Sea + Golfe du Lion, Ligurian, Balearic, Tyrrhenian Sea",
}
MICRO = {"monaco", "andorra"}  # te klein om te tikken: symbolische locator (zoals San Marino in Italie)

items = json.load(open(ROOT / "data/fr/items.draft.json", encoding="utf-8"))["items"]
assert set(GEO) == {i["id"] for i in items}, set(GEO) ^ {i["id"] for i in items}

out_items = {}
for it in items:
    g = GEO[it["id"]]
    assert not g.is_empty, it["id"]
    pg = P(g)
    rec = {"type": it["type"]}
    if isinstance(g, Point):
        rec["x"], rec["y"] = round(pg.x, 1), round(pg.y, 1)
        rec["lon"], rec["lat"] = round(g.x, 5), round(g.y, 5)
    else:
        vis = pg.intersection(FRAME) if pg.geom_type != "Point" else pg
        rec["d"] = d_of(vis)
        a = (vis if vis.geom_type in ("LineString", "MultiLineString") else None)
        if a is not None:
            line = max(a.geoms, key=lambda l: l.length) if a.geom_type == "MultiLineString" else a
            m = line.interpolate(0.5, normalized=True)
        else:
            biggest = max(vis.geoms, key=lambda p: p.area) if vis.geom_type == "MultiPolygon" else vis
            m = biggest.representative_point()
        rec["lx"], rec["ly"] = round(m.x, 1), round(m.y, 1)
        if it["id"] in MICRO:
            c = pg.centroid
            rec["x"], rec["y"] = round(c.x, 1), round(c.y, 1)
    if it["id"] in ZONES:
        rec["zone"] = ZONES[it["id"]]
    out_items[it["id"]] = rec

france = P(countries["France"]).intersection(FRAME)
QUIZ_COUNTRIES = ["Andorra", "Belgium", "Germany", "United Kingdom", "Italy", "Luxembourg", "Monaco", "Spain", "Switzerland"]
others = P(LAND.difference(unary_union([countries[c] for c in ["France", *QUIZ_COUNTRIES]]))).intersection(FRAME)
# Landen buiten de lesstof: alleen context, met een klein naamlabel (zoals bij Italie)
CONTEXT_NL = {"Netherlands": "NEDERLAND", "Austria": "OOSTENRIJK", "Czechia": "TSJECHIË", "Slovenia": "SLOVENIË",
              "Croatia": "KROATIË", "Portugal": "PORTUGAL", "Ireland": "IERLAND", "Bosnia and Herzegovina": "BOSNIË",
              "Liechtenstein": None, "San Marino": None, "Vatican": None}
ctx_labels = []
for name, nl in CONTEXT_NL.items():
    if nl and name in countries:
        vis = P(countries[name]).intersection(FRAME.buffer(-12))
        if vis.area > 600:
            big = max(vis.geoms, key=lambda g: g.area) if vis.geom_type == "MultiPolygon" else vis
            c = big.representative_point()
            ctx_labels.append({"t": nl, "x": round(c.x, 1), "y": round(c.y, 1)})
ctx_rivers = [shape(f["geometry"]) for f in rivers_all
              if shape(f["geometry"]).intersects(EXT) and f["properties"].get("scalerank", 99) <= 7
              and f["properties"].get("name") not in {"Garonne", "Loire", "Maas", "Meuse", "Rhône", "Rhone",
                                                       "Rhine", "Rhin", "Seine"}]
borders = P(unary_union([c.boundary for c in countries.values()]).intersection(LAND.buffer(-0.01))).intersection(FRAME)

data = {
    "schema": 1, "land": "fr",
    "viewBox": [0, 0, W, H],
    "projectie": {"soort": "equirectangulair (affien lon/lat)", "x": f"{K:.6f} * (lon - ({LON0}))",
                  "y": f"{KY:.6f} * ({LAT1} - lat)", "middenbreedte": PHI,
                  "uitsnede": {"lon": [LON0, LON1], "lat": [LAT0, LAT1]}},
    "context": {"france": d_of(france), "land": d_of(others), "labels": ctx_labels, "lakes": d_of(P(lakes).intersection(FRAME)),
                "borders": d_of(borders),
                "rivers": d_of(P(unary_union(ctx_rivers).intersection(EXT)).intersection(FRAME))},
    "items": out_items,
}
(ROOT / "data/fr/map.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", "utf-8")

# Controlebeeld met namen
names = {i["id"]: i["nl"] for i in items}
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:g} {H:g}" font-family="Helvetica,Arial" font-size="12">',
       f'<rect width="{W:g}" height="{H:g}" fill="#7fb7d8"/>',
       f'<path d="{data["context"]["land"]}" fill="#efe9dc" stroke="#9a9384" stroke-width=".6"/>',
       f'<path d="{data["context"]["france"]}" fill="#fbf6ea" stroke="#5c5548" stroke-width="1"/>',
       f'<path d="{data["context"]["lakes"]}" fill="#7fb7d8"/>',
       f'<path d="{data["context"]["rivers"]}" fill="none" stroke="#8fc0dd" stroke-width=".8"/>']
for k, r in out_items.items():
    t = r["type"]
    if "d" in r and t in ("regio", "gebergte"):
        svg.append(f'<path d="{r["d"]}" fill="{"#c9a46b" if t=="gebergte" else "#e7b7a0"}" fill-opacity=".45" stroke="#8a6a3c" stroke-width=".6"/>')
    if t == "rivier":
        svg.append(f'<path d="{r["d"]}" fill="none" stroke="#2f7fb8" stroke-width="2"/>')
    if t == "zee" and k == "nauw-van-calais":
        svg.append(f'<path d="{r["d"]}" fill="#2f7fb8" fill-opacity=".35"/>')
for k, r in out_items.items():
    if "x" in r:
        svg.append(f'<circle cx="{r["x"]}" cy="{r["y"]}" r="3.2" fill="#1d1a14"/>')
    x, y = (r["x"] + 5, r["y"] - 4) if r["type"] == "stad" else (r["lx"], r["ly"])
    svg.append(f'<text x="{x}" y="{y}" fill="#1d1a14" stroke="#fff" stroke-width="2.5" paint-order="stroke">{names[k]}</text>')
svg.append("</svg>")
(ROOT / "data/fr/schoolkaart.svg").write_text("\n".join(svg) + "\n", "utf-8")
print(f"viewBox 0 0 {W:g} {H:g}; items {len(out_items)}; map.json {len((ROOT/'data/fr/map.json').read_text())//1024} KB")
