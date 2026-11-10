#!/usr/bin/env python3
"""TOPO V3.0 — afwerking na fase B (docs/v3/renders/README.md § Afwerking na fase B, § Bijstelling eigenaar).
Presentation only; the screens' own QA stays in qa-v3-faseb-*.py.

Screens: Reis, Oefenen, Les, Toets instellen, Toets resultaat, Beloningen, Voortgang — desktop 1440×900, iPad
landscape 1180×820, iPad portrait 820×1180, on #bezig; Landschap screens also on the three backgrounds (BG-01/02/03)
at desktop and iPad landscape:
  * text ≥ 13 px: every visible V3 text (map labels in the SVG aside) is at least 13 px;
  * AA against the artwork: on each background, every visible V3 text against the rendered pixels behind it (text
    hidden for a second screenshot; 5th percentile), ≥ 4.5, or ≥ 3 for large text — the lightest and the darkest spot;
  * no horizontal overflow, no page errors;
  * map left, controls right (≥ 1024 and iPad landscape): the map's box starts left of the panel's (Reis, Oefenen, Les,
    Toets resultaat, Voortgang); on the Landschap screens with a map the map covers ≥ 45 % of the content area (the area
    inside the inner margins beside the sidebar; Les in Focus Mode keeps its own layout and is not measured);
  * Toets resultaat: Nino never overlaps a panel (0 px²); the score in the accent (violet), weight 600, without a card,
    no focus ring when it receives focus;
  * Beloningen: no "Open Reisboekje" button, the cover is the (focusable) button without a circle behind it; the tile
    label is "Pizza"; Voortgang: locked rows show no bar.
Runs with prefers-reduced-transparency: no-preference. Writes results-afwerking.json to docs/qa/v3-afwerking/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-afwerking.py [preview.html]
"""
import asyncio, io, json, pathlib, sys, os
from playwright.async_api import async_playwright
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = ROOT / 'docs/qa/v3-afwerking'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180)}
SCREENS = ['reis', 'oefenen', 'les', 'toets', 'toetsResult', 'rewards', 'voortgang']
LANDSCHAP = {'reis', 'oefenen', 'les', 'toetsResult', 'rewards'}
BGS = ['bg01', 'bg02', 'bg03']
MAPSHARE = {'reis', 'oefenen', 'les', 'toetsResult'}  # Landschap screens with a map; Les in Focus Mode (iPad) keeps its own layout

TEXTS = r'''() => {
  const W = innerWidth, H = innerHeight, cs = n => getComputedStyle(n);
  const scope = document.body.classList.contains('v3Les') ? 'body.v3Les :is(.v3, main.layout, #focusAnswerSheet, #focusLearnBar)' : '.v3Reis';
  return [...document.querySelectorAll(scope + ' *')].filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && !n.closest('svg, .v3PreviewBar, dialog')
      && n.checkVisibility({opacityProperty: true, visibilityProperty: true}) && cs(n).color !== 'transparent')
    .map(n => { const r = n.getBoundingClientRect(), s = cs(n);
      const clipped = (() => { for (let a = n.parentElement; a && a !== document.body; a = a.parentElement) { const o = cs(a); if (o.overflowX !== 'visible' || o.overflowY !== 'visible') { const q = a.getBoundingClientRect();
        if (r.top < q.top - 1 || r.bottom > q.bottom + 1 || r.left < q.left - 1 || r.right > q.right + 1) return true; } } return false; })();
      return {t: n.textContent.trim().slice(0, 24), color: s.color, size: parseFloat(s.fontSize), weight: parseInt(s.fontWeight), box: [r.left, r.top, r.width, r.height], clipped,
        kind: n.matches('.v3NavItem,.v3NavItem span') ? 'nav' : n.matches('.v3ScreenTitle,.v3View>h1,.v3ToetsSetup>h1,.v3VgTitleBar h1') ? 'title' : n.matches('.v3Name,.v3VgName,.v3Chip,.v3FormBtn,.v3Tile>span,.v3ToetsTile') ? 'row' : '', disabled: !!n.closest('button[disabled]')}; })
    .filter(x => x.box[2] > 2 && x.box[3] > 2 && x.box[0] >= 0 && x.box[1] >= 0 && x.box[0] + x.box[2] <= W && x.box[1] + x.box[3] <= H && !x.clipped);
}'''


