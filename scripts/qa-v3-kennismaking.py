#!/usr/bin/env python3
"""TOPO V3.0 — Kennismaking (docs/v3/V3_0_REST.md § 4).

Per viewport (desktop, iPad landscape, iPad portrait, phone, 320 px), on #welkom (first visit: no profile, no intro):
  * the V2 first-run dialog opens as the V3 scene: welcome pose, name, three pizzas, Andiamo! and Start meteen;
    no help lines; the label "Jouw naam" is not visible but is the field's accessible name; focus inside; the scene fits the screen without horizontal scroll;
  * Andiamo! (keyboard: type, choose with arrow keys, Enter): profile schema 1 exactly {schema,name,coverColor,
    favoritePizza} under topo-nino-profile-v1, intro "done"; then Reis with chapter 1 selected;
  * Start meteen: profile schema 1 (empty name, no pizza), intro "skipped"; Reis with chapter 1; the first lesson
    then gets the V2 one-time offer (V3 style, no help line) whose Start meteen starts the lesson;
  * Escape = Start meteen (V2 cancel).
Writes results.json and screenshots to docs/qa/v3-kennismaking/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-kennismaking.py [preview.html] [outdir]
"""
import asyncio, hashlib, json, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-kennismaking').resolve()
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844), 'telefoon-320': (320, 640)}

DIALOG_JS = '''() => { const d = document.querySelector('dialog.ninoProfile[open]'), vis = e => e && e.getBoundingClientRect().width > 1 && e.checkVisibility();
  if (!d) return {open: false}; const r = d.getBoundingClientRect();
  return {open: true, v3: d.classList.contains('v3Welkom'), firstRun: d.classList.contains('ninoFirstRun'), pose: vis(d.querySelector('.profileWelcome')),
    name: vis(d.querySelector('[name=name]')), pizzas: [...d.querySelectorAll('[name=favoritePizza]')].map(i => i.value),
    buttons: [...d.querySelectorAll('button')].filter(vis).map(b => b.textContent.trim()),
    help: ['(mag leeg blijven)', 'Maximaal 24 tekens.'].filter(t => [...d.querySelectorAll('*')].some(n => vis(n) && n.children.length === 0 && n.textContent.trim() === t)),
    nameLabelVisible: [...d.querySelectorAll('label.profileName *, label.profileName')].some(n => vis(n) && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim() === 'Jouw naam')),
    nameAccessible: (() => { const i = d.querySelector('[name=name]'); return i?.labels?.[0] ? [...i.labels[0].childNodes].filter(c => c.nodeType === 3 || (c.nodeType === 1 && !c.hidden && c.tagName !== 'INPUT')).map(c => c.textContent).join('').trim() : null; })(),
    focusInside: d.contains(document.activeElement), fits: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight + 1,
    hOverflow: document.documentElement.scrollWidth > innerWidth + 1}; }'''
