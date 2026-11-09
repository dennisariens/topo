#!/usr/bin/env python3
"""TOPO V3 — regression GE01-K01 (Hermes, issue #76, 1a42590): the key that submits an answer never activates a control
in a reward moment that opens because of it.

Hermes' reproduction, step by step (scenario `pizza-hermes`): prefers-reduced-motion, #nieuw, Steden 1–6: Ontdekken,
six correct Aanwijzen answers (Enter on the map target), one correct written answer, then the next written answer —
the eighth rewarded answer — submitted with ONE Enter (and, as the control, with a click on Controleer). The pizza
dialog must stay open. Then the same rule for every reward moment, with and without reduced motion:
  `bezig`  #bezig, chapter 2 Aanwijzen → Namen schrijven: pizza 1→2, 2→3, Vespa ride 0→1, stamp on the finish screen;
  `goud`   #afgerond, Steden 13–18 (stage 3, no gold yet) → ★ Goud: the gold moment on the finish screen.
In the Enter runs every step is a keyboard step: answers with Enter on the map target or the answer field, and the
next question with Enter on whatever has focus (as a keyboard user does). Per key press it records trusted keyboard
clicks (detail 0) that land on another element than the key went down on, whether the V3 layer dropped them, and
every dialog that closed during that key press. Fails on: a reward dialog closed by the key that opened it, an
unintended keyboard click that went through, the Reisboekje opened by it, or a moment that never appeared.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-toets-beloning.py [preview.html] [outdir]
"""
import asyncio, hashlib, json, os, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-les/toets-beloning').resolve()
DEBUG = bool(os.environ.get('QA_DEBUG'))
ONLY = os.environ.get('QA_ONLY')  # e.g. QA_ONLY=bezig/Enter/reduce
REWARD = lambda d: d.startswith(('pizzaCelebration', 'vespaRide'))  # the picker and other dialogs are no reward moment
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# Registered before any page script, so it sees each click before the V3 layer can drop it.
LEDGER = '''(() => { window.__ev = []; const name = t => t && (t.tagName === 'DIALOG' ? (t.id || t.className) : t.id || (t.textContent || '').trim().slice(0, 40) || t.tagName);
  for (const k of ['keydown', 'keyup']) addEventListener(k, e => __ev.push({type: k, key: e.key, target: name(e.target)}), true);
  addEventListener('click', e => { const rec = {type: 'click', target: name(e.target), detail: e.detail, trusted: e.isTrusted}; __ev.push(rec);
    setTimeout(() => { rec.dropped = e.defaultPrevented; }); }, true);
  document.addEventListener('close', e => __ev.push({type: 'close', target: name(e.target)}), true); })()'''
STATE = '''() => { const s = state.route.active, f = document.querySelector('#finishScreen');
  return {mode: state.questionMode, id: state.current?.id ?? null, name: state.current?.name ?? null, answered: !!state.answered,
    paused: typeof roundPaused !== 'undefined' && roundPaused, kind: s?.kind ?? null, done: !!s?.done,
    finish: !!f?.checkVisibility?.(), moment: f?.checkVisibility?.() ? (f.querySelector('.earnedMoment')?.dataset.moment || null) : null,
    slices: state.slices, pizzas: state.pizzas, trips: state.trips, book: !!TopoBook.element.open,
    dialogs: [...document.querySelectorAll('dialog[open]')].map(d => d.id || d.className), active: document.activeElement?.id || (document.activeElement?.textContent || '').trim().slice(0, 40)}; }'''


