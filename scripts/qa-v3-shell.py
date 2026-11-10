#!/usr/bin/env python3
"""TOPO V3.0 — shell navigation on every screen (docs/v3/V3_0_REST.md § Navigatie).

Per viewport (desktop, iPad landscape, iPad portrait, phone, 320 px), on the #bezig demo:
  * Reis, Oefenen, Toets, Beloningen, Voortgang and Instellingen are reachable on the V3 window and inside a lesson
    (sidebar, iPad rail or phone tab bar); the current tab carries aria-current=page; no V2 header, V2 nav, V2 tabs
    or Focus Mode menu is visible;
  * a tab moves focus to the view title; Instellingen opens the V2 settings dialog and returns focus on close;
  * Oefenen → Start opens free practice in the shell (tab Oefenen); Reis and back to Oefenen restores the same question;
  * Reis → the V3 primary action (Ga verder / next stage) opens the route lesson (tab Reis); Beloningen and back via Reis → Ga verder restores it;
  * no clipped V3 text and no overlapping V3 buttons on any of these screens; with reduced motion (extra phone run)
    no V3 element transitions or animates;
  * nav items are at least 44 px, inside the viewport, and the page has no horizontal scroll; the rail or tab bar does
    not cover the answer sheet.
Writes results.json and screenshots per viewport to docs/qa/v3-shell/.

Usage: node scripts/build-v3-preview.mjs && python3 scripts/qa-v3-shell.py [preview.html] [outdir]
"""
import asyncio, hashlib, json, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-shell').resolve()
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1180, 820), 'ipad-staand': (820, 1180), 'telefoon': (390, 844), 'telefoon-320': (320, 640), 'telefoon-verminderd': (390, 844)}
TABS = ['reis', 'oefenen', 'toets', 'rewards', 'voortgang', 'instellingen']

NAV_JS = '''() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && e.checkVisibility({visibilityProperty: true, opacityProperty: true}); };
  const navs = [...document.querySelectorAll('.v3Side')].filter(vis);
  const nav = navs[0], items = nav ? [...nav.querySelectorAll('[data-nav]')] : [];
  const r = e => e.getBoundingClientRect();
  return {navCount: navs.length, inShell: !!nav?.closest('.v3ShellNav'), tabs: items.map(i => i.dataset.nav),
    visibleTabs: items.filter(vis).map(i => i.dataset.nav), current: items.filter(i => i.getAttribute('aria-current') === 'page').map(i => i.dataset.nav),
    small: items.filter(i => vis(i) && (r(i).height < 44 || r(i).width < 44)).map(i => i.dataset.nav + ' ' + Math.round(r(i).width) + 'x' + Math.round(r(i).height)),
    outside: items.filter(i => vis(i) && (r(i).left < -1 || r(i).right > innerWidth + 1 || r(i).top < -1 || r(i).bottom > innerHeight + 1)).map(i => i.dataset.nav),
    v2Chrome: [...document.querySelectorAll('body>header, .ninoNav, nav.tabs, #focusMenu, footer.backupTools')].filter(vis).map(e => e.tagName + (e.id ? '#' + e.id : '.' + e.className)),
    view: document.querySelector('.v3Reis')?.dataset.view || null, lesson: document.body.classList.contains('v3Les'),
    active: document.activeElement?.id || document.activeElement?.className || '', mode: state.mode, q: state.current?.id || null,
    hOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    // Afkapping: visible V3 text that does not fit its box (ellipsis or clipped), and overlapping buttons.
    clipped: [...document.querySelectorAll('.v3 :is(h1,h2,strong,span,button,a,li,p)')].filter(e => vis(e) && e.children.length === 0 && (e.scrollWidth > e.clientWidth + 1) && getComputedStyle(e).overflow !== 'visible').map(e => e.textContent.trim().slice(0, 30)),
    overlaps: (() => { const bs = [...document.querySelectorAll('.v3 .v3Btn')].filter(e => vis(e) && !e.closest('.v3Side')), out = [];  // the fixed tab bar sits above scrolling content by design
      for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) { if (bs[i].contains(bs[j]) || bs[j].contains(bs[i])) continue; const a = r(bs[i]), c = r(bs[j]);
        if (a.left < c.right - 1 && a.right > c.left + 1 && a.top < c.bottom - 1 && a.bottom > c.top + 1) out.push(bs[i].textContent.trim().slice(0, 20) + ' × ' + bs[j].textContent.trim().slice(0, 20)); } return out; })(),
    moving: matchMedia('(prefers-reduced-motion: reduce)').matches ? [...document.querySelectorAll('.v3, .v3 *')].filter(e => { const c = getComputedStyle(e); return vis(e) && (parseFloat(c.transitionDuration) > 0 || (c.animationName !== 'none' && parseFloat(c.animationDuration) > 0)); }).map(e => e.className.toString().slice(0, 30)) : [],
    sheetCovered: (() => { const s = ['#focusAnswerSheet', '#focusLearnBar'].map(q => document.querySelector(q)).find(x => x && vis(x)), t = document.querySelector('.v3ShellNav');
      if (!s || !t || !vis(t)) return false; const a = r(s), b = r(t); return a.bottom > b.top + 1 && a.top < b.bottom - 1 && a.right > b.left + 1 && a.left < b.right - 1; })()}; }'''

