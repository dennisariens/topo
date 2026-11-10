#!/usr/bin/env python3
"""TOPO V3.0 fase B, stap 3 — Oefenen volgens R-oefenen-ijk (docs/v3/renders/README.md § IJkpunt stijl, § Raster en
uitlijning, § Verfijning; map variants as Reis, DECISIONS 10-11 fase B stap 2).

On #bezig, desktop 1440×900, iPad landscape 1180×820 and iPad portrait 820×1180, for both variants (a) eiland and
(b) kaart, with the group Steden 7–12 chosen (and Eilanden, and Slim rondje), plus the phone 390×844:
  * raster (≥ 1024): the panel starts on the inner margin and spans a whole number of the 12 columns (5–8) — the one
    after its longest chip; the map takes the rest up to the inner margin, one gutter between (±1.5 px);
  * shared line: the top of the panel and the top of the map row on one line (±1 px);
  * one title: exactly one display-size text (≥ 30 px, the wordmark aside): "Oefenen"; no visible field headings;
  * four form tiles, each a line icon and a label (no illustration); a thin line (1 px) between form and group;
  * the groups as chips in three columns (two on the phone), each on one line, with the full names, all inside the
    panel; one primary pill (Start) with the open play icon, full width;
  * pins: only the chosen group's places (Steden 7–12: 6 pins), all inside the map row; Eilanden as areas (no pins);
    Slim rondje: no group, no pins;
  * variant (a): the relief clipped to Italy (this clone's own clip), no sea colour; (b): the map in a glass card;
  * the panel keeps its width when the form changes (Slim rondje hides the groups);
  * portrait 112 / 88 / 56; no violet text outside the active nav, the selection and the primary pill; no overflow.
Writes screenshots, the comparisons beside R-oefenen-ijk (docs/qa/v3-stijlbeeld/oefenen-ijk-<variant>-<viewport>.jpg)
and results-oefenen.json to docs/qa/v3-faseb/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-faseb-oefenen.py
"""
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
OUT = ROOT / 'docs/qa/v3-faseb'
STIJL = ROOT / 'docs/qa/v3-stijlbeeld'
RENDER = ROOT / 'docs/v3/renders/R-oefenen-ijk.webp'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844)}
VARIANTS = {'eiland': '', 'kaart': '/kaart'}