AFTER_JS = '''() => { const s = window.TOPO_V3_PREVIEW.storage;
  return {open: !!document.querySelector('dialog.ninoProfile[open]'), profile: s.get('topo-nino-profile-v1') ?? null, intro: s.get('topo-nino-intro-v1') ?? null,
    view: document.querySelector('.v3Reis')?.dataset.view, selected: window.TOPO_V3.ui.selected, title: document.querySelector('.v3Panel #v3Title')?.textContent || '',
    lesson: document.body.classList.contains('v3Les')}; }'''

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = HTML.read_bytes()
    res = {'html': str(HTML.relative_to(ROOT)) if HTML.is_relative_to(ROOT) else str(HTML), 'sha256': hashlib.sha256(data).hexdigest(),
           'indexSha256': hashlib.sha256((ROOT / 'index.html').read_bytes()).hexdigest(), 'runs': {}, 'errors': []}
    fails = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await p.chromium.launch()
        for name, (w, h) in VIEWPORTS.items():
            run = {}
            for flow in ('andiamo', 'start', 'escape'):
                ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=name != 'desktop', is_mobile=name.startswith('telefoon'))
                pg = await ctx.new_page(); errs = []; label = f'{name}/{flow}'
                pg.on('pageerror', lambda e: errs.append(str(e)))
                fail = lambda why: fails.append(f'{label}: {why}')
                await pg.goto(HTML.as_uri() + '#welkom'); await pg.wait_for_timeout(1800)
                d = await pg.evaluate(DIALOG_JS); run[flow] = {'dialog': d}
                if not d['open'] or not d['v3'] or not d['firstRun'] or not d['pose'] or not d['name']: fail(f'dialog {d}')
                elif d['pizzas'] != ['margherita', 'salami', 'quattro_formaggi'] or d['buttons'] != ['Start meteen', 'Andiamo!'] and sorted(d['buttons']) != ['Andiamo!', 'Start meteen']: fail(f'content {d["pizzas"]} {d["buttons"]}')
                if d.get('help'): fail(f'help texts {d["help"]}')
                if d.get('open') and (d['nameLabelVisible'] or d['nameAccessible'] != 'Jouw naam'): fail(f'name label visible={d["nameLabelVisible"]} accessible={d["nameAccessible"]!r}')
                if flow == 'andiamo':
                    tb = await pg.get_by_role('textbox', name='Jouw naam', exact=True).count(); run['nameRole'] = tb
                    if tb != 1: fail(f'textbox "Jouw naam" by accessible name: {tb}')
                if d.get('open') and (not d['focusInside'] or not d['fits'] or d['hOverflow']): fail(f'focus={d["focusInside"]} fits={d["fits"]} overflow={d["hOverflow"]}')
                if flow == 'andiamo':
                    await pg.screenshot(path=str(OUT / f'kennismaking-{name}.png'))
                    await pg.locator('dialog.ninoProfile [name=name]').focus(); await pg.keyboard.type('Lia')
                    await pg.locator('dialog.ninoProfile [name=favoritePizza]').first.focus(); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(200)
                    if name == 'desktop': await pg.screenshot(path=str(OUT / 'kennismaking-ingevuld-desktop.png'))
                    await pg.locator('dialog.ninoProfile [type=submit]').focus(); await pg.keyboard.press('Enter')
                elif flow == 'start':
                    await pg.locator('dialog.ninoProfile [data-profile-cancel]').click()
                else:
                    await pg.keyboard.press('Escape')
                await pg.wait_for_timeout(700)
                a = await pg.evaluate(AFTER_JS); run[flow]['after'] = a
                prof = json.loads(a['profile']) if a['profile'] else None
                if a['open']: fail('dialog still open')
                if not prof or sorted(prof) != ['coverColor', 'favoritePizza', 'name', 'schema'] or prof['schema'] != 1: fail(f'profile {a["profile"]}')
                elif flow == 'andiamo' and (prof['name'] != 'Lia' or prof['favoritePizza'] != 'salami'): fail(f'profile values {prof}')
                elif flow != 'andiamo' and (prof['name'] != '' or prof['favoritePizza'] is not None): fail(f'skip profile {prof}')
                if a['intro'] != ('done' if flow == 'andiamo' else 'skipped'): fail(f'intro {a["intro"]}')
                if a['view'] != 'reis' or a['selected'] != 'city1' or 'Steden 1' not in a['title'] or a['lesson']: fail(f'reis {a["view"]} {a["selected"]} {a["title"]!r} lesson={a["lesson"]}')
                if flow == 'andiamo': await pg.screenshot(path=str(OUT / f'reis-na-kennismaking-{name}.png'))
                if flow == 'start':
                    # First lesson: the V2 one-time renewed offer, in V3 style; its Start meteen starts the lesson.
                    await pg.locator('.v3Main .v3Btn.primary').filter(visible=True).first.click(); await pg.wait_for_timeout(600)
                    o = await pg.evaluate('''(() => { const d = document.querySelector('dialog.ninoIntroOffer[open]'), vis = e => e && e.getBoundingClientRect().width > 1 && e.checkVisibility();
                      return d && {v3: d.classList.contains('v3Aanbod'), help: [...d.querySelectorAll(':scope>p')].some(vis), buttons: [...d.querySelectorAll('button')].filter(vis).map(b => b.textContent.trim())}; })()''')
                    run[flow]['offer'] = o
                    if not o or not o['v3'] or o['help'] or 'Start meteen' not in o['buttons']: fail(f'offer {o}')
                    if name in ('desktop', 'telefoon'): await pg.screenshot(path=str(OUT / f'aanbod-{name}.png'))
                    if o:
                        await pg.locator('dialog.ninoIntroOffer button', has_text='Start meteen').click(); await pg.wait_for_timeout(900)
                        a = await pg.evaluate(AFTER_JS); run[flow]['lesson'] = a['lesson']
                        if not a['lesson']: fail('Start meteen did not start the lesson')
                run[flow]['pageErrors'] = errs
                if errs: fail(f'page errors {errs[:3]}')
                await ctx.close()
            res['runs'][name] = run
        await b.close()
    res['errors'] = fails
    res['summary'] = {'viewports': len(VIEWPORTS), 'flows': ['andiamo', 'start', 'escape'], 'pass': not fails}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
