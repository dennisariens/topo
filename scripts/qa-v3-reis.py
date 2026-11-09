#!/usr/bin/env python3
"""TOPO V3 Reis preview — browser QA on the exact built HTML (file://).

Usage: python3 scripts/qa-v3-reis.py [html] [outdir] [chrome]
Writes screenshots and results.json to outdir (default docs/qa/v3-reis).
Checks: next action above the fold, map reference frame (neighbours, seas, islands; edge fade only), no overlapping/clipped controls, label wrapping,
chapter selection, map clone geometry == live map, relief switch, real lesson start
through V2 buttons, Reis -> Verder restore, keyboard order, themes, demo storage
isolation, console errors.
"""
import asyncio, hashlib, json, sys, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'output/html/TOPO-V3-Reis-Preview.html').resolve()
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'docs/qa/v3-reis').resolve()
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
CHROME = sys.argv[3] if len(sys.argv) > 3 else (MAC_CHROME if pathlib.Path(MAC_CHROME).exists() else '/usr/bin/google-chrome')
VIEWPORTS = {'desktop': (1440, 900, False), 'ipad-portrait': (820, 1180, True), 'ipad-landscape': (1180, 820, True), 'phone': (390, 844, True), 'phone-small': (320, 640, True)}
STATES = ['nieuw', 'bezig', 'afgerond', 'alles']
MUST_SEE = ['Frankrijk', 'Zwitserland', 'Oostenrijk', 'Slovenië', 'Kroatië', 'Sardinië', 'Sicilië', 'Noord-Afrika']

LAYOUT_JS = '''() => {
  const vh = innerHeight, r = e => e.getBoundingClientRect();
  const fixed = [...document.querySelectorAll('body>header,.ninoNav,.v3PreviewBar,.v3Side,#focusMenu')].filter(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed').filter(e=>getComputedStyle(e).position==='fixed').map(r);
  const primary = document.querySelector('.v3Actions .v3Btn.primary'), p = primary && r(primary);
  const covered = p ? fixed.some(f => p.top < f.bottom && p.bottom > f.top && p.left < f.right && p.right > f.left) : null;
  const ctrls = [...document.querySelectorAll('.v3Reis button')].filter(b => b.offsetParent && getComputedStyle(b).visibility!=='hidden');
  const overlaps = [];
  for (let i = 0; i < ctrls.length; i++) for (let j = i + 1; j < ctrls.length; j++) {
    const a = r(ctrls[i]), b = r(ctrls[j]);
    const fixedA = !!ctrls[i].closest('.v3Side') && getComputedStyle(ctrls[i].closest('.v3Side')).position==='fixed', fixedB = !!ctrls[j].closest('.v3Side') && getComputedStyle(ctrls[j].closest('.v3Side')).position==='fixed';
    if (fixedA !== fixedB) continue; // content scrolling beneath a fixed tab bar; checked separately below
    if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) overlaps.push([ctrls[i].textContent.trim(), ctrls[j].textContent.trim()]);
  }
  const small = ctrls.filter(b => !b.closest('.v3Switch,.v3Again,.v3SchoolBtn') && (r(b).height < 44 || r(b).width < 44)).map(b => b.textContent.trim() + ' ' + Math.round(r(b).width) + 'x' + Math.round(r(b).height));
  const clipped = [...document.querySelectorAll('.v3Reis h1,.v3Reis h2,.v3Reis b,.v3Name,.v3Btn')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim());
  // Text whose painted line box runs past its column (siblings would touch or overlap).
  for (const e of document.querySelectorAll('.v3Name,.v3Panel h1,.v3Count b,.v3NavItem span')) {
    if (e.getBoundingClientRect().width <= 1) continue; // visually hidden label (screen readers only)
    const col = e.parentElement.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(e);
    for (const q of rg.getClientRects()) if (q.right > col.right + 1 || q.left < col.left - 1) { clipped.push('overflow:' + e.textContent.trim()); break; }
  }
  // Fixed tab bar: the last row must be able to scroll fully above it.
  const bar = document.querySelector('.v3Side'); let lastRowClear = true;
  if (bar && getComputedStyle(bar).position==='fixed') { const last=[...document.querySelectorAll('.v3Row')].pop(); const doc=document.scrollingElement;
    const bottomAtMaxScroll = last.getBoundingClientRect().bottom - (doc.scrollHeight - innerHeight - doc.scrollTop); lastRowClear = bottomAtMaxScroll <= r(bar).top + 1; }
  const map = document.querySelector('.v3Map'), vb = map && map.viewBox.baseVal;
  const frame = map ? {viewBox: [vb.x, vb.y, vb.width, vb.height].map(Math.round).join(' '), mask: (getComputedStyle(map).maskImage || getComputedStyle(map).webkitMaskImage || '').slice(0, 160)} : null;
  return {frame, lastRowClear, primaryTop: p ? Math.round(p.top) : null, primaryBottom: p ? Math.round(p.bottom) : null, viewport: vh,
          primaryVisible: p ? p.bottom <= vh && !covered : false, covered, overlaps, small, clipped,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1};
}'''

