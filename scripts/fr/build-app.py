#!/usr/bin/env python3
"""Bouwt de offline oefenkaart Frankrijk: één HTML-bestand zonder externe bestanden.

Gebruik: python3 scripts/fr/build-app.py
Invoer:  scripts/fr/app.html, data/fr/map.json, data/fr/items.draft.json, data/fr/nino-portret.webp, data/fr/vespa.webp, data/fr/schoolblad-*.jpg (web-kopie van docs/v4/bron/IMG_0802/0801)
Uitvoer: output/fr/TOPO-Frankrijk-oefenkaart.html
"""
import base64
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
tpl = (ROOT / "scripts/fr/app.html").read_text("utf-8")
les = json.loads((ROOT / "data/fr/items.draft.json").read_text("utf-8"))
les = {"items": les["items"], "chapters": les["chapters"]}
nino = "data:image/webp;base64," + base64.b64encode((ROOT / "data/fr/nino-portret.webp").read_bytes()).decode()
html = (tpl.replace("__MAP__", (ROOT / "data/fr/map.json").read_text("utf-8").strip())
        .replace("__LES__", json.dumps(les, ensure_ascii=False, separators=(",", ":")))
        .replace("__NINO__", nino)
        .replace("__SB_LIJST__", "data:image/jpeg;base64," + base64.b64encode((ROOT / "data/fr/schoolblad-lijst.jpg").read_bytes()).decode())
        .replace("__SB_KAART__", "data:image/jpeg;base64," + base64.b64encode((ROOT / "data/fr/schoolblad-leerkaart.jpg").read_bytes()).decode())
        .replace("__VESPA__", "data:image/webp;base64," + base64.b64encode((ROOT / "data/fr/vespa.webp").read_bytes()).decode()))
out = ROOT / "output/fr/TOPO-Frankrijk-oefenkaart.html"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, "utf-8")
print(out.relative_to(ROOT), len(html) // 1024, "KB", hashlib.sha256(html.encode()).hexdigest()[:12])
