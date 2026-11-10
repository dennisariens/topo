#!/usr/bin/env python3
"""TOPO V3.0 — afwerking na fase B (docs/v3/renders/README.md § Afwerking na fase B, § Bijstelling eigenaar).
Presentation only; the screens' own QA stays in qa-v3-faseb-*.py.

Screens: Reis, Oefenen, Les, Toets instellen, Toets resultaat, Beloningen, Voortgang — desktop 1440×900, iPad
landscape 1180×820, iPad portrait 820×1180, on #bezig; Landschap screens also on the three backgrounds (BG-01/02/03)
at desktop and iPad landscape:
  * text ≥ 13 px: every visible V3 text (map labels in the SVG aside) is at least 13 px;
  * AA against the artwork: on each background, every visible V3 text against the rendered pixels behind it (text
    hidden for a second screenshot; 5th percentile), ≥ 4.5, or ≥ 3 for large text — the lightest and the darkest spot;
  * no horizontal overflow, no page errors.
Runs with prefers-reduced-transparency: no-preference. Writes results-afwerking.json to docs/qa/v3-afwerking/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-afwerking.py [preview.html]
"""
import asyncio, io, json, pathlib, sys
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

TEXTS = r'''() => {
  const W = innerWidth, H = innerHeight, cs = n => getComputedStyle(n);
  const scope = document.body.classList.contains('v3Les') ? 'body.v3Les :is(.v3, main.layout, #focusAnswerSheet, #focusLearnBar)' : '.v3Reis';
  return [...document.querySelectorAll(scope + ' *')].filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && !n.closest('svg, .v3PreviewBar, dialog')
      && n.checkVisibility({opacityProperty: true, visibilityProperty: true}) && cs(n).color !== 'transparent')
    .map(n => { const r = n.getBoundingClientRect(), s = cs(n);
      const clipped = (() => { for (let a = n.parentElement; a && a !== document.body; a = a.parentElement) { const o = cs(a); if (o.overflowX !== 'visible' || o.overflowY !== 'visible') { const q = a.getBoundingClientRect();
        if (r.top < q.top - 1 || r.bottom > q.bottom + 1 || r.left < q.left - 1 || r.right > q.right + 1) return true; } } return false; })();
      return {t: n.textContent.trim().slice(0, 24), color: s.color, size: parseFloat(s.fontSize), weight: parseInt(s.fontWeight), box: [r.left, r.top, r.width, r.height], clipped,
        disabled: !!n.closest('button[disabled]')}; })
    .filter(x => x.box[2] > 2 && x.box[3] > 2 && x.box[0] >= 0 && x.box[1] >= 0 && x.box[0] + x.box[2] <= W && x.box[1] + x.box[3] <= H && !x.clipped);
}'''


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
            for screen in SCREENS:
                for bg in (BGS if screen in LANDSCHAP and vp != 'ipad-staand' else ['bg01']):
                    tag = f'{screen}/{vp}/{bg}'
                    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, has_touch=vp != 'desktop')
                    pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
                    await (await ctx.new_cdp_session(pg)).send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-transparency', 'value': 'no-preference'}]})
                    await pg.goto(HTML.as_uri() + '#bezig' + ('' if bg == 'bg01' else '/' + bg)); await pg.wait_for_timeout(2000)
                    await goto(pg, screen)
                    texts = await pg.evaluate(TEXTS)
                    small = sorted({f'{t["t"]} ({t["size"]:g})' for t in texts if t['size'] < 13})
                    await pg.add_style_tag(content='*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}')
                    await pg.wait_for_timeout(150)
                    low = contrast(texts, Image.open(io.BytesIO(await pg.screenshot())))
                    hov = await pg.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
                    f = lambda why: fails.append(f'{tag}: {why}')
                    if small: f(f'text < 13 px: {small[:5]}')
                    if low: f(f'contrast < AA: {low[:4]}')
                    if hov: f('horizontal overflow')
                    if errs: f(f'page errors {errs[:2]}')
                    res['runs'][tag] = {'texts': len(texts), 'small': small, 'lowContrast': low}
                    await ctx.close()
        await b.close()
    res['errors'] = fails; res['summary'] = {'runs': len(res['runs']), 'pass': not fails}
    (OUT / 'results-afwerking.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    asyncio.run(main())
