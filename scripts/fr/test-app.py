#!/usr/bin/env python3
"""Browsertest oefenkaart Frankrijk (Playwright, Chromium en WebKit).

- Aanwijzen: alle 44 plekken op hun eigen geometrie aantikken -> 'Goed zo!'
- Aanwijzen: een fout antwoord geeft 'bad'
- Namen schrijven: alle 44 namen goed; zonder accenten = 'bijna'; fout = 'bad'
- Toets: eind met uitslag
- Screenshots desktop en iPad naar output/fr/screens/
Gebruik: python3 scripts/fr/test-app.py [chromium|webkit]
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
APP = (ROOT / "output/fr/TOPO-Frankrijk-oefenkaart.html").as_uri()
LES = json.loads((ROOT / "data/fr/items.draft.json").read_text("utf-8"))["items"]
NAME2ID = {i["nl"]: i["id"] for i in LES}
M = json.loads((ROOT / "data/fr/map.json").read_text("utf-8"))["items"]
ENGINE = sys.argv[1] if len(sys.argv) > 1 else "chromium"
fails = []


def target(i):
    m = M[i]
    if "x" in m:
        return m["x"], m["y"]
    if m["type"] == "rivier":
        seg = max(m["d"].split("M")[1:], key=len).split("L")
        return tuple(map(float, seg[len(seg) // 2].split()))
    return m["lx"], m["ly"]


def tap(page, x, y):
    pt = page.evaluate("([x,y])=>{const s=document.getElementById('map');const p=s.createSVGPoint();p.x=x;p.y=y;"
                       "const q=p.matrixTransform(s.getScreenCTM());return [q.x,q.y]}", [x, y])
    page.mouse.click(*pt)


with sync_playwright() as p:
    b = getattr(p, ENGINE).launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(APP)
    shots = ROOT / "output/fr/screens"
    shots.mkdir(parents=True, exist_ok=True)
    pg.click("#all")
    pg.screenshot(path=str(shots / f"leren-desktop-{ENGINE}.png"))

    pg.click("nav [data-mode=wijs]")
    seen = set()
    for _ in range(44):
        name = pg.inner_text(".prompt b")
        i = NAME2ID[name]
        seen.add(i)
        tap(pg, *target(i))
        cls = pg.get_attribute("#fb", "class")
        if "good" not in cls:
            fails.append(f"aanwijzen {i}: {pg.inner_text('#fb')}")
        pg.click("#nx")
    if len(seen) != 44:
        fails.append(f"aanwijzen: {len(seen)} van 44 gevraagd")
    # fout antwoord: tik op Parijs als het geen Parijs is
    name = pg.inner_text(".prompt b")
    wrong = "lyon" if NAME2ID[name] != "lyon" else "parijs"
    if M[NAME2ID[name]]["type"] == "stad":
        tap(pg, *target(wrong))
        if "bad" not in pg.get_attribute("#fb", "class"):
            fails.append("aanwijzen: fout antwoord niet fout gerekend")

    pg.click("nav [data-mode=schrijf]")
    for k in range(44):
        name = None
        i = pg.evaluate("cur")
        nl = next(x["nl"] for x in LES if x["id"] == i)
        val = nl if k % 3 else nl.lower()
        pg.fill("#in", val)
        pg.press("#in", "Enter")
        if "good" not in pg.get_attribute("#fb", "class"):
            fails.append(f"schrijven {i}: '{val}' -> {pg.inner_text('#fb')}")
        pg.click("#nx")
    pg.evaluate("cur='pyreneeen'")
    pg.fill("#in", "Pyreneeen"); pg.press("#in", "Enter")
    if "info" not in pg.get_attribute("#fb", "class"):
        fails.append("schrijven: zonder accent niet als 'bijna' gemeld")
    pg.click("#nx")
    pg.fill("#in", "Rotterdam"); pg.press("#in", "Enter")
    if "bad" not in pg.get_attribute("#fb", "class"):
        fails.append("schrijven: fout antwoord niet fout")
    pg.click("#nx")
    pg.evaluate("cur='le-havre'")
    pg.fill("#in", "LeHavre"); pg.press("#in", "Enter")
    if "good" not in pg.get_attribute("#fb", "class"):
        fails.append("schrijven: bladspelling LeHavre niet goed")
    pg.click("#nx")
    pg.screenshot(path=str(shots / f"schrijven-desktop-{ENGINE}.png"))

    pg.click("nav [data-mode=toets]")
    pg.select_option("#chap", "steden-1")
    pg.click("#go")
    for n in range(5):
        if pg.locator("#in").count():
            pg.fill("#in", "fout"); pg.press("#in", "Enter")
        else:
            pg.click("#skip")
        pg.wait_for_timeout(350)
    if "0 / 5" not in pg.inner_text(".result"):
        fails.append("toets: uitslag klopt niet")
    pg.screenshot(path=str(shots / f"toets-desktop-{ENGINE}.png"))

    ip = b.new_page(viewport={"width": 1180, "height": 820})
    ip.goto(APP)
    ip.click("nav [data-mode=wijs]")
    ip.screenshot(path=str(shots / f"aanwijzen-ipad-{ENGINE}.png"))
    if errs:
        fails.append("JS-fouten: " + "; ".join(errs))
    b.close()

print("\n".join(fails) if fails else f"{ENGINE}: alles ok (44 aanwijzen, 44 schrijven, varianten, toets)")
sys.exit(1 if fails else 0)
