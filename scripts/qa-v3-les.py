#!/usr/bin/env python3
"""TOPO V3 Golden Experience 01, beat 3-7 — browser QA on the exact built preview (file://). Spec: docs/v3/GE01.md.

Usage: python3 scripts/qa-v3-les.py [html] [outdir] [chrome]
Plays chapter 2 for real from the demo state #bezig (memory only): Ontdekken (replay) -> Aanwijzen -> Namen schrijven,
with one wrong answer in Aanwijzen and in Schrijven. Answers go through the V2 map and the V2 input; nothing is injected.
Per beat: screenshot + measured values in results.json. Checks: current lesson step, one main action, real map tap,
feedback = V2 message, meter = state, pizza/Vespa moments only on the real count, finish stamp -> Reisboekje,
back to Reis with the next chapter current, layout (overlap, clipping, small targets, overflow), console errors.
"""
import asyncio, hashlib, json, sys, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-les').resolve()
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
CHROME = sys.argv[3] if len(sys.argv) > 3 else (MAC_CHROME if pathlib.Path(MAC_CHROME).exists() else '/usr/bin/google-chrome')
VIEWPORTS = {'desktop': (1440, 900, False), 'ipad-landscape': (1180, 820, True), 'ipad-portrait': (820, 1180, True), 'phone': (390, 844, True), 'phone-small': (320, 640, True)}
import os
if os.environ.get('QA_ONLY'): VIEWPORTS = {k: v for k, v in VIEWPORTS.items() if k in os.environ['QA_ONLY'].split(',')}  # e.g. QA_ONLY=phone
FULL_SHOTS = {'desktop', 'phone'}  # every beat; the other formats keep the key beats only
KEY_SHOTS = {'point-q', 'write-wrong', 'finish'}

STATE_JS = '''() => { const s = state.route.active, b = document.body;
  const step = document.querySelector('.v3LesSteps [aria-current=step] .v3LesStep, .v3LesGold [aria-current=step]');
  return {mode: state.questionMode, id: state.current?.id ?? null, name: state.current?.name ?? null, answered: !!state.answered,
    paused: typeof roundPaused !== 'undefined' && roundPaused, kind: s?.kind ?? null, done: !!s?.done, chapter: s?.chapterId ?? null,
    stage: s ? TopoRoute.record(state.route, s.chapterId).stage : null, last: s?.lastAnswer ?? null,
    slices: state.slices, pizzas: state.pizzas, trips: state.trips, good: state.good,
    v3: b.classList.contains('v3Les'), focusShell: b.dataset.focusMode === 'true', currentStep: step?.dataset.stage || (step ? 'gold' : null),
    count: document.querySelector('.v3LesCount')?.textContent || '', dialogs: [...document.querySelectorAll('dialog[open]')].map(d => d.id || d.className),
    message: (document.querySelector('#message')?.textContent || '').trim(), messageClass: document.querySelector('#message')?.className || '',
    prompt: (document.querySelector('#prompt')?.textContent || '').trim(), meter: (document.querySelector('#ninoMeter .ninoMeterPoints strong')?.textContent || '').trim(),
    active: document.activeElement?.id || document.activeElement?.className || ''}; }'''

# Visible main actions: buttons painted in the accent colour (one per state is the rule).
LAYOUT_JS = '''() => { const r = e => e.getBoundingClientRect(), vis = e => { const q = r(e); return q.width > 1 && q.height > 1 && e.checkVisibility({contentVisibilityAuto: true, visibilityProperty: true, opacityProperty: true}) && q.bottom > 0 && q.top < innerHeight; };
  const accent = getComputedStyle(document.body).getPropertyValue('--v3-accent').trim();
  const toRgb = h => { const n = parseInt(h.slice(1), 16); return `rgb(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255})`; };
  const scope = [...document.querySelectorAll('.v3LesBar, .layout, #focusAnswerSheet, #focusLearnBar, .v3LesSideWrap, dialog[open]')];
  const buttons = [...new Set(scope.flatMap(s => [...s.querySelectorAll('button')]))].filter(vis);
  const primaries = buttons.filter(b => getComputedStyle(b).backgroundColor === toRgb(accent)).map(b => b.textContent.trim());
  const bar = [...document.querySelectorAll('.v3LesBar button, .v3LesBar .v3LesCount, #focusMenu>summary')].filter(vis), overlaps = [];
  for (let i = 0; i < bar.length; i++) for (let j = i + 1; j < bar.length; j++) { const a = r(bar[i]), b = r(bar[j]);
    if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) overlaps.push([bar[i].textContent.trim(), bar[j].textContent.trim()]); }
  const clipped = [...document.querySelectorAll('.v3LesBar .v3LesStepName, .v3LesTitle, .v3LesCount, #prompt, #message, #finishScreen h2')].filter(e => vis(e) && r(e).width > 1 && e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim());
  const small = buttons.filter(b => b.closest('.v3LesBar, #quiz, #finishScreen, #focusAnswerSheet') && (r(b).height < 44 || r(b).width < 44)).map(b => b.textContent.trim() + ' ' + Math.round(r(b).width) + 'x' + Math.round(r(b).height));
  const v2Chrome = [...document.querySelectorAll('body>header, .ninoNav, nav.tabs.practiceModes')].filter(vis).map(e => e.tagName + '.' + e.className);
  const sheetCollapsed = document.querySelector('#focusSheetToggle')?.getAttribute('aria-expanded') === 'false' && !!document.querySelector('#focusSheetToggle')?.checkVisibility();
  return {primaries, overlaps, clipped, small, v2Chrome, sheetCollapsed, horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1}; }'''

