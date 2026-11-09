#!/usr/bin/env python3
"""TOPO V3 — stijlbeeld (renderniveau) QA for Reis.

Checks the style image against the brief (docs/v3/ARTWORK_BRIEF.md, Volgorde 1): the V2 panorama full-bleed behind
the app on desktop and iPad (none on phone), the floating frosted-glass window (radius 24, soft shadow), the #75
miniatures from assets/v3/scenes/manifest.json (byte-checked) with chapter icons where a scene is missing, relief on by
default with the render palette on the existing layer, a white coast rim and a soft land shadow — while the map
geometry stays exactly the live map's (46/46). Writes screenshots, side-by-side comparisons with the owner's concept
renders, and results.json to docs/qa/v3-stijlbeeld/.

Needs Playwright (Chromium or Chrome) and Pillow. Concept renders: RENDERS_DIR (default ~/Downloads).
Usage:  node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-stijlbeeld.py
"""
import asyncio, base64, hashlib, io, json, os, sys
from pathlib import Path
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
OUT = ROOT / 'docs/qa/v3-stijlbeeld'
MANIFEST = json.loads((ROOT / 'assets/v3/scenes/manifest.json').read_text())
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
RENDERS_DIR = Path(os.environ.get('RENDERS_DIR', Path.home() / 'Downloads'))
RENDERS = {  # the owner's five concept renders (9 November 2026), the target images
    'r1-kaart': 'TOPO_ Italiaanse meren ontdekken-1.png',
    'r3-les': 'Topo V2_ Meren van Italië-3.png',
    'r4-voortgang': 'Topo V2_ Jouw voortgang in Italië-4.png',
    'r5-hoofdstukken': 'Topo hoofdstukken in Italiaans landschap-5.png',
    'r6-voortgangskaart': 'Topo Italië Voortgangskaart-6.png',
}
VIEWPORTS = {'desktop': (1440, 900), 'ipad-landscape': (1180, 820), 'phone': (390, 844)}
sha = lambda b: hashlib.sha256(b).hexdigest()

PROBE = r'''() => {
  const body = document.body, cs = n => getComputedStyle(n), win = document.querySelector('.v3Reis'), w = cs(win), r = win.getBoundingClientRect();
  const pano = document.querySelector('.routeScene img')?.src || '';
  const bg = cs(body).backgroundImage, alpha = (c => { const m = c.match(/[\d.]+/g) || []; return c.startsWith('color(') ? (c.includes('/') ? parseFloat(c.split('/')[1]) : 1) : m.length > 3 ? +m[3] : 1; })(w.backgroundColor);
  const map = document.querySelector('.v3Map'), terrain = map.querySelector('.atlasTerrain'), italy = map.querySelector('.italy');
  const glow = map.querySelector('.v3CoastGlow'), shadow = map.querySelector('.v3LandShadow'), base = map.querySelector('.v3LandBase');
  const rows = [...document.querySelectorAll('.v3Row')].map(b => { const i = b.querySelector('.v3Thumb img');
    return {chapter: b.dataset.chapter, icon: b.querySelector('.v3Thumb').classList.contains('v3ThumbIcon'), src: i?.getAttribute('src') || '', natural: i ? [i.naturalWidth, i.naturalHeight] : null,
            box: i ? [Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)] : null,
            nameClipped: (n => n.scrollWidth > n.clientWidth + 1)(b.querySelector('.v3Name')), nameLines: Math.round(b.querySelector('.v3Name').getBoundingClientRect().height / parseFloat(cs(b.querySelector('.v3Name')).lineHeight || 20))}; });
  const icons = Object.fromEntries(ROUTE_CHAPTERS.map((c, i) => [c.id, NINO_V2_ART['chapter' + i]?.src || '']));
  const primary = document.querySelector('.v3Actions .primary')?.getBoundingClientRect();
  return {
    backdrop: {image: bg !== 'none', isV2Panorama: !!pano && bg.includes(pano.slice(0, 200)), size: cs(body).backgroundSize, attachment: cs(body).backgroundAttachment},
    window: {radius: w.borderTopLeftRadius, backdropFilter: w.backdropFilter, shadow: w.boxShadow !== 'none', bgAlpha: alpha,
             gaps: [Math.round(r.left), Math.round(innerWidth - r.right), Math.round(r.top), Math.round(innerHeight - r.bottom)]},
    rows, icons,
    relief: {mode: map.dataset.relief, terrain: cs(terrain).display, filter: cs(terrain).filter, pressed: document.querySelector('.v3Switch [aria-pressed=true]')?.textContent},
    coast: {stroke: cs(italy).stroke, width: cs(italy).strokeWidth, glow: glow ? cs(glow).display : null, shadow: shadow ? cs(shadow).display : null,
            base: base ? cs(base).display : null, copies: (glow?.children.length || 0) + (shadow?.children.length || 0) + (base?.children.length || 0), copiesWithId: map.querySelectorAll(':is(.v3CoastGlow,.v3LandShadow,.v3LandBase) :is([data-id],[class])').length,
            landShapes: [...map.querySelectorAll('.land,.italy')].filter(n => n.getAttribute('d')).length},
    targets: {live: document.querySelectorAll('#map [data-id]').length, clone: map.querySelectorAll('[data-id]').length},
    primaryAboveFold: !!primary && primary.bottom <= innerHeight && primary.top >= 0,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
  };
}'''
GEOMETRY = r'''() => { const live = document.querySelector('#map'), clone = document.querySelector('.v3Map'); let same = 0, diff = [];
  for (const n of live.querySelectorAll('[data-id]')) { const id = n.getAttribute('data-id'), k = clone.querySelectorAll('[data-id="' + id + '"]')[[...live.querySelectorAll('[data-id="' + id + '"]')].indexOf(n)];
    const keys = ['d', 'cx', 'cy', 'r', 'points', 'x', 'y']; if (k && keys.every(a => n.getAttribute(a) === k.getAttribute(a))) same++; else diff.push(id); }
  return {same, diff: diff.slice(0, 5), total: live.querySelectorAll('[data-id]').length}; }'''


