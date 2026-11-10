#!/usr/bin/env python3
"""TOPO V3.0 — visuele herziening fase A: canvas, glas en kaart (docs/v3/DESIGN_AUDIT_V3_0.md, docs/v3/renders/README.md).

Per screen (Reis, Les, Oefenen, Toets, Voortgang) at desktop 1440×900 and iPad landscape 1180×820, on #bezig:
  * one frame, identical on every tab (±1 px): margin 28 px (iPad 20), radius 28;
  * Landschap (Reis, Les, Oefenen) — background visible on at least 30% of the viewport: a sample point counts when no map, image or element with an
    (almost) opaque background lies above the artwork — glass panels (background alpha ≤ .75) let it through;
  * Landschap — no opaque panel (background alpha ≥ .9) wider than 70% of the viewport;
  * Werkblad (Toets instellen, Voortgang) — the artwork visible on at least 12% of the viewport;
  * the theme is Viola by default (accent #5b45e0);
  * no haze at the map edge: no CSS mask, opacity ≥ .85 on the map and its ancestors, and nothing but the map (or
    its tools) inside the 24 px edge band;
  * schoolkaart (Reis on Schoolkaart, Les, Voortgang): neighbours always in land colour — the map element shows exactly
    its viewBox (no letterbox beyond the drawn data, which the sea colour would fill) and no country or context land
    is see-through (effective opacity × fill-opacity ≥ .9);
  * fase B variant (a) Eiland (Reis): no sea colour at all (sea layers hidden, transparent) and every neighbour a
    visible silhouette (alpha ≥ .3) — the schoolkaart letterbox/see-through rule applies to variant (b) and the lessons;
  * contrast AA for every visible V3 text: the text colour against the rendered pixels behind it (text hidden for a
    second screenshot; 5th percentile of the per-pixel contrast), ≥ 4.5, or ≥ 3 for large text (≥ 24 px, or ≥ 18.66 px bold);
    text cut off by a scrolling or clipping ancestor is not measured (fase B stap 7);
  * with reduced transparency the glass turns opaque (no backdrop blur).
Writes screenshots <screen>-<viewport>.png and results.json to the outdir (default docs/qa/v3-glas/).

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-glas.py [preview.html] [outdir] [label]
"""
import asyncio, hashlib, io, json, os, pathlib, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-glas').resolve()
LABEL = sys.argv[3] if len(sys.argv) > 3 else 'na'
STRICT = LABEL == 'na'  # the "voor" run only records
EDGE_CHECK = True  # map edge and schoolkaart neighbours: phase A step 2
VOOR = os.environ.get('VOOR_DIR')  # screenshots of the 'voor' build → side-by-side comparisons in docs/qa/v3-stijlbeeld/
STIJL = ROOT / 'docs/qa/v3-stijlbeeld'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820)}
SCREENS = ['reis', 'reis-schoolkaart', 'les', 'oefenen', 'toets', 'voortgang']
WERKBLAD = {'toets', 'voortgang'}  # renders/README § Voortgang: Werkblad = Voortgang, Toets instellen, Instellingen