PROBE = r'''() => {
  const q = s => document.querySelector(s), R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height}; };
  const cs = n => getComputedStyle(n), root = q('.v3Reis'), px = v => parseFloat(v) || 0;
  const view = q('.v3View-oefenen'), panel = q('.v3OefPanel'), stage = q('.v3OefStage'), map = q('.v3OefMap');
  const side = R(q('.v3Reis>.v3Side')), frame = R(root), gut = px(cs(root).columnGap), inner = gut + 8;
  const content = frame.w - side.w - 2 * inner, col = (content - 11 * gut) / 12;
  const text = n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
  const big = [...document.querySelectorAll('.v3Reis *')].filter(n => text(n) && n.checkVisibility() && px(cs(n).fontSize) >= 30 && !n.closest('.v3Brand')).map(n => n.textContent.trim().slice(0, 30));
  const headings = [...panel.querySelectorAll('h2')].filter(h => h.getBoundingClientRect().width > 2).map(h => h.textContent);
  const forms = [...panel.querySelectorAll('.v3FormBtn')].map(b => ({icon: !!b.querySelector('svg.v3Icon use'), img: !!b.querySelector('img'), label: b.textContent.trim()}));
  const groep = panel.querySelector('.v3OefGroep'), chips = [...panel.querySelectorAll('.v3Chip')].filter(c => c.checkVisibility());
  const pr = R(panel), ppad = px(cs(panel).paddingRight);
  const chipInfo = chips.map(c => ({t: c.textContent.replace(/\s+/g, ' ').trim(), h: Math.round(c.getBoundingClientRect().height), clip: c.scrollWidth > c.clientWidth + 1, out: c.getBoundingClientRect().right > pr.r - ppad + 1, l: Math.round(c.getBoundingClientRect().left)}));
  const cols = new Set(chipInfo.map(c => c.l)).size;
  const titles = ROUTE_CHAPTERS.map(c => c.title.replace(/\s+/g, ' ').trim());
  const primaries = [...panel.querySelectorAll('.v3Btn.primary')].filter(b => b.checkVisibility());
  const start = primaries[0], pins = [...document.querySelectorAll('.v3OefMap .v3Pin')].map(R);
  const accent = cs(root).getPropertyValue('--v3-accent').trim().toLowerCase();
  const rgb = h => { const m = h.match(/^#(..)(..)(..)$/); return m ? 'rgb(' + [1, 2, 3].map(i => parseInt(m[i], 16)).join(', ') + ')' : h; };
  const violetText = [...document.querySelectorAll('.v3Reis *')].filter(n => n.checkVisibility() && text(n) && cs(n).color === rgb(accent) && !n.closest('[aria-current=page],[aria-pressed=true],.primary')).map(n => n.textContent.trim().slice(0, 24));
  const sea = map && [...map.querySelectorAll('.sea,.v3RSea,.atlasWaterTexture')].some(n => cs(n).display !== 'none');
  const portrait = R(q('.v3Reis .v3Portrait'));
  return {frame, side, gut, inner, col, panel: pr, stage: R(stage), big, headings, forms, line: groep && !groep.hidden ? cs(groep).borderTopWidth : null,
    chipInfo, chipCols: cols, titles, primaries: primaries.length, startPlay: start && start.querySelector('use')?.getAttribute('href'), startW: start && start.getBoundingClientRect().width, panelInner: pr.w - 2 * ppad,
    pins, focus: map && map.dataset.focus, kaart: root.dataset.kaart, clip: map ? cs(map.querySelector('.atlasTerrain')).clipPath : '', sea, svgBg: map ? cs(map).backgroundColor : '',
    stageRadius: cs(stage).borderTopLeftRadius, stageBg: cs(stage).backgroundColor, viewCols: view.dataset.cols, groupHidden: !!groep?.hidden,
    violetText, portrait: portrait && Math.round(portrait.w), hOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''


def near(a, b, tol=1.0):
    return a is not None and b is not None and abs(a - b) <= tol


def checks(p, vp, variant, case, fail):
    f = lambda why: fail(f'{vp}/{variant}/{case}: {why}')
    wide = vp in ('desktop', 'ipad-liggend')
    if wide:
        n = round((p['panel']['w'] + p['gut']) / (p['col'] + p['gut']))
        if not (5 <= n <= 8) or not near(p['panel']['w'], n * p['col'] + (n - 1) * p['gut'], 1.5): f(f'panel {p["panel"]["w"]:.1f} not on a column line ({n} cols = {n * p["col"] + (n - 1) * p["gut"]:.1f})')
        if not near(p['panel']['l'] - p['side']['r'], p['inner']): f(f'inner margin left {p["panel"]["l"] - p["side"]["r"]:.1f}')
        if not near(p['stage']['l'] - p['panel']['r'], p['gut']): f(f'gutter panel|map {p["stage"]["l"] - p["panel"]["r"]:.1f}')
        if not near(p['frame']['r'] - p['stage']['r'], p['inner']): f(f'inner margin right {p["frame"]["r"] - p["stage"]["r"]:.1f}')
        if not near(p['panel']['t'], p['stage']['t']): f(f'panel top {p["panel"]["t"]:.1f} ≠ map top {p["stage"]["t"]:.1f}')
    if p['big'] != ['Oefenen']: f(f'display texts {p["big"]}')
    if p['headings']: f(f'visible field headings {p["headings"]}')
    if len(p['forms']) != 4 or not all(x['icon'] and not x['img'] for x in p['forms']): f(f'form tiles {p["forms"]}')
    if case != 'smart':
        if p['line'] != '1px': f(f'line between form and group {p["line"]}')
        want = 2 if vp == 'telefoon' else 3
        if p['chipCols'] != want: f(f'{p["chipCols"]} chip columns ≠ {want}')
        bad = [c for c in p['chipInfo'] if c['h'] > 48 or c['clip'] or c['out']]
        if bad: f(f'chips not on one line inside the panel {bad[:3]}')
        shown = [c['t'] for c in p['chipInfo']]
        if [t for t in p['titles'] if t not in shown]: f(f'chip names not full {shown}')
    elif not p['groupHidden']: f('group shown for Slim rondje')
    if p['primaries'] != 1 or p['startPlay'] != '#topo-v3play' or not near(p['startW'], p['panelInner'], 1.5): f(f'start pill ({p["primaries"]}, {p["startPlay"]}, {p["startW"]} of {p["panelInner"]})')
    want = {'city2': 6, 'islands': 0, 'smart': 0}[case]
    if len(p['pins']) != want: f(f'{len(p["pins"])} pins ≠ {want}')
    if case == 'islands' and p['focus'] != 'areas': f(f'Eilanden focus {p["focus"]}')
    if vp != 'telefoon':
        for b in p['pins']:
            if b['t'] < p['stage']['t'] - 1 or b['b'] > p['stage']['b'] + 1 or b['l'] < p['stage']['l'] - 1 or b['r'] > p['stage']['r'] + 1: f(f'pin outside the map row {b}')
    if variant == 'eiland':
        if 'v3o-italyClip' not in p['clip']: f(f'relief not clipped to Italy ({p["clip"]})')
        if p['sea'] or p['svgBg'] not in ('rgba(0, 0, 0, 0)', 'transparent'): f('sea colour on the island map')
    elif vp != 'telefoon' and (p['stageRadius'] != '28px' or p['stageBg'] in ('rgba(0, 0, 0, 0)', 'transparent')): f(f'map not in a glass card ({p["stageRadius"]}, {p["stageBg"]})')
    want = {'desktop': 112, 'ipad-liggend': 88, 'ipad-staand': 56}.get(vp)
    if want and p['portrait'] != want: f(f'portrait {p["portrait"]} ≠ {want}')
    if p['violetText']: f(f'violet text outside meaning {p["violetText"][:5]}')
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
    d.text((pad, 10), 'Doelbeeld · R-oefenen-ijk', fill=(42, 36, 64), font=font)
    d.text((2 * pad + a.width, 10), label, fill=(42, 36, 64), font=font)
    im.save(out, quality=86)


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    res = {'runs': {}}; fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await pw.chromium.launch()
        for vp, (w, h) in VIEWPORTS.items():
            for variant, tail in VARIANTS.items():
                ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=vp != 'desktop', is_mobile=vp == 'telefoon')
                pg = await ctx.new_page(); errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                await pg.goto(HTML.as_uri() + '#bezig' + tail); await pg.wait_for_timeout(1500)
                await pg.evaluate('TOPO_V3.shell.go("oefenen")'); await pg.wait_for_timeout(400)
                for case, sel in (('city2', '[data-group=city2]'), ('islands', '[data-group=islands]'), ('smart', '[data-form=smart]')):
                    if case == 'city2': await pg.locator('[data-form=point]').click()
                    await pg.locator('.v3View-oefenen ' + sel).click(); await pg.wait_for_timeout(500)
                    p = await pg.evaluate(PROBE)
                    checks(p, vp, variant, case, fails.append)
                    if case == 'city2': width = p['panel']['w']
                    elif vp in ('desktop', 'ipad-liggend') and not near(p['panel']['w'], width): fails.append(f'{vp}/{variant}/{case}: the panel edge moves with the form ({width:.1f} → {p["panel"]["w"]:.1f})')
                    res['runs'][f'{vp}/{variant}/{case}'] = {k: p[k] for k in ('gut', 'col', 'viewCols', 'big', 'chipCols', 'portrait', 'kaart', 'focus')} | {'pins': len(p['pins'])}
                    if case == 'city2':
                        shot = OUT / f'oefenen-{variant}-{vp}.png'
                        await pg.screenshot(path=str(shot), full_page=vp == 'telefoon')
                        if vp in ('desktop', 'ipad-liggend'):
                            bar = round(await pg.evaluate("document.querySelector('.v3PreviewBar')?.getBoundingClientRect().height || 0"))
                            side_by_side(RENDER, shot, STIJL / f'oefenen-ijk-{variant}-{vp}.jpg', f'Build · variant ({"a" if variant == "eiland" else "b"}) {variant.capitalize()} · {vp}', bar)
                    if case == 'smart': await pg.locator('.v3View-oefenen [data-form=point]').click(); await pg.wait_for_timeout(300)
                if errs: fails.append(f'{vp}/{variant}: page errors {errs[:2]}')
                await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results-oefenen.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
