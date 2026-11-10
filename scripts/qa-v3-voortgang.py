#!/usr/bin/env python3
"""TOPO V3.0 — Voortgang (docs/v3/V3_0_REST.md § 3).

Per viewport (desktop, iPad landscape, iPad portrait, phone, 320 px) and demo (#bezig, #afgerond, #alles):
  * head `n / 45 plekken` with a bar; n = places with both V2 paspoort labels "Goed onthouden" (DECISIONS);
  * the status per place (beheerst / bezig / nog niet) equals an independent reading of the V2 skill history with the
    V2 label rules, on the real map (one class per place) and in the legend counts;
  * 11 chapters with the chapter photo, one bar of three lesson segments and a status illustration (gold = goud, done =
    stage 3, open, locked), from TopoRoute.record and TopoRoute.unlocked (fase B stap 7; earlier ✓/★ text);
  * daily goal = V2 (after three V2 recordDailyCorrect calls: 3 / 8);
  * the V2 kennis-paspoort (45 rows) sits in Voortgang, without its V2 summary and note;
  * toets results: "Nog geen toetsen." when empty; with two stored results both are listed, newest first;
  * focus on the title, no streak, no horizontal scroll.
Writes results.json and screenshots to docs/qa/v3-voortgang/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-voortgang.py [preview.html] [outdir]
"""
import asyncio, hashlib, json, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-voortgang').resolve()
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844), 'telefoon-320': (320, 640)}
DEMOS = ['bezig', 'afgerond', 'alles']

