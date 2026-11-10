#!/usr/bin/env python3
"""TOPO V3.0 fase B, stap 6 — Beloningen volgens R-beloningen (docs/v3/renders/README.md § Per render: R-beloningen,
§ Ingetogenheid, § Raster en uitlijning). Presentation only; the counts against the V2 Reisboekje stay covered by
qa-v3-stijlbeeld.py.

On #bezig (desktop, iPad landscape 1180×820, iPad portrait 820×1180, phone 390×844) and #alles (desktop):
  * one display text (≥ 30 px, the wordmark aside): "Beloningen", without decorative lines (no pseudo-elements);
  * the Reisboekje free on the landscape (no card: transparent, no shadow), the cover a button, one primary pill;
  * one glass panel for the ride (backdrop filter, radius 28): three pizzas from the data (3 per ride: earned ones
    whole, the current one with its slices, the rest 0), the Vespa, the number of rides and a meter of three wide
    segments (on = pizzas mod 3);
  * four glass tiles of equal width, each with an icon, a label and a number on 700 (32–44 px, afwerking 10-11; phone 22–26);
  * ≥ 1024: 12 columns — the book on columns 1–5 from the view's left edge, the ride panel on 6–12 to its right edge
    (±1.5 px), book and panel on one top line (±1 px), the tiles over the full width;
  * no horizontal overflow.
Runs with prefers-reduced-transparency: no-preference (the reduced variant is covered by qa-v3-glas.py).
Writes screenshots, the comparisons beside R-beloningen (docs/qa/v3-stijlbeeld/beloningen-ijk-<viewport>.jpg) and
results-beloningen.json to docs/qa/v3-faseb/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-faseb-beloningen.py
"""
import re
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
OUT = ROOT / 'docs/qa/v3-faseb'
STIJL = ROOT / 'docs/qa/v3-stijlbeeld'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844)}
RUNS = [('bezig', 'desktop'), ('bezig', 'ipad-liggend'), ('bezig', 'ipad-staand'), ('bezig', 'telefoon'), ('alles', 'desktop')]

