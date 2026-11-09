#!/usr/bin/env python3
"""TOPO V3.0 — Toets: set-up, toets, result (docs/v3/V3_0_REST.md § 2).

Per viewport (desktop, iPad landscape, iPad portrait, phone, 320 px), on #afgerond:
  * set-up: default chapters are the completed ones, form Beide, length 10; Start toets;
  * the toets runs in the V2 engine inside the lesson shell (tab Toets): only the count `n / 10` in the bar; no hints,
    no Oefen fouten, no pizza meter, no schoolblad; answers by real clicks/keys: 7 right, 2 wrong, 1 skipped;
  * no rewards: slices, pizzas, trips and the V2 good-counter unchanged, no reward dialog ever opened;
  * result: score `7 / 10` (= V2 examCorrect/examTotal), a Nino pose, the map with 10 marks (3 ×, with the name), the
    mistakes list, no V2 result dialog; one stored result under topo-v3-toetsen-v1 that matches;
  * focus on the score; Oefen deze fouten opens the V2 mistakes exercise (tab Oefenen).
Desktop only, in addition: the reservekopie contains the results (export), an import with results replaces them, an
import of an old copy keeps them; at most 10 results (newest first); Print builds the A4 sheet (PDF in the outdir).
Writes results.json, screenshots and print-a4.pdf to docs/qa/v3-toets/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-toets.py [preview.html] [outdir]
"""
import asyncio, hashlib, json, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-toets').resolve()
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844), 'telefoon-320': (320, 640)}
KEY = 'topo-v3-toetsen-v1'
WRONG, SKIP = {2, 5}, {7}

# Every dialog that opens, by name (reward moments must never appear in a toets).
LEDGER = '''(() => { const seen = window.__opened = []; const o = HTMLDialogElement.prototype.showModal, s = HTMLDialogElement.prototype.show;
  HTMLDialogElement.prototype.showModal = function () { seen.push(this.id || this.className); return o.apply(this, arguments); };
  HTMLDialogElement.prototype.show = function () { seen.push(this.id || this.className); return s.apply(this, arguments); }; })()'''

STATE_JS = '''() => { const vis = e => e && e.getBoundingClientRect().width > 1 && e.checkVisibility({visibilityProperty: true, opacityProperty: true});
  return {mode: state.mode, view: document.querySelector('.v3Reis')?.dataset.view, tab: document.body.dataset.v3Tab, type: document.body.dataset.v3Type || null,
    count: document.querySelector('.v3LesCount')?.textContent || '', q: state.current?.id || null, qmode: state.questionMode, answered: !!state.answered,
    examTotal: state.examTotal, examAnswered: state.examAnswered, examCorrect: state.examCorrect, examEnded: !!state.examEnded,
    slices: state.slices, pizzas: state.pizzas, trips: state.trips, good: state.good, mistakes: state.mistakes.slice(),
    hints: ['#reveal', '#mistakes', '#ninoMeter', '.v3School', '.schoolbladButton', '#help', '#testStatus'].filter(s => [...document.querySelectorAll(s)].some(vis)),
    active: document.activeElement?.id || document.activeElement?.className || '', opened: (window.__opened || []).slice(),
    v2ResultOpen: !!document.querySelector('dialog.ninoExamResult[open]')}; }'''

SETUP_JS = '''() => { const on = s => [...document.querySelectorAll(s + ' [aria-pressed=true]')].map(b => b.dataset.group || b.dataset.value);
  const done = ROUTE_CHAPTERS.filter(c => TopoRoute.record(state.route, c.id).stage === 3).map(c => c.id);
  return {chapters: on('[aria-labelledby=v3ToetsHoofdstukken]').filter(x => x !== 'all'), completed: done,
    form: on('[aria-labelledby=v3ToetsVorm]'), length: on('[aria-labelledby=v3ToetsLengte]'),
    start: !!document.querySelector('.v3View-toets .v3Start:not(:disabled)'), active: document.activeElement?.id || ''}; }'''

