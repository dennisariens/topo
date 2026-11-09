#!/usr/bin/env python3
"""TOPO V3.0 — Schoolblad button and key S (docs/v3/V3_0_REST.md § 5).

Per viewport (desktop, iPad landscape, iPad portrait, phone, 320 px):
  * Reis (#bezig): button beside Schoolkaart/Reliëf opens the V2 schoolblad dialog; Escape returns focus to it;
    key S opens it too;
  * route lesson Aanwijzen: button in the lesson bar; S opens; the question stays the same;
  * Oefenen › Ontdekken: button in the lesson bar;
  * Oefenen › Namen schrijven: typing S in the answer only types; the bar button keeps draft and selection and
    returns focus to the answer field;
  * Toets (tab and running V2 toets) and the Gouden proef (#afgerond, Steden 13–18 → ★ Goud): no button, S does nothing;
  * S with Ctrl/Cmd/Alt does nothing; the V2 schoolblad buttons are not visible anywhere.
Writes results.json and screenshots to docs/qa/v3-schoolblad/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-schoolblad.py [preview.html] [outdir]
"""
import asyncio, hashlib, json, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-schoolblad').resolve()
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844), 'telefoon-320': (320, 640)}

STATE_JS = '''() => { const vis = e => e && e.getBoundingClientRect().width > 1 && e.checkVisibility({visibilityProperty: true, opacityProperty: true});
  const a = document.activeElement;
  return {open: !!document.querySelector('#schoolbladDialog[open]'), v3Buttons: [...document.querySelectorAll('.v3School')].filter(vis).map(b => b.className.replace('v3Btn v3School ', '')),
    v2Buttons: [...document.querySelectorAll('.schoolbladButton')].filter(vis).length, mode: state.mode, q: state.current?.id || null,
    active: a?.id || a?.className?.baseVal || a?.className || '', answer: document.querySelector('#answer')?.value ?? null,
    sel: a?.id === 'answer' ? [a.selectionStart, a.selectionEnd, a.selectionDirection] : null}; }'''

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = HTML.read_bytes()
    res = {'html': str(HTML.relative_to(ROOT)) if HTML.is_relative_to(ROOT) else str(HTML), 'sha256': hashlib.sha256(data).hexdigest(),
           'indexSha256': hashlib.sha256((ROOT / 'index.html').read_bytes()).hexdigest(), 'runs': {}, 'errors': []}
    fails = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await p.chromium.launch()
        for name, (w, h) in VIEWPORTS.items():
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=name != 'desktop', is_mobile=name.startswith('telefoon'))
            pg = await ctx.new_page(); errs = []; run = {}
            pg.on('pageerror', lambda e: errs.append(str(e)))
            fail = lambda why: fails.append(f'{name}: {why}')
            st = lambda: pg.evaluate(STATE_JS)
            wait = lambda ms=450: pg.wait_for_timeout(ms)
            click = lambda sel: pg.locator(sel).filter(visible=True).first.click()
            async def esc():
                await pg.keyboard.press('Escape'); await wait(350)
            async def blur():
                await pg.evaluate('document.activeElement?.blur?.()')
            async def nav(t):
                await blur(); await wait(150)  # phone: the tab bar steps aside while the answer field has focus
                await click(f'.v3Side [data-nav={t}]'); await wait()
            async def practice(form, group='city1'):
                await nav('oefenen'); await click(f'.v3Forms [data-form={form}]'); await click(f'.v3Chips [data-group={group}]'); await click('.v3Start'); await wait(900)

            await pg.goto(HTML.as_uri() + '#bezig'); await wait(1500)
            # Reis: button, Escape → focus back; key S.
            s = await st(); run['reis'] = s
            if 'v3SchoolBtn' not in s['v3Buttons']: fail(f'reis: no button {s["v3Buttons"]}')
            await pg.screenshot(path=str(OUT / f'reis-{name}.png'))
            await click('.v3SchoolBtn'); await wait(); s = await st()
            if not s['open']: fail('reis: button did not open')
            await pg.screenshot(path=str(OUT / f'open-{name}.png'))
            await esc(); s = await st(); run['reisClose'] = s
            if s['open'] or 'v3SchoolBtn' not in s['active']: fail(f'reis: focus after close {s["active"]!r}')
            await blur(); await pg.keyboard.press('s'); await wait(); s = await st(); run['reisS'] = s['open']
            if not s['open']: fail('reis: S did not open')
            await esc()
            for mod in ['Control+s', 'Meta+s', 'Alt+s']:
                await blur(); await pg.keyboard.press(mod); await wait(250)
                if (await st())['open']: fail(f'reis: {mod} opened'); await esc()

            # Route lesson (Aanwijzen): bar button and S; same question afterwards.
            await click('.v3Main .v3Btn.primary'); await wait(900); s = await st(); q = s['q']; run['les'] = s
            if 'v3LesSchool' not in s['v3Buttons']: fail(f'les: no bar button {s["v3Buttons"]}')
            await pg.screenshot(path=str(OUT / f'les-{name}.png'))
            await blur(); await pg.keyboard.press('S'); await wait(); s = await st()
            if not s['open']: fail('les: S did not open')
            await esc(); s = await st()
            if s['q'] != q: fail(f'les: question {q} → {s["q"]}')
            await click('.v3LesSchool'); await wait(); s = await st()
            if not s['open']: fail('les: bar button did not open')
            await esc(); s = await st()
            if 'v3LesSchool' not in s['active']: fail(f'les: focus after close {s["active"]!r}')

            # Oefenen › Ontdekken: bar button.
            await practice('learn'); s = await st(); run['ontdekken'] = s
            if s['mode'] != 'learn' or 'v3LesSchool' not in s['v3Buttons']: fail(f'ontdekken: {s["mode"]} {s["v3Buttons"]}')
            await pg.screenshot(path=str(OUT / f'ontdekken-{name}.png'))

            # Oefenen › Namen schrijven: S types; the button keeps draft + selection and returns focus to the answer.
            await practice('write'); ans = pg.locator('#answer')
            await ans.click(); await ans.fill(''); await pg.keyboard.type('Pisas'); await wait(200); s = await st()
            if s['open'] or s['answer'] != 'Pisas': fail(f'schrijven: S in answer {s["open"]} {s["answer"]!r}')
            await pg.evaluate("(() => { const a = document.querySelector('#answer'); a.focus(); a.setSelectionRange(1, 4, 'backward'); })()")
            await click('.v3LesSchool'); await wait(); s = await st()
            if not s['open']: fail('schrijven: bar button did not open')
            await esc(); await wait(200); s = await st(); run['schrijven'] = s
            if s['active'] != 'answer' or s['answer'] != 'Pisas' or s['sel'] != [1, 4, 'backward']: fail(f'schrijven: restore {s["active"]} {s["answer"]!r} {s["sel"]}')

            # Toets: tab view and running V2 toets: no button, S nothing.
            await nav('toets'); await blur(); await pg.keyboard.press('s'); await wait(); s = await st(); run['toetsTab'] = s
            if s['open'] or s['v3Buttons']: fail(f'toets tab: {s["open"]} {s["v3Buttons"]}')
            await pg.evaluate("document.querySelector('nav.tabs .tab[data-mode=\"exam\"]')?.click()"); await wait(900)
            await blur(); await pg.keyboard.press('s'); await wait(); s = await st(); run['toetsRun'] = s
            if s['mode'] != 'exam': fail(f'toets run: mode {s["mode"]}')
            if s['open'] or s['v3Buttons']: fail(f'toets run: {s["open"]} {s["v3Buttons"]}')
            await pg.screenshot(path=str(OUT / f'toets-{name}.png'))

            # Gouden proef.
            await pg.goto(HTML.as_uri() + '#afgerond'); await wait(1500)
            await click('.v3Row[data-chapter="city3"]'); await click('.v3Actions .primary'); await wait(900)
            kind = await pg.evaluate('document.body.dataset.v3Kind')
            await blur(); await pg.keyboard.press('s'); await wait(); s = await st(); run['goud'] = dict(s, kind=kind)
            if kind != 'gold': fail(f'goud: kind {kind}')
            if s['open'] or s['v3Buttons']: fail(f'goud: {s["open"]} {s["v3Buttons"]}')
            await pg.screenshot(path=str(OUT / f'goud-{name}.png'))
            if any(r.get('v2Buttons') for r in run.values() if isinstance(r, dict)): fail('V2 schoolblad button visible')
            run['pageErrors'] = errs
            if errs: fail(f'page errors {errs[:3]}')
            res['runs'][name] = run
            await ctx.close()
        await b.close()
    res['errors'] = fails
    res['summary'] = {'viewports': len(VIEWPORTS), 'pass': not fails}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