LAYOUT = r'''(screen) => {
  const R = n => { if (!n) return null; const r = n.getBoundingClientRect(); return r.width && r.height ? {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height} : null; };
  const q = s => [...document.querySelectorAll(s)].find(n => n.checkVisibility());
  const host = document.body.classList.contains('v3Les') ? document.body : document.querySelector('.v3Reis'), v = k => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;visibility:hidden;width:var(' + k + ')'; host.append(d); const w = d.getBoundingClientRect().width; d.remove(); return w; };
  const bar = R(document.querySelector('.v3PreviewBar'))?.h || 0, m = v('--v3-frame-m'), side = v('--v3-side-w'), inner = v('--v3-inner');
  const content = {l: m + side + inner, t: bar + m + inner, r: innerWidth - m - inner, b: innerHeight - m - inner};
  content.w = content.r - content.l; content.h = content.b - content.t;
  const sel = {reis: ['.v3MapStage svg.v3Map', '.v3Rows'], oefenen: ['.v3OefStage svg.v3Map', '.v3OefPanel'], les: ['.mapArea svg', 'aside.panel'],
    toetsResult: ['.v3ToetsMap', '.v3ToetsSide'], voortgang: ['.v3VgKaart', '.v3VgSide']}[screen];
  if (!sel) return null;
  const map = R(q(sel[0])), panel = R(q(sel[1]));
  const cut = map && {w: Math.max(0, Math.min(map.r, content.r) - Math.max(map.l, content.l)), h: Math.max(0, Math.min(map.b, content.b) - Math.max(map.t, content.t))};
  const nino = screen === 'toetsResult' ? R(q('.v3ToetsNino img')) : null;
  const over = (a, b) => a && b ? Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t)) : 0;
  const panels = [...document.querySelectorAll('.v3ToetsSide, .v3ToetsScoreCard')].map(R).filter(Boolean);
  return {content, map, panel, share: cut ? cut.w * cut.h / (content.w * content.h) : 0, nino, ninoOverlap: nino ? panels.reduce((s, p) => s + over(nino, p), 0) : null};
}'''

# Per screen (afwerking § Toets, § Beloningen, § Voortgang): the score, the book and the locked rows.
SCREEN = r'''(screen) => {
  const q = s => [...document.querySelectorAll(s)].find(n => n.checkVisibility()), cs = n => getComputedStyle(n);
  if (screen === 'toetsResult') { const h = q('.v3ToetsScore'), card = q('.v3ToetsScoreCard'); h?.focus();
    const accent = cs(document.querySelector('.v3Reis')).getPropertyValue('--v3-accent').trim(), c = document.createElement('i'); c.style.color = accent; document.body.append(c); const acc = cs(c).color; c.remove();
    return {color: cs(h).color, accent: acc, weight: cs(h).fontWeight, outline: cs(h).outlineStyle, cardBg: cs(card).backgroundColor, cardShadow: cs(card).boxShadow}; }
  if (screen === 'rewards') { const b = q('.v3BookCover');
    return {openBtn: [...document.querySelectorAll('.v3Rewards button')].some(n => n.checkVisibility() && /Open Reisboekje/.test(n.textContent)), coverTab: b?.tabIndex,
      coverBg: b && cs(b).backgroundColor, coverFilter: b && cs(b).backdropFilter, labels: [...document.querySelectorAll('.v3Rewards .v3Tile span')].map(n => n.textContent.trim())}; }
  if (screen === 'voortgang') return {island:q('.v3VgMap')?.dataset.kaart, clippedRows:[...document.querySelectorAll('.v3VgChapters li')].filter(n=>{const r=n.getBoundingClientRect(),p=n.closest('.v3Card').getBoundingClientRect();return r.height<40 || r.top<p.top || r.bottom>p.bottom;}).length, rowCount:document.querySelectorAll('.v3VgChapters li').length, lockedBars: [...document.querySelectorAll('.v3VgChapters [data-status=locked] .v3VgSteps')].filter(n => n.checkVisibility({visibilityProperty: true})).length};
  return null;
}'''


def screen_checks(screen, vp, lay, sc, f):
    wide = vp != 'ipad-staand'
    if lay and lay.get('map') and lay.get('panel') and wide and lay['map']['l'] > lay['panel']['l']: f('map not left of the panel')
    if screen in MAPSHARE and wide and lay and lay['share'] < .45: f(f'map {lay["share"]:.0%} of the content area (< 45 %)')
    if screen == 'toetsResult':
        if wide and (lay['nino'] is None or lay['ninoOverlap'] > 0): f(f'Nino overlaps a panel ({lay["ninoOverlap"]} px²)')
        if sc['color'] != sc['accent'] or sc['weight'] != '600': f(f'score {sc["color"]}/{sc["weight"]} (violet 600)')
        if sc['outline'] not in ('none', ''): f(f'focus ring on the score ({sc["outline"]})')
        if sc['cardBg'] in ('rgba(0, 0, 0, 0)', 'transparent') or sc['cardShadow'] == 'none': f('score lacks glass card')
    if screen == 'rewards':
        if sc['openBtn']: f('"Open Reisboekje" button shown')
        if sc['coverTab'] != 0: f(f'book cover not focusable ({sc["coverTab"]})')
        if sc['coverBg'] not in ('rgba(0, 0, 0, 0)', 'transparent') or sc['coverFilter'] != 'none': f(f'circle behind the book ({sc["coverBg"]}, {sc["coverFilter"]})')
        if 'Pizza' not in sc['labels'] or any(l.startswith('Pizza ') for l in sc['labels']): f(f'tile labels {sc["labels"]}')
    if screen == 'voortgang':
        if sc['lockedBars']: f(f'{sc["lockedBars"]} locked rows with a bar')
        if sc['island'] != 'eiland' or sc['rowCount'] != 11 or sc['clippedRows']: f(f'progress island/rows {sc}')


