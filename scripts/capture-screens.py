#!/usr/bin/env python3
"""Maak screenshots van een TOPO-versie voor docs/ontwikkeling.

Gebruik:
  python3 scripts/capture-screens.py <html-bestand> <uitvoer-prefix> [hash] [--set=sleutel=waarde ...]

--set zet localStorage vooraf, bv. --set=topo-nino-intro-v1=done om de kennismaking over te slaan.

Maakt <prefix>-desktop.webp (1440x900) en <prefix>-ipad.webp (1180x820, liggend).
Elke versie van TOPO is een zelfstandig HTML-bestand, dus er is geen server nodig.
Vereist: pip install playwright pillow && playwright install chromium
"""
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

SIZES = {"desktop": (1440, 900), "ipad": (1180, 820)}


def capture(html: Path, prefix: Path, hash_: str = "", storage: dict | None = None) -> None:
    prefix.parent.mkdir(parents=True, exist_ok=True)
    url = html.resolve().as_uri() + (f"#{hash_}" if hash_ else "")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, (w, h) in SIZES.items():
            page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            if storage:  # bv. kennismaking overslaan: topo-nino-intro-v1=done
                page.add_init_script(
                    "".join(f"localStorage.setItem({k!r}, {v!r});" for k, v in storage.items())
                )
            page.goto(url, wait_until="load")
            page.wait_for_timeout(1800)  # animaties en lazy images laten landen
            png = page.screenshot(full_page=False)
            out = prefix.parent / f"{prefix.name}-{name}.webp"
            Image.open(io.BytesIO(png)).save(out, "WEBP", quality=80, method=6)
            print(out, out.stat().st_size // 1024, "KB")
            page.close()
        browser.close()


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--set=")]
    store = dict(a[6:].split("=", 1) for a in sys.argv[1:] if a.startswith("--set="))
    if len(args) < 2:
        sys.exit(__doc__)
    capture(Path(args[0]), Path(args[1]), args[2] if len(args) > 2 else "", store)
