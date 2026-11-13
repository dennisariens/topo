#!/usr/bin/env python3
"""Ronde 5B: only the screen changed by --point 10, 11 or 12; requested desktop/iPad evidence."""
import argparse
import asyncio
import hashlib
import importlib.util
import json
import pathlib
import re
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/qa/v3-stijlbeeld/final'
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
spec = importlib.util.spec_from_file_location('screen_metrics', ROOT/'scripts/qa-v3-afwerking.py')
q = importlib.util.module_from_spec(spec)
spec.loader.exec_module(q)
q.HTML = HTML
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
VIEWPORTS = {'desktop': (1440, 900), 'ipad-liggend': (1080, 810)}


def compact_reis(rows):
    return {'cases':len(rows),'states':sorted({r['state'] for r in rows}),
            'chapters':len({r['chapter'] for r in rows}),
            'minExposedMapShare':min(r['exposedMapShare'] for r in rows),
            'maxCardShare':max(r['cardShare'] for r in rows),
            'maxTitleLines':max(r['lines'] for r in rows),'fonts':sorted({r['font'] for r in rows}),
            'longTitleCases':[{k:r[k] for k in ('state','title','lines','font')} for r in rows if r['chapter']=='city4'],
            'framesStable':True}

CARD = '''()=>{
 const card=document.querySelector('.v3Main>.v3Panel'),title=card.querySelector('#v3Title'),r=card.getBoundingClientRect(),s=getComputedStyle(title);
 const svg=document.querySelector('.v3MapStage .v3Map'),b=svg.getBoundingClientRect();
 const collision=Math.max(0,Math.min(r.right,b.right)-Math.max(r.left,b.left))*Math.max(0,Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top));
 return {width:r.width,title:title.textContent,lines:Math.round(title.getBoundingClientRect().height/parseFloat(s.lineHeight)),
  font:parseFloat(s.fontSize),clipped:title.scrollWidth>title.clientWidth+1,outside:r.right>innerWidth+1||r.bottom>innerHeight+1,
  mapOcclusion:collision,frame:svg.dataset.frame,viewBox:svg.getAttribute('viewBox')};}'''


async def choose(page, chapter):
    await page.evaluate('id=>{TOPO_V3.ui.selected=id;TOPO_V3.render()}', chapter)
    await page.wait_for_timeout(70)
    await page.wait_for_function('!document.querySelector(".v3MapStage .v3Map").dataset.gliding')


async def reis(page, name):
    measurements = []
    failures = []
    for state in ('nieuw', 'bezig', 'alles'):
        await page.goto('about:blank')
        await page.goto(HTML.as_uri() + '#' + state + '/bg03')
        await page.evaluate('document.fonts.ready')
        await page.wait_for_timeout(450)
        chapters = await page.evaluate('TOPO_V3.model().chapters.map(c=>c.id)')
        frames = {}
        for chapter in chapters:
            await choose(page, chapter)
            card = await page.evaluate(CARD)
            layout = await page.evaluate(q.LAYOUT, 'reis')
            row = {'state': state, 'chapter': chapter, 'mapShare': round(layout['share'], 4),
                   'exposedMapShare':round(layout['share']-card['mapOcclusion']/(layout['content']['w']*layout['content']['h']),4),
                   'cardShare': round(card['width']/layout['content']['w'], 4), **card}
            measurements.append(row)
            if row['exposedMapShare'] < .45 or row['cardShare'] > .41 or card['lines'] > 2 or card['font']!=(28 if name=='desktop' else 24) or card['clipped'] or card['outside'] or card['mapOcclusion'] > 1:
                failures.append(row)
            frames.setdefault(card['frame'], set()).add(card['viewBox'])
        if any(len(boxes)>1 for boxes in frames.values()):
            failures.append({'state': state, 'unstableFrames': {k:list(v) for k,v in frames.items()}})
    await choose(page, 'city4')
    button=page.locator('.v3Row[data-chapter=city4]')
    await (button.click() if name=='desktop' else button.tap())
    assert await button.get_attribute('aria-pressed')=='true'
    return measurements, failures, 'reis'


async def countries(page, name):
    await choose(page, 'countries')
    data = await page.locator('.v3MapStage .v3Map').evaluate('''svg=>({
      frame:svg.dataset.frame,relief:getComputedStyle(svg.querySelector('.atlasTerrain')).display,
      countries:[...svg.querySelectorAll('.country.v3Hit')].map(n=>{const s=getComputedStyle(n);return{id:n.dataset.id,fill:s.fill,alpha:+s.fillOpacity,stroke:s.stroke,strokeAlpha:+s.strokeOpacity,width:parseFloat(s.strokeWidth)}}),
      geometry:[...svg.querySelectorAll('.country[data-id]')].map(n=>[n.dataset.id,n.getAttribute('d')])})''')
    errors = []
    if data['frame'] != 'omgeving' or data['relief']=='none' or not data['countries']:
        errors.append(data)
    if any(c['alpha']>.2 or c['alpha']<=0 or c['stroke']!='rgb(91, 69, 224)' or c['strokeAlpha']<.5 or c['width']<1 for c in data['countries']):
        errors.append(data['countries'])
    data['geometrySha256']=hashlib.sha256(json.dumps(data.pop('geometry')).encode()).hexdigest()
    return data, errors, 'reis-omgeving'


