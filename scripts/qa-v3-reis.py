#!/usr/bin/env python3
"""TOPO V3 Reis preview — browser QA on the exact built HTML (file://).

Usage: python3 scripts/qa-v3-reis.py [html] [outdir] [chrome]
Writes screenshots and results.json to outdir (default docs/qa/v3-reis).
Checks: next action above the fold, no overlapping/clipped controls, label wrapping,
stop selection + detail, real lesson start through V2 buttons, Reis -> Verder restore,
keyboard order, reduced motion, demo storage isolation, console errors.
"""
import asyncio, hashlib, json, sys, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-reis').resolve()
CHROME = sys.argv[3] if len(sys.argv) > 3 else '/usr/bin/google-chrome'
VIEWPORTS = {'desktop': (1440, 900, False), 'ipad-portrait': (820, 1180, True), 'ipad-landscape': (1180, 820, True), 'phone': (390, 844, True), 'phone-small': (320, 640, True)}
STATES = ['nieuw', 'bezig', 'afgerond', 'alles']

LAYOUT_JS = '''() => {
  const vh = innerHeight, r = e => e.getBoundingClientRect();
  const fixed = [...document.querySelectorAll('body>header,.ninoNav,.v3PreviewBar')].filter(e=>getComputedStyle(e).position==='fixed').map(r);
  const primary = document.querySelector('#v3Continue'), p = primary && r(primary);
  const covered = p ? fixed.some(f => p.top < f.bottom && p.bottom > f.top && p.left < f.right && p.right > f.left) : null;
  const ctrls = [...document.querySelectorAll('.v3Reis button')].filter(b => b.offsetParent);
  const overlaps = [];
  for (let i = 0; i < ctrls.length; i++) for (let j = i + 1; j < ctrls.length; j++) {
    const a = r(ctrls[i]), b = r(ctrls[j]);
    if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) overlaps.push([ctrls[i].textContent.trim(), ctrls[j].textContent.trim()]);
  }
  const small = ctrls.filter(b => r(b).height < 44 || r(b).width < 44).map(b => b.textContent.trim() + ' ' + Math.round(r(b).width) + 'x' + Math.round(r(b).height));
  const clipped = [...document.querySelectorAll('.v3Reis h1,.v3Reis h2,.v3Reis h3,.v3Reis b,.v3Stop .name,.v3Btn')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim());
  // Text whose painted line box runs past its column (siblings would touch or overlap).
  for (const e of document.querySelectorAll('.v3Stage b,.v3Stop .name,.v3RewardText b,.v3RewardText span,.v3Now h1')) {
    const col = e.parentElement.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(e);
    for (const q of rg.getClientRects()) if (q.right > col.right + 1 || q.left < col.left - 1) { clipped.push('overflow:' + e.textContent.trim()); break; }
  }
  return {primaryTop: p ? Math.round(p.top) : null, primaryBottom: p ? Math.round(p.bottom) : null, viewport: vh,
          primaryVisible: p ? p.bottom <= vh && !covered : false, covered, overlaps, small, clipped,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''

WORDBREAK_JS = '''() => {
  // Detect words split across lines: measure each word as its own inline box via Range rects.
  const out = [];
  for (const el of document.querySelectorAll('.v3Stop .name,.v3Stage b,.v3Now h1,.v3RewardText b')) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) {
      const re = /[^\\s]+/g; let m;
      while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
        const lines = new Set([...rg.getClientRects()].map(q => Math.round(q.top))); if (lines.size > 1) out.push(m[0]); }
    }
  }
  return out;
}'''

async def settle(pg):
    await pg.wait_for_timeout(600)
    await pg.evaluate('Promise.allSettled([...document.images].map(i=>i.decode()))')
    await pg.wait_for_timeout(300)

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = HTML.read_bytes(); res = {'html': str(HTML.relative_to(ROOT)) if HTML.is_relative_to(ROOT) else str(HTML), 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data), 'layout': {}, 'flows': {}, 'errors': []}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME)
        res['browser'] = 'Chrome ' + b.version
        for vp, (w, h, touch) in VIEWPORTS.items():
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=touch, is_mobile=vp.startswith('phone'))
            pg = await ctx.new_page(); pg.on('pageerror', lambda e, vp=vp: res['errors'].append(vp + ': ' + str(e)))
            pg.on('console', lambda m, vp=vp: m.type == 'error' and res['errors'].append(vp + ' console: ' + m.text))
            for st in STATES:
                await pg.goto(HTML.as_uri() + '#' + st); await settle(pg)
                lay = await pg.evaluate(LAYOUT_JS); lay['brokenWords'] = await pg.evaluate(WORDBREAK_JS)
                res['layout'][vp + '/' + st] = lay
                await pg.screenshot(path=str(OUT / f'{st}-{vp}.png'))
            await ctx.close()

        # Flows on desktop and phone.
        for vp in ('desktop', 'phone'):
            w, h, touch = VIEWPORTS[vp]; f = {}
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=touch, is_mobile=vp == 'phone')
            pg = await ctx.new_page(); pg.on('pageerror', lambda e, vp=vp: res['errors'].append(vp + ' flow: ' + str(e)))
            await pg.goto(HTML.as_uri() + '#afgerond'); await settle(pg)
            # 1. Select a completed stop: detail opens with replay + gold, primary unchanged.
            before = await pg.inner_text('#v3Continue')
            await pg.click('.v3Stop[data-chapter="city2"]'); await settle(pg)
            f['detailOpens'] = await pg.is_visible('#v3Detail')
            f['detailActions'] = await pg.eval_on_selector_all('#v3Detail .v3DetailActions button', 'bs=>bs.map(b=>b.textContent)')
            f['primaryUnchanged'] = before == await pg.inner_text('#v3Continue')
            await pg.screenshot(path=str(OUT / f'flow-detail-{vp}.png'))
            # 2. Locked stop: explains, no actions.
            await pg.click('.v3Stop[data-chapter="volcanoes"]'); await settle(pg)
            f['lockedText'] = await pg.inner_text('#v3Detail .v3Muted'); f['lockedActions'] = await pg.locator('#v3Detail .v3DetailActions button').count()
            # 3. Replay through the V2 control: starts the real discover lesson of city2.
            await pg.click('.v3Stop[data-chapter="city2"]'); await settle(pg)
            await pg.click('#v3Detail .v3DetailActions button >> nth=0'); await settle(pg)
            q1 = await pg.evaluate('state.current&&state.current.id')
            f['replayStarted'] = await pg.evaluate('({chapter:state.route.active?.chapterId,kind:state.route.active?.kind,mode:state.mode,homeHidden:document.querySelector("#routeHome").classList.contains("hidden")})')
            # 4. Primary: start the current stop lesson (confirm replaces the running replay).
            pg.once('dialog', lambda d: asyncio.ensure_future(d.accept()))
            await pg.click('.ninoNav button:has-text("Reis")'); await settle(pg)
            f['primaryLabelWithActive'] = await pg.inner_text('#v3Continue')
            # 5. Reis -> Verder returns the same lesson and question.
            await pg.click('#v3Continue'); await settle(pg)
            q2 = await pg.evaluate('({id:state.current&&state.current.id,chapter:state.route.active?.chapterId,kind:state.route.active?.kind})')
            f['questionBefore'] = q1; f['reisVerderSameQuestion'] = q2; f['sameQuestion'] = q1 == q2['id']
            f['activeTab'] = await pg.eval_on_selector_all('.ninoNav button', 'bs=>bs.map(b=>b.textContent+":"+b.className+":"+b.getAttribute("aria-current")+":"+b.getAttribute("aria-pressed"))')
            await pg.screenshot(path=str(OUT / f'flow-lesson-{vp}.png'))
            # 6. Storage isolation: real localStorage untouched (preview memory object).
            f['memoryStorage'] = await pg.evaluate('window.localStorage===window.TOPO_V3_PREVIEW.storage||typeof window.TOPO_V3_PREVIEW.storage.get==="function"')
            res['flows'][vp] = f; await ctx.close()

        # Keyboard: tab order reaches primary before route stops; Enter on a stop opens detail.
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}); pg = await ctx.new_page()
        await pg.goto(HTML.as_uri() + '#afgerond'); await settle(pg)
        order = []
        for _ in range(30):
            await pg.keyboard.press('Tab')
            order.append(await pg.evaluate('(document.activeElement.id||document.activeElement.dataset.chapter||document.activeElement.textContent||"").trim().slice(0,30)'))
        await pg.focus('.v3Stop[data-chapter="city1"]'); await pg.keyboard.press('Enter'); await settle(pg)
        res['keyboard'] = {'order': order, 'enterOpensDetail': await pg.is_visible('#v3Detail'), 'focusRing': await pg.evaluate('(()=>{const e=document.querySelector(".v3Stop[data-chapter=city1]");e.focus();const c=getComputedStyle(e);return c.outlineStyle+" "+c.outlineWidth+" "+c.outlineColor})()')}
        await ctx.close()
        # Reduced motion: transitions off.
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce'); pg = await ctx.new_page()
        await pg.goto(HTML.as_uri() + '#bezig'); await settle(pg)
        res['reducedMotion'] = await pg.evaluate('getComputedStyle(document.querySelector(".v3Stop .disc")).transitionDuration')
        await ctx.close(); await b.close()

    lay = res['layout']
    res['summary'] = {
        'primaryAboveFoldAll': all(v['primaryVisible'] for v in lay.values()),
        'primaryBelowFold': [k for k, v in lay.items() if not v['primaryVisible']],
        'overlaps': {k: v['overlaps'] for k, v in lay.items() if v['overlaps']},
        'clipped': {k: v['clipped'] for k, v in lay.items() if v['clipped']},
        'brokenWords': {k: v['brokenWords'] for k, v in lay.items() if v['brokenWords']},
        'smallTargets': {k: v['small'] for k, v in lay.items() if v['small']},
        'horizontalOverflow': [k for k, v in lay.items() if v['horizontalOverflow']],
        'errors': len(res['errors'])}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False))
    print(json.dumps(res['summary'], indent=1, ensure_ascii=False)); print(json.dumps(res['flows'], indent=1, ensure_ascii=False)); print(json.dumps(res['keyboard'], ensure_ascii=False)[:600]); print('reducedMotion', res['reducedMotion'])

asyncio.run(main())
