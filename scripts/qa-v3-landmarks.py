#!/usr/bin/env python3
"""Targeted master-landmark QA: Reis and toetsresultaat only, desktop and 1080×810 iPad."""
import asyncio
import base64
import hashlib
import importlib.util
import io
import json
import math
import pathlib
import re
import subprocess
from PIL import Image
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs/qa/v3-stijlbeeld/final'
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
INDEX_SHA = '3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a'
SPEC = importlib.util.spec_from_file_location('existing_exam_flow', ROOT / 'scripts/qa-v3-afwerking.py')
q = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(q)
sha = lambda data: hashlib.sha256(data).hexdigest()


def check_pipeline():
    manifest = json.loads((ROOT / 'assets/v3/landmarks/manifest.json').read_text())
    source = manifest['source']
    raw = subprocess.check_output(['git', 'show', source['commit'] + ':' + source['path']], cwd=ROOT)
    assert sha(raw) == source['sha256']
    masters = {f'TOPO_{a["id"]:02}': a for a in json.loads(raw)}
    locations = json.loads((ROOT / 'assets/v3/landmarks/locations.json').read_text())['items']
    assert set(masters) == {f'TOPO_{i:02}' for i in [*range(1, 11), *range(12, 17)]}
    active = {a['id']: a for a in manifest['items'] if a['ui']}
    assert set(active) == {f'TOPO_{i:02}' for i in range(1, 11)}
    for entry in manifest['items']:
        data = subprocess.check_output(['git', 'show', source['commit'] + ':' + entry['master']['path']], cwd=ROOT)
        assert sha(data) == masters[entry['id']]['sha256'] == entry['master']['sha256']
        if not entry['ui']:
            assert entry['status'] == 'V3.1 uitstapjes' and 'exports' not in entry
            continue
        assert entry['location'] == locations[entry['id']]
        source_point = entry['location']['source']
        if 'claim' in source_point:
            value = source_point['claim']['mainsnak']['datavalue']['value']
            assert entry['location']['coordinates'] == [value['longitude'], value['latitude']]
        elif 'sourceDms' in source_point:
            dms = source_point['sourceDms']
            convert = lambda values: values[0] + values[1]/60 + values[2]/3600
            assert entry['location']['coordinates'] == [convert(dms['longitude']), convert(dms['latitude'])]
        for size in (128, 256):
            export = entry['exports'][str(size)]
            data = (ROOT / export['path']).read_bytes()
            assert sha(data) == export['sha256']
            with Image.open(io.BytesIO(data)) as im:
                assert im.size == (size, size) and im.mode == 'RGBA'
                assert im.getchannel('A').getextrema()[0] == 0
    # Read only the canonical ITEMS declaration, never the complete HTML source.
    with (ROOT / 'index.html').open() as file:
        for line in file:
            if line.startswith('const ITEMS='):
                items = {i['id']: i for i in json.loads(line[len('const ITEMS='):].strip().rstrip(';'))}
                break
    expected = {}
    for key, entry in active.items():
        location = entry['location']
        if 'canonicalItemId' in location:
            item = items[location['canonicalItemId']]
            lon, lat = item['lon'], item['lat']
        else:
            lon, lat = location['coordinates']
        expected[key] = [55 * lon - 225.5, 3830.75 - 77 * lat]
    return manifest, active, expected


async def map_check(page, selector, active, expected, export_size):
    svg = page.locator(selector)
    nodes = await svg.locator('.v3Landmarks>g').evaluate_all('''nodes=>nodes.map(n=>{
      const img=n.querySelector('image');return {id:n.dataset.landmark,transform:n.getAttribute('transform'),
        href:img.getAttribute('href'),size:img.dataset.exportSize,pointer:getComputedStyle(n.parentNode).pointerEvents,
        hidden:n.parentNode.getAttribute('aria-hidden')};})''')
    assert {n['id'] for n in nodes} == set(expected)
    for node in nodes:
        position = re.match(r'translate\(([^ ]+) ([^)]+)\)', node['transform'])
        assert position and all(math.isclose(float(position[i+1]), v, abs_tol=1e-8) for i, v in enumerate(expected[node['id']]))
        assert node['pointer'] == 'none' and node['hidden'] == 'true'
        assert int(node['size']) == export_size
        assert sha(base64.b64decode(node['href'].split(',', 1)[1])) == active[node['id']]['exports'][str(export_size)]['sha256']
    decoded = await page.evaluate('''async()=>Promise.all(TOPO_V3.art.landmarks.items.map(async a=>{
      const i=new Image();i.src=a.exports[devicePixelRatio>1?256:128].src;await i.decode();return i.naturalWidth;}))''')
    assert decoded == [export_size] * 10
    overlaps = await svg.locator('.v3Landmarks').evaluate('''g=>{
      const boxes=[...g.children].map(n=>{
        const i=n.querySelector('image'),a=TOPO_V3.art.landmarks.items.find(a=>a.id===n.dataset.landmark).exports[i.dataset.exportSize];
        const b=a.paintBounds,s=+i.getAttribute('width')/a.size[0],x=+i.getAttribute('x'),y=+i.getAttribute('y'),m=i.getScreenCTM();
        const l=new DOMPoint(x+b[0]*s,y+b[1]*s).matrixTransform(m),r=new DOMPoint(x+b[2]*s,y+b[3]*s).matrixTransform(m);
        return {id:n.dataset.landmark,l:l.x,t:l.y,r:r.x,b:r.y};
      });
      const overlap=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
        const a=boxes[i],b=boxes[j];if(Math.min(a.r,b.r)>Math.max(a.l,b.l)+.5&&Math.min(a.b,b.b)>Math.max(a.t,b.t)+.5)overlap.push([a.id,b.id]);
      }return overlap;}''')
    assert not overlaps, overlaps
    assert await page.locator('#map .v3Landmarks').count() == 0
    return {'landmarks': 10, 'exactProjectedCoordinates': True, 'exportSize': export_size,
            'decoded': True, 'paintBoundsDoNotOverlap': True, 'learningMapUndecorated': True}