async def page(b, w, h, hash, reduce=False):
    pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1)
    errors = []; pg.on('pageerror', lambda e: errors.append(str(e)))
    cdp = await pg.context.new_cdp_session(pg)
    await cdp.send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'reduce' if reduce else 'no-preference'}]})
    await pg.goto(HTML.as_uri() + '#' + hash, wait_until='commit')
    await pg.wait_for_timeout(4500 if hash.startswith('thema') else 2200)
    return pg, errors


def composite(render_path, shot_path, out_path, title):
    """Render (left) and screenshot (right) at the same height, labelled, saved as JPEG."""
    H = 760
    r = Image.open(render_path).convert('RGB'); s = Image.open(shot_path).convert('RGB')
    r = r.resize((round(r.width * H / r.height), H), Image.LANCZOS); s = s.resize((round(s.width * H / s.height), H), Image.LANCZOS)
    pad, top = 24, 56
    c = Image.new('RGB', (r.width + s.width + pad * 3, H + top + pad), '#ece6da'); d = ImageDraw.Draw(c)
    try: f = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 22)
    except Exception: f = ImageFont.load_default()
    d.text((pad, 18), 'Doelbeeld (conceptrender eigenaar)', fill='#073f3b', font=f)
    d.text((pad * 2 + r.width, 18), title, fill='#073f3b', font=f)
    c.paste(r, (pad, top)); c.paste(s, (pad * 2 + r.width, top)); c.save(out_path, quality=82, optimize=True)


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    res = {'html': str(HTML.relative_to(ROOT)), 'htmlSha256': sha(HTML.read_bytes()), 'indexSha256': sha((ROOT / 'index.html').read_bytes()), 'runs': {}, 'errors': []}
    minis = {k: v['mini']['sha256'] for k, v in MANIFEST['chapters'].items()}
    async with async_playwright() as p:
        exe = MAC_CHROME if Path(MAC_CHROME).exists() else None
        b = await p.chromium.launch(executable_path=exe) if exe else await p.chromium.launch()
        res['browser'] = b.version
        for vp, (w, h) in VIEWPORTS.items():
            for theme in (['italia', 'viola'] if vp != 'phone' else ['italia']):
                key = f'{vp}-{theme}'
                pg, errors = await page(b, w, h, 'bezig' + ('/viola' if theme == 'viola' else ''))
                run = await pg.evaluate(PROBE); run['geometry'] = await pg.evaluate(GEOMETRY)
                run['theme'] = await pg.evaluate('getComputedStyle(document.querySelector(".v3Reis")).getPropertyValue("--v3-accent").trim()')
                # Miniatures: decoded bytes equal the manifest; missing scenes show the chapter icon.
                for row in run['rows']:
                    if row['src'].startswith('data:image/webp;base64,') and not row['icon']:
                        row['sha256'] = sha(base64.b64decode(row['src'].split(',', 1)[1]))
                    row['iconIsChapterIcon'] = row['icon'] and row['src'] == run['icons'].get(row['chapter'])
                    del row['src']
                del run['icons']
                await pg.screenshot(path=str(OUT / f'{key}.png'))
                run['errors'] = errors; res['runs'][key] = run; await pg.close()
        # Reduced transparency (macOS "Verminder transparantie"): the window turns opaque, the backdrop stays.
        pg, errors = await page(b, 1440, 900, 'bezig', reduce=True)
        res['reducedTransparency'] = (await pg.evaluate(PROBE))['window']; await pg.screenshot(path=str(OUT / 'desktop-verminder-transparantie.png')); await pg.close()
        # Theme pairs: Italia and Viola side by side.
        for name, hash in [('italia-viola-desktop', 'thema-bezig'), ('italia-viola-ipad', 'thema-ipad-bezig')]:
            pg, errors = await page(b, 1440, 900, hash)
            res.setdefault('pairs', {})[name] = await pg.evaluate('[...document.querySelectorAll("iframe")].map(f=>f.getAttribute("src").split("#")[1])')
            await pg.screenshot(path=str(OUT / f'{name}.png')); res['errors'] += errors; await pg.close()
        await b.close()

    runs = res['runs']; big = {k: v for k, v in runs.items() if not k.startswith('phone')}
    every = lambda d, f: all(f(v) for v in d.values())
    res['summary'] = {
        'indexUnchanged': res['indexSha256'].startswith('3aced3c3'),
        'backdropIsV2Panorama': every(big, lambda r: r['backdrop']['image'] and r['backdrop']['isV2Panorama'] and r['backdrop']['size'] == 'cover'),
        'phoneNoBackdrop': every({k: v for k, v in runs.items() if k.startswith('phone')}, lambda r: not r['backdrop']['image']),
        'floatingGlassWindow': every(big, lambda r: r['window']['radius'] == '24px' and 'blur' in r['window']['backdropFilter'] and r['window']['shadow'] and r['window']['bgAlpha'] < 1 and min(r['window']['gaps']) >= 16),
        'reducedTransparencyOpaque': res['reducedTransparency']['backdropFilter'] == 'none' and res['reducedTransparency']['bgAlpha'] == 1,
        'miniaturesMatchManifest': every(runs, lambda r: all(row.get('sha256') == minis[row['chapter']] and row['natural'] == [480, 270] for row in r['rows'] if row['chapter'] in minis)),
        'missingScenesUseChapterIcon': every(runs, lambda r: [row['chapter'] for row in r['rows'] if row['iconIsChapterIcon']] == ['city2', 'city3', 'city4']),
        'reliefDefaultWithPalette': every(runs, lambda r: r['relief']['mode'] == 'on' and r['relief']['terrain'] == 'block' and 'v3-relief-palette' in r['relief']['filter'] and r['relief']['pressed'] == 'Reliëf'),
        'whiteCoastAndShadow': every(runs, lambda r: r['coast']['stroke'] == 'rgb(255, 255, 255)' and r['coast']['width'] == '1.5px' and r['coast']['glow'] == 'block' and r['coast']['shadow'] == 'block' and r['coast']['base'] == 'block' and r['coast']['copiesWithId'] == 0 and r['coast']['copies'] == 3 * r['coast']['landShapes']),
        'geometrySame': {k: f"{r['geometry']['same']}/{r['geometry']['total']}" for k, r in runs.items()},
        'geometryAllSame': every(runs, lambda r: r['geometry']['same'] == r['geometry']['total'] == 46 and r['targets']['clone'] == r['targets']['live']),
        'themes': {k: r['theme'] for k, r in runs.items()},
        'themePairs': res.get('pairs'),
        'namesClipped': [f"{k}/{row['chapter']}" for k, r in runs.items() for row in r['rows'] if row['nameClipped']],
        'namesTwoLines': [f"{k}/{row['chapter']}" for k, r in runs.items() for row in r['rows'] if row['nameLines'] > 1],
        'primaryAboveFold': every(runs, lambda r: r['primaryAboveFold']),
        'horizontalOverflow': [k for k, r in runs.items() if r['horizontalOverflow']],
        'errors': len(res['errors']) + sum(len(r['errors']) for r in runs.values()),
    }
    # Comparisons: each concept render next to the matching Reis screenshot (desktop 1440×900).
    comps = {}
    for rid, shot, title in [('r1-kaart', 'desktop-viola', 'Stijlbeeld Reis · Viola · 1440×900'), ('r1-kaart', 'desktop-italia', 'Stijlbeeld Reis · Italia · 1440×900'),
                             ('r5-hoofdstukken', 'desktop-italia', 'Stijlbeeld Reis · hoofdstukbeelden'), ('r1-kaart', 'ipad-landscape-italia', 'Stijlbeeld Reis · iPad liggend 1180×820')]:
        src = RENDERS_DIR / RENDERS[rid]
        if not src.exists(): comps[f'{rid}+{shot}'] = 'render ontbreekt: ' + RENDERS[rid]; continue
        out = OUT / f'vergelijking-{rid}-{shot}.jpg'; composite(src, OUT / f'{shot}.png', out, title); comps[f'{rid}+{shot}'] = out.name
    res['comparisons'] = comps
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary'], indent=1, ensure_ascii=False))
    bad = [k for k in ('indexUnchanged', 'backdropIsV2Panorama', 'phoneNoBackdrop', 'floatingGlassWindow', 'reducedTransparencyOpaque', 'miniaturesMatchManifest',
                       'missingScenesUseChapterIcon', 'reliefDefaultWithPalette', 'whiteCoastAndShadow', 'geometryAllSame', 'primaryAboveFold') if not res['summary'][k]]
    bad += [k for k in ('namesClipped', 'horizontalOverflow') if res['summary'][k]] + (['errors'] if res['summary']['errors'] else [])
    print('problems:', bad or 'none')
    sys.exit(1 if bad else 0)

asyncio.run(main())