async def run(b, scenario, method, reduce):
    ctx = await b.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce' if reduce else 'no-preference')
    await ctx.add_init_script(LEDGER)
    pg = await ctx.new_page(); errors = []; pg.on('pageerror', lambda e: errors.append(str(e)))
    st = lambda: pg.evaluate(STATE)
    presses, moments = [], []

    async def wait(ms=250): await pg.wait_for_timeout(ms)

    async def mouse(sel):
        await pg.locator(sel).filter(visible=True).first.click(); await wait(200)

    async def keyed(label, action, before):
        """One key press (or click); records what happened between key down and settled state."""
        await pg.evaluate('__ev.length = 0'); await action(); await wait(700 if reduce else 900)
        ev = await pg.evaluate('__ev'); s = await st()
        down = next((e['target'] for e in ev if e['type'] == 'keydown'), None)
        foreign = [e for e in ev if e['type'] == 'click' and e['trusted'] and e['detail'] == 0 and down is not None and e['target'] != down]
        # A dialog that was already open may close by its own button; one that opened during this press may not close.
        rec = {'step': label, 'key': down, 'opened': [d for d in s['dialogs'] if d not in before['dialogs']], 'closed': [e['target'] for e in ev if e['type'] == 'close' and e['target'] not in before['dialogs']],
               'foreignKeyClicks': foreign, 'leaked': [e['target'] for e in foreign if not e.get('dropped')], 'bookOpenedByKey': s['book'] and not before['book'],
               'pizzas': [before['pizzas'], s['pizzas']], 'trips': [before['trips'], s['trips']], 'moment': s['moment'] if s['moment'] != before['moment'] else None}
        presses.append(rec)
        for d in [d for d in rec['opened'] + rec['closed'] if REWARD(d)]: moments.append({'moment': d, 'step': label, 'stillOpen': d in s['dialogs']})
        if rec['moment']: moments.append({'moment': rec['moment'], 'step': label, 'stillOpen': s['finish'] and not s['book']})
        return s

    async def close_dialogs():
        # Through the dialog's own button, the same way as the run: Enter on it, or a click. "Start de Vespa-rit" opens
        # the ride, which is itself a reward moment.
        for _ in range(8):
            s = await st()
            if not s['dialogs']: return
            if any('ride' in d.lower() or 'vespa' in d.lower() for d in s['dialogs']):
                await pg.screenshot(path=str(OUT / f'{scenario}-vespa-{method}-{"reduce" if reduce else "motion"}.png'))
            for label in ('Verder', 'Start de Vespa-rit', 'Overslaan'):
                btn = pg.locator('dialog[open] button').filter(visible=True).filter(has_text=label).last
                if await btn.count():
                    await keyed('dialog ' + label, (lambda: btn.press('Enter')) if method == 'Enter' else (lambda: btn.click()), s); break
            else: return

    async def answer(s):
        if s['mode'] == 'point':
            target = pg.locator(f'#map [data-id="{s["id"]}"][tabindex="0"]').first
            if method == 'Enter': return await keyed('point ' + s['id'], lambda: target.press('Enter'), s)
            async def tap():
                await target.click(force=True); await wait(300)
                choice = pg.locator(f'[data-map-choice="{s["id"]}"]').filter(visible=True)
                if not await pg.evaluate('state.answered') and await choice.count(): await choice.first.click()
                if not await pg.evaluate('state.answered'): await target.press('Enter')  # fallback recorded by the ledger
            return await keyed('point ' + s['id'], tap, s)
        await pg.locator('#answer').fill(s['name'])
        if method == 'Enter': return await keyed('write ' + s['id'], lambda: pg.locator('#answer').press('Enter'), s)
        return await keyed('write ' + s['id'], lambda: pg.locator('#check').click(), s)

    async def advance(s):
        # Next question: the click run clicks Volgende.
        # Focus on the answer field or a button: Enter right there (V2 handles Enter in #answer as "next"); focus left on
        # a map target: the user tabs to Volgende first, so Enter goes to Volgende.
        if method == 'Enter':
            here = await pg.evaluate("document.activeElement?.id === 'answer' || document.activeElement?.tagName === 'BUTTON'")
            return await keyed('next', (lambda: pg.keyboard.press('Enter')) if here else (lambda: pg.locator('#next').filter(visible=True).first.press('Enter')), s)
        return await keyed('next', lambda: pg.locator('#next').filter(visible=True).first.click(), s)

    await pg.goto(HTML.as_uri() + {'pizza-hermes': '#nieuw', 'bezig': '#bezig', 'goud': '#afgerond'}[scenario]); await wait(1200)
    if scenario == 'goud': await mouse('.v3Row[data-chapter="city3"]')
    await mouse('.v3Actions .primary')

    if scenario == 'pizza-hermes':
        # Hermes' exact path: Ontdekken (6× Volgende), Aanwijzen (6× Enter on the target + Volgende), 1 written answer, then the 8th.
        for _ in range(6): await mouse('#next')
        await mouse('#finishScreen .primary')
        for _ in range(6):
            i = await pg.evaluate('state.current.id'); await pg.locator(f'#map [data-id="{i}"][tabindex="0"]').first.press('Enter'); await wait(150); await mouse('#next')
        await mouse('#finishScreen .primary')
        await pg.locator('#answer').fill(await pg.evaluate('state.current.name')); await mouse('#check'); await mouse('#next')
        s = await st(); await pg.locator('#answer').fill(s['name'])
        act = (lambda: pg.locator('#answer').press('Enter')) if method == 'Enter' else (lambda: pg.locator('#check').click())
        s = await keyed('write ' + s['id'] + ' (8th rewarded answer)', act, s)
        await pg.screenshot(path=str(OUT / f'pizza-hermes-{method}-{"reduce" if reduce else "motion"}.png'))
        want = {'pizzaCelebration'}
    else:
        want = {'pizzaCelebration', 'stamp', 'vespa'} if scenario == 'bezig' else {'gold'}
        for k in range(160):
            s = await st()
            if DEBUG: print('  ', k, {x: s[x] for x in ('mode', 'kind', 'id', 'answered', 'finish', 'done', 'moment', 'dialogs', 'active', 'pizzas', 'slices')}, flush=True)
            if s['dialogs']: await close_dialogs(); continue
            if s['paused']: await mouse('#finishScreen .button.primary'); continue
            if s['finish'] or s['done'] or not s['kind']:
                if s['moment'] or not s['kind']: break
                await mouse('#finishScreen .button.primary'); continue  # Volgende les (Aanwijzen → Namen schrijven)
            if s['mode'] == 'discover': await mouse('#next'); continue
            if not s['answered']: s = await answer(s)
            if s['dialogs']: await close_dialogs(); s = await st()
            if s['answered'] and not s['finish']: s = await advance(s)
        s = await st()
        if s['moment']: await pg.screenshot(path=str(OUT / f'{scenario}-{s["moment"].split(":")[0]}-{method}-{"reduce" if reduce else "motion"}.png'))
    seen = {('vespa' if ('ride' in m['moment'].lower() or 'vespa' in m['moment'].lower()) else m['moment'].split(':')[0]) for m in moments}
    await ctx.close()
    return {'scenario': scenario, 'method': method, 'reducedMotion': reduce, 'presses': presses, 'moments': moments, 'errors': errors,
            'missing': sorted(want - seen), 'closedByKey': [m for m in moments if not m['stillOpen']],
            'leaked': [p for p in presses if p['leaked'] or p['bookOpenedByKey']], 'dropped': sum(len(p['foreignKeyClicks']) - len(p['leaked']) for p in presses)}


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    res = {'html': str(HTML.relative_to(ROOT)) if HTML.is_relative_to(ROOT) else str(HTML), 'sha256': hashlib.sha256(HTML.read_bytes()).hexdigest(),
           'indexSha256': hashlib.sha256((ROOT / 'index.html').read_bytes()).hexdigest(), 'runs': []}
    async with async_playwright() as p:
        b = await p.webkit.launch()
        res['browser'] = 'Chrome ' + b.version
        for scenario in ('pizza-hermes', 'bezig', 'goud'):
            for reduce in (True, False):
                for method in ('Enter', 'click'):
                    if ONLY and ONLY != f"{scenario}/{method}/{'reduce' if reduce else 'motion'}": continue
                    r = await run(b, scenario, method, reduce); res['runs'].append(r)
                    print(scenario, method, 'reduce' if reduce else 'motion', 'missing', r['missing'], 'closedByKey', len(r['closedByKey']), 'leaked', len(r['leaked']), 'dropped', r['dropped'], flush=True)
        await b.close()
    runs = res['runs']
    res['summary'] = {
        'indexUnchanged': res['indexSha256'].startswith('3aced3c3'),
        'hermesReproPizzaStaysOpen': all(not r['closedByKey'] and not r['missing'] for r in runs if r['scenario'] == 'pizza-hermes'),
        'everyMomentSeen': {f"{r['scenario']}/{r['method']}/{'reduce' if r['reducedMotion'] else 'motion'}": r['missing'] for r in runs if r['missing']},
        'momentsClosedByKey': {f"{r['scenario']}/{r['method']}/{'reduce' if r['reducedMotion'] else 'motion'}": r['closedByKey'] for r in runs if r['closedByKey']},
        'keyClicksLeaked': {f"{r['scenario']}/{r['method']}/{'reduce' if r['reducedMotion'] else 'motion'}": r['leaked'] for r in runs if r['leaked']},
        'keyClicksDropped': sum(r['dropped'] for r in runs),
        'momentsPerRun': {f"{r['scenario']}/{r['method']}/{'reduce' if r['reducedMotion'] else 'motion'}": sorted({m['moment'] for m in r['moments']}) for r in runs},
        'errors': sum(len(r['errors']) for r in runs),
    }
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary'], indent=1, ensure_ascii=False))
    bad = [k for k in ('indexUnchanged', 'hermesReproPizzaStaysOpen') if not res['summary'][k]] + [k for k in ('everyMomentSeen', 'momentsClosedByKey', 'keyClicksLeaked', 'errors') if res['summary'][k]]
    print('problems:', bad or 'none'); sys.exit(1 if bad else 0)

asyncio.run(main())