RESULT_JS = '''() => { const v = document.querySelector('.v3View-toetsResult'), vis = e => e && e.getBoundingClientRect().width > 1 && e.checkVisibility();
  let stored = null; try { stored = JSON.parse(localStorage.getItem('%s')); } catch {}
  const r = e => e.getBoundingClientRect();
  return {score: v?.querySelector('#v3ToetsScore')?.textContent, nino: !!v?.querySelector('.v3ToetsNino *'), marks: v?.querySelectorAll('.v3Mark').length || 0,
    bad: [...(v?.querySelectorAll('.v3Mark.bad') || [])].map(m => ({id: m.dataset.id, name: m.querySelector('.v3MarkName')?.textContent})),
    marksOnMap: (() => { const svg = v?.querySelector('.v3ToetsMap'); if (!svg) return false; const b = r(svg); return [...svg.querySelectorAll('.v3Mark circle')].every(c => { const q = r(c); return q.width > 4 && q.left >= b.left - 2 && q.right <= b.right + 2 && q.top >= b.top - 2 && q.bottom <= b.bottom + 2; }); })(),
    fouten: [...(v?.querySelectorAll('.v3ToetsFouten li') || [])].map(li => li.textContent), actions: [...(v?.querySelectorAll('.v3ToetsActions .v3Btn') || [])].filter(vis).map(b => b.textContent.trim()),
    primary: v?.querySelector('.v3ToetsActions .primary')?.textContent, stored, mail: v?.querySelector('.v3ToetsMail')?.getAttribute('href') || '',
    hOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    small: [...(v?.querySelectorAll('.v3Btn') || [])].filter(b => vis(b) && (r(b).height < 44 || r(b).width < 44)).map(b => b.textContent.trim())}; }''' % KEY

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
            await ctx.add_init_script(LEDGER)
            pg = await ctx.new_page(); errs = []; run = {}
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('dialog', lambda d: asyncio.ensure_future(d.accept()))
            fail = lambda why: fails.append(f'{name}: {why}')
            st = lambda: pg.evaluate(STATE_JS)
            wait = lambda ms=450: pg.wait_for_timeout(ms)
            click = lambda sel: pg.locator(sel).filter(visible=True).first.click()
            async def nav(t):
                await pg.evaluate('document.activeElement?.blur?.()'); await wait(150); await click(f'.v3Side [data-nav={t}]'); await wait()

            await pg.goto(HTML.as_uri() + '#afgerond'); await wait(1500)
            before = await st()
            await nav('toets'); s = await pg.evaluate(SETUP_JS); run['setup'] = s
            if sorted(s['chapters']) != sorted(s['completed']) or not s['completed']: fail(f'setup chapters {s["chapters"]} ≠ completed {s["completed"]}')
            if s['form'] != ['both'] or s['length'] != ['10'] or not s['start']: fail(f'setup defaults {s["form"]} {s["length"]} {s["start"]}')
            if s['active'] != 'v3ToetsTitle': fail(f'setup focus {s["active"]}')
            await pg.screenshot(path=str(OUT / f'instellen-{name}.png'))

            await click('.v3View-toets .v3Start'); await wait(900)
            s = await st(); run['start'] = s
            if s['mode'] != 'exam' or s['examTotal'] != 10 or s['type'] != 'exam' or s['tab'] != 'toets': fail(f'start {s["mode"]} {s["examTotal"]} {s["type"]} {s["tab"]}')
            answers = []
            for n in range(1, 11):
                s = await st()
                if s['count'] != f'{n} / 10': fail(f'q{n}: count {s["count"]!r}')
                if s['hints']: fail(f'q{n}: visible {s["hints"]}')
                if n == 3 and name in ('desktop', 'telefoon'): await pg.screenshot(path=str(OUT / f'toets-{name}.png'))
                q, mode = s['q'], s['qmode']
                if __import__('os').environ.get('QA_DEBUG'): print(name, n, {k: s[k] for k in ('q', 'qmode', 'answered', 'examAnswered', 'count', 'active')})
                if n in SKIP:
                    answers.append((q, mode, 'skip')); await click('#next'); await wait(350)  # V2: first press grades as skipped
                    await click('#next'); await wait(350); continue
                if mode == 'point':
                    target = q if n not in WRONG else await pg.evaluate(f"state.examPool.find(i => i.id !== '{q}' && document.querySelector('#map [data-id=\"' + i.id + '\"][tabindex=\"0\"]'))?.id")
                    await pg.locator(f'#map [data-id="{target}"][tabindex="0"]').first.press('Enter')
                else:
                    text = await pg.evaluate('state.current.name') if n not in WRONG else 'Fout'
                    await pg.locator('#answer').fill(text); await pg.locator('#answer').press('Enter')
                await wait(250); answers.append((q, mode, 'wrong' if n in WRONG else 'ok'))
                await click('#next'); await wait(350)
            await wait(600)
            s = await st(); r = await pg.evaluate(RESULT_JS); run['result'] = r; run['after'] = {k: s[k] for k in ('examCorrect', 'examTotal', 'slices', 'pizzas', 'trips', 'good', 'opened', 'view', 'tab', 'active', 'v2ResultOpen')}
            run['answers'] = answers
            if s['examCorrect'] != 7 or s['examTotal'] != 10: fail(f'V2 score {s["examCorrect"]}/{s["examTotal"]}')
            for k in ('slices', 'pizzas', 'trips', 'good'):
                if s[k] != before[k]: fail(f'reward {k} {before[k]} → {s[k]}')
            if any(d.startswith(('pizzaCelebration', 'vespaRide', 'ninoExamResult')) for d in s['opened']): fail(f'dialogs {s["opened"]}')
            if s['v2ResultOpen']: fail('V2 result dialog open')
            if s['view'] != 'toetsResult' or s['tab'] != 'toets': fail(f'result view {s["view"]} tab {s["tab"]}')
            if s['active'] != 'v3ToetsScore': fail(f'result focus {s["active"]}')
            if r['score'] != '7 / 10' or not r['nino'] or r['marks'] != 10 or len(r['bad']) != 3 or not r['marksOnMap']: fail(f'result {r["score"]} nino={r["nino"]} marks={r["marks"]} bad={len(r["bad"])} onMap={r["marksOnMap"]}')
            if any(not x['name'] for x in r['bad']): fail('× without name')
            if len(r['fouten']) != 3 or r['primary'] != 'Oefen deze fouten': fail(f'fouten {r["fouten"]} primary {r["primary"]}')
            if not {'Kopieer', 'E-mail', 'Print', 'Nieuwe toets'} <= set(r['actions']): fail(f'actions {r["actions"]}')
            if 'Score%3A%207%20van%2010%20goed' not in r['mail']: fail('mail text')
            if r['hOverflow'] or r['small']: fail(f'layout overflow={r["hOverflow"]} small={r["small"]}')
            stored = (r['stored'] or {}).get('results') or []
            if len(stored) != 1 or stored[0]['correct'] != 7 or stored[0]['total'] != 10 or len(stored[0]['items']) != 10 or [x['id'] for x in stored[0]['items']] != [a[0] for a in answers]: fail(f'stored {stored[:1]}')
            elif [x['ok'] for x in stored[0]['items']] != [a[2] == 'ok' for a in answers]: fail('stored ok/× differs from answers')
            await pg.screenshot(path=str(OUT / f'resultaat-{name}.png'), full_page=name.startswith('telefoon'))

            if name == 'desktop':
                # Reservekopie: export contains the results.
                exported = await pg.evaluate('''async () => { const o = URL.createObjectURL; let blob = null; URL.createObjectURL = b => { blob = b; return 'blob:qa'; };
                  const a = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () {};
                  try { document.querySelector('#exportProgress').click(); } finally { URL.createObjectURL = o; HTMLAnchorElement.prototype.click = a; }
                  return blob ? JSON.parse(await blob.text()) : null; }''')
                run['export'] = {'keys': sorted(exported or {}), 'v3Toetsen': len(((exported or {}).get('v3Toetsen') or {}).get('results') or [])}
                if not exported or exported.get('app') != 'topo-italie' or exported.get('version') != 1 or run['export']['v3Toetsen'] != 1: fail(f'export {run["export"]}')
                # Import with two results replaces; an old copy (no field) keeps them.
                two = dict(exported); two['v3Toetsen'] = {'schema': 1, 'results': exported['v3Toetsen']['results'] * 2}
                old = {k: v for k, v in exported.items() if k != 'v3Toetsen'}
                async def imp(obj, label):
                    f = OUT / f'_{label}.json'; f.write_text(json.dumps(obj))
                    await pg.locator('#backupFile').set_input_files(str(f)); await wait(900); f.unlink()
                    return await pg.evaluate(f"(JSON.parse(localStorage.getItem('{KEY}'))?.results || []).length"), await pg.evaluate("document.querySelector('#backupStatus')?.textContent || ''")
                n2, msg2 = await imp(two, 'import-two'); n3, msg3 = await imp(old, 'import-old')
                run['import'] = {'withResults': n2, 'oldCopy': n3, 'status': [msg2, msg3]}
                if n2 != 2 or n3 != 2 or not msg2.startswith('Je voortgang is teruggezet') or not msg3.startswith('Je voortgang is teruggezet'): fail(f'import {run["import"]}')
                # At most 10, newest first: 10 stored + one more toets → 10, the new one first.
                await pg.evaluate(f"(() => {{ const d = JSON.parse(localStorage.getItem('{KEY}')); const one = d.results[0]; d.results = Array.from({{length: 10}}, (_, i) => ({{...one, at: new Date(Date.UTC(2026, 0, 1 + i)).toISOString()}})); localStorage.setItem('{KEY}', JSON.stringify(d)); }})()")
                await nav('toets'); await click('[aria-labelledby=v3ToetsLengte] [data-value="10"]'); await click('.v3View-toets .v3Start'); await wait(900)
                for _ in range(25):  # skip all: two presses per question
                    await click('#next'); await wait(250)
                    if await pg.evaluate("document.querySelector('.v3Reis')?.dataset.view === 'toetsResult'"): break
                await wait(600)
                d = await pg.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).results.map(r => [r.at, r.correct])")
                run['max10'] = {'count': len(d), 'first': d[0]}
                if len(d) != 10 or d[0][1] != 0 or d[0][0] < '2026-02': fail(f'max10 {run["max10"]}')
                # Print: the A4 sheet (window.print stubbed), PDF for the record.
                await pg.evaluate('(() => { window.print = () => { window.__printed = (window.__printed || 0) + 1; }; })()')
                await click('.v3ToetsPrint'); await wait(300)
                sheet = await pg.evaluate("(() => { const s = document.querySelector('.v3Print'); return s && {printed: window.__printed || 0, text: s.innerText, map: !!s.querySelector('svg .v3Marks'), marks: s.querySelectorAll('.v3Mark').length}; })()")
                run['print'] = sheet
                if not sheet or sheet['printed'] != 1 or not sheet['map'] or sheet['marks'] != 10 or '0 van 10 goed' not in sheet['text']: fail(f'print {sheet}')
                await pg.emulate_media(media='print'); await pg.pdf(path=str(OUT / 'print-a4.pdf'), format='A4', print_background=True)
                await pg.emulate_media(media='screen')
                await pg.evaluate("dispatchEvent(new Event('afterprint'))"); await wait(200)
                if await pg.evaluate("!!document.querySelector('.v3Print')"): fail('print sheet not removed')

            # Oefen deze fouten → V2 mistakes exercise under Oefenen.
            if name != 'desktop':
                await click('.v3ToetsOefen'); await wait(900); s = await st()
                grp = await pg.evaluate("document.querySelector('#groupSelect').value")
                run['oefen'] = {'mode': s['mode'], 'group': grp, 'tab': s['tab']}
                if s['mode'] != 'point' or grp != 'mistakes' or s['tab'] != 'oefenen': fail(f'oefen deze fouten {run["oefen"]}')
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
