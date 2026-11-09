import hashlib, itertools, json, pathlib, subprocess
ROOT = pathlib.Path('/Users/dennisariens/projects/topo-v3-ge01-6934799')
OUT = pathlib.Path(__file__).resolve().parent
res = json.loads((OUT/'results.json').read_text())
expected = set(itertools.product(('pizza-hermes','bezig','goud'),('Enter','click'),(True,False)))
actual = [(r['scenario'],r['method'],r['reducedMotion']) for r in res['runs']]
assert len(actual) == len(set(actual)) == 12 and set(actual) == expected
counts = {k: sum(len(r[k]) for r in res['runs']) for k in ('missing','closedByKey','leaked','errors')}
assert not any(counts.values())
assert res['summary']['indexUnchanged'] and res['summary']['hermesReproPizzaStaysOpen']
controls = []
for r in res['runs']:
    if r['method'] != 'Enter' or r['scenario'] == 'pizza-hermes': continue
    presses = [p for p in r['presses'] if p['step'].startswith('dialog ')]
    want = ['dialog Verder'] if r['scenario'] == 'goud' else ['dialog Verder','dialog Start de Vespa-rit'] + ([] if r['reducedMotion'] else ['dialog Overslaan']) + ['dialog Verder']
    assert [p['step'] for p in presses] == want, (r, want)
    assert all(not p['foreignKeyClicks'] and not p['leaked'] and p['key'] == p['step'][7:] for p in presses)
    if r['scenario'] == 'bezig':
        assert presses[1]['opened'] == ['vespaRide']
        assert any(m['moment'] == 'stamp:city2' for m in r['moments'])
    else:
        assert any(m['moment'] == 'gold:city3' for m in r['moments'])
    controls.append({'scenario':r['scenario'],'reducedMotion':r['reducedMotion'],'sequence':[p['step'] for p in presses],'count':len(presses),'laterExpectedFinishReached':True})
before = json.loads((OUT/'tracked-before.json').read_text())
changed = [p for p,h in before.items() if not (ROOT/p).is_file() or hashlib.sha256((ROOT/p).read_bytes()).hexdigest() != h]
assert not changed, changed
status = subprocess.check_output(['git','status','--porcelain'],cwd=ROOT,text=True)
assert not status, status
html = ROOT/'output/html/TOPO-V3-Reis-Preview.html'
assert hashlib.sha256(html.read_bytes()).hexdigest() == '71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4'
assert html.stat().st_size == 50200591
report = {'verdict':'PASS','scope':'Maintained GE01-K01, cached Playwright WebKit 27.2 only','runs':len(actual),'counts':counts,'droppedForeignKeyClicks':res['summary']['keyClicksDropped'],'purposefulEnterDialogControls':controls,'purposefulEnterDialogControlCount':sum(c['count'] for c in controls),'purposefulEnterLimit':'Proven by maintained dialog action sequences, no repeated/no-op attempts, Vespa opens, and subsequent stamp/gold reached. Existing-dialog close events are intentionally excluded from maintained closed array. No claim for new-action/book controls outside this harness.','screenshots':len(list(OUT.glob('*.png'))),'trackedFilesVerifiedUnchanged':len(before),'changedTrackedFiles':changed,'gitStatus':status,'htmlSha256':hashlib.sha256(html.read_bytes()).hexdigest(),'htmlBytes':html.stat().st_size,'limits':['Not native Safari or physical iPad/VoiceOver acceptance','No Space or additional new-action tests; parent owns those','results.json browser label says Chrome because only launch line was changed; launch-provenance.json records actual WebKit 27.2']}
(OUT/'aggregate.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
files = sorted(p for p in OUT.iterdir() if p.is_file() and p.name != 'SHA256SUMS')
(OUT/'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in files))
