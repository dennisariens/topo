#!/usr/bin/env python3
"""TOPO V3.0 fase B, stap 5 — Toets instellen volgens R-toets-instellen (docs/v3/renders/README.md § Per render,
§ Voortgang: Werkblad, § Raster en uitlijning). Presentation only; the toets itself is covered by qa-v3-toets.py.

On #bezig, desktop 1440×900, iPad landscape 1180×820, iPad portrait 820×1180 and the phone 390×844:
  * one display text (≥ 30 px, the wordmark aside): "Toets";
  * all 11 chapters and Alles as chips, three columns (phone: two), each on one line with its full name; a chosen chip
    carries a check icon, an unchosen one none; choosing one more adds its check;
  * the form as three tiles with line icons (Beide: two), no illustrations; the length as chips without radio dots;
  * one primary pill (Start toets) with the play icon, as wide as the set-up;
  * ≥ 1024: the set-up starts on the plate's inner edge and spans 6 (desktop) or 7 (iPad landscape) of 12 columns
    (±1.5 px); Nino stands to its right, inside the plate, as decoration (aria-hidden);
  * no horizontal overflow.
Toets resultaat (R-toets-resultaat), after a toets of 10 with 3 skipped, desktop and iPad landscape (variant (a)) and
desktop (variant (b)):
  * the score is the one display text, in a glass card; Nino (decoration) is visible;
  * the map in the same variant as Reis ((a): relief clipped to Italy with this clone's clip; (b): a glass card), the
    10 marks inside the map's box; the other places step back;
  * one glass panel on the right: the mistakes with a × (CSS, the list's DOM unchanged), the primary Oefen deze fouten
    with an icon, and Nieuwe toets, Kopieer, E-mail, Print as tiles with a line icon;
  * ≥ 1024: the score card and the panel on one top line (±1 px); the map on 7 columns, the panel on 5 (±1.5 px).
Writes screenshots, the comparisons beside R-toets-instellen and R-toets-resultaat
(docs/qa/v3-stijlbeeld/toets-instellen-<viewport>.jpg, toets-resultaat-<variant>-<viewport>.jpg)
and results-toets.json to docs/qa/v3-faseb/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-faseb-toets.py
"""
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
OUT = ROOT / 'docs/qa/v3-faseb'
STIJL = ROOT / 'docs/qa/v3-stijlbeeld'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844)}