async def ride(page, name):
    # Freeze the browser clock for a genuine focused departure state, not a fabricated dialog.
    await page.clock.install(time=0)
    await page.clock.pause_at(100)
    await page.keyboard.press('Tab')
    before = await page.evaluate('[state.good,state.pizzas,state.trips]')
    await page.evaluate('celebrateTrip("Rome","Florence")')
    button = page.locator('.vespaRide .rideActions button').first
    data = await button.evaluate('''b=>{const s=getComputedStyle(b),r=b.getBoundingClientRect();return{text:b.textContent,focus:document.activeElement===b,visible:b.matches(':focus-visible'),
      outline:s.outlineColor,outlineWidth:parseFloat(s.outlineWidth),outlineStyle:s.outlineStyle,offset:parseFloat(s.outlineOffset),shadow:s.boxShadow,
      background:s.backgroundColor,radius:parseFloat(s.borderRadius),height:r.height,width:r.width};}''')
    errors = []
    if not (data['text']=='Overslaan' and data['focus'] and data['visible'] and data['outline']=='rgb(91, 69, 224)' and data['outlineWidth']>=3 and data['offset']>=2 and data['radius']>=data['height']/2 and data['height']>=44):
        errors.append(data)
    rgba = re.findall(r'[\d.]+', data['background'])
    if not data['background'].startswith('rgba(') or not .5<=float(rgba[-1])<1:
        errors.append(data)
    data['rewardCountersBefore']=before
    return data, errors, 'vespa-rit'


async def main(point):
    initial = sha(HTML)
    index = sha(ROOT/'index.html')
    failures = []
    runs = {}
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=q.MAC_CHROME)
        for name, (width, height) in VIEWPORTS.items():
            context = await browser.new_context(viewport={'width':width,'height':height},has_touch=name!='desktop',offline=True)
            page = await context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            await (await context.new_cdp_session(page)).send('Emulation.setEmulatedMedia', {'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
            await page.goto(HTML.as_uri()+'#alles/bg03')
            await page.evaluate('document.fonts.ready')
            await page.wait_for_timeout(450)
            geometry = await page.locator('#map [data-id]').evaluate_all('ns=>ns.map(n=>[n.dataset.id,n.getAttribute("d"),n.getAttribute("cx"),n.getAttribute("cy")])')
            result, bad, screen = await {10:reis,11:countries,12:ride}[point](page,name)
            assert await page.locator('#map [data-id]').evaluate_all('ns=>ns.map(n=>[n.dataset.id,n.getAttribute("d"),n.getAttribute("cx"),n.getAttribute("cy")])') == geometry
            assert not errors, errors
            failures.extend({'viewport':name,'failure':item} for item in bad)
            if not bad:
                if point!=12:
                    await page.evaluate('document.activeElement?.blur?.()')
                    await page.mouse.move(1,1)
                await page.screenshot(path=str(OUT/f'{screen}-{name}.png'))
                if point==12:
                    await page.locator('.vespaRide .v3RideSkip').click()
                    assert await page.locator('.vespaRide').get_attribute('data-phase')=='arrived'
                    assert await page.evaluate('[state.good,state.pizzas,state.trips]')==result['rewardCountersBefore']
                    result['skipReachesArrivalWithoutRewardChanges']=True
            runs[name] = {'viewport':[width,height],'screen':screen,'checks':compact_reis(result) if point==10 and not bad else result,'errors':errors}
            await context.close()
        await browser.close()
    assert initial==sha(HTML) and index==sha(ROOT/'index.html')
    assert not failures, json.dumps(failures,ensure_ascii=False)
    path = OUT/'ronde5b.json'
    data = json.loads(path.read_text()) if path.exists() else {}
    for entry in data.values():
        for run in entry.get('runs',{}).values():
            checks=run.get('checks',{})
            if isinstance(checks,dict) and 'geometry' in checks:
                checks['geometrySha256']=hashlib.sha256(json.dumps(checks.pop('geometry')).encode()).hexdigest()
    data[str(point)] = {'pass':True,'previewSha256':initial,'indexSha256':index,'runs':runs}
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(f'Ronde 5B punt {point}: PASS ({len(runs)} viewports)',flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--point',type=int,choices=[10,11,12])
    args=parser.parse_args()
    for point in ([args.point] if args.point else [10,11,12]):
        asyncio.run(main(point))