async def settle(pg, ms=450):
    await pg.wait_for_timeout(ms)

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = HTML.read_bytes(); index = (ROOT / 'index.html').read_bytes()
    res = {'html': str(HTML.relative_to(ROOT)) if HTML.is_relative_to(ROOT) else str(HTML), 'sha256': hashlib.sha256(data).hexdigest(),
           'indexSha256': hashlib.sha256(index).hexdigest(), 'runs': {}, 'errors': []}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME); res['browser'] = 'Chrome ' + b.version
        for vp, (w, h, touch) in VIEWPORTS.items():
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=touch, is_mobile=vp.startswith('phone'))
            pg = await ctx.new_page(); run = {'beats': {}, 'layout': {}, 'events': [], 'checks': {}}
            pg.on('pageerror', lambda e, vp=vp: res['errors'].append(vp + ': ' + str(e)))
            pg.on('console', lambda m, vp=vp: m.type == 'error' and res['errors'].append(vp + ' console: ' + m.text))
            st = lambda: pg.evaluate(STATE_JS)

            async def shot(tag):
                s = await st(); s['layout'] = await pg.evaluate(LAYOUT_JS); run['layout'][tag] = s['layout']
                if vp in FULL_SHOTS or tag in KEY_SHOTS: await pg.screenshot(path=str(OUT / f'{tag}-{vp}.png'))
                return s

            async def click(sel):
                await pg.locator(sel).first.evaluate('n => n.click()'); await settle(pg)

            async def dialogs(before):
                # Reward moments: record them, check they match the real count, continue through the V2 buttons.
                for _ in range(6):
                    s = await st()
                    if not s['dialogs']: return
                    d = s['dialogs'][0]
                    run['events'].append({'dialog': d, 'pizzasBefore': before['pizzas'], 'pizzasAfter': s['pizzas'], 'tripsBefore': before['trips'], 'tripsAfter': s['trips']})
                    if 'pizza' in d and 'pizza' not in run['beats']: run['beats']['pizza'] = await shot('pizza')
                    if 'vespa' in d.lower() and 'vespa' not in run['beats']: run['beats']['vespa'] = await shot('vespa')
                    await pg.evaluate('''() => { const d = [...document.querySelectorAll('dialog[open]')].pop(); const bs = [...d.querySelectorAll('button')].filter(b => b.offsetParent);
                      (bs.find(x => /Verder|Start de Vespa-rit/.test(x.textContent)) || bs.find(x => /Overslaan/.test(x.textContent)) || bs.pop())?.click(); }''')
                    await settle(pg, 700)

            async def tap_place(item_id):
                # A real pointer tap/click on the canonical target, as a child would do it: when the target lies under the
                # Focus sheet, first "Kaart vrijmaken"; when V2 opens its neutral picker for nearby places, choose the right
                # numbered option. Only if none of that answers does it fall back to the V2 keyboard path (reason recorded).
                locate = '''id => { const n = [...document.querySelectorAll('#map [data-id="' + id + '"]')].find(e => e.getBoundingClientRect().width > 0);
                  if (!n) return null; const q = n.getBoundingClientRect(), x = q.left + q.width / 2, y = q.top + q.height / 2, top = document.elementFromPoint(x, y);
                  return {x, y, onMap: !!top && !!top.closest('#map'), v3: !!top && !!top.closest('.v3, .v3LesBar')}; }'''
                box = await pg.evaluate(locate, item_id); info = {}
                if box and not box['onMap'] and await pg.evaluate('!!document.querySelector("#focusSheetToggle")?.checkVisibility()'):
                    await click('#focusSheetToggle'); info['freedMap'] = True; box = await pg.evaluate(locate, item_id)
                if box and box['onMap']:
                    if touch: await pg.touchscreen.tap(box['x'], box['y'])
                    else: await pg.mouse.click(box['x'], box['y'])
                    await settle(pg)
                    choice = f'[data-map-choice="{item_id}"]'
                    if not await pg.evaluate('state.answered') and await pg.evaluate(f'[...document.querySelectorAll(\'{choice}\')].some(b => b.checkVisibility())'):
                        await pg.locator(choice).filter(visible=True).first.click(); await settle(pg); info['picker'] = True
                    if await pg.evaluate('state.answered'): return box | info | {'via': 'tap', 'ok': await pg.evaluate('!!state.route.active.lastAnswer?.ok')}
                await pg.locator(f'#map [data-id="{item_id}"][tabindex="0"]').first.press('Enter'); await settle(pg)
                return (box or {}) | info | {'via': 'keyboard', 'reason': 'no hit' if box and box['onMap'] else 'not reachable'}

            async def play(kind):
                wrong_done = False; k = 0
                while True:
                    s = await st()
                    if not s['kind'] or s['done']: return
                    if s['paused']:
                        if 'pause' not in run['beats']: run['beats']['pause'] = await shot('pause')
                        await click('#finishScreen .button.primary'); continue
                    k += 1
                    if k > 40: raise RuntimeError('lesson did not finish')
                    if s['mode'] == 'discover':
                        if 'discover' not in run['beats']:
                            run['beats']['discover'] = await shot('discover')
                            run['checks']['discoverTitleIsPlace'] = s['prompt'] == s['name']
                        await click('#next'); await dialogs(s); continue
                    if f'{kind}-q' not in run['beats']: run['beats'][f'{kind}-q'] = await shot(f'{kind}-q')
                    before = s
                    if not wrong_done:
                        wrong_done = True
                        if kind == 'point':
                            other = await pg.evaluate("[...document.querySelectorAll('#map [data-id][tabindex=\"0\"]')].map(n => n.dataset.id).find(i => i !== state.current.id && i.startsWith('city'))")
                            await pg.locator(f'#map [data-id="{other}"][tabindex="0"]').first.press('Enter')
                        else:
                            await pg.locator('#answer').fill('Parijs'); await click('#check')
                        await settle(pg); w2 = await shot(f'{kind}-wrong'); run['beats'][f'{kind}-wrong'] = w2
                        run['checks'][f'{kind}WrongNotOk'] = w2['last'] and w2['last'].get('ok') is False and 'bad' in w2['messageClass'] and w2['slices'] == before['slices'] and w2['pizzas'] == before['pizzas']
                        await dialogs(before); await click('#next'); continue
                    if kind == 'point':
                        tap = await tap_place(s['id']); run['checks'].setdefault('pointTaps', []).append(tap)
                    else:
                        if 'draft' not in run['checks'] and vp == 'desktop':
                            # Draft, caret and focus survive a format change into Focus Mode and back.
                            await pg.locator('#answer').fill(s['name'][:3]); await pg.focus('#answer')
                            await pg.set_viewport_size({'width': 1100, 'height': 800}); await settle(pg, 600)
                            mid = await pg.evaluate('({v: answer.value, f: document.activeElement === answer, shell: document.body.dataset.focusMode})')
                            await pg.set_viewport_size({'width': w, 'height': h}); await settle(pg, 600)
                            end = await pg.evaluate('({v: answer.value, f: document.activeElement === answer, shell: document.body.dataset.focusMode})')
                            run['checks']['draft'] = {'mid': mid, 'end': end, 'ok': mid['v'] == end['v'] == s['name'][:3] and end['f'] and mid['shell'] == 'true'}
                        await pg.locator('#answer').fill(s['name']); await click('#check')
                    await settle(pg); a = await st()
                    if f'{kind}-ok' not in run['beats'] and not a['dialogs']:
                        run['beats'][f'{kind}-ok'] = await shot(f'{kind}-ok')
                        run['checks'][f'{kind}OkFeedback'] = bool(a['last'] and a['last'].get('ok')) and 'good' in a['messageClass'] and bool(a['message'])
                        run['checks'][f'{kind}MeterMatchesState'] = a['meter'] == f"{a['slices']} van 8"
                        run['checks'][f'{kind}FocusOnNext'] = a['active'] == 'next' or vp != 'desktop'
                    await dialogs(before); await click('#next')

            await pg.goto(HTML.as_uri() + '#bezig'); await settle(pg, 900)
            # Beat 3: Ontdekken (replay of the done stage through the quiet V3 replay button on Reis).
            await click('.v3Again button'); await play('discover')
            r = await st(); run['checks']['discoverDoneScreen'] = r['done']
            await pg.goto(HTML.as_uri() + '#bezig'); await settle(pg, 900)
            # Beat 4-6: Aanwijzen from the Reis main action, then straight on to Schrijven via the V2 "Volgende les".
            await click('.v3Actions .primary'); await play('point')
            run['beats']['point-done'] = await shot('point-done')
            await click('#finishScreen .button.primary'); await dialogs(await st())
            s = await st()
            if s['kind'] != 'write': raise RuntimeError('expected the write lesson after Volgende les, got ' + str(s['kind']))
            await play('write'); await dialogs(await st()); await settle(pg, 600)
            # Beat 7: finish with the stamp; Reisboekje opens on the stamp; back to Reis shows the next chapter.
            run['beats']['finish'] = await shot('finish')
            fin = await pg.evaluate('''() => { const f = document.querySelector('#finishScreen'); return {title: f?.querySelector('h2')?.textContent.trim(), stamp: f?.querySelector('.earnedMoment')?.dataset.moment || null,
              stampArt: !!f?.querySelector('.earnedMoment img'), buttons: [...(f?.querySelectorAll('button') || [])].filter(b => b.offsetParent).map(b => b.textContent.trim())}; }''')
            run['checks']['finish'] = fin
            # A tap must land on the button it started on (regression: a focused title changed size on blur and moved it).
            await pg.evaluate('''(() => { const b = window.__bookBtn = document.querySelector('#finishScreen .earnedMoment .button.primary'); window.__ev = [];
              for (const k of ['pointerdown', 'pointerup', 'click']) document.addEventListener(k, e => window.__ev.push(k + ':' + (e.target === b || b.contains(e.target) ? 'btn' : e.target.tagName + '.' + e.target.className)), true); })()''')
            await pg.locator('#finishScreen .earnedMoment .button.primary').first.click()
            try: await pg.wait_for_function('TopoBook.element.open', timeout=3000)
            except Exception: pass
            await settle(pg, 500)
            if not await pg.evaluate('TopoBook.element.open'):
                await pg.screenshot(path=str(OUT / f'book-fail-{vp}.png'))
                run['checks']['bookDebug'] = await pg.evaluate('''(() => { const b = document.querySelector('#finishScreen .earnedMoment .button.primary'), q = b?.getBoundingClientRect();
                  const top = q && document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
                  return {button: !!b, rect: q && [q.left, q.top, q.width, q.height].map(Math.round), top: top && (top.tagName + '#' + top.id + '.' + top.className), dialogs: [...document.querySelectorAll('dialog')].map(d => (d.id || d.className) + ':' + d.open)}; })()''')
            book = await pg.evaluate('({open: !!TopoBook.element.open, text: TopoBook.element.textContent.replace(/\\s+/g, " ").slice(0, 160)})')
            book['events'] = await pg.evaluate('window.__ev')
            if not book['open']:
                await pg.evaluate('window.__bookBtn.click()'); await settle(pg, 600); book['domClickOpens'] = await pg.evaluate('TopoBook.element.open')
            run['checks']['bookOpens'] = book
            if vp in FULL_SHOTS: await pg.screenshot(path=str(OUT / f'reisboekje-{vp}.png'))
            await pg.keyboard.press('Escape'); await settle(pg, 600)
            if await pg.evaluate('TopoBook.element.open'): await pg.evaluate('TopoBook.element.close()'); await settle(pg)
            await pg.locator('#finishScreen > button.primary, #finishScreen > button').first.click(); await settle(pg, 900)
            run['checks']['backToReis'] = await pg.evaluate('({reis: !!document.querySelector(".v3Reis") && document.body.classList.contains("v3Home"), selected: document.querySelector(".v3Row[aria-pressed=true]")?.dataset.chapter, v3Les: document.body.classList.contains("v3Les")})')
            run['final'] = await st(); res['runs'][vp] = run; await ctx.close()

        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce'); pg = await ctx.new_page()
        await pg.goto(HTML.as_uri() + '#bezig'); await settle(pg, 900); await pg.locator('.v3Actions .primary').first.evaluate('n => n.click()'); await settle(pg)
        res['reducedMotion'] = await pg.evaluate('getComputedStyle(document.querySelector(".v3LesStep")).transitionDuration')
        await ctx.close(); await b.close()

    def every(vp_pred):
        return all(vp_pred(v) for v in res['runs'].values())
    lay = {f'{vp}/{t}': l for vp, r in res['runs'].items() for t, l in r['layout'].items()}
    beats = {vp: {t: s['currentStep'] for t, s in r['beats'].items()} for vp, r in res['runs'].items()}
    events_ok = every(lambda r: all((('pizza' in e['dialog']) <= (e['pizzasAfter'] > e['pizzasBefore'])) and (('vespa' in e['dialog'].lower()) <= (e['tripsAfter'] > e['tripsBefore'])) for e in r['events']))
    res['summary'] = {
        'indexUnchanged': res['indexSha256'].startswith('3aced3c3'),
        'currentStepPerBeat': beats,
        'stepsRight': every(lambda r: r['beats']['discover']['currentStep'] == 'discover' and r['beats']['point-q']['currentStep'] == 'point' and r['beats']['write-q']['currentStep'] == 'write'),
        'oneMainAction': {k: v['primaries'] for k, v in lay.items() if len(v['primaries']) > 1 and not k.endswith(('/pizza', '/vespa'))},
        # Point and write questions have no accent action by design (the map or Controleer after typing is the action);
        # a Focus sheet the child collapsed with "Kaart vrijmaken" stays collapsed after answering (V2 Focus Mode, also in afb32d1).
        'noMainAction': [k for k, v in lay.items() if not v['primaries'] and not v.get('sheetCollapsed') and not k.endswith(('/vespa', '/point-q', '/write-q'))],
        'collapsedSheetAfterAnswer': [k for k, v in lay.items() if v.get('sheetCollapsed')],
        'pointByRealTap': {vp: [t.get('via') + ('+kiezer' if t.get('picker') else '') + ('+vrijmaken' if t.get('freedMap') else '') + ('' if t.get('via') != 'tap' or t.get('ok') else ':notOk') for t in r['checks'].get('pointTaps', [])] for vp, r in res['runs'].items()},
        'tapsBlockedByV3': [vp for vp, r in res['runs'].items() if any(t.get('v3') for t in r['checks'].get('pointTaps', []))],
        'wrongAnswersNotRewarded': every(lambda r: r['checks'].get('pointWrongNotOk') and r['checks'].get('writeWrongNotOk')),
        'feedbackFromV2': every(lambda r: r['checks'].get('pointOkFeedback') and r['checks'].get('writeOkFeedback')),
        'meterMatchesState': every(lambda r: r['checks'].get('pointMeterMatchesState') and r['checks'].get('writeMeterMatchesState')),
        'rewardMomentsOnRealCount': events_ok,
        'pizzaAndVespaSeen': {vp: sorted({e['dialog'] for e in r['events']}) for vp, r in res['runs'].items()},
        'draftSurvivesFormatChange': res['runs'].get('desktop', {}).get('checks', {}).get('draft', {}).get('ok'),
        'finishStampAndBook': every(lambda r: r['checks']['finish']['stamp'] == 'stamp:city2' and r['checks']['finish']['stampArt'] and r['checks']['bookOpens']['open']),
        'bookTapLandsOnButton': every(lambda r: r['checks']['bookOpens']['events'][:2] == ['pointerdown:btn', 'pointerup:btn']),
        'finishOneBackButton': {vp: r['checks']['finish']['buttons'] for vp, r in res['runs'].items()},
        'backToReisNextChapter': every(lambda r: r['checks']['backToReis']['reis'] and r['checks']['backToReis']['selected'] == 'city3' and not r['checks']['backToReis']['v3Les']),
        'v2ChromeVisible': {k: v['v2Chrome'] for k, v in lay.items() if v['v2Chrome'] and not k.endswith(('/pizza', '/vespa'))},
        'barOverlaps': {k: v['overlaps'] for k, v in lay.items() if v['overlaps']},
        'clipped': {k: v['clipped'] for k, v in lay.items() if v['clipped']},
        'smallTargets': {k: v['small'] for k, v in lay.items() if v['small']},
        'horizontalOverflow': [k for k, v in lay.items() if v['horizontalOverflow']],
        'reducedMotion': res['reducedMotion'],
        'errors': len(res['errors'])}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False))
    print(json.dumps(res['summary'], indent=1, ensure_ascii=False))
    if res['errors']: print('\n'.join(res['errors'][:10]))

asyncio.run(main())
