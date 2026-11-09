import collections
import hashlib
import itertools
import json
import pathlib

out = pathlib.Path(__file__).resolve().parent
res = json.loads((out / 'results.json').read_text())
preservation = json.loads((out / 'preservation.json').read_text())
expected = set(itertools.product(('pizza-hermes', 'bezig', 'goud'), ('Enter', 'click'), (True, False)))
actual = [(r['scenario'], r['method'], r['reducedMotion']) for r in res['runs']]
counts = {key: sum(len(r[key]) for r in res['runs']) for key in ('missing', 'closedByKey', 'leaked', 'errors')}
controls = []
for r in res['runs']:
    if r['scenario'] == 'bezig' and r['method'] == 'Enter':
        dialog = [p for p in r['presses'] if p['step'].startswith('dialog ')]
        control_counts = dict(collections.Counter(p['step'] for p in dialog))
        moments = {m['moment'].split(':')[0] for m in r['moments']}
        controls.append({'scenario': r['scenario'], 'reducedMotion': r['reducedMotion'], 'controls': control_counts, 'presses': dialog, 'moments': sorted(moments), 'progressesToStamp': 'stamp' in moments, 'vespaStartsOnPurposefulEnter': any(p['step'] == 'dialog Start de Vespa-rit' and any('vespa' in d.lower() or 'ride' in d.lower() for d in p['opened']) for p in dialog)})
checks = {'allTwelveExactlyOnce': len(actual) == 12 and set(actual) == expected and len(set(actual)) == 12, 'zeroMissingClosedByKeyLeakedErrors': not any(counts.values()), 'originalSummaryPass': res['summary']['indexUnchanged'] and res['summary']['hermesReproPizzaStaysOpen'] and not any(res['summary'][k] for k in ('everyMomentSeen', 'momentsClosedByKey', 'keyClicksLeaked', 'errors')), 'trackedSourcePreserved': not preservation['changedTrackedFiles'] and not preservation['gitStatusAfter'], 'htmlHashPreserved': preservation['htmlSha256After'] == res['sha256'] == '71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4', 'purposefulEnterDialogFlowNotBroken': len(controls) == 2 and all(c['progressesToStamp'] and c['vespaStartsOnPurposefulEnter'] and c['controls'].get('dialog Verder', 0) >= 1 and (c['reducedMotion'] or c['controls'].get('dialog Overslaan', 0) >= 1) for c in controls)}
summary = {'verdict': 'PASS' if all(checks.values()) else 'REWORK', 'scope': 'GE01 maintained keyboard/reward regression; cached Chromium only; no publication', 'browserLabelFromOriginalScript': res['browser'], 'runCount': len(actual), 'counts': counts, 'dropped': sum(r['dropped'] for r in res['runs']), 'checks': checks, 'purposefulEnterControls': controls, 'screenshots': sorted(p.name for p in out.glob('*.png'))}
(out / 'aggregate.json').write_text(json.dumps(summary, indent=2, ensure_ascii=False) + '\n')
report = '\n'.join(['# GE01 — ' + summary['verdict'] + ' (uitsluitend Chromium)', '', '- Exacte pin: `6934799454441582b953ed455d54ca3b0e2db722`.', '- HTML SHA256: `' + res['sha256'] + '`; 50.200.591 bytes.', '- Alle 12 oorspronkelijke scenario’s, zonder verzwakte checks. Alleen browserlaunch gewijzigd naar gecachte Chromium; oorspronkelijke `__file__`, ROOT en argv behouden.', '- Ontbrekende momenten / gesloten door invoertoets / gelekte acties / paginafouten: ' + ' / '.join(str(counts[k]) for k in ('missing', 'closedByKey', 'leaked', 'errors')) + '.', '- Doelbewuste Enter-bediening: Verder en Start de Vespa-rit in beide standen, Overslaan bij normale beweging; beide standen bereiken het stempel. Verminderde beweging doorloopt de statische rit met Verder.', '- Getraceerde bronbestanden en kandidaat-HTML ongewijzigd; geen publicatie, volledige app-/kaart-/asset-hertest of andere browser.', '', '## Controles', json.dumps(checks, indent=2), '', 'Zie `aggregate.json`, `results.json`, `run.log`, `launch-provenance.json`, `preservation.json`, wrapper en PNG-bewijs.'])
(out / 'REPORT.md').write_text(report + '\n')
inventory = {p.name: {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in out.iterdir() if p.is_file() and p.name != 'evidence-hashes.json'}
(out / 'evidence-hashes.json').write_text(json.dumps(inventory, indent=2) + '\n')
print(json.dumps(summary, indent=2, ensure_ascii=False))
assert all(checks.values()), checks