async def main():
    initial = sha(HTML.read_bytes())
    assert sha((ROOT / 'index.html').read_bytes()) == INDEX_SHA
    manifest, active, expected = check_pipeline()
    runs = {}
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=q.MAC_CHROME)
        for name, width, height, dpr in [('desktop', 1440, 900, 1), ('ipad-liggend', 1080, 810, 2)]:
            ctx = await browser.new_context(viewport={'width': width, 'height': height},
                                            has_touch=dpr==2, device_scale_factor=dpr, offline=True)
            page = await ctx.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            await (await ctx.new_cdp_session(page)).send('Emulation.setEmulatedMedia', {
                'features': [{'name': 'prefers-reduced-transparency', 'value': 'no-preference'}]})
            await page.goto(HTML.as_uri() + '#bezig/bg03')
            await page.wait_for_timeout(700)
            assert await page.title() == 'NINO · La Grande Avventura · Topografie Italië'
            assert page.url == HTML.as_uri() + '#bezig/bg03' and await page.locator('.v3Reis').is_visible()
            assert await page.evaluate('TOPO_V3.art.landmarks.items.map(a=>a.id)') == list(active)
            geometry = '()=>[...document.querySelectorAll("#map [data-id]")].map(n=>[n.dataset.id,n.getAttribute("d"),n.getAttribute("cx"),n.getAttribute("cy")])'
            before = await page.evaluate(geometry)
            await page.evaluate('TopoV3Landmarks(document.querySelector("#map"),1)')
            reis = await map_check(page, '.v3MapStage .v3Map', active, expected, 128*dpr)
            for value in ('false', 'true'):
                button = page.locator(f'.v3MapTools [data-relief={value}]')
                await (button.tap() if dpr==2 else button.click())
                assert await page.locator('.v3MapStage .v3Landmarks').is_visible() == (value=='true')
            await page.evaluate('document.activeElement?.blur?.()')
            await page.screenshot(path=str(OUT / f'reis-{name}.png'), scale='css')
            # Exercise the existing V2 exam; this is not a setup-screen or lesson QA run.
            await q.play_toets(page)
            result = await map_check(page, '.v3ToetsMap', active, expected, 128*dpr)
            assert await page.locator('.v3ToetsScore').inner_text() == '7 / 10'
            assert await page.locator('.v3ToetsMap').evaluate('n=>[...n.children].indexOf(n.querySelector(".v3Landmarks"))<[...n.children].indexOf(n.querySelector(".v3Marks"))')
            assert await page.evaluate(geometry) == before
            assert not errors, errors
            await page.evaluate('document.activeElement?.blur?.()')
            await page.mouse.move(1, 1)
            await page.screenshot(path=str(OUT / f'toetsResult-{name}.png'), scale='css')
            screenshots = {}
            for screen in ('reis', 'toetsResult'):
                path = OUT / f'{screen}-{name}.png'
                with Image.open(path) as im:
                    assert im.size == (width, height)
                screenshots[screen] = {'path': str(path.relative_to(ROOT)), 'size': [width, height],
                                       'sha256': sha(path.read_bytes())}
            runs[name] = {'viewport': [width, height], 'deviceScaleFactor': dpr,
                          'reis': reis, 'toetsResultaat': result, 'screenshots': screenshots, 'errors': errors}
            await ctx.close()
        await browser.close()
    assert sha(HTML.read_bytes()) == initial and sha((ROOT/'index.html').read_bytes()) == INDEX_SHA
    report = {'pass': True, 'scope': ['Reis', 'toetsresultaat'], 'previewSha256': initial,
              'indexSha256': INDEX_SHA, 'sourceCommit': manifest['source']['commit'],
              'manifestSha256': sha((ROOT/'assets/v3/landmarks/manifest.json').read_bytes()),
              'locationsSha256': sha((ROOT/'assets/v3/landmarks/locations.json').read_bytes()),
              'qaScriptSha256': sha(pathlib.Path(__file__).read_bytes()),
              'masters': 15, 'webpExports': 20, 'excluded': ['TOPO_11'],
              'futureManifestOnly': [f'TOPO_{i}' for i in range(12, 17)], 'runs': runs,
              'browser': 'Chrome / Playwright; Browser plugin not available',
              'open': ['Physical iPad Safari', 'TOPO_12 red/black seating colour review']}
    (OUT / 'landmarks.json').write_text(json.dumps(report, indent=2) + '\n')
    print('Reis + toetsresultaat: 4 screens PASS; 15 master hashes / 20 WebPs / 10 exact coordinates PASS')


if __name__ == '__main__':
    asyncio.run(main())