def lum(rgb):
    def ch(c):
        c = c / 255; return c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    r, g, b = rgb[:3]; return .2126 * ch(r) + .7152 * ch(g) + .0722 * ch(b)


def parse_rgb(c):
    return [float(v) for v in c[c.index('(') + 1:c.index(')')].replace('/', ',').split(',')[:3]]


def contrast(texts, img):
    fails = []
    for t in texts:
        if t['disabled']: continue
        fg = lum(parse_rgb(t['color'])); x, y, w, h = t['box']
        x, y, w, h = x + w * .2, y + h * .25, w * .6, h * .5
        crop = img.crop((int(x), int(y), int(x + w) + 1, int(y + h) + 1)).convert('RGB').resize((min(40, max(1, int(w))), min(12, max(1, int(h)))))
        cs = sorted((max(fg, L) + .05) / (min(fg, L) + .05) for L in (lum(p) for p in crop.getdata()))
        c = cs[int(len(cs) * .05)] if cs else 21
        large = t['size'] >= 24 or (t['size'] >= 18.66 and t['weight'] >= 700)
        if c < (3 if large else 4.5): fails.append({'text': t['t'], 'contrast': round(c, 2)})
    return fails


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


async def goto(pg, screen):
    if screen == 'les': await pg.locator('.v3Main .v3Btn.primary').filter(visible=True).first.click(); await pg.wait_for_timeout(1300)
    elif screen == 'toetsResult': await play_toets(pg)
    elif screen != 'reis': await pg.locator(f'[data-nav={screen}]').filter(visible=True).first.click(); await pg.wait_for_timeout(900)
    await pg.evaluate('document.activeElement?.blur?.()'); await pg.mouse.move(1, 1); await pg.wait_for_timeout(400)


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    res = {'runs': {}}; fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await pw.chromium.launch()
        for vp, (w, h) in VIEWPORTS.items():
            if os.environ.get('TOPO_QA_QUICK') and vp != 'desktop': continue
            for screen in SCREENS:
                for bg in (BGS if not os.environ.get('TOPO_QA_QUICK') and screen in LANDSCHAP and vp != 'ipad-staand' else ['bg01']):
                    tag = f'{screen}/{vp}/{bg}'
                    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, has_touch=vp != 'desktop')
                    pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
                    await (await ctx.new_cdp_session(pg)).send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'no-preference'}]})
                    await pg.goto(HTML.as_uri() + '#bezig' + '/' + bg); await pg.wait_for_timeout(2000)
                    await goto(pg, screen)
                    lay = await pg.evaluate(LAYOUT, screen); sc = await pg.evaluate(SCREEN, screen)
                    if screen == 'les' and await pg.evaluate("document.body.dataset.focusShell === 'true'"): lay = None
                    await pg.evaluate('document.activeElement?.blur?.()')
                    texts = await pg.evaluate(TEXTS)
                    small = sorted({f'{t["t"]} ({t["size"]:g})' for t in texts if t['size'] < 13})
                    await pg.add_style_tag(content='*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}')
                    await pg.wait_for_timeout(150)
                    low = contrast(texts, Image.open(io.BytesIO(await pg.screenshot())))
                    hov = await pg.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
                    f = lambda why: fails.append(f'{tag}: {why}')
                    if small: f(f'text < 13 px: {small[:5]}')
                    for t in texts:
                        minimum = {'title': 44 if w >= 1280 else 36 if w >= 1024 else 30, 'nav': 18 if w >= 1280 else 16, 'row': 17 if w >= 1280 else 16}.get(t['kind'], 0)
                        if t['size'] < minimum: f(f"{t['kind']} {t['t']}: {t['size']} < {minimum}")
                    if low: f(f'contrast < AA: {low[:4]}')
                    if hov: f('horizontal overflow')
                    if errs: f(f'page errors {errs[:2]}')
                    if bg == 'bg01': screen_checks(screen, vp, lay, sc, f)
                    print(tag, 'checked', flush=True)
                    res['runs'][tag] = {'texts': len(texts), 'small': small, 'lowContrast': low} | ({'mapShare': round(lay['share'], 3), 'ninoOverlap': lay['ninoOverlap']} if lay else {})
                    await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results-afwerking.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    asyncio.run(main())
