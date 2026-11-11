#!/usr/bin/env python3
"""TOPO V3.0 fase B — Reis volgens R-reis-ijk (docs/v3/renders/README.md § Reis, § Raster en uitlijning, § Verfijning;
DECISIONS 10-11 "Review fase A"; afwerking 10-11: variant (a) Eiland chosen, map left and controls right).

On #bezig (and #afgerond for the gold and done rows), desktop 1440×900, iPad landscape 1180×820 and iPad portrait
820×1180, map variant (a) Eiland:
  * raster: the content area has 12 columns with one gutter (24 desktop, 16 iPad) and an inner margin of gutter + 8;
    the map on 7 columns at the left, the chapter list on 5 at the right (±1.5 px); the gutter between them is the
    gutter (±1 px); the inner margins left and right (±1 px);
  * shared lines: the title "Reis" and the counters' row centred on one line (±3 px); the bottom of the chapter list,
    the bottom of the map and the bottom of the chapter card on one line, on the inner margin (±1 px);
  * one title: exactly one display-size text (≥ 30 px, the wordmark aside) on the screen: "Reis"; no visible "Hoofdstukken" heading;
  * sidebar: portrait 112 px on desktop, 88 on iPad landscape (labelled sidebar, 200 px), rail on iPad portrait;
  * rows: done = the illustrated stamp (no bar), gold = the illustrated laurel, in progress = a thin bar, locked = a lock only (no bar);
  * the card: title, three step dots and one primary pill; pins of the chapter's places all inside the map's row,
    never under the card (a pin's box ends above the card's top);
  * counters with line icons (no illustration in the UI);
  * variant (a): no sea colour anywhere on the map (sea layers hidden, transparent background), neighbours visible as
    one soft silhouette (one group: effective alpha 0.3–0.8, faded by the mask; the original shapes draw nothing, so
    overlaps make no seams), the relief clipped to Italy;
  * the theme accent only on meaning (no violet text outside the active nav, selection and the primary pill).
Writes screenshots and the comparisons beside R-reis-ijk (docs/qa/v3-stijlbeeld/reis-ijk-<variant>-<viewport>.jpg)
and results.json to docs/qa/v3-faseb/.

Runs with prefers-reduced-transparency: no-preference (the reduced variant is covered by qa-v3-glas.py).

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-faseb.py
"""
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
OUT = ROOT / 'docs/qa/v3-faseb'
STIJL = ROOT / 'docs/qa/v3-stijlbeeld'
RENDER = ROOT / 'docs/v3/renders/R-reis-ijk.webp'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180)}
VARIANTS = {'eiland': ''}

