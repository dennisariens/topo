#!/usr/bin/env python3
"""TOPO V3.0 fase B, stap 4 — Les volgens R-les (docs/v3/renders/README.md § Per render: R-les, § Ingetogenheid,
§ Verfijning). Presentation only; the lesson flow itself is covered by qa-v3-les.py.

In a route lesson (#bezig, Steden 7–12, Aanwijzen) on desktop 1440×900 and iPad landscape 1180×820 (Focus Mode),
with the map variant as default:
  * desktop: the steps bar as two glass pills (the lesson; Schoolblad and the count on the right), tops and bottoms
    on one line (±1 px); the steps as one segmented pill;
  * every step mark is a line icon (no digits or ✓ characters): a check for done, the stage's form icon otherwise;
  * desktop: the prompt is the one display text (≥ 30 px); the secondary answers ("Ik weet het nog niet", "Toon
    antwoord") are full-width pills with a line icon; hidden V2 buttons stay hidden;
  * desktop: the zoom group (− + 100%) and the camera tools lie inside the map's box, in its corners (bottom right,
    top left); the map's top is on the question panel's top line (±1 px) and its bottom inside the frame;
  * (in a toets the hints stay hidden with the new pill style: checked by qa-v3-toets.py, "hints");
  * iPad (Focus Mode): the bar keeps its single row (the wrappers dissolve), the marks are icons, nothing overflows.
Writes screenshots and the comparison beside R-les (docs/qa/v3-stijlbeeld/les-ijk-<viewport>.jpg) and
results-les.json to docs/qa/v3-faseb/.

Runs with prefers-reduced-transparency: no-preference (the reduced variant is covered by qa-v3-glas.py).

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-faseb-les.py
"""
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
OUT = ROOT / 'docs/qa/v3-faseb'
STIJL = ROOT / 'docs/qa/v3-stijlbeeld'
RENDER = ROOT / 'docs/v3/renders/R-les.webp'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820)}