PROBE = r'''() => {
  const q = s => document.querySelector(s), R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height}; };
  const cs = (n, pe) => getComputedStyle(n, pe), px = v => parseFloat(v) || 0, vis = n => n && n.checkVisibility() && n.getBoundingClientRect().width > 0;
  const text = n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
  const view = q('.v3View-toets'), setup = q('.v3ToetsSetup'), nino = q('.v3ToetsSetupNino');
  const big = [...document.querySelectorAll('.v3Reis *')].filter(n => text(n) && vis(n) && px(cs(n).fontSize) >= 30 && !n.closest('.v3Brand')).map(n => n.textContent.trim().slice(0, 30));
  const chips = [...document.querySelectorAll('[aria-labelledby=v3ToetsHoofdstukken] .v3Chip')].map(c => ({t: c.textContent.replace(/\s+/g, ' ').trim(), on: c.getAttribute('aria-pressed') === 'true',
    check: !!c.querySelector('use[href="#topo-v3checkmark"]'), h: Math.round(c.getBoundingClientRect().height), clip: c.scrollWidth > c.clientWidth + 1, l: Math.round(c.getBoundingClientRect().left)}));
  const forms = [...document.querySelectorAll('[aria-labelledby=v3ToetsVorm] .v3FormBtn')].map(b => ({v: b.dataset.value, icons: b.querySelectorAll('svg.v3Icon').length, img: !!b.querySelector('img')}));
  const lens = [...document.querySelectorAll('[aria-labelledby=v3ToetsLengte] .v3Chip')].map(b => ({radio: !!b.querySelector('input[type=radio]'), before: cs(b, '::before').content}));
  const prim = [...view.querySelectorAll('.v3Btn.primary')].filter(vis);
  const vs = cs(view), padL = px(vs.paddingLeft), padR = px(vs.paddingRight), gut = px(vs.columnGap) || px(cs(q('.v3Reis')).columnGap);
  const inner = R(view).w - padL - padR, col = (inner - 11 * gut) / 12;
  return {big, chips, chipCols: new Set(chips.map(c => c.l)).size, titles: ROUTE_CHAPTERS.map(c => c.title.replace(/\s+/g, ' ').trim()), forms, lens,
    primaries: prim.length, play: prim[0]?.querySelector('use')?.getAttribute('href'), startW: prim[0]?.getBoundingClientRect().width, setup: R(setup), view: R(view), padL, gut, col,
    nino: vis(nino) ? R(nino) : null, ninoHidden: nino?.getAttribute('aria-hidden'), ninoImg: !!nino?.querySelector('img'), hOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''


RESULT = r'''() => {
  const q = s => document.querySelector(s), R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height}; };
  const cs = (n, pe) => getComputedStyle(n, pe), px = v => parseFloat(v) || 0, vis = n => n && n.checkVisibility() && n.getBoundingClientRect().width > 0;
  const text = n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
  const v = q('.v3View-toetsResult'), map = v.querySelector('.v3ToetsMap'), card = v.querySelector('.v3ToetsScoreCard'), side = v.querySelector('.v3ToetsSide');
  const big = [...document.querySelectorAll('.v3Reis *')].filter(n => text(n) && vis(n) && px(cs(n).fontSize) >= 30 && !n.closest('.v3Brand')).map(n => n.textContent.trim().slice(0, 30));
  const mb = R(map), marks = [...map.querySelectorAll('.v3Mark circle')].map(R);
  const tiles = [...v.querySelectorAll('.v3ToetsTile')].map(b => ({t: b.textContent.trim(), icon: !!b.querySelector('svg.v3Icon')}));
  const prim = v.querySelector('.v3ToetsActions .primary');
  const rows = [...v.querySelectorAll('.v3ToetsFouten li')].map(li => cs(li, '::before').maskImage.includes('svg'));
  const vs = cs(v), gut = px(vs.columnGap), col = (R(v).w - 11 * gut) / 12;
  return {big, nino: vis(v.querySelector('.v3ToetsNino img')), kaart: map.dataset.kaart, clip: cs(map.querySelector('.atlasTerrain')).clipPath,
    marks: marks.length, marksIn: marks.every(c => c.l >= mb.l - 2 && c.r <= mb.r + 2 && c.t >= mb.t - 2 && c.b <= mb.b + 2),
    cardBg: cs(card).backgroundColor, sideBg: cs(side).backgroundColor, kaartBg: cs(v.querySelector('.v3ToetsKaart')).backgroundColor, kaartRadius: cs(v.querySelector('.v3ToetsKaart')).borderTopLeftRadius,
    tiles, primary: prim && prim.textContent.trim(), primaryIcon: !!prim?.querySelector('svg.v3Icon'), rows,
    card: R(card), side: R(side), kaartBox: R(v.querySelector('.v3ToetsKaart')), view: R(v), gut, col, hOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''


def result_checks(p, tag, variant, wide, fail):
    f = lambda why: fail(f'result {tag}: {why}')
    if len(p['big']) != 1 or not p['big'][0].startswith('7 / 10'): f(f'display texts {p["big"]}')
    if not p['nino']: f('Nino not shown')
    if p['marks'] != 10 or not p['marksIn']: f(f'marks {p["marks"]} inside={p["marksIn"]}')
    if p['kaart'] != variant: f(f'map variant {p["kaart"]}')
    if variant == 'eiland' and 'v3t-italyClip' not in p['clip']: f(f'relief not clipped ({p["clip"]})')
    if variant == 'kaart' and wide and (p['kaartRadius'] != '28px' or p['kaartBg'] in ('rgba(0, 0, 0, 0)', 'transparent')): f('map not in a glass card')
    for k in ('cardBg', 'sideBg'):
        if p[k] in ('rgba(0, 0, 0, 0)', 'transparent'): f(f'{k} not glass')
    if [t['t'] for t in p['tiles']] != ['Nieuwe toets', 'Kopieer', 'E-mail', 'Print'] or not all(t['icon'] for t in p['tiles']): f(f'tiles {p["tiles"]}')
    if p['primary'] != 'Oefen deze fouten' or not p['primaryIcon']: f(f'primary {p["primary"]}')
    if len(p['rows']) != 3 or not all(p['rows']): f(f'mistake rows with × {p["rows"]}')
    if wide:
        if not near(p['card']['t'], p['side']['t']): f(f'score card top {p["card"]["t"]:.1f} ≠ panel top {p["side"]["t"]:.1f}')
        if not near(p['kaartBox']['w'], 7 * p['col'] + 6 * p['gut'], 1.5) or not near(p['side']['w'], 5 * p['col'] + 4 * p['gut'], 1.5): f(f'map {p["kaartBox"]["w"]:.1f} / panel {p["side"]["w"]:.1f} not 7 / 5 columns')
    if p['hOverflow']: f('horizontal overflow')


async def play_toets(pg):
    await pg.evaluate('TOPO_V3.shell.go("toets")'); await pg.wait_for_timeout(300)
    await pg.locator('[aria-labelledby=v3ToetsHoofdstukken] [data-group=city2]').click(); await pg.wait_for_timeout(200)
    await pg.locator('[aria-labelledby=v3ToetsLengte] [data-value="10"]').click(); await pg.wait_for_timeout(200)
    await pg.locator('.v3View-toets .v3Start').click(); await pg.wait_for_timeout(800)
    for n in range(10):
        q = await pg.evaluate('state.current.id'); mode = await pg.evaluate('state.questionMode')
        if n in (2, 5, 8):
            await pg.evaluate('document.querySelector("#next").click()'); await pg.wait_for_timeout(250)
            await pg.evaluate('document.querySelector("#next").click()'); await pg.wait_for_timeout(300); continue
        if mode == 'point': await pg.locator(f'#map [data-id="{q}"][tabindex="0"]').first.press('Enter')
        else:
            await pg.locator('#answer').fill(await pg.evaluate('state.current.name')); await pg.locator('#answer').press('Enter')
        await pg.wait_for_timeout(200); await pg.evaluate('document.querySelector("#next").click()'); await pg.wait_for_timeout(300)
    await pg.wait_for_timeout(900)


def near(a, b, tol=1.0):
    return a is not None and b is not None and abs(a - b) <= tol


def checks(p, vp, fail, tag=''):
    f = lambda why: fail(f'{vp}{tag}: {why}')
    if p['big'] != ['Toets']: f(f'display texts {p["big"]}')
    shown = [c['t'] for c in p['chips']]
    if [t for t in p['titles'] if t not in shown] or 'Alles' not in shown or len(shown) != 12: f(f'chapter chips {shown}')
    want = 2 if vp == 'telefoon' else 3
    if p['chipCols'] != want: f(f'{p["chipCols"]} chip columns ≠ {want}')
    bad = [c for c in p['chips'] if c['h'] > 48 or c['clip'] or c['on'] != c['check']]
    if bad: f(f'chips not on one line, or check ≠ chosen {bad[:3]}')
    if [x['icons'] for x in p['forms']] != [1, 1, 2] or any(x['img'] for x in p['forms']): f(f'form tiles {p["forms"]}')
    if any(x['radio'] or x['before'] not in ('none', 'normal', '""') for x in p['lens']): f(f'length chips with radio {p["lens"]}')
    if p['primaries'] != 1 or p['play'] != '#topo-v3play' or not near(p['startW'], p['setup']['w'], 1.5): f(f'start pill ({p["primaries"]}, {p["play"]}, {p["startW"]} vs {p["setup"]["w"]})')
    if vp in ('desktop', 'ipad-liggend'):
        n = 6 if vp == 'desktop' else 7
        if not near(p['setup']['l'] - p['view']['l'], p['padL']) or not near(p['setup']['w'], n * p['col'] + (n - 1) * p['gut'], 1.5): f(f'set-up not on {n} columns ({p["setup"]["w"]:.1f} vs {n * p["col"] + (n - 1) * p["gut"]:.1f})')
        if not p['nino'] or not p['ninoImg'] or p['ninoHidden'] != 'true' or p['nino']['l'] < p['setup']['r'] or p['nino']['r'] > p['view']['r'] + 1: f(f'Nino not beside the set-up in the plate {p["nino"]}')
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
        for vp, (w, h) in VIEWPORTS.items():
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=vp != 'desktop', is_mobile=vp == 'telefoon')
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(HTML.as_uri() + '#bezig'); await pg.wait_for_timeout(1500)
            await pg.evaluate('TOPO_V3.shell.go("toets")'); await pg.wait_for_timeout(500)
            p = await pg.evaluate(PROBE); checks(p, vp, fails.append)
            shot = OUT / f'toets-instellen-{vp}.png'
            await pg.screenshot(path=str(shot), full_page=vp == 'telefoon')
            if vp in ('desktop', 'ipad-liggend'):
                bar = round(await pg.evaluate("document.querySelector('.v3PreviewBar')?.getBoundingClientRect().height || 0"))
                side_by_side(ROOT / 'docs/v3/renders/R-toets-instellen.webp', shot, STIJL / f'toets-instellen-{vp}.jpg', f'Build · {vp}', bar)
            # Choosing one more chapter adds its check.
            await pg.locator('[aria-labelledby=v3ToetsHoofdstukken] [data-group=city2]').click(); await pg.wait_for_timeout(300)
            p2 = await pg.evaluate(PROBE); checks(p2, vp, fails.append, '/+city2')
            if not any(c['t'].startswith('Steden 7') and c['on'] and c['check'] for c in p2['chips']): fails.append(f'{vp}: chosen chapter without check')
            if errs: fails.append(f'{vp}: page errors {errs[:2]}')
            res['runs'][vp] = {'big': p['big'], 'chipCols': p['chipCols'], 'chosen': [c['t'] for c in p2['chips'] if c['on']], 'forms': p['forms']}
            await ctx.close()
        for vp, variant in (('desktop', 'eiland'), ('ipad-liggend', 'eiland'), ('desktop', 'kaart')):
            w, h = VIEWPORTS[vp]
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=vp != 'desktop')
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(HTML.as_uri() + '#bezig' + ('/kaart' if variant == 'kaart' else '')); await pg.wait_for_timeout(1500)
            await play_toets(pg)
            if await pg.evaluate('TOPO_V3.ui.view') != 'toetsResult': fails.append(f'result {vp}/{variant}: no result view'); await ctx.close(); continue
            p = await pg.evaluate(RESULT); result_checks(p, f'{vp}/{variant}', variant, True, fails.append)
            shot = OUT / f'toets-resultaat-{variant}-{vp}.png'; await pg.screenshot(path=str(shot))
            bar = round(await pg.evaluate("document.querySelector('.v3PreviewBar')?.getBoundingClientRect().height || 0"))
            side_by_side(ROOT / 'docs/v3/renders/R-toets-resultaat.webp', shot, STIJL / f'toets-resultaat-{variant}-{vp}.jpg', f'Build · variant ({"a" if variant == "eiland" else "b"}) {variant.capitalize()} · {vp}', bar)
            if errs: fails.append(f'result {vp}/{variant}: page errors {errs[:2]}')
            res['runs'][f'result/{vp}/{variant}'] = {k: p[k] for k in ('big', 'marks', 'kaart', 'tiles', 'primary')}
            await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results-toets.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