PROBE = r'''() => {
  const q = s => document.querySelector(s), R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height}; };
  const cs = (n, pe) => getComputedStyle(n, pe), px = v => parseFloat(v) || 0, vis = n => n && n.checkVisibility() && n.getBoundingClientRect().width > 0;
  const text = n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
  const glass = n => n && {filter: cs(n).backdropFilter, radius: px(cs(n).borderTopLeftRadius)};
  const view = q('.v3Rewards'), h1 = view.querySelector('h1'), book = q('.v3Book'), ride = q('.v3Ride');
  const big = [...document.querySelectorAll('.v3Reis *')].filter(n => text(n) && vis(n) && px(cs(n).fontSize) >= 30 && !n.closest('.v3Brand')).map(n => n.textContent.trim().slice(0, 30));
  const pizzas = [...ride.querySelectorAll('.v3RidePizza')].map(p => ({on: p.classList.contains('on'), slices: +p.dataset.slices, w: p.getBoundingClientRect().width, img: cs(p, '::after').backgroundImage.startsWith('url(')}));
  const meter = [...ride.querySelectorAll('.v3RideSteps i')].map(i => ({on: i.classList.contains('on'), w: i.getBoundingClientRect().width}));
  const tiles = [...view.querySelectorAll('.v3Tile')].map(t => ({w: t.getBoundingClientRect().width, icon: vis(t.querySelector('.v3TileIcon')), label: t.querySelector('span')?.textContent,
    nw: cs(t.querySelector('b')).fontWeight, ns: px(cs(t.querySelector('b')).fontSize), glass: glass(t)}));
  const vs = cs(view), gut = px(vs.columnGap), inner = R(view).w - px(vs.paddingLeft) - px(vs.paddingRight), col = (inner - 11 * gut) / 12;
  const bc = cs(book);
  return {big, title: h1?.textContent, deco: [cs(h1, '::before').content, cs(h1, '::after').content],
    state: {slices: state.slices | 0, pizzas: state.pizzas | 0, trips: state.trips | 0},
    book: {bg: bc.backgroundColor, shadow: bc.boxShadow, cover: q('.v3BookCover')?.tagName, coverArt: vis(q('.v3CoverArt')), r: R(book)},
    primaries: [...view.querySelectorAll('.v3Btn.primary')].filter(vis).map(b => b.textContent.trim()),
    ride: {glass: glass(ride), r: R(ride), art: vis(ride.querySelector('.v3RideArt')), n: ride.querySelector(':scope>b')?.textContent, nw: cs(ride.querySelector(':scope>b')).fontWeight},
    pizzas, meter, tiles, view: R(view), padL: px(vs.paddingLeft), gut, col, tilesR: R(q('.v3Tiles')),
    hOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''


FIG = re.compile(r'^[\d\s\u202f/]+$')


def near(a, b, tol=1.0):
    return a is not None and b is not None and abs(a - b) <= tol


def checks(p, tag, vp, fail):
    f = lambda why: fail(f'{tag}: {why}')
    # Afwerking 10-11: key figures are 32–44/700 by design; only the title is a display text.
    words = [t for t in p['big'] if not FIG.match(t)]
    if words != ['Beloningen']: f(f'display texts {p["big"]}')
    if any(c not in ('none', 'normal') for c in p['deco']): f(f'decoration by the title {p["deco"]}')
    b = p['book']
    if b['bg'] not in ('rgba(0, 0, 0, 0)', 'transparent') or b['shadow'] != 'none' or b['cover'] != 'BUTTON' or not b['coverArt']: f(f'book not free as a button {b}')
    if p['primaries'] != ['Open Reisboekje']: f(f'primaries {p["primaries"]}')
    g = p['ride']['glass']
    if g['filter'] in ('none', '') or not near(g['radius'], 28): f(f'ride panel not glass {g}')
    s = p['state']; k = s['pizzas'] % 3
    want = [8 if i < k else (min(8, s['slices']) if i == k else 0) for i in range(3)]
    if [x['slices'] for x in p['pizzas']] != want or [x['on'] for x in p['pizzas']] != [i < k for i in range(3)] or not all(x['img'] for x in p['pizzas']): f(f'pizzas {p["pizzas"]} vs {want}')
    if not p['ride']['art'] or p['ride']['n'] != str(s['trips']) or p['ride']['nw'] != '700': f(f'ride {p["ride"]}')
    if len(p['meter']) != 3 or [m['on'] for m in p['meter']] != [i < k for i in range(3)] or min(m['w'] for m in p['meter']) < 40: f(f'ride meter {p["meter"]}')
    t = p['tiles']; lo, hi = (22, 26) if vp == 'telefoon' else (32, 44)
    if len(t) != 4 or any(not x['icon'] or x['nw'] != '700' or not lo <= x['ns'] <= hi or x['glass']['filter'] in ('none', '') for x in t) or max(x['w'] for x in t) - min(x['w'] for x in t) > 1:
        f(f'tiles {[(x["label"], x["ns"], x["nw"], round(x["w"])) for x in t]}')
    if vp in ('desktop', 'ipad-liggend'):
        v, c, gu = p['view'], p['col'], p['gut']; span = lambda n: n * c + (n - 1) * gu
        if not near(b['r']['l'], v['l'] + p['padL'], 1.5) or not near(b['r']['w'], span(5), 1.5): f(f'book not on columns 1–5 ({b["r"]["l"] - v["l"]:.1f}, {b["r"]["w"]:.1f} vs {span(5):.1f})')
        rr = p['ride']['r']
        if not near(rr['l'], v['l'] + p['padL'] + span(5) + gu, 1.5) or not near(rr['w'], span(7), 1.5): f(f'ride not on columns 6–12 ({rr["w"]:.1f} vs {span(7):.1f})')
        if not near(rr['t'], b['r']['t']): f(f'book and ride not on one top line ({b["r"]["t"]:.1f} vs {rr["t"]:.1f})')
        if not near(p['tilesR']['w'], span(12), 1.5): f('tiles not over the full width')
    if p['hOverflow']: f('horizontal overflow')


def side_by_side(render_path, shot_path, out, label, top=0):
    a = Image.open(render_path).convert('RGB'); b = Image.open(shot_path).convert('RGB')
    b = b.crop((0, top, b.width, b.height))
    h = 720; a = a.resize((round(a.width * h / a.height), h)); b = b.resize((round(b.width * h / b.height), h))
    pad, cap = 24, 44
    im = Image.new('RGB', (a.width + b.width + 3 * pad, h + cap + pad), (240, 236, 246))
    im.paste(a, (pad, cap)); im.paste(b, (2 * pad + a.width, cap))
    d = ImageDraw.Draw(im)
    try: font = ImageFont.truetype('/System/Library/Fonts/SFNSRounded.ttf', 22)
    except Exception: font = ImageFont.load_default()
    d.text((pad, 10), 'Doelbeeld · ' + pathlib.Path(render_path).stem, fill=(42, 36, 64), font=font)
    d.text((2 * pad + a.width, 10), label, fill=(42, 36, 64), font=font)
    im.save(out, quality=86)


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    res = {'runs': {}}; fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await pw.chromium.launch()
        for demo, vp in RUNS:
            w, h = VIEWPORTS[vp]; tag = f'{demo}/{vp}'
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=vp != 'desktop', is_mobile=vp == 'telefoon')
            pg = await ctx.new_page(); errs = []
            # The glass as designed: the QA machine may prefer reduced transparency (then the panels turn opaque, glas.css).
            cdp = await ctx.new_cdp_session(pg)
            await cdp.send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'no-preference'}]})
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(HTML.as_uri() + '#' + demo); await pg.wait_for_timeout(1500)
            await pg.locator('[data-nav=rewards]').filter(visible=True).first.click(); await pg.wait_for_timeout(600)
            p = await pg.evaluate(PROBE); checks(p, tag, vp, fails.append)
            shot = OUT / f'beloningen-{demo}-{vp}.png'
            await pg.screenshot(path=str(shot), full_page=vp == 'telefoon')
            if demo == 'bezig' and vp in ('desktop', 'ipad-liggend'):
                bar = round(await pg.evaluate("document.querySelector('.v3PreviewBar')?.getBoundingClientRect().height || 0"))
                side_by_side(ROOT / 'docs/v3/renders/R-beloningen.webp', shot, STIJL / f'beloningen-ijk-{vp}.jpg', f'Build · {vp}', bar)
            if errs: fails.append(f'{tag}: page errors {errs[:2]}')
            res['runs'][tag] = {'big': p['big'], 'state': p['state'], 'pizzas': [x['slices'] for x in p['pizzas']], 'meter': [m['on'] for m in p['meter']], 'tiles': [x['label'] for x in p['tiles']]}
            await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results-beloningen.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