READ_JS = '''() => { const v = document.querySelector('.v3View-voortgang'), vis = e => e && e.getBoundingClientRect().width > 1 && e.checkVisibility();
  // Independent reading of the V2 skill history with the V2 paspoort rules.
  const label = a => !a ? 'Nog oefenen' : a.streak === 0 ? 'Herhalen' : a.due <= Date.now() ? 'Opfrissen' : a.streak >= 3 ? 'Goed onthouden' : 'Op weg';
  const expect = Object.fromEntries(ITEMS.map(i => { const s = state.route.items[i.id]?.skills || {}, f = label(s.point), n = label(s.write);
    return [i.id, f === 'Goed onthouden' && n === 'Goed onthouden' ? 'beheerst' : f !== 'Nog oefenen' || n !== 'Nog oefenen' ? 'bezig' : 'nog']; }));
  const svg = v?.querySelector('svg.v3VgMap'), shown = {};
  for (const i of ITEMS) { const n = svg?.querySelector('[data-id="' + i.id + '"]'); shown[i.id] = ['beheerst', 'bezig', 'nog'].find(k => n?.classList.contains('v3St-' + k)) || null; }
  const chapters = [...(v?.querySelectorAll('.v3VgChapters li') || [])].map(li => ({id: li.dataset.chapter, on: li.querySelectorAll('.v3VgSteps i.on').length, status: li.dataset.status, art: !!li.querySelector('.v3VgStatus :is(img,svg)'), photo: !!li.querySelector('.v3VgThumb img')}));
  const route = ROUTE_CHAPTERS.map(c => { const r = TopoRoute.record(state.route, c.id); return {id: c.id, on: r.stage, status: r.goldAt > 0 ? 'gold' : r.stage === 3 ? 'done' : TopoRoute.unlocked(state.route, ROUTE_CHAPTERS, c.id) ? 'open' : 'locked', art: true, photo: true}; });
  const mastery = v?.querySelector('details.mastery');
  return {count: v?.querySelector('.v3VgCount strong')?.textContent, bar: v?.querySelector('.v3VgBar')?.getAttribute('aria-valuenow'),
    expect, shown, legend: [...(v?.querySelectorAll('.v3VgLegend li') || [])].map(li => li.textContent), chapters, route,
    daily: v?.querySelector('.v3VgDaily strong')?.textContent, dailyV2: state.daily?.correct,
    paspoortRows: mastery?.querySelectorAll('tbody tr').length || 0, paspoortInView: !!mastery && v.contains(mastery),
    v2Chrome: [...(mastery?.querySelectorAll(':scope>summary, #masteryGrid>p') || [])].filter(vis).length,
    toetsen: [...(v?.querySelectorAll('.v3VgToetsen li') || [])].map(li => li.textContent), empty: v?.querySelector('.v3VgEmpty')?.textContent || null,
    streak: /streak|reeks|op rij/i.test(v?.innerText || ''), active: document.activeElement?.id, hOverflow: document.documentElement.scrollWidth > innerWidth + 1}; }'''

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = HTML.read_bytes()
    res = {'html': str(HTML.relative_to(ROOT)) if HTML.is_relative_to(ROOT) else str(HTML), 'sha256': hashlib.sha256(data).hexdigest(),
           'indexSha256': hashlib.sha256((ROOT / 'index.html').read_bytes()).hexdigest(), 'runs': {}, 'errors': []}
    fails = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await p.chromium.launch()
        for name, (w, h) in VIEWPORTS.items():
            for demo in DEMOS:
                ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=name != 'desktop', is_mobile=name.startswith('telefoon'))
                pg = await ctx.new_page(); errs = []; label = f'{name}/{demo}'
                pg.on('pageerror', lambda e: errs.append(str(e)))
                fail = lambda why: fails.append(f'{label}: {why}')
                await pg.goto(HTML.as_uri() + '#' + demo); await pg.wait_for_timeout(1500)
                async def open_vg():
                    await pg.locator('.v3Side [data-nav=reis]').filter(visible=True).first.click(); await pg.wait_for_timeout(300)
                    await pg.locator('.v3Side [data-nav=voortgang]').filter(visible=True).first.click(); await pg.wait_for_timeout(700)
                    return await pg.evaluate(READ_JS)
                s = await open_vg()
                n = sum(1 for v in s['expect'].values() if v == 'beheerst')
                if s['count'] != f'{n} / 45' or s['bar'] != str(n): fail(f'count {s["count"]} bar {s["bar"]} ≠ {n}')
                if s['shown'] != s['expect']: fail(f'map status differs: {[k for k in s["expect"] if s["shown"][k] != s["expect"][k]][:5]}')
                counts = {k: sum(1 for v in s['expect'].values() if v == k) for k in ('beheerst', 'bezig', 'nog')}
                if s['legend'] != [f'Beheerst · {counts["beheerst"]}', f'Bezig · {counts["bezig"]}', f'Nog niet · {counts["nog"]}']: fail(f'legend {s["legend"]}')
                if s['chapters'] != s['route']: fail('chapters differ from TopoRoute.record')
                if s['paspoortRows'] != 45 or not s['paspoortInView'] or s['v2Chrome']: fail(f'paspoort rows={s["paspoortRows"]} inView={s["paspoortInView"]} v2={s["v2Chrome"]}')
                if s['empty'] != 'Nog geen toetsen.' or s['toetsen']: fail(f'toetsen empty {s["empty"]} {s["toetsen"]}')
                if s['streak']: fail('streak shown')
                if s['active'] != 'v3VoortgangTitle': fail(f'focus {s["active"]}')
                if s['hOverflow']: fail('horizontal scroll')
                run = {'first': {k: s[k] for k in ('count', 'legend', 'daily', 'paspoortRows', 'empty')}}
                await pg.screenshot(path=str(OUT / f'{demo}-{name}.png'), full_page=name.startswith('telefoon'))
                # Daily goal from V2, and two stored toets results (newest first).
                await pg.evaluate('''(() => { for (let i = 0; i < 3; i++) recordDailyCorrect();
                  const it = ITEMS.slice(0, 10).map((x, k) => ({id: x.id, mode: 'point', ok: k < 7, ...(k < 7 ? {} : {given: null})}));
                  const r = (at, c) => ({at, chapters: ['city1', 'city2'], form: 'both', length: 10, total: 10, correct: 7, items: it});
                  localStorage.setItem('topo-v3-toetsen-v1', JSON.stringify({schema: 1, results: [r('2026-11-09T10:00:00.000Z'), r('2026-11-02T10:00:00.000Z')]})); })()''')
                s = await open_vg(); run['after'] = {k: s[k] for k in ('daily', 'dailyV2', 'toetsen')}
                if s['daily'] != f'{min(8, s["dailyV2"])} / 8' or s['dailyV2'] < 3: fail(f'daily {s["daily"]} V2 {s["dailyV2"]}')
                if len(s['toetsen']) != 2 or not s['toetsen'][0].startswith('9 nov') or not s['toetsen'][1].startswith('2 nov') or '7 / 10' not in s['toetsen'][0]: fail(f'toetsen {s["toetsen"]}')
                if demo == 'afgerond': await pg.screenshot(path=str(OUT / f'met-toetsen-{name}.png'), full_page=name.startswith('telefoon'))
                run['pageErrors'] = errs
                if errs: fail(f'page errors {errs[:3]}')
                res['runs'][label] = run
                await ctx.close()
        await b.close()
    res['errors'] = fails
    res['summary'] = {'viewports': len(VIEWPORTS), 'demos': DEMOS, 'pass': not fails}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