# Map reference frame (owner 9-11): neighbours, seas and islands must stay visible around Italy.
# For each reference feature pick one on-screen point inside its real fill; the Python side compares the
# painted pixel with and without the edge mask. A feature is visible when >= 80% of its contrast remains.
MAP_SAMPLE_JS = '''() => {
  const map = document.querySelector('.v3Map'); if (!map) return {};
  const el = map.getBoundingClientRect(), stage = map.parentElement.getBoundingClientRect(), ctm = map.getScreenCTM(), inv = ctm.inverse();
  // Sample only outside the 4% edge fade (plus 2 px): a feature counts as reference when it shows beyond the soft edge.
  const fx = el.width * .04 + 2, fy = el.height * .04 + 2;
  const x0 = Math.max(el.left + fx, stage.left), x1 = Math.min(el.right - fx, stage.right, innerWidth), y0 = Math.max(el.top + fy, stage.top, 0), y1 = Math.min(el.bottom - fy, stage.bottom, innerHeight);
  const hidden = [...document.querySelectorAll('.v3Switch,.v3PreviewBar,.v3Side')].map(n => n.getBoundingClientRect());
  const free = (x, y) => !hidden.some(h => x >= h.left - 4 && x <= h.right + 4 && y >= h.top - 4 && y <= h.bottom + 4);
  const pick = (n, ok) => { // grid over the visible part of the element, nearest to the outer edge last
    const b = n.getBoundingClientRect(), ax = Math.max(b.left, x0), bx = Math.min(b.right, x1), ay = Math.max(b.top, y0), by = Math.min(b.bottom, y1);
    if (bx - ax < 4 || by - ay < 4) return null; const cands = [];
    for (let i = 1; i < 16; i++) for (let j = 1; j < 16; j++) { const x = ax + (bx - ax) * i / 16, y = ay + (by - ay) * j / 16; if (!free(x, y)) continue;
      const pt = map.createSVGPoint(); pt.x = x; pt.y = y; const u = pt.matrixTransform(inv);
      if (ok(u, x, y)) cands.push([x, y]); }
    if (!cands.length) return null; const cx = (ax + bx) / 2, cy = (ay + by) / 2; cands.sort((p, q) => Math.hypot(p[0] - cx, p[1] - cy) - Math.hypot(q[0] - cx, q[1] - cy));
    return cands[0].map(Math.round); };
  // The copy has pointer-events:none, so occlusion is tested geometrically: inside this fill, outside any land drawn over it.
  const lands = [...map.querySelectorAll('[id$="landLayer"]>*')];
  const fill = (n, over) => (u) => n.isPointInFill(u) && !over.some(o => o !== n && o.isPointInFill(u));
  const above = n => lands.filter(o => lands.indexOf(o) > lands.indexOf(n));
  const ids = {Frankrijk: 'area-i', Zwitserland: 'area-j', Oostenrijk: 'area-k', 'Slovenië': 'area-l', 'Kroatië': 'area-m', Sardinië: 'area-b', 'Sicilië': 'area-a'};
  const out = {};
  for (const [k, id] of Object.entries(ids)) { const n = map.querySelector('[data-id="' + id + '"]'); out[k] = n ? pick(n, fill(n, above(n))) : null; }
  for (const t of map.querySelectorAll('[id$="labels"] text')) { const w = t.textContent.trim(); if (/TUNES|DUITS|BOSN|HONGAR/.test(w)) { const b = t.getBoundingClientRect(), x = Math.round(b.left + b.width / 2), y = Math.round(b.top + b.height / 2); out['label ' + w] = x > x0 && x < x1 && y > y0 && y < y1 && free(x, y) ? [x, y] : null; } }
  const seas = [...map.querySelectorAll('[id$="seaLayer"] .water')]; seas.forEach((n, i) => { out['zee ' + (i + 1)] = pick(n, fill(n, lands)); });
  const tun = [...map.querySelectorAll('[id$="labels"] text')].find(t => /TUNES/.test(t.textContent)), tb = tun && tun.getBBox();
  const land = tb && [...map.querySelectorAll('.contextLand')].find(l => { const pt = map.createSVGPoint(); pt.x = tb.x + tb.width / 2; pt.y = tb.y + tb.height / 2; return l.isPointInFill(pt); }); // North Africa (Tunisia), the southern frame edge
  if (land) out['Noord-Afrika'] = pick(land, fill(land, above(land)));
  return out;
}'''

