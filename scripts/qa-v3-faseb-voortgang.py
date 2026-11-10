#!/usr/bin/env python3
"""TOPO V3.0 fase B, stap 7 — Voortgang volgens de bijstelling van de eigenaar (docs/v3/renders/README.md § Voortgang,
bijstelling; § Raster en uitlijning; § Ingetogenheid). Presentation only; the data (places, chapters, daily goal,
toetsen, paspoort) stays covered by qa-v3-voortgang.py.

On #bezig (desktop 1440×900, iPad landscape 1180×820, iPad portrait 820×1180, phone 390×844) and #alles (desktop):
  * title bar: the display texts are exactly "Voortgang" and "n / 45", on one line (≥ 768), in ink (not violet), with
    a broad bar (≥ 14 px high; ≥ 768: ≥ 40% of the content width);
  * map card: a white card with the schoolkaart and the legend (Beheerst, Bezig, Nog niet) inside it; a mastered place
    in the accent colour, a place not yet started in cream; (≥ 1024, afwerking 10-11) the map fills the card (no empty
    column: card = map + 12 px each side, ±2 px), "Italië" with the number and the legend lie on the map;
  * chapters: 11 rows, each with its photo, a bar of three segments ≥ 10 px high (locked rows: no bar, the lock only)
    and a status illustration; the card scrolls on its own when the rows do not fit (≥ 1024);
  * Dagdoel with a line icon and 8 dots (on = n of 8), Pizza's and Vespa-ritten as tiles; no greeting, offline badge
    or streak;
  * ≥ 1024 (afwerking 10-11: map left, controls right): the map card on the inner margin at the left over the
    Werkblad's height below the title bar; the chapters one gutter right of it up to the inner margin, on the map
    card's top line; under them Dagdoel over the column's width, Pizza's and Vespa-ritten side by side, the last row on
    the map card's bottom line (±1 px); Toetsen and the paspoort below (the Werkblad scrolls as a whole);
  * no horizontal overflow.
Runs with prefers-reduced-transparency: no-preference. Writes screenshots, the comparisons beside R-voortgang
(docs/qa/v3-stijlbeeld/voortgang-ijk-<viewport>.jpg) and results-voortgang.json to docs/qa/v3-faseb/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-faseb-voortgang.py [preview.html]
"""
import re
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = ROOT / 'docs/qa/v3-faseb'
STIJL = ROOT / 'docs/qa/v3-stijlbeeld'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844)}
RUNS = [('bezig', 'desktop'), ('bezig', 'ipad-liggend'), ('bezig', 'ipad-staand'), ('bezig', 'telefoon'), ('alles', 'desktop')]

