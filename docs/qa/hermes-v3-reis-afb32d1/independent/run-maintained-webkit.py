# Exact maintained QA, with only the engine-launch line adapted for WebKit.
import sys, pathlib, hashlib, json
root=pathlib.Path('/Users/dennisariens/projects/topo-v3-independent-qa')
out=pathlib.Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-afb32d1/maintained-webkit')
out.mkdir(parents=True,exist_ok=True)
script=root/'scripts/qa-v3-reis.py'; original=script.read_text()
a='b = await p.chromium.launch(executable_path=CHROME)'; b='b = await p.webkit.launch()'
assert original.count(a)==1
adapted=original.replace(a,b)
(out/'provenance.json').write_text(json.dumps({'originalScript':str(script),'originalSHA256':hashlib.sha256(original.encode()).hexdigest(),'adaptedSHA256':hashlib.sha256(adapted.encode()).hexdigest(),'onlyChange':{'from':a,'to':b},'checksWeakened':False},indent=2))
sys.argv=[str(script),str(root/'output/html/TOPO-V3-Reis-Preview.html'),str(out)]
exec(compile(adapted,str(script),'exec'),{'__file__':str(script),'__name__':'__main__'})