def png_pixel(png):
    """RGB of a 1x1 PNG screenshot (no image library needed: a single pixel needs no unfiltering)."""
    import struct, zlib
    i, data = 8, b''
    while i < len(png):
        n, kind = struct.unpack('>I4s', png[i:i + 8]); chunk = png[i + 8:i + 8 + n]; i += 12 + n
        if kind == b'IHDR': depth, colour = chunk[8], chunk[9]
        elif kind == b'IDAT': data += chunk
    raw = zlib.decompress(data); return tuple(raw[1:4])

async def sample_frame(pg):
    # Phones show the map below the action: bring it into view first (the frame, not the fold, is under test).
    # Instant scroll, then wait until the position is stable, so the chosen points and the pixels match.
    await pg.evaluate("document.querySelector('.v3Map')?.scrollIntoView({block:'center',behavior:'instant'})")
    await pg.wait_for_function("new Promise(r => { const y = scrollY; requestAnimationFrame(() => requestAnimationFrame(() => r(scrollY === y))); })")
    await pg.wait_for_timeout(100)
    pts = await pg.evaluate(MAP_SAMPLE_JS); surface = (255, 253, 249)
    async def px(x, y): return png_pixel(await pg.screenshot(clip={'x': x, 'y': y, 'width': 1, 'height': 1}))
    masked = {k: await px(*v) for k, v in pts.items() if v}
    await pg.evaluate("document.querySelector('.v3Map').style.setProperty('mask','none');document.querySelector('.v3Map').style.setProperty('-webkit-mask','none')")
    plain = {k: await px(*pts[k]) for k in masked}
    await pg.evaluate("document.querySelector('.v3Map').style.removeProperty('mask');document.querySelector('.v3Map').style.removeProperty('-webkit-mask')")
    d = lambda c: sum(abs(a - b) for a, b in zip(c, surface)) or 1
    kept = {k: round(min(1, d(masked[k]) / d(plain[k])), 2) for k in masked}
    await pg.evaluate("scrollTo({top:0,behavior:'instant'})")
    return {'kept': kept, 'outOfFrame': sorted(k for k, v in pts.items() if not v), 'visible': sorted(k for k, v in kept.items() if v >= .8)}

WORDBREAK_JS = '''() => {
  // Detect words split across lines: measure each word as its own inline box via Range rects.
  const out = [];
  for (const el of document.querySelectorAll('.v3Name,.v3Panel h1,.v3Count b,.v3NavItem span')) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) {
      const re = /[^\\s]+/g; let m;
      while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
        const lines = new Set([...rg.getClientRects()].map(q => Math.round(q.top))); if (lines.size > 1) out.push(m[0]); }
    }
  }
  return out;
}'''

# Hermes V3-01: context names stay in the map copy (owner: reference frame), but no label may contain one of the
# 45 learning names (name or alias; accents and letter-spacing ignored, whole words).
LABELS_JS = r"""() => { const norm = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const names = ITEMS.flatMap(i => [i.name, ...(i.aliases || [])]).filter(Boolean).map(n => ({n, re: new RegExp('(^|[^a-z0-9])' + esc(norm(n)) + '([^a-z0-9]|$)')}));
  const labels = [...new Set([...document.querySelectorAll('.v3Map text')].map(t => t.textContent.trim()).filter(Boolean))];
  const hits = []; for (const l of labels) { const a = norm(l), b = a.replace(/\s+/g, ''); for (const {n, re} of names) if (re.test(a) || re.test(b)) hits.push(l + ' ⊃ ' + n); }
  return {labels, hits, names: names.length}; }"""