PROBE = r'''() => {
  const q = s => document.querySelector(s), R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height}; };
  const cs = n => getComputedStyle(n), px = v => parseFloat(v) || 0, vis = n => n && n.checkVisibility() && n.getBoundingClientRect().width > 0;
  const text = n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
  const view = q('.v3View-voortgang'), h1 = q('#v3VoortgangTitle'), count = view.querySelector('.v3VgCount strong'), bar = view.querySelector('.v3VgBar');
  const big = [...document.querySelectorAll('.v3Reis *')].filter(n => text(n) && vis(n) && px(cs(n).fontSize) >= 30 && !n.closest('.v3Brand')).map(n => n.textContent.trim().slice(0, 30));
  const fig = view.querySelector('.v3VgKaart'), svg = fig?.querySelector('svg.v3VgMap'), legend = fig?.querySelector('.v3VgLegend');
  const circ = k => { const n = svg?.querySelector('circle.city.v3St-' + k); return n ? cs(n).fill : null; };
  const probe = document.createElement('i'); probe.style.color = 'var(--v3-accent)'; view.append(probe); const accent = cs(probe).color; probe.style.color = 'var(--v3-ink)'; const ink = cs(probe).color; probe.remove();
  const side = view.querySelector('.v3VgSide .v3Card');
  const rows = [...view.querySelectorAll('.v3VgChapters li')].map(li => ({photo: vis(li.querySelector('.v3VgThumb img')), bar: R(li.querySelector('.v3VgSteps'))?.h, segs: li.querySelectorAll('.v3VgSteps i').length,
    art: vis(li.querySelector('.v3VgStatus img, .v3VgStatus svg')), status: li.dataset.status, barShown: !!li.querySelector('.v3VgSteps')?.checkVisibility({visibilityProperty: true})}));
  const dd = view.querySelector('.v3VgDagdoel'), dots = [...(dd?.querySelectorAll('.v3VgDots i') || [])];
  const vs = cs(view), gut = px(vs.columnGap), padL = px(vs.paddingLeft), inner = R(view).w - padL - px(vs.paddingRight), col = (inner - 11 * gut) / 12;
  const words = /buongiorno|offline|streak|reeks|dagen op rij/i;
  return {big, h1: R(h1), count: R(count), countText: count?.textContent, h1Color: cs(h1).color, countColor: cs(count).color, accent, ink, bar: R(bar),
    fig: R(fig), figBg: fig && cs(fig).backgroundColor, svgIn: !!svg && fig.contains(svg), relief: svg?.dataset.relief, legend: legend ? [...legend.querySelectorAll('li')].map(l => l.textContent.split(' · ')[0]) : [], legendIn: !!legend && fig.contains(legend), svgBox: R(svg), legendBox: R(legend), capBox: R(fig?.querySelector('.v3VgKaartTitle')),
    fillHi: circ('beheerst'), fillLo: circ('nog'), side: R(side), sideScroll: side ? {sh: side.scrollHeight, ch: side.clientHeight, ov: cs(side).overflowY} : null, rows,
    dagIcon: vis(dd?.querySelector('.v3VgTileIcon svg')), dots: dots.length, dotsOn: dots.filter(d => d.classList.contains('on')).length, daily: dd?.querySelector('strong')?.textContent,
    pizzas: vis(view.querySelector('.v3VgPizzas')), rides: vis(view.querySelector('.v3VgRides')), dag: R(dd), piz: R(view.querySelector('.v3VgPizzas')), rid: R(view.querySelector('.v3VgRides')),
    words: words.test(view.innerText), view: R(view), padL, gut, col, inner, hOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''


FIG = re.compile(r'^[\d\s\u202f/]+$')


def near(a, b, tol=1.0):
    return a is not None and b is not None and abs(a - b) <= tol


def checks(p, tag, vp, fail):
    f = lambda why: fail(f'{tag}: {why}')
    # Afwerking 10-11: key figures are 32–44/700 by design; the words are only the title.
    words = [t for t in p['big'] if not FIG.match(t)]
    if [w for w in words if not w.startswith('Italië')] != ['Voortgang'] or p['countText'] not in p['big'] or not p['countText'].endswith(' / 45'): f(f'display texts {p["big"]}')
    if p['h1Color'] != p['ink'] or p['countColor'] != p['ink']: f(f'title bar not in ink ({p["h1Color"]}, {p["countColor"]})')
    wide = vp != 'telefoon'
    if wide and not near(p['h1']['t'] + p['h1']['h'] / 2, p['count']['t'] + p['count']['h'] / 2, 4): f('title and count not on one line')
    if p['bar']['h'] < 14 or (wide and p['bar']['w'] < .4 * p['inner']): f(f'bar not broad ({p["bar"]["w"]:.0f}×{p["bar"]["h"]:.0f})')
    if p['figBg'] not in ('rgba(0, 0, 0, 0)', 'transparent') or not p['svgIn'] or p['relief'] != 'off': f(f'map card ({p["figBg"]}, svg {p["svgIn"]}, relief {p["relief"]})')
    if p['legend'] != ['Beheerst', 'Bezig', 'Nog niet'] or not p['legendIn']: f(f'legend {p["legend"]}')
    if p['fillHi'] and p['fillHi'] != p['accent']: f(f'mastered place {p["fillHi"]} ≠ accent {p["accent"]}')
    if p['fillLo'] and p['fillLo'] != 'rgb(243, 236, 220)': f(f'place not started {p["fillLo"]} ≠ cream')
    bad = [r for r in p['rows'] if not r['photo'] or not r['art'] or r['segs'] != 3 or (r['status'] == 'locked') == r['barShown'] or (r['status'] != 'locked' and (r['bar'] or 0) < 10)]
    if len(p['rows']) != 11 or bad: f(f'chapter rows ({len(p["rows"])}, {bad[:2]})')
    if not p['dagIcon'] or p['dots'] != 8 or p['daily'] != f'{p["dotsOn"]} / 8' or not p['pizzas'] or not p['rides']: f(f'Dagdoel/tiles ({p["dagIcon"]}, {p["dots"]}, {p["daily"]}, {p["dotsOn"]})')
    if p['words']: f('greeting, offline badge or streak shown')
    if vp in ('desktop', 'ipad-liggend'):
        v, g = p['view'], p['gut']; x0, x1 = v['l'] + p['padL'], v['l'] + p['padL'] + p['inner']; fig, sd, sv = p['fig'], p['side'], p['svgBox']
        inside = lambda a, b: a and b and a['l'] >= b['l'] - 1 and a['r'] <= b['r'] + 1 and a['t'] >= b['t'] - 1 and a['b'] <= b['b'] + 1
        if not near(fig['l'], x0, 1.5): f(f'map card not on the inner margin ({fig["l"]:.1f} vs {x0:.1f})')
        if not near(fig['w'], sv['w'] + 24, 2) or not near(fig['h'], sv['h'] + 24, 2): f(f'empty space in the map card ({fig["w"]:.0f}×{fig["h"]:.0f} vs map {sv["w"]:.0f}×{sv["h"]:.0f})')
        if not inside(p['capBox'], sv) or not inside(p['legendBox'], sv): f('title or legend not on the map')
        if not near(sd['l'], fig['r'] + g, 1.5) or not near(sd['r'], x1, 1.5): f(f'chapters not between the map card and the inner margin ({sd["l"]:.1f}–{sd["r"]:.1f})')
        if not near(sd['t'], fig['t']): f('map card and chapters not on one top line')
        if p['sideScroll']['sh'] > p['sideScroll']['ch'] + 1 and p['sideScroll']['ov'] not in ('auto', 'scroll'): f('chapters overflow without their own scroll')
        tiles = [p['dag'], p['piz'], p['rid']]
        if max(t['t'] for t in tiles) - min(t['t'] for t in tiles) > 1 or min(t['t'] for t in tiles) < fig['b'] or max(t['w'] for t in tiles) - min(t['w'] for t in tiles) > 1:
            f('three equal tiles must follow the map and chapter row')
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
            pg.on('pageerror', lambda e: errs.append(str(e)))
            cdp = await ctx.new_cdp_session(pg)
            await cdp.send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'no-preference'}]})
            await pg.goto(HTML.as_uri() + '#' + demo); await pg.wait_for_timeout(1500)
            await pg.locator('[data-nav=voortgang]').filter(visible=True).first.click(); await pg.wait_for_timeout(900)
            p = await pg.evaluate(PROBE); checks(p, tag, vp, fails.append)
            shot = OUT / f'voortgang-{demo}-{vp}.png'
            await pg.screenshot(path=str(shot))
            if demo == 'bezig' and vp in ('desktop', 'ipad-liggend'):
                bar = round(await pg.evaluate("document.querySelector('.v3PreviewBar')?.getBoundingClientRect().height || 0"))
                side_by_side(ROOT / 'docs/v3/renders/R-voortgang.webp', shot, STIJL / f'voortgang-ijk-{vp}.jpg', f'Build · {vp}', bar)
            if errs: fails.append(f'{tag}: page errors {errs[:2]}')
            res['runs'][tag] = {'big': p['big'], 'rows': [r['status'] for r in p['rows']], 'daily': p['daily'], 'legend': p['legend']}
            await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results-voortgang.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
