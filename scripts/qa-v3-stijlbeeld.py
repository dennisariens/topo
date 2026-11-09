#!/usr/bin/env python3
"""TOPO V3 — stijlbeeld (renderniveau) QA for Reis.

Checks the style image against the brief (docs/v3/ARTWORK_BRIEF.md): BG-01 full-bleed behind the app on desktop and
iPad (BG-02/BG-03 via #…/bg02 and /bg03; none on phone), the floating frosted-glass window (radius 24, soft shadow),
the render assets from assets/v3/render/manifest.json (NINO-PORTRET, IC-slice/IC-vespa at the counters, kop per
chapter, the Beloningen view with VE-01 and IC-pizza/stamp/gold/postcard, counts checked against the V2 Reisboekje),
the 11 chapter miniatures (8 #75 scenes from assets/v3/scenes/manifest.json + Roma/Venezia/Napoli; byte-checked), and the z8
relief from v3/relief-z8 (render layers sea, shadow, relief, coast; SHA256 against their provenance, in layer order,
decoration only) with neighbouring countries dimmed and a softer sea — while the map geometry stays exactly the live map's (46/46). Writes screenshots, side-by-side comparisons with the owner's concept
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
RENDER = {a['id']: a for a in json.loads((ROOT / 'assets/v3/render/manifest.json').read_text())['assets']}
SCENE_SHA = {k: {'mini': v['mini']['sha256'], 'kop': v['scene']['sha256']} for k, v in MANIFEST['chapters'].items()}
for _id in ('SCENE-ROMA', 'SCENE-VENEZIA', 'SCENE-NAPOLI'):
    SCENE_SHA[RENDER[_id]['chapter']] = {'mini': RENDER[_id]['export_mini']['sha256'], 'kop': RENDER[_id]['export_kop']['sha256']}
BG_SHA = {f'bg0{i}': RENDER[f'BG-0{i}']['export']['sha256'] for i in (1, 2, 3)}
ICON_SHA = {k: RENDER['IC-' + k]['exports']['96']['sha256'] for k in ('slice', 'pizza', 'vespa', 'gold', 'stamp', 'postcard')}
RELIEF_PROV = json.loads((ROOT / 'assets/discovery/terrain-z8-render-provenance.json').read_text())
RELIEF_SHA = {'terrain': RELIEF_PROV['output']['sha256'], **{l['role']: l['sha256'] for l in RELIEF_PROV['pipeline']['decorative_layers']}}
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
def dsha(src):
    """SHA256 of the bytes inside a data:…;base64 URI (None otherwise)."""
    return sha(base64.b64decode(src.split(',', 1)[1])) if src and src.startswith('data:') and ';base64,' in src[:40] else None

PROBE = r'''() => {
  const body = document.body, cs = n => getComputedStyle(n), win = document.querySelector('.v3Reis'), w = cs(win), r = win.getBoundingClientRect();
  const bg = cs(body).backgroundImage, alpha = (c => { const m = c.match(/[\d.]+/g) || []; return c.startsWith('color(') ? (c.includes('/') ? parseFloat(c.split('/')[1]) : 1) : m.length > 3 ? +m[3] : 1; })(w.backgroundColor);
  const map = document.querySelector('.v3Map'), terrain = map.querySelector('.atlasTerrain'), italy = map.querySelector('.italy');
  const glow = map.querySelector('.v3CoastGlow'), base = map.querySelector('.v3LandBase'), href = n => n?.getAttribute('href') || '';
  const layerOrder = [...map.children].map(n => (n.getAttribute('class') || n.id || n.tagName).split(' ').pop()).filter(c => /v3RSea|v3CoastGlow|v3RShadow|v3LandBase|seaLayer|atlasTerrain|v3RCoast|landLayer/.test(c));
  const rows = [...document.querySelectorAll('.v3Row')].map(b => { const i = b.querySelector('.v3Thumb img');
    return {chapter: b.dataset.chapter, icon: b.querySelector('.v3Thumb').classList.contains('v3ThumbIcon'), src: i?.getAttribute('src') || '', natural: i ? [i.naturalWidth, i.naturalHeight] : null,
            box: i ? [Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)] : null,
            nameClipped: (n => n.scrollWidth > n.clientWidth + 1)(b.querySelector('.v3Name')), nameLines: Math.round(b.querySelector('.v3Name').getBoundingClientRect().height / parseFloat(cs(b.querySelector('.v3Name')).lineHeight || 20))}; });
  const primary = document.querySelector('.v3Actions .primary')?.getBoundingClientRect();
  const bgUri = (bg.match(/url\("?([^")]+)"?\)/) || [])[1] || '';
  const srcOf = q => document.querySelector(q)?.getAttribute('src') || '';
  return {
    backdrop: {image: bg !== 'none', uri: bgUri, key: window.TOPO_V3_BG, size: cs(body).backgroundSize, attachment: cs(body).backgroundAttachment},
    art: {portrait: srcOf('.v3Reis .v3PortraitArt img'), slice: srcOf('.v3Top .v3Mini:not(.v3MiniVespa)'), vespa: srcOf('.v3Top .v3MiniVespa'),
          kop: srcOf('.v3Panel .v3Kop img'), kopShown: (n => !!n && cs(n).display !== 'none')(document.querySelector('.v3Panel .v3Kop')),
          kopBeforeTitle: (n => !!n && n.nextElementSibling?.id === 'v3Title')(document.querySelector('.v3Panel .v3Kop')), selected: document.querySelector('.v3Row[aria-current], .v3Row[aria-pressed=true], .v3Row.isSelected')?.dataset.chapter},
    window: {radius: w.borderTopLeftRadius, backdropFilter: w.backdropFilter, shadow: w.boxShadow !== 'none', bgAlpha: alpha,
             gaps: [Math.round(r.left), Math.round(innerWidth - r.right), Math.round(r.top), Math.round(innerHeight - r.bottom)]},
    rows,
    relief: {mode: map.dataset.relief, terrain: cs(terrain).display, pressed: document.querySelector('.v3Switch [aria-pressed=true]')?.textContent,
             layers: {terrain: href(terrain.querySelector('image')), sea: href(map.querySelector('.v3RSea')), shadow: href(map.querySelector('.v3RShadow')), coast: href(map.querySelector('.v3RCoast'))},
             shown: ['.v3RSea', '.v3RShadow', '.v3RCoast'].map(q => map.querySelector(q) && cs(map.querySelector(q)).display), layerOrder,
             decorationTargets: map.querySelectorAll('.v3R[data-id], .v3R[tabindex], :is(.v3CoastGlow,.v3LandBase) :is([data-id],[class])').length,
             pointer: [...map.querySelectorAll('.v3R')].every(n => n.getAttribute('pointer-events') === 'none' && n.getAttribute('aria-hidden') === 'true')},
    dim: {neighbour: cs(map.querySelector('.contextLand')).fillOpacity, country: (n => n ? cs(n).fillOpacity : null)(map.querySelector('.country:not(.v3Hit)')), italy: cs(italy).fillOpacity,
          glow: glow ? cs(glow).display : null, base: base ? cs(base).display : null, copies: (glow?.children.length || 0) + (base?.children.length || 0),
          landShapes: [...map.querySelectorAll('.land,.italy')].filter(n => n.getAttribute('d')).length},
    targets: {live: document.querySelectorAll('#map [data-id]').length, clone: map.querySelectorAll('[data-id]').length},
    primaryAboveFold: !!primary && primary.bottom <= innerHeight && primary.top >= 0,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
  };
}'''
REWARDS = r'''() => {
  const v = document.querySelector('.v3Rewards'), cs = n => getComputedStyle(n), src = n => n?.getAttribute('src') || '';
  const tiles = [...v.querySelectorAll('.v3Tile')].map(t => ({label: t.getAttribute('aria-label'), icon: src(t.querySelector('img')), value: t.querySelector('b').textContent}));
  const clipped = [...v.querySelectorAll('h1,b,span,button:not(.v3BookCover)')].filter(n => n.scrollWidth > n.clientWidth + 1 || n.scrollHeight > n.clientHeight + 1 && cs(n).overflow !== 'visible').map(n => n.className || n.tagName);
  const box = n => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.right <= innerWidth + 1 && r.left >= -1; };
  return {view: document.querySelector('.v3Reis').dataset.view, shown: cs(v).display !== 'none', reisHidden: [...document.querySelectorAll('.v3Reis > :is(.v3List,.v3Main)')].every(n => cs(n).display === 'none'),
    focus: document.activeElement?.id, current: [...document.querySelectorAll('.v3Reis .v3Side [aria-current=page]')].map(n => n.dataset.nav),
    ride: {art: src(v.querySelector('.v3RideArt')), label: v.querySelector('.v3Ride').getAttribute('aria-label'), value: v.querySelector('.v3Ride > b').textContent, on: v.querySelectorAll('.v3RideSteps .on').length},
    overlap: (() => { const rs = [...v.querySelectorAll('h1,.v3CoverArt,.v3Book .primary,.v3RideArt,.v3Ride > b,.v3Tile')].map(n => [n.className || n.tagName, n.getBoundingClientRect()]), hits = [];
      for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) { const [a, A] = rs[i], [b, B] = rs[j];
        if (Math.min(A.right, B.right) - Math.max(A.left, B.left) > 1 && Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top) > 1) hits.push(a + ' × ' + b); }
      const book = v.querySelector('.v3Book').getBoundingClientRect(), c = v.querySelector('.v3CoverArt')?.getBoundingClientRect();
      if (c && (c.top < book.top - 1 || c.bottom > book.bottom + 1)) hits.push('cover outside book'); return hits; })(),
    tiles, primaries: v.querySelectorAll('.primary').length, cover: !!v.querySelector('.v3BookCover img'), allInView: [...v.querySelectorAll('.v3Tile,.v3Ride,.v3Book .primary')].every(box),
    clipped, state: {slices: state.slices | 0, pizzas: state.pizzas | 0, trips: state.trips | 0}, horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''
# Walks the opened V2 Reisboekje spread by spread and counts what V2 itself shows as earned.
BOOK = r'''async () => { const d = window.TopoBook.element, seen = new Set(), n = {postcards: 0, stamps: 0, gold: 0}; let guard = 0;
  while (guard++ < 40) { for (const s of d.querySelectorAll('section.bookPage')) { const k = s.getAttribute('aria-label') + '|' + s.className; if (seen.has(k)) continue; seen.add(k);
      n.postcards += s.querySelectorAll('.earnedPostcard').length; n.stamps += s.querySelectorAll('.stampInspect').length; n.gold += s.querySelectorAll('.chapterSeal').length; }
    const next = [...d.querySelectorAll('button')].find(b => b.textContent.trim() === 'Volgende'); if (!next || next.disabled) break; next.click(); await new Promise(r => setTimeout(r, 120)); }
  return {open: d.open, ...n}; }'''
GEOMETRY = r'''() => { const live = document.querySelector('#map'), clone = document.querySelector('.v3Map'); let same = 0, diff = [];
  for (const n of live.querySelectorAll('[data-id]')) { const id = n.getAttribute('data-id'), k = clone.querySelectorAll('[data-id="' + id + '"]')[[...live.querySelectorAll('[data-id="' + id + '"]')].indexOf(n)];
    const keys = ['d', 'cx', 'cy', 'r', 'points', 'x', 'y']; if (k && keys.every(a => n.getAttribute(a) === k.getAttribute(a))) same++; else diff.push(id); }
  return {same, diff: diff.slice(0, 5), total: live.querySelectorAll('[data-id]').length}; }'''


async def rewards(b, w, h, hash, shot=None):
    """Opens Beloningen from the Reis sidebar, probes it, then opens the Reisboekje and counts what V2 shows."""
    pg, errors = await page(b, w, h, hash)
    await pg.click('.v3Reis .v3Side [data-nav=rewards]'); await pg.wait_for_timeout(400)
    r = await pg.evaluate(REWARDS)
    if shot: await pg.screenshot(path=str(OUT / shot))
    r['ride']['art'] = dsha(r['ride']['art'])
    for t in r['tiles']: t['icon'] = dsha(t['icon'])
    await pg.click('.v3Rewards .v3Book .primary', timeout=5000); await pg.wait_for_timeout(700)
    r['book'] = await pg.evaluate(BOOK)
    r['errors'] = errors; await pg.close(); return r


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
                for k2, v2 in run['relief']['layers'].items():
                    run['relief']['layers'][k2] = sha(base64.b64decode(v2.split(',', 1)[1])) if v2.startswith('data:image/webp;base64,') else None
                for row in run['rows']:
                    row['sha256'] = dsha(row['src']); del row['src']
                run['backdrop']['sha256'] = dsha(run['backdrop'].pop('uri'))
                run['art'] = {k: (dsha(v) if isinstance(v, str) and v.startswith('data:') else v) for k, v in run['art'].items()}
                await pg.screenshot(path=str(OUT / f'{key}.png'))
                run['errors'] = errors; res['runs'][key] = run; await pg.close()
        # Background alternatives BG-02 and BG-03 (preview switch).
        for bg in ('bg02', 'bg03'):
            pg, errors = await page(b, 1440, 900, 'bezig/' + bg)
            res.setdefault('bgAlternatives', {})[bg] = {'key': await pg.evaluate('window.TOPO_V3_BG'), 'sha256': dsha((await pg.evaluate(PROBE))['backdrop']['uri']),
                                                        'switch': await pg.evaluate('[...document.querySelectorAll(".v3Bg")].map(a=>a.getAttribute("href").split("#")[1])')}
            await pg.screenshot(path=str(OUT / f'desktop-{bg}.png')); res['errors'] += errors; await pg.close()
        # Chapter kop per chapter: select every row on desktop and check the kop bytes.
        pg, errors = await page(b, 1440, 900, 'alles'); kops = {}
        for cid in await pg.evaluate('[...document.querySelectorAll(".v3Row")].map(r=>r.dataset.chapter)'):
            await pg.click(f'.v3Row[data-chapter="{cid}"]'); await pg.wait_for_timeout(150)
            kops[cid] = dsha(await pg.evaluate('document.querySelector(".v3Panel .v3Kop img")?.getAttribute("src")||""'))
            if cid == 'city2': await pg.screenshot(path=str(OUT / 'desktop-kop-roma.png'))
        res['kops'] = kops; res['errors'] += errors; await pg.close()
        # Beloningen (V3 layer): desktop, iPad landscape/portrait, phone; demo states #alles and #bezig.
        for vp, (w, h) in {**VIEWPORTS, 'ipad-portrait': (820, 1180)}.items():
            for st in ('alles', 'bezig'):
                res.setdefault('rewards', {})[f'{vp}-{st}'] = await rewards(b, w, h, st, f'beloningen-{vp}-{st}.png' if st == 'alles' or vp == 'desktop' else None)
        # Lesson sidebar → Beloningen lands on the rewards view.
        pg, errors = await page(b, 1440, 900, 'bezig')
        await pg.click('.v3Actions .primary'); await pg.wait_for_timeout(900)
        inLesson = await pg.evaluate('document.body.classList.contains("v3Les")')
        await pg.click('.v3ShellNav .v3Side [data-nav=rewards]'); await pg.wait_for_timeout(900)
        res['lessonToRewards'] = {'inLesson': inLesson, **(await pg.evaluate('({view:document.querySelector(".v3Reis")?.dataset.view,focus:document.activeElement?.id,les:document.body.classList.contains("v3Les")})'))}
        res['errors'] += errors; await pg.close()
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
        'backdropIsBG01': every(big, lambda r: r['backdrop']['sha256'] == BG_SHA['bg01'] and r['backdrop']['size'] == 'cover'),
        'bgAlternativesSwitch': all(v['key'] == k and v['sha256'] == BG_SHA[k] and v['switch'] == ['bezig', 'bezig/bg02', 'bezig/bg03'] for k, v in res['bgAlternatives'].items()),
        'phoneNoBackdrop': every({k: v for k, v in runs.items() if k.startswith('phone')}, lambda r: not r['backdrop']['image']),
        'floatingGlassWindow': every(big, lambda r: r['window']['radius'] == '24px' and 'blur' in r['window']['backdropFilter'] and r['window']['shadow'] and r['window']['bgAlpha'] < 1 and min(r['window']['gaps']) >= 16),
        'reducedTransparencyOpaque': res['reducedTransparency']['backdropFilter'] == 'none' and res['reducedTransparency']['bgAlpha'] == 1,
        'miniaturesMatchManifest': every(runs, lambda r: len(r['rows']) == 11 and all(row['sha256'] == SCENE_SHA[row['chapter']]['mini'] and row['natural'] == [480, 270] and not row['icon'] for row in r['rows'])),
        'kopsMatchManifest': len(res['kops']) == 11 and all(v == SCENE_SHA[k]['kop'] for k, v in res['kops'].items()) and every(big, lambda r: r['art']['kopShown'] and r['art']['kopBeforeTitle']),
        'phoneNoKop': every({k: v for k, v in runs.items() if k.startswith('phone')}, lambda r: not r['art']['kopShown']),
        'portraitIsNinoPortret': every(runs, lambda r: r['art']['portrait'] == RENDER['NINO-PORTRET']['export']['sha256']),
        'counterIcons': every(runs, lambda r: r['art']['slice'] == ICON_SHA['slice'] and r['art']['vespa'] == ICON_SHA['vespa']),
        'rewardsArt': every(res['rewards'], lambda r: r['ride']['art'] == RENDER['VE-01']['export']['sha256'] and [t['icon'] for t in r['tiles']] == [ICON_SHA[k] for k in ('pizza', 'stamp', 'gold', 'postcard')] and r['cover']),
        'rewardsCountsMatchV2Book': every(res['rewards'], lambda r: r['book']['open'] and [t['value'].split()[0] for t in r['tiles']] == [str(r['state']['slices']), str(r['book']['stamps']), str(r['book']['gold']), str(r['book']['postcards'])] and r['ride']['value'] == str(r['state']['trips']) and r['ride']['on'] == r['state']['pizzas'] % 3),
        'rewardsView': every(res['rewards'], lambda r: r['view'] == 'rewards' and r['shown'] and r['reisHidden'] and r['focus'] == 'v3RewardsTitle' and r['current'] == ['rewards'] and r['primaries'] == 1),
        'rewardsLayout': {k: r['clipped'] + r['overlap'] + ([] if r['allInView'] else ['not in view']) for k, r in res['rewards'].items() if r['clipped'] or r['overlap'] or not r['allInView'] or r['horizontalOverflow']},
        'lessonToRewards': res['lessonToRewards']['inLesson'] and res['lessonToRewards']['view'] == 'rewards' and not res['lessonToRewards']['les'] and res['lessonToRewards']['focus'] == 'v3RewardsTitle',
        'reliefDefaultZ8': every(runs, lambda r: r['relief']['mode'] == 'on' and r['relief']['terrain'] == 'block' and r['relief']['pressed'] == 'Reliëf'),
        'reliefLayersMatchProvenance': every(runs, lambda r: r['relief']['layers'] == RELIEF_SHA and r['relief']['shown'] == ['block'] * 3),
        'reliefLayerOrder': every(runs, lambda r: r['relief']['layerOrder'] == ['v3RSea', 'v3CoastGlow', 'v3RShadow', 'v3LandBase', 'v3m-seaLayer', 'atlasTerrain', 'v3RCoast', 'v3m-landLayer']),
        'reliefIsDecorationOnly': every(runs, lambda r: r['relief']['decorationTargets'] == 0 and r['relief']['pointer'] and r['dim']['copies'] == 2 * r['dim']['landShapes']),
        'neighboursDimmed': every(runs, lambda r: float(r['dim']['neighbour']) < .6 and float(r['dim']['country']) < .6 and float(r['dim']['italy']) == 0),
        'geometrySame': {k: f"{r['geometry']['same']}/{r['geometry']['total']}" for k, r in runs.items()},
        'geometryAllSame': every(runs, lambda r: r['geometry']['same'] == r['geometry']['total'] == 46 and r['targets']['clone'] == r['targets']['live']),
        'themes': {k: r['theme'] for k, r in runs.items()},
        'themePairs': res.get('pairs'),
        'namesClipped': [f"{k}/{row['chapter']}" for k, r in runs.items() for row in r['rows'] if row['nameClipped']],
        'namesTwoLines': [f"{k}/{row['chapter']}" for k, r in runs.items() for row in r['rows'] if row['nameLines'] > 1],
        'primaryAboveFold': every(runs, lambda r: r['primaryAboveFold']),
        'horizontalOverflow': [k for k, r in runs.items() if r['horizontalOverflow']],
        'errors': len(res['errors']) + sum(len(r['errors']) for r in [*runs.values(), *res['rewards'].values()]),
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
    bad = [k for k in ('indexUnchanged', 'backdropIsBG01', 'bgAlternativesSwitch', 'phoneNoBackdrop', 'floatingGlassWindow', 'reducedTransparencyOpaque', 'miniaturesMatchManifest',
                       'kopsMatchManifest', 'phoneNoKop', 'portraitIsNinoPortret', 'counterIcons', 'rewardsArt', 'rewardsCountsMatchV2Book', 'rewardsView', 'lessonToRewards', 'reliefDefaultZ8', 'reliefLayersMatchProvenance', 'reliefLayerOrder', 'reliefIsDecorationOnly', 'neighboursDimmed', 'geometryAllSame', 'primaryAboveFold') if not res['summary'][k]]
    bad += [k for k in ('namesClipped', 'horizontalOverflow', 'rewardsLayout') if res['summary'][k]] + (['errors'] if res['summary']['errors'] else [])
    print('problems:', bad or 'none')
    sys.exit(1 if bad else 0)

asyncio.run(main())