# Hermes V3-02: the style switch may not cover any highlighted place of the chosen chapter (filled shape or point),
# sampled every 2 CSS px inside the switch with isPointInFill / isPointInStroke on the real SVG elements.
OCCLUSION_JS = r"""() => { const sw = document.querySelector('.v3MapTools') || document.querySelector('.v3Switch'), svg = document.querySelector('.v3Map'); if (!sw || !svg) return null;
  const a = sw.getBoundingClientRect(), s = svg.getBoundingClientRect(), x0 = Math.max(a.left, s.left), x1 = Math.min(a.right, s.right), y0 = Math.max(a.top, s.top), y1 = Math.min(a.bottom, s.bottom);
  const out = {rectOverlap: Math.max(0, x1 - x0) * Math.max(0, y1 - y0), covered: {}};
  if (out.rectOverlap <= 0) return out;
  const hits = [...svg.querySelectorAll('.v3Hit')];
  for (const n of hits) { const m = n.getScreenCTM().inverse(), p = svg.createSVGPoint(), id = n.getAttribute('data-id'); let c = 0;
    for (let x = x0; x <= x1; x += 2) for (let y = y0; y <= y1; y += 2) { p.x = x; p.y = y; const q = p.matrixTransform(m); if (n.isPointInFill(q) || n.isPointInStroke(q)) c++; }
    if (c) out.covered[id] = c * 4; }
  return out; }"""


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
                lay['labels'] = await pg.evaluate(LABELS_JS); lay['switchOcclusion'] = await pg.evaluate(OCCLUSION_JS)
                lay['frame'] = {**(lay['frame'] or {}), **await sample_frame(pg)}
                res['layout'][vp + '/' + st] = lay
                await pg.screenshot(path=str(OUT / f'{st}-{vp}.png'))
            await ctx.close()

        # V3-01 negative control: a learning name in a map label must be caught.
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}); pg = await ctx.new_page()
        await pg.goto(HTML.as_uri() + '#bezig'); await settle(pg)
        await pg.evaluate("(() => { const t = document.createElementNS('http://www.w3.org/2000/svg', 'text'); t.textContent = 'B A R I'; t.id = 'qaProbe'; document.querySelector('.v3Map').append(t); })()")
        res['labelCheckControl'] = (await pg.evaluate(LABELS_JS))['hits']; await ctx.close()

        # V3-02: every chapter × both map styles on the phone formats (Hermes repro: #afgerond, 390×844, Eilanden → Schoolkaart).
        res['switchSweep'] = {}
        for vp in ('phone', 'phone-small', 'ipad-portrait'):
            w, h, touch = VIEWPORTS[vp]
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=touch, is_mobile=vp.startswith('phone')); pg = await ctx.new_page()
            await pg.goto(HTML.as_uri() + '#afgerond'); await settle(pg)
            for ch in await pg.eval_on_selector_all('.v3Row', 'bs=>bs.map(b=>b.dataset.chapter)'):
                await pg.click(f'.v3Row[data-chapter="{ch}"]'); await settle(pg)
                for relief in ('false', 'true'):
                    await pg.click(f'.v3Switch button[data-relief="{relief}"]'); await settle(pg)
                    o = await pg.evaluate(OCCLUSION_JS); res['switchSweep'][f'{vp}/{ch}/{"reliëf" if relief == "true" else "schoolkaart"}'] = o
                    if vp == 'phone' and ch == 'islands' and relief == 'false': await pg.screenshot(path=str(OUT / 'v3-02-eilanden-schoolkaart-phone.png'))
            await ctx.close()

        # V3-03: phone keyboard — Tab to Steden 7–12, Enter: focus lands on the chosen chapter's title, next Tab on its action.
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True); pg = await ctx.new_page()
        await pg.goto(HTML.as_uri() + '#alles'); await settle(pg)
        for _ in range(40):
            await pg.keyboard.press('Tab')
            if await pg.evaluate('document.activeElement.dataset.chapter') == 'city2': break
        await pg.keyboard.press('Enter'); await settle(pg)
        k = await pg.evaluate("({active: document.activeElement.id || document.activeElement.tagName, text: document.activeElement.textContent.trim().slice(0, 40), selected: document.querySelector('.v3Row[aria-pressed=true]')?.dataset.chapter, ring: getComputedStyle(document.activeElement).outlineStyle, inView: (r => r.top >= 0 && r.bottom <= innerHeight)(document.activeElement.getBoundingClientRect())})")
        await pg.screenshot(path=str(OUT / 'v3-03-focus-titel-phone.png'))
        await pg.keyboard.press('Tab'); k['nextTab'] = await pg.evaluate('document.activeElement.textContent.trim().slice(0, 40)')
        res['phoneSelectFocus'] = k; await ctx.close()

        # Flows on desktop and phone.
        for vp in ('desktop', 'phone'):
            w, h, touch = VIEWPORTS[vp]; f = {}
            ctx = await b.new_context(viewport={'width': w, 'height': h}, has_touch=touch, is_mobile=vp == 'phone')
            pg = await ctx.new_page(); pg.on('pageerror', lambda e, vp=vp: res['errors'].append(vp + ' flow: ' + str(e)))
            await pg.goto(HTML.as_uri() + '#afgerond'); await settle(pg)
            # Map clone: same geometry as the live map for every learning object.
            f['mapGeometry'] = await pg.evaluate("""()=>{const live=document.querySelector('#map'),clone=document.querySelector('.v3Map');let same=0,diff=[];
              for(const n of live.querySelectorAll('[data-id]')){const id=n.getAttribute('data-id'),k=clone.querySelectorAll('[data-id="'+id+'"]')[[...live.querySelectorAll('[data-id="'+id+'"]')].indexOf(n)];
               const keys=['d','cx','cy','r','points','x','y'];if(k&&keys.every(a=>n.getAttribute(a)===k.getAttribute(a)))same++;else diff.push(id);}return {same,diff:diff.slice(0,5),total:live.querySelectorAll('[data-id]').length}}""")
            f['defaultSelected'] = await pg.evaluate('document.querySelector(".v3Row[aria-pressed=true]")?.dataset.chapter')
            f['hitsForCurrent'] = await pg.evaluate('[...new Set([...document.querySelectorAll(".v3Map .v3Hit")].map(n=>n.getAttribute("data-id")))].sort()')
            # Locked chapter: explains, no primary action.
            await pg.click('.v3Row[data-chapter="volcanoes"]'); await settle(pg)
            f['lockedText'] = await pg.inner_text('.v3Locked'); f['lockedPrimary'] = await pg.locator('.v3Actions .primary').count()
            # Relief switch: terrain shows on the same clone; school map hides it.
            await pg.click('.v3Switch button[data-relief="true"]'); await settle(pg)
            f['reliefOn'] = await pg.evaluate('getComputedStyle(document.querySelector(".v3Map .atlasTerrain")).display')
            await pg.click('.v3Switch button[data-relief="false"]'); await settle(pg)
            f['reliefOff'] = await pg.evaluate('getComputedStyle(document.querySelector(".v3Map .atlasTerrain")).display')
            # Completed chapter: primary + replays; replay starts the real lesson through the V2 control.
            await pg.click('.v3Row[data-chapter="city2"]'); await settle(pg)
            f['donePrimary'] = await pg.inner_text('.v3Actions .primary'); f['replays'] = await pg.eval_on_selector_all('.v3Again button', 'bs=>bs.map(b=>b.textContent)')
            if vp == 'phone': f['phonePanelInView'] = await pg.evaluate('document.querySelector(".v3Panel").getBoundingClientRect().top < innerHeight && document.querySelector(".v3Panel").getBoundingClientRect().bottom > 0')
            if f['replays']:
                await pg.click('.v3Again button >> nth=0'); await settle(pg)
            else:
                await pg.evaluate('document.querySelector(\'#routeCards article[data-chapter="city2"] .routeStep\').click()'); await settle(pg)
            q1 = await pg.evaluate('state.current&&state.current.id')
            f['replayStarted'] = await pg.evaluate('({chapter:state.route.active?.chapterId,kind:state.route.active?.kind,mode:state.mode,v3Hidden:!document.body.classList.contains("v3Home")})')
            # Back to Reis the way the lesson offers it (V3 sidebar on desktop, ‹ Reis on phone), then "Ga verder" returns the same question.
            f['backVia'] = await pg.evaluate('''(() => { const b = [document.querySelector('.v3LesBack'), document.querySelector('.v3ShellNav .v3NavItem')].find(x => x && x.checkVisibility()); b?.click(); return b?.className || null; })()''')
            await settle(pg)
            f['primaryLabelWithActive'] = await pg.inner_text('.v3Actions .primary')
            await pg.click('.v3Actions .primary'); await settle(pg)
            q2 = await pg.evaluate('({id:state.current&&state.current.id,chapter:state.route.active?.chapterId,kind:state.route.active?.kind})')
            f['questionBefore'] = q1; f['reisVerderSameQuestion'] = q2; f['sameQuestion'] = q1 == q2['id']
            f['activeTab'] = await pg.eval_on_selector_all('.ninoNav button', 'bs=>bs.map(b=>b.textContent+":"+b.getAttribute("aria-current"))')
            await pg.screenshot(path=str(OUT / f'flow-lesson-{vp}.png'))
            f['memoryStorage'] = await pg.evaluate('typeof window.TOPO_V3_PREVIEW.storage.get==="function"')
            res['flows'][vp] = f; await ctx.close()

        # Theme: Viola changes accent only.
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}); pg = await ctx.new_page()
        await pg.goto(HTML.as_uri() + '#bezig/viola'); await settle(pg)
        res['theme'] = {'viola': await pg.evaluate('getComputedStyle(document.querySelector(".v3Actions .primary")).backgroundColor')}
        await pg.screenshot(path=str(OUT / 'bezig-viola-desktop.png'))
        await pg.close(); pg = await ctx.new_page(); await pg.goto(HTML.as_uri() + '#bezig'); await settle(pg)
        res['theme']['italia'] = await pg.evaluate('getComputedStyle(document.querySelector(".v3Actions .primary")).backgroundColor')
        # Keyboard: Tab order sidebar -> list 1..11 -> panel action.
        order = []
        for _ in range(26):
            await pg.keyboard.press('Tab')
            order.append(await pg.evaluate('(document.activeElement.dataset.chapter||document.activeElement.textContent||"").trim().slice(0,24)'))
        await pg.focus('.v3Row[data-chapter="city1"]'); await pg.keyboard.press('Enter'); await settle(pg)
        res['keyboard'] = {'order': order, 'enterSelects': await pg.evaluate('document.querySelector(".v3Row[data-chapter=city1]").getAttribute("aria-pressed")'),
                           'focusRing': await pg.evaluate('(()=>{const e=document.querySelector(".v3Row[data-chapter=city1]");e.focus();const c=getComputedStyle(e);return c.outlineStyle+" "+c.outlineWidth})()')}
        await ctx.close()
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce'); pg = await ctx.new_page()
        await pg.goto(HTML.as_uri() + '#bezig'); await settle(pg)
        res['reducedMotion'] = await pg.evaluate('getComputedStyle(document.querySelector(".v3Btn")).transitionDuration')
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
        'lastRowHiddenByTabBar': [k for k, v in lay.items() if not v.get('lastRowClear', True)],
        # Reference frame: Alpine neighbours, Croatia, both big islands, North Africa and at least three seas visible.
        'mapFrameShort': {k: sorted(set(MUST_SEE) - set(v['frame']['visible'])) for k, v in lay.items() if v.get('frame') and (set(MUST_SEE) - set(v['frame']['visible']) or sum(n.startswith('zee') for n in v['frame']['visible']) < 3)},
        'labelsWithLearningName': {k: v['labels']['hits'] for k, v in lay.items() if v['labels']['hits']},
        'labelCheckCatchesControl': bool(res['labelCheckControl']),
        'contextLabels': sorted({l for v in lay.values() for l in v['labels']['labels']}),
        'switchCoversPlace': {k: v['covered'] for k, v in {**{kk: vv['switchOcclusion'] for kk, vv in lay.items()}, **res['switchSweep']}.items() if v and v['covered']},
        'phoneSelectFocusOnTitle': res['phoneSelectFocus']['active'] == 'v3Title' and res['phoneSelectFocus']['selected'] == 'city2' and res['phoneSelectFocus']['inView'],
        'errors': len(res['errors'])}
    (OUT / 'results.json').write_text(json.dumps(res, indent=1, ensure_ascii=False))
    print(json.dumps(res['summary'], indent=1, ensure_ascii=False)); print(json.dumps(res['flows'], indent=1, ensure_ascii=False)); print(json.dumps(res['keyboard'], ensure_ascii=False)[:700]); print('theme', res['theme'], 'reducedMotion', res['reducedMotion'])

asyncio.run(main())