MEASURE = r'''() => {
  const W = innerWidth, H = innerHeight, cs = n => getComputedStyle(n);
  const alpha = c => { if (!c || c === 'transparent') return 0; const m = c.match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(/[ ,/]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1; }
    const s = c.match(/\/\s*([\d.]+)/); return s ? parseFloat(s[1]) : (c.startsWith('color(') ? 1 : 0); };
  const opaque = n => { const s = cs(n); return alpha(s.backgroundColor) >= .9 || (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)); };
  const isMap = n => !!n.closest('svg, img, picture, canvas, video');
  // 1. Background visibility on a 40×25 grid.
  let free = 0, total = 0;
  for (let i = 0; i < 40; i++) for (let j = 0; j < 25; j++) { const x = (i + .5) * W / 40, y = (j + .5) * H / 25; total++;
    let n = document.elementFromPoint(x, y), cover = 0, blocked = false;
    if (!n || n === document.body || n === document.documentElement) { free++; continue; }
    if (isMap(n)) continue;
    for (let e = n; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      const s = cs(e); if (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) { blocked = true; break; }
      const a = alpha(s.backgroundColor); cover = 1 - (1 - cover) * (1 - a); if (cover > .75) { blocked = true; break; } }
    if (!blocked) free++; }
  // 2. Opaque panels wider than 70%.
  const wide = [...document.querySelectorAll('body *')].filter(n => { if (n.closest('.v3PreviewBar')) return false; const r = n.getBoundingClientRect();
    return r.width > .7 * W && r.height > 40 && r.bottom > 0 && r.top < H && n.checkVisibility({opacityProperty: true, visibilityProperty: true}) && opaque(n); })
    .map(n => (n.id ? '#' + n.id : n.tagName.toLowerCase()) + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' ' + Math.round(n.getBoundingClientRect().width));
  // 3. Map edge: masks and opacity on the map and its ancestors.
  const map = [...document.querySelectorAll('.v3Map, #map')].find(n => n.checkVisibility() && n.getBoundingClientRect().width > 100);
  let edge = null;
  if (map) { let op = 1, masks = []; for (let e = map; e && e !== document.documentElement; e = e.parentElement) { const s = cs(e); op *= parseFloat(s.opacity);
      const m = s.maskImage || s.webkitMaskImage; if (m && m !== 'none') masks.push((e.id || e.className.baseVal || e.className || e.tagName).toString().slice(0, 30)); }
    const r = map.getBoundingClientRect();
    // Haze: anything but the map itself (and its tools) inside the 24 px edge band.
    const over = new Set(); for (let k = 0; k < 60; k++) { const t = k / 60, pts = [[r.left + 12, r.top + t * r.height], [r.right - 12, r.top + t * r.height], [r.left + t * r.width, r.top + 12], [r.left + t * r.width, r.bottom - 12]];
      for (const [x, y] of pts) { if (x < 0 || y < 0 || x >= W || y >= H) continue;
        // Rounded corners (radius 28) are cut out by design: skip the corner squares.
        if ((x - r.left < 36 || r.right - x < 36) && (y - r.top < 36 || r.bottom - y < 36)) continue; const e = document.elementFromPoint(x, y);
        if (e && !map.contains(e) && e !== map && !e.closest('button, .v3MapTools, .mapTools, #focusAnswerSheet, #focusLearnBar, .v3Panel, .v3LesBar, .v3ShellNav, .v3Side') && !(e.closest('.atlasCanvas, .mapArea') && map.closest('.atlasCanvas, .mapArea')))
          over.add((e.id || e.getAttribute('class') || e.tagName).toString().slice(0, 30)); } }
    // Schoolkaart: neighbours always in land colour — the element shows only the viewBox (no letterbox beyond the data)
    // and no country or context land is see-through.
    const school = map.dataset.relief !== 'on' || map.id === 'map';
    const vb = (map.getAttribute('viewBox') || '').split(/[ ,]+/).map(Number), vba = vb[2] / vb[3], ea = r.width / r.height;
    const seeThrough = school ? [...map.querySelectorAll('.country, .contextLand')].filter(n => { let o = 1; for (let e = n; e && e !== map; e = e.parentNode) o *= parseFloat(cs(e).opacity);
      return o * parseFloat(cs(n).fillOpacity) < .9 && cs(n).display !== 'none'; }).map(n => n.dataset.id || n.dataset.country) : [];
    // Fase B variant (a) Eiland (owner 10-11): the sea is transparent on the wash and neighbours are soft silhouettes —
    // never sea colour: no sea layer, a transparent background, every neighbour visible (alpha ≥ .3).
    const island = map.dataset.kaart === 'eiland';
    const seaShown = island && [...map.querySelectorAll('.sea,.v3RSea,.atlasWaterTexture')].some(n => cs(n).display !== 'none');
    // Variant (a): the neighbours are drawn by one silhouette group (fase B, stap 5); it must stay visible.
    const grp = island && map.querySelector('.v3Neighbours');
    const islandFaint = island ? (!grp || cs(grp).display === 'none' || (() => { let o = 1; for (let e = grp; e && e !== map; e = e.parentNode) o *= parseFloat(cs(e).opacity); return o < .3; })() ? ['v3Neighbours'] : []) : [];
    edge = {selector: map.id ? '#map' : '.v3Map', masks, opacity: op, overlays: [...over], school, island, seaShown, islandFaint,
      letterbox: school && !island && map.id !== 'map' ? Math.abs(vba - ea) > .015 : false, seeThrough: island ? [] : seeThrough,
      box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]}; }
  // 4. Visible V3 texts for the contrast check.
  const scope = document.body.classList.contains('v3Les') ? 'body.v3Les :is(.v3, main.layout, #focusAnswerSheet, #focusLearnBar)' : '.v3Reis';
  const texts = [...document.querySelectorAll(scope + ' *')].filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && !n.closest('svg, button[disabled], .v3PreviewBar, dialog')
      && n.checkVisibility({opacityProperty: true, visibilityProperty: true}) && cs(n).color !== 'transparent')
    .map(n => { const r = n.getBoundingClientRect(), s = cs(n); return {t: n.textContent.trim().slice(0, 24), color: s.color, size: parseFloat(s.fontSize), weight: parseInt(s.fontWeight),
      box: [r.left, r.top, r.width, r.height],
      // Text cut off by a scrolling or clipping ancestor (a card with its own scroll, the plate) is not what one sees.
      clipped: (() => { for (let a = n.parentElement; a && a !== document.body; a = a.parentElement) { const o = cs(a); if (o.overflowX !== 'visible' || o.overflowY !== 'visible') { const q = a.getBoundingClientRect();
        if (r.top < q.top - 1 || r.bottom > q.bottom + 1 || r.left < q.left - 1 || r.right > q.right + 1) return true; } } return false; })()}; }).filter(x => x.box[2] > 2 && x.box[3] > 2 && x.box[0] >= 0 && x.box[1] >= 0 && x.box[0] + x.box[2] <= W && x.box[1] + x.box[3] <= H && !x.clipped);
  const root = document.querySelector('.v3Reis'), les = document.body.classList.contains('v3Les');
  // The frame: .v3Reis outside lessons, the body::after outline in lessons.
  const fr = les ? (a => { const px = v => parseFloat(v); return [px(a.left), px(a.top), W - px(a.left) - px(a.right), H - px(a.top) - px(a.bottom), a.borderTopLeftRadius]; })(getComputedStyle(document.body, '::after'))
                 : (r => [r.left, r.top, r.width, r.height, cs(root).borderTopLeftRadius])(root.getBoundingClientRect());
  // The preview bar (not part of the app) sits above the frame outside Focus Mode: frame relative to its bottom.
  const bar = (b => b && b.checkVisibility() && cs(b).position !== 'fixed' ? b.getBoundingClientRect().bottom : 0)(document.querySelector('.v3PreviewBar'));
  fr[1] -= bar; fr[3] += bar;
  return {frame: fr.map(v => typeof v === 'number' ? Math.round(v) : v), free: free / total, wide, edge, texts, theme: getComputedStyle(root).getPropertyValue('--v3-accent').trim(), les,
    view: root.dataset.view, hOverflow: document.documentElement.scrollWidth > W + 1}; }'''