PROBE = r'''() => {
  const q = s => document.querySelector(s), R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height}; };
  const cs = (n, pe) => getComputedStyle(n, pe), px = v => parseFloat(v) || 0, vis = n => n && n.checkVisibility() && n.getBoundingClientRect().width > 0;
  const text = n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
  const group = q('.v3LesGroup'), end = q('.v3LesEnd');
  const marks = [...document.querySelectorAll('.v3LesStep .v3LesMark')].filter(vis).map(m => ({icon: (m.querySelector('use')?.getAttribute('href') || '').replace('#topo-', ''), text: m.textContent.trim(), state: m.closest('.v3LesStep').dataset.state}));
  const big = [...document.querySelectorAll('body *')].filter(n => text(n) && vis(n) && px(cs(n).fontSize) >= 30 && !n.closest('.v3Brand,.v3PreviewBar')).map(n => n.textContent.trim().slice(0, 30));
  const secondary = [...document.querySelectorAll('#quiz>.buttons>.button')].map(b => ({id: b.id, quiet: b.classList.contains('ninoQuiet'), hidden: b.classList.contains('hidden') || b.hidden, shown: vis(b), w: b.getBoundingClientRect().width,
    icon: cs(b, '::before').maskImage || cs(b, '::before').webkitMaskImage || 'none', radius: cs(b).borderTopLeftRadius}));
  const buttonsW = R(q('#quiz>.buttons'))?.w;
  return {group: vis(group) ? R(group) : null, end: vis(end) ? R(end) : null, groupBg: group && cs(group).backgroundColor, groupDisplay: group && cs(group).display,
    steps: R(q('.v3LesSteps')), stepsBg: cs(q('.v3LesSteps')).backgroundColor, marks, big, secondary, buttonsW,
    map: R(q('.mapArea')), zoom: R([...document.querySelectorAll('.atlasZoom')].find(vis)), camera: vis(q('.focusCameraTools')) ? R(q('.focusCameraTools')) : null, panel: R(q('aside.panel')),
    frame: R(q('body')), focus: document.body.dataset.focusShell === 'true', hOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''


def near(a, b, tol=1.0):
    return a is not None and b is not None and abs(a - b) <= tol


def inside(a, b, tol=1):
    return a and b and a['l'] >= b['l'] - tol and a['r'] <= b['r'] + tol and a['t'] >= b['t'] - tol and a['b'] <= b['b'] + tol


def checks(p, vp, fail):
    f = lambda why: fail(f'{vp}: {why}')
    bad = [m for m in p['marks'] if not m['icon'] or m['text']]
    if bad or not p['marks']: f(f'step marks not line icons {p["marks"]}')
    for m in p['marks']:
        want = 'v3checkmark' if m['state'] == 'done' else None
        if want and m['icon'] != want: f(f'done mark {m}')
        if m['state'] != 'done' and m['icon'] not in ('v3discover', 'v3point', 'v3write'): f(f'stage mark {m}')
    if p['hOverflow']: f('horizontal overflow')
    if p['focus']:
        if p['groupDisplay'] != 'contents': f(f'Focus Mode bar wrappers not dissolved ({p["groupDisplay"]})')
        return
    if not p['group'] or not p['end']: f('steps bar not two pills'); return
    if not (near(p['group']['t'], p['end']['t']) and near(p['group']['b'], p['end']['b'])): f(f'bar pills not on one line {p["group"]} {p["end"]}')
    if p['groupBg'] in ('rgba(0, 0, 0, 0)', 'transparent'): f('lesson pill not glass')
    if p['stepsBg'] in ('rgba(0, 0, 0, 0)', 'transparent'): f('steps not one segmented pill')
    if p['big'] != [p['big'][0]] or not p['big'][0].startswith('Waar ligt'): f(f'display texts {p["big"]} (only the prompt)')
    for b in p['secondary']:
        if b['hidden'] and b['shown']: f(f'hidden V2 button shown {b["id"]}')
        if b['shown'] and (b['quiet'] or b['id'] in ('reveal', 'mistakes')):
            if not near(b['w'], p['buttonsW'], 1.5) or 'svg' not in b['icon']: f(f'secondary answer not a full-width pill with icon {b}')
    if not inside(p['zoom'], p['map']) or not near(p['zoom']['r'], p['map']['r'] - 14, 2) or not near(p['zoom']['b'], p['map']['b'] - 14, 2): f(f'zoom group not in the map\'s bottom-right corner {p["zoom"]} {p["map"]}')
    if p['camera'] and (not inside(p['camera'], p['map']) or not near(p['camera']['l'], p['map']['l'] + 14, 2) or not near(p['camera']['t'], p['map']['t'] + 14, 2)): f(f'camera tools not in the map\'s top-left corner {p["camera"]}')
    if not near(p['map']['t'], p['panel']['t']): f(f'map top {p["map"]["t"]:.1f} ≠ panel top {p["panel"]["t"]:.1f}')


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
    d.text((pad, 10), 'Doelbeeld · R-les', fill=(42, 36, 64), font=font)
    d.text((2 * pad + a.width, 10), label, fill=(42, 36, 64), font=font)
    im.save(out, quality=86)


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    res = {'runs': {}}; fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await pw.chromium.launch()
        for vp, (w, h) in VIEWPORTS.items():
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=vp != 'desktop')
            pg = await ctx.new_page(); errs = []
            # The glass as designed (the QA machine may prefer reduced transparency; that variant is qa-v3-glas.py).
            await (await ctx.new_cdp_session(pg)).send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'no-preference'}]})
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(HTML.as_uri() + '#bezig'); await pg.wait_for_timeout(1500)
            await pg.locator('.v3Actions .primary').first.evaluate('n => n.click()'); await pg.wait_for_timeout(900)
            p = await pg.evaluate(PROBE)
            checks(p, vp, fails.append)
            if errs: fails.append(f'{vp}: page errors {errs[:2]}')
            shot = OUT / f'les-{vp}.png'
            await pg.screenshot(path=str(shot))
            bar = round(await pg.evaluate("document.querySelector('.v3PreviewBar')?.getBoundingClientRect().height || 0"))
            side_by_side(RENDER, shot, STIJL / f'les-ijk-{vp}.jpg', f'Build · {vp}', bar)
            res['runs'][vp] = {k: p[k] for k in ('marks', 'big', 'focus')}
            await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results-les.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