PROBE = r'''() => {
  const q = s => document.querySelector(s), R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height}; };
  const cs = n => getComputedStyle(n), root = q('.v3Reis'), rs = cs(root);
  const px = v => parseFloat(v) || 0;
  const side = R(q('.v3Reis>.v3Side')), frame = R(root);
  const gut = px(rs.columnGap), inner = gut + 8;
  const rows = R(q('.v3Rows')), main = R(q('.v3Main')), title = R(q('.v3ScreenTitle')), top = R(q('.v3Main>.v3Top')), card = R(q('.v3Panel')), stage = R(q('.v3MapStage'));
  const content = frame.w - side.w - 2 * inner, col = (content - 11 * gut) / 12;
  const big = [...document.querySelectorAll('.v3Reis *')].filter(n => n.childNodes.length && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && n.checkVisibility() && px(cs(n).fontSize) >= 30 && !n.closest('.v3Brand,.v3CardTitle'))
    .map(n => n.textContent.trim().slice(0, 30));
  const lt = q('#v3ListTitle'), ltVisible = lt && lt.getBoundingClientRect().width > 2;
  const rowInfo = [...document.querySelectorAll('.v3Row')].map(b => ({state: b.dataset.state, bar: !!b.querySelector('.v3RowBar'), icon: (b.querySelector('.v3End use')?.getAttribute('href') || '').replace('#topo-', ''), art: ['stamp','gold'].find(k=>b.querySelector('.v3End img')?.src===TOPO_V3.art.icons[k]) || '', decoded: !!b.querySelector('.v3End img')?.naturalWidth}));
  const pins = [...document.querySelectorAll('.v3Map .v3Pin')].map(p => R(p));
  const map = q('.v3Map'), sea = map && [...map.querySelectorAll('.sea,.v3RSea,.atlasWaterTexture')].some(n => cs(n).display !== 'none' && cs(n).visibility !== 'hidden');
  const eff = n => { let o = 1; for (let e = n; e && e !== map; e = e.parentNode) o *= parseFloat(cs(e).opacity); return o * parseFloat(cs(n).fillOpacity); };
  // Variant (a): the neighbours are one silhouette group (one opacity, one fade); the originals draw nothing there.
  const grp = map && map.querySelector('.v3Neighbours'), grpOn = grp && cs(grp).display !== 'none';
  const nb = grpOn ? [{a: Math.round(eff(grp.querySelector('path')) * 100) / 100, mask: cs(grp).mask || cs(grp).maskImage || '', paths: grp.children.length}] : [];
  const nbOriginals = map ? [...map.querySelectorAll('.contextLand,.country:not(.v3Hit):not(.v3Isle)')].filter(n => cs(n).display !== 'none' && parseFloat(cs(n).fillOpacity) > 0).length : 0;
  const terrainClip = map ? cs(map.querySelector('.atlasTerrain')).clipPath : '';
  const stageCs = cs(q('.v3MapStage'));
  const counters = [...document.querySelectorAll('.v3Count')].map((c,index) => ({icon: !!c.querySelector('svg.v3Icon'), img: !!c.querySelector('img'), expected: c.querySelector('img')?.src===TOPO_V3.art.icons[index===0?'slice':'vespa'], decoded: !!c.querySelector('img')?.naturalWidth}));
  const accent = cs(root).getPropertyValue('--v3-accent').trim().toLowerCase();
  const rgb = h => { const m = h.match(/^#(..)(..)(..)$/); return m ? 'rgb(' + [1, 2, 3].map(i => parseInt(m[i], 16)).join(', ') + ')' : h; };
  const violetText = [...document.querySelectorAll('.v3Reis *')].filter(n => n.checkVisibility() && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && cs(n).color === rgb(accent)
    && !n.closest('[aria-current=page],[aria-pressed=true],.primary')).map(n => n.textContent.trim().slice(0, 24));
  const portrait = R(q('.v3Reis .v3Portrait'));
  return {frame, side, gut, inner, col, rows, main, title, top, card, stage, big, ltVisible, rowInfo, pins, sea, nb, nbOriginals, terrainClip,
    stageRadius: stageCs.borderTopLeftRadius, stageBg: stageCs.backgroundColor, svgBg: map ? cs(map).backgroundColor : '', kaart: root.dataset.kaart,
    primaries: document.querySelectorAll('.v3Panel .v3Btn.primary').length, dots: document.querySelectorAll('.v3Panel .v3StageBar span').length,
    counters, violetText, portrait: portrait && Math.round(portrait.w), navLabels: [...document.querySelectorAll('.v3Reis .v3NavList .v3NavItem span')].every(s => s.getBoundingClientRect().width > 8),
    hOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''


def near(a, b, tol=1.0):
    return a is not None and b is not None and abs(a - b) <= tol


def checks(p, vp, variant, demo, fail):
    tag = f'{vp}/{variant}/{demo}'
    f = lambda why: fail(f'{tag}: {why}')
    # Raster (≥ 768 px).
    list_w, map_w = p['rows']['w'], p['stage']['w']
    if not near(list_w, 5 * p['col'] + 4 * p['gut'], 1.5): f(f'list {list_w:.1f} ≠ 5 columns {5 * p["col"] + 4 * p["gut"]:.1f}')
    if not near(map_w, 7 * p['col'] + 6 * p['gut'], 1.5): f(f'map {map_w:.1f} ≠ 7 columns {7 * p["col"] + 6 * p["gut"]:.1f}')
    if not near(p['rows']['l'] - p['stage']['r'], p['gut']): f(f'gutter map|list {p["rows"]["l"] - p["stage"]["r"]:.1f} ≠ {p["gut"]}')
    if not near(p['stage']['l'] - p['side']['r'], p['inner']): f(f'inner margin left {p["stage"]["l"] - p["side"]["r"]:.1f} ≠ {p["inner"]}')
    if not near(p['frame']['r'] - p['rows']['r'], p['inner']): f(f'inner margin right {p["frame"]["r"] - p["rows"]["r"]:.1f} ≠ {p["inner"]}')
    if not near(p['card']['l'], p['stage']['l']) or not near(p['card']['r'], p['stage']['r']): f('chapter card not on the map area')
    # Shared lines.
    if not near(p['title']['t'] + p['title']['h'] / 2, p['top']['t'] + p['top']['h'] / 2, 3): f(f'title and counters not on one line ({p["title"]["t"]:.1f}, {p["top"]["t"]:.1f})')
    if not near(p['rows']['b'], p['card']['b']) or not near(p['stage']['b'], p['card']['b']): f(f'list / map / card bottom {p["rows"]["b"]:.1f} / {p["stage"]["b"]:.1f} / {p["card"]["b"]:.1f}')
    if not near(p['frame']['b'] - p['card']['b'], p['inner']): f(f'card bottom not on the inner margin ({p["frame"]["b"] - p["card"]["b"]:.1f})')
    # One title.
    if p['big'] != ['Reis']: f(f'display texts {p["big"]} (only "Reis")')
    if p['ltVisible']: f('"Hoofdstukken" heading visible')
    # Sidebar.
    want = {'desktop': 112, 'ipad-liggend': 88, 'ipad-staand': 56}[vp]
    if p['portrait'] != want: f(f'portrait {p["portrait"]} ≠ {want}')
    if vp != 'ipad-staand' and not p['navLabels']: f('nav labels hidden')
    # Rows.
    for r in p['rowInfo']:
        if r['state'] == 'done' and (r['bar'] or r['art'] != 'stamp' or not r['decoded']): f(f'done row {r}')
        if r['state'] == 'gold' and (r['bar'] or r['art'] != 'gold' or not r['decoded']): f(f'gold row {r}')
        if r['state'] == 'locked' and (r['bar'] or r['icon'] != 'v3lock'): f(f'locked row {r}')
        if r['state'] in ('now', 'open') and not r['bar']: f(f'row in progress without bar {r}')
    # Card, pins.
    if p['dots'] != 3: f(f'{p["dots"]} step dots')
    if p['primaries'] != 1: f(f'{p["primaries"]} primary pills')
    for b in p['pins']:
        if b['b'] > p['card']['t'] - 1 or b['t'] < p['stage']['t'] - 1 or b['l'] < p['stage']['l'] - 1 or b['r'] > p['stage']['r'] + 1: f(f'pin outside the map row {b} (card top {p["card"]["t"]:.0f})')
    if demo == 'bezig' and len(p['pins']) != 6: f(f'{len(p["pins"])} pins (Steden 7–12: 6)')
    if len(p['counters'])!=2 or not all(not c['icon'] and c['img'] and c['expected'] and c['decoded'] for c in p['counters']): f(f'counters {p["counters"]}')
    if p['violetText']: f(f'violet text outside meaning {p["violetText"][:5]}')
    # Variants.
    if variant == 'eiland':
        if p['sea'] or p['svgBg'] not in ('rgba(0, 0, 0, 0)', 'transparent'): f(f'sea colour on the island map (layers {p["sea"]}, background {p["svgBg"]})')
        bad = [n for n in p['nb'] if not (.3 <= n['a'] <= .8) or 'nbFade' not in n['mask'] or n['paths'] < 10]
        if not p['nb'] or bad: f(f'neighbours not one soft faded silhouette {p["nb"]}')
        if p['nbOriginals']: f(f'{p["nbOriginals"]} original neighbour shapes still drawn (double alpha, seams)')
        if 'italyClip' not in p['terrainClip']: f(f'relief not clipped to Italy ({p["terrainClip"]})')
    if p['hOverflow']: f('horizontal overflow')


def side_by_side(render_path, shot_path, out, label, top=0):
    a = Image.open(render_path).convert('RGB'); b = Image.open(shot_path).convert('RGB')
    b = b.crop((0, top, b.width, b.height))  # without the preview bar (outside the frame)
    h = 720; a = a.resize((round(a.width * h / a.height), h)); b = b.resize((round(b.width * h / b.height), h))
    pad, cap = 24, 44
    im = Image.new('RGB', (a.width + b.width + 3 * pad, h + cap + pad), (240, 236, 246))
    im.paste(a, (pad, cap)); im.paste(b, (2 * pad + a.width, cap))
    d = ImageDraw.Draw(im)
    try: font = ImageFont.truetype('/System/Library/Fonts/SFNSRounded.ttf', 22)
    except Exception: font = ImageFont.load_default()
    d.text((pad, 10), 'Doelbeeld · R-reis-ijk', fill=(42, 36, 64), font=font)
    d.text((2 * pad + a.width, 10), label, fill=(42, 36, 64), font=font)
    im.save(out, quality=86)


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    res = {'runs': {}}; fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await pw.chromium.launch()
        for vp, (w, h) in VIEWPORTS.items():
            for variant, tail in VARIANTS.items():
                for demo in ('bezig', 'afgerond'):
                    ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=vp != 'desktop')
                    pg = await ctx.new_page(); errs = []
                    # The glass as designed (the QA machine may prefer reduced transparency; that variant is qa-v3-glas.py).
                    await (await ctx.new_cdp_session(pg)).send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'no-preference'}]})
                    pg.on('pageerror', lambda e: errs.append(str(e)))
                    await pg.goto(HTML.as_uri() + '#' + demo + tail); await pg.wait_for_timeout(1500)
                    p = await pg.evaluate(PROBE)
                    checks(p, vp, variant, demo, fails.append)
                    if errs: fails.append(f'{vp}/{variant}/{demo}: page errors {errs[:2]}')
                    shot = OUT / f'reis-{variant}-{demo}-{vp}.png'
                    await pg.screenshot(path=str(shot))
                    if demo == 'bezig' and vp != 'ipad-staand':
                        bar = round(await pg.evaluate("document.querySelector('.v3PreviewBar')?.getBoundingClientRect().height || 0"))
                        side_by_side(RENDER, shot, STIJL / f'reis-ijk-{variant}-{vp}.jpg', f'Build · {vp}', bar)
                    res['runs'][f'{vp}/{variant}/{demo}'] = {k: p[k] for k in ('gut', 'inner', 'col', 'big', 'portrait', 'kaart', 'dots', 'primaries', 'rowInfo')} | {'pins': len(p['pins'])}
                    await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