def lum(rgb):
    def ch(c):
        c = c / 255; return c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    r, g, b = rgb[:3]; return .2126 * ch(r) + .7152 * ch(g) + .0722 * ch(b)

def parse_rgb(c):
    import re
    p = [float(x) for x in re.findall(r'[\d.]+', c)]
    return tuple(int(round(x)) for x in p[:3]) if len(p) >= 3 else (0, 0, 0)

def contrast(texts, img, scale):
    fails = []
    for t in texts:
        fg = lum(parse_rgb(t['color'])); x, y, w, h = [v * scale for v in t['box']]
        # The central part of the text box (where the glyphs are), so a badge's rounded corners do not count.
        x, y, w, h = x + w * .2, y + h * .25, w * .6, h * .5
        crop = img.crop((int(x), int(y), int(x + w) + 1, int(y + h) + 1)).convert('RGB').resize((min(40, max(1, int(w))), min(12, max(1, int(h)))))
        cs = sorted((max(fg, L) + .05) / (min(fg, L) + .05) for L in (lum(p) for p in list(crop.getdata())))
        c = cs[int(len(cs) * .05)] if cs else 21
        large = t['size'] >= 24 or (t['size'] >= 18.66 and t['weight'] >= 700)
        if c < (3 if large else 4.5): fails.append({'text': t['t'], 'contrast': round(c, 2), 'need': 3 if large else 4.5})
    return fails