# Phone: scrolled to the end, the last content of the screen (view, Beloningen) ends at least 8 px above the fixed tab
# bar; the screen's bottom padding is the measured tab bar height (incl. safe area) plus room; every button that gets
# keyboard focus is scrolled clear of the bar (scroll-padding) and is the element at its own centre.
# An svg (a map clone) counts as one leaf: its paths may run past its box, where they are clipped.
CLEAR_JS = '''(async () => { const bar = [...document.querySelectorAll('.v3Side')].find(e => e.checkVisibility() && getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().bottom >= innerHeight - 1 && e.getBoundingClientRect().width >= innerWidth - 1); if (!bar) return null;
  const root = document.querySelector('.v3Reis'), v = document.querySelector('.v3Reis > .v3View-' + root.dataset.view) || document.querySelector('.v3Reis > .v3Rewards');
  scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'}); await new Promise(r => requestAnimationFrame(r));
  const leaves = [...v.querySelectorAll('*')].filter(e => !e.closest('.v3Side') && !e.parentElement.closest('svg') && (e.children.length === 0 || e.tagName === 'svg') && e.checkVisibility() && e.getBoundingClientRect().height > 0);
  const last = Math.max(...leaves.map(e => e.getBoundingClientRect().bottom)), top = bar.getBoundingClientRect().top, covered = [];
  for (const btn of [...v.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter(e => e.checkVisibility() && e.getBoundingClientRect().height > 0)) {
    scrollTo({top: 0, behavior: 'instant'}); btn.focus(); await new Promise(r => requestAnimationFrame(r));
    const r = btn.getBoundingClientRect(), at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    if (r.bottom > bar.getBoundingClientRect().top || !(at === btn || btn.contains(at))) covered.push(btn.textContent.trim().slice(0, 24)); }
  document.activeElement?.blur?.(); scrollTo({top: 0, behavior: 'instant'});
  return {gap: Math.round(top - last), bar: Math.round(bar.getBoundingClientRect().height), pad: parseFloat(getComputedStyle(root).paddingBottom),
    tabbarVar: getComputedStyle(document.documentElement).getPropertyValue('--v3-tabbar').trim(), covered}; })()'''

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = HTML.read_bytes()
    res = {'html': str(HTML.relative_to(ROOT)) if HTML.is_relative_to(ROOT) else str(HTML), 'sha256': hashlib.sha256(data).hexdigest(),
           'indexSha256': hashlib.sha256((ROOT / 'index.html').read_bytes()).hexdigest(), 'runs': {}, 'errors': []}
    fails = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await p.chromium.launch()
        for name, (w, h) in VIEWPORTS.items():
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=name != 'desktop', is_mobile=name.startswith('telefoon'), reduced_motion='reduce' if 'verminderd' in name else 'no-preference')
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(HTML.as_uri() + '#bezig'); await pg.wait_for_timeout(1500)
            nav = lambda: pg.evaluate(NAV_JS)
            async def tab(t):
                await pg.locator(f'.v3Side [data-nav={t}]').filter(visible=True).first.click(); await pg.wait_for_timeout(500)
            run = {}; fail = lambda why: fails.append(f'{name}: {why}')
            def check(label, s, cur, lesson=None):
                run[label] = s
                if s['navCount'] != 1: fail(f'{label}: {s["navCount"]} navs visible')
                if s['tabs'] != TABS: fail(f'{label}: tabs {s["tabs"]}')
                if sorted(s['visibleTabs']) != sorted(TABS): fail(f'{label}: visible {s["visibleTabs"]}')
                if s['current'] != [cur]: fail(f'{label}: aria-current {s["current"]} ≠ {cur}')
                if s['v2Chrome']: fail(f'{label}: V2 chrome {s["v2Chrome"]}')
                if s['small']: fail(f'{label}: small {s["small"]}')
                if s['outside']: fail(f'{label}: outside {s["outside"]}')
                if s['hOverflow']: fail(f'{label}: horizontal scroll')
                if s['sheetCovered']: fail(f'{label}: tab bar covers the answer sheet')
                if s['clipped']: fail(f'{label}: clipped {s["clipped"][:4]}')
                if s['overlaps']: fail(f'{label}: overlap {s["overlaps"][:3]}')
                if s['moving']: fail(f'{label}: motion with reduced motion {s["moving"][:3]}')
                if lesson is not None and s['lesson'] != lesson: fail(f'{label}: lesson={s["lesson"]}')
            check('reis', await nav(), 'reis', False)
            await pg.screenshot(path=str(OUT / f'reis-{name}.png'))
            for t, title in [('oefenen', 'v3OefenenTitle'), ('toets', 'v3ToetsTitle'), ('rewards', 'v3RewardsTitle'), ('voortgang', 'v3VoortgangTitle')]:
                await tab(t); s = await nav(); check(t, s, t, False)
                if s['view'] != t: fail(f'{t}: view {s["view"]}')
                # The end of the view can scroll clear of a fixed tab bar.
                clear = await pg.evaluate(CLEAR_JS); run[t + '-clear'] = clear
                if clear and (clear['gap'] < 8 or clear['pad'] < clear['bar'] + 8 or clear['covered']): fail(f'{t}: tab bar clearance {clear}')
                if s['active'] != title: fail(f'{t}: focus on {s["active"]}')
                await pg.screenshot(path=str(OUT / f'{t}-{name}.png'))
            # Instellingen: V2 dialog, focus back on the opener.
            await tab('instellingen')
            opened = await pg.evaluate("!!document.querySelector('dialog.ninoSettings[open]')")
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
            back = await pg.evaluate("document.activeElement?.dataset?.nav || ''")
            run['instellingen'] = {'opened': opened, 'focusBack': back}
            if not opened: fail('instellingen: dialog did not open')
            if back != 'instellingen': fail(f'instellingen: focus back on {back!r}')
            # Oefenen → Start: free practice in the shell; Reis and back restores the same question.
            await tab('oefenen')
            await pg.locator('.v3View-oefenen .v3Forms [data-form=point]').click(); await pg.locator('.v3View-oefenen .v3Chips [data-group=city1]').click()
            await pg.locator('.v3View-oefenen .v3Start').click(); await pg.wait_for_timeout(900)
            s = await nav(); check('vrij', s, 'oefenen', True); q = s['q']
            if s['mode'] != 'point': fail(f'vrij: mode {s["mode"]}')
            await pg.screenshot(path=str(OUT / f'vrij-oefenen-{name}.png'))
            await tab('reis'); s = await nav(); check('vrij→reis', s, 'reis', False)
            await tab('oefenen'); s = await nav(); check('reis→vrij', s, 'oefenen', True)
            if s['q'] != q or s['mode'] != 'point': fail(f'oefenen restore: {s["mode"]}/{s["q"]} ≠ point/{q}')
            # Reis → Ga verder: route lesson (tab Reis); Beloningen and back restores it.
            await tab('reis'); await pg.locator('.v3Main .v3Btn.primary').filter(visible=True).first.click(); await pg.wait_for_timeout(900)
            s = await nav(); check('les', s, 'reis', True); q = s['q']
            await pg.screenshot(path=str(OUT / f'les-{name}.png'))
            await tab('rewards'); s = await nav(); check('les→beloningen', s, 'rewards', False)
            await tab('reis'); await pg.locator('.v3Main .v3Btn.primary').filter(visible=True).first.click(); await pg.wait_for_timeout(900)
            s = await nav(); check('beloningen→les', s, 'reis', True)
            if s['q'] != q: fail(f'les restore: {s["q"]} ≠ {q}')
            run['pageErrors'] = errs
            if errs: fail(f'page errors {errs[:3]}')
            res['runs'][name] = run
            await ctx.close()
        await b.close()
    res['errors'] = fails
    res['summary'] = {'viewports': len(VIEWPORTS), 'screensPerViewport': 9, 'pass': not fails}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
    print(json.dumps(res['summary']), *fails, sep='\n')
    sys.exit(1 if fails else 0)

asyncio.run(main())
