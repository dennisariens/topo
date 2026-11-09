import sys, pathlib, os
ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590')
engine=sys.argv[1]
src=ROOT/'scripts/qa-v3-les.py'
text=src.read_text()
old="b = await p.chromium.launch(executable_path=CHROME); res['browser'] = 'Chrome ' + b.version"
new=f"b = await p.{engine}.launch(); res['browser'] = '{engine} ' + b.version"
assert text.count(old)==1
text=text.replace(old,new)
out=pathlib.Path(__file__).parent/('maintained-'+engine)
sys.argv=[str(src),str(ROOT/'output/html/TOPO-V3-Reis-Preview.html'),str(out)]
exec(compile(text,str(src),'exec'),{'__file__':str(src),'__name__':'__main__'})