def side(a, b, out, la, lb):
    """Before (left) and after (right), same size, labelled; JPEG."""
    A, B = Image.open(a).convert('RGB'), Image.open(b).convert('RGB'); pad, top = 20, 50
    c = Image.new('RGB', (A.width + B.width + pad * 3, max(A.height, B.height) + top + pad), '#ece6da'); d = ImageDraw.Draw(c)
    try: f = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 24)
    except Exception: f = ImageFont.load_default()
    d.text((pad, 14), la, fill='#2a1f6b', font=f); d.text((pad * 2 + A.width, 14), lb, fill='#2a1f6b', font=f)
    c.paste(A, (pad, top)); c.paste(B, (pad * 2 + A.width, top)); c.save(out, quality=80, optimize=True)

async def goto_screen(pg, screen):
    click = lambda sel: pg.locator(sel).filter(visible=True).first.click()
    if screen == 'reis-schoolkaart': await pg.locator('.v3Switch .v3Btn', has_text='Schoolkaart').click(); await pg.wait_for_timeout(700)
    elif screen == 'les': await click('.v3Main .v3Btn.primary'); await pg.wait_for_timeout(1200)
    elif screen != 'reis': await click(f'.v3Side [data-nav={screen}]'); await pg.wait_for_timeout(900)
    await pg.evaluate('document.activeElement?.blur?.()'); await pg.mouse.move(1, 1); await pg.wait_for_timeout(400)

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = HTML.read_bytes()
    res = {'html': str(HTML), 'sha256': hashlib.sha256(data).hexdigest(), 'indexSha256': hashlib.sha256((ROOT / 'index.html').read_bytes()).hexdigest(),
           'label': LABEL, 'runs': {}, 'errors': []}
    fails = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await p.chromium.launch()
        for vp, (w, h) in VIEWPORTS.items():
            for screen in SCREENS:
                for reduce in (False, True):
                    if reduce and screen not in ('reis', 'les'): continue
                    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, has_touch=vp != 'desktop')
                    pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
                    cdp = await ctx.new_cdp_session(pg)
                    await cdp.send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'reduce' if reduce else 'no-preference'}]})
                    await pg.goto(HTML.as_uri() + '#bezig'); await pg.wait_for_timeout(2200)
                    await goto_screen(pg, screen)
                    m = await pg.evaluate(MEASURE)
                    key = f'{screen}-{vp}' + ('-verminderd' if reduce else ''); label = f'{key}'
                    shot = await pg.screenshot(); await pg.screenshot(path=str(OUT / f'{key}.png'))
                    await pg.add_style_tag(content='*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}')
                    await pg.wait_for_timeout(150)
                    bare = Image.open(io.BytesIO(await pg.screenshot()))
                    low = contrast(m.pop('texts'), bare, 1)
                    glass = await pg.evaluate('''[...document.querySelectorAll('.v3Glass, .v3Reis > *, .v3ShellNav .v3Side, body.v3Les aside.panel, .v3LesBar')].filter(n => n.checkVisibility())
                      .map(n => getComputedStyle(n).backdropFilter)''')
                    run = {**m, 'freePct': round(m.pop('free') * 100, 1), 'lowContrast': low, 'backdropFilters': sorted(set(glass)), 'pageErrors': errs}
                    res['runs'][key] = run
                    f = lambda why: fails.append(f'{label}: {why}')
                    surface = 'werkblad' if screen in WERKBLAD else 'landschap'; run['surface'] = surface
                    if not reduce:
                        if surface == 'landschap':
                            if run['freePct'] < 30: f(f'background visible {run["freePct"]}% < 30%')
                            if run['wide']: f(f'opaque panels > 70%: {run["wide"][:4]}')
                        elif run['freePct'] < 12: f(f'werkblad: artwork visible {run["freePct"]}% < 12%')
                    e = run['edge']
                    if EDGE_CHECK and e and (e['masks'] or e['opacity'] < .85 or e['overlays']): f(f'map edge haze {e}')
                    if EDGE_CHECK and e and e['school'] and (e['letterbox'] or e['seeThrough']): f(f'schoolkaart: neighbours not in land colour (letterbox={e["letterbox"]}, see-through={e["seeThrough"][:6]})')
                    if EDGE_CHECK and e and e['island'] and (e['seaShown'] or e['islandFaint']): f(f'eiland: sea colour or invisible neighbours (sea={e["seaShown"]}, faint={e["islandFaint"][:6]})')
                    if low: f(f'contrast < AA: {low[:4]}')
                    if run['theme'].lower() != '#5b45e0': f(f'theme {run["theme"]}')
                    if reduce and any('blur' in g for g in glass): f('reduced transparency still blurs')
                    if run['hOverflow']: f('horizontal scroll')
                    if errs: f(f'page errors {errs[:2]}')
                    await ctx.close()
        await b.close()
    # One frame, identical on every tab (renders/README § Raster en uitlijning): ±1 px.
    for vp, (w, h) in VIEWPORTS.items():
        frames = {k: v['frame'] for k, v in res['runs'].items() if k.split('-', 1)[1] == vp}
        ref = frames.get(f'reis-{vp}')
        exp = [28, 28, w - 56, h - 56] if vp == 'desktop' else [20, 20, w - 40, h - 40]
        for k, fr in frames.items():
            if any(abs(a - b) > 1 for a, b in zip(fr[:4], ref[:4])) or fr[4] != '28px': fails.append(f'{k}: frame {fr} ≠ reis {ref}')
        if any(abs(a - b) > 1 for a, b in zip(ref[:4], exp)): fails.append(f'reis-{vp}: frame {ref} ≠ margin {exp}')
    if VOOR:
        res['comparisons'] = []
        for screen in SCREENS:
            for vp in VIEWPORTS:
                a, b2 = pathlib.Path(VOOR) / f'{screen}-{vp}.png', OUT / f'{screen}-{vp}.png'
                if a.exists() and b2.exists():
                    out = STIJL / f'voor-na-{screen}-{vp}.jpg'; side(a, b2, out, os.environ.get('VOOR_LABEL', 'Voor'), os.environ.get('NA_LABEL', 'Na')); res['comparisons'].append(out.name)
    res['errors'] = fails
    res['summary'] = {'label': LABEL, 'free': {k: v['freePct'] for k, v in res['runs'].items()}, 'wide': {k: v['wide'] for k, v in res['runs'].items() if v['wide']},
                      'lowContrast': {k: len(v['lowContrast']) for k, v in res['runs'].items() if v['lowContrast']}, 'pass': not fails}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary'], ensure_ascii=False), *fails, sep='\n')
    sys.exit(1 if fails and STRICT else 0)

asyncio.run(main())
