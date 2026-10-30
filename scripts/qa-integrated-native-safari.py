"""Bounded native Safari compatibility probe. Never enables automation/settings."""
import json,socket,subprocess,time,urllib.request,urllib.error,base64
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/qa/integration-lead-20261030';OUT.mkdir(parents=True,exist_ok=True)
s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close();base='http://127.0.0.1:%s'%port
log=(OUT/'native-safari-driver.txt').open('w');proc=subprocess.Popen(['/usr/bin/safaridriver','-p',str(port)],stdout=log,stderr=subprocess.STDOUT);session=None
result={'browser':'native Safari via safaridriver','status':'NOT TESTED','settingsChanged':False,'testProfile':'WebDriver automation session only','physicalIPad':'NOT TESTED'}
def call(path,payload=None,method=None):
 req=urllib.request.Request(base+path,data=None if payload is None else json.dumps(payload).encode(),headers={'Content-Type':'application/json'},method=method or('GET'if payload is None else'POST'))
 try:
  with urllib.request.urlopen(req,timeout=15)as f:return json.load(f)
 except urllib.error.HTTPError as e:raise RuntimeError(e.read().decode())
try:
 for _ in range(30):
  try:call('/status');break
  except Exception:time.sleep(.1)
 response=call('/session',{'capabilities':{'alwaysMatch':{'browserName':'safari'}}});value=response['value'];session=value['sessionId'];result['capabilities']=value.get('capabilities',{});route='/session/'+session
 call(route+'/url',{'url':(ROOT/'output/html/TOPO-NINO-Computer-Release.html').as_uri()})
 def js(code):return call(route+'/execute/sync',{'script':code,'args':[]})['value']
 inventory=js('return {items:ITEMS.length,chapters:ROUTE_CHAPTERS.length,images:[...document.images].every(n=>n.complete&&n.naturalWidth>0)}');assert inventory['items']==45 and inventory['chapters']==11 and inventory['images']
 js('document.querySelector("[data-mode=write]").click();document.querySelector("#answer").value="zeker fout";document.querySelector("#check").click()');assert js('return state.good')==0
 js('document.querySelector("#next").click();document.querySelector("#answer").value=state.current.name;document.querySelector("#check").click()');assert js('return state.good')==1
 stored=js('return JSON.parse(localStorage.getItem("topo-italie-v3"))');call(route+'/refresh',{});assert js('return state.good')==1
 js('document.querySelector("[data-mode=point]").click();[...document.querySelectorAll("#pointLayer .microHit")].at(-1).dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))');assert js('return document.querySelector("#mapPicker").open&&!!document.querySelector("#mapPicker [data-approved-artwork]")')
 resources=js('return performance.getEntriesByType("resource").map(n=>n.name).filter(n=>/^https?:/.test(n))');assert resources==[]
 shot=call(route+'/screenshot')['value'];(OUT/'native-safari.png').write_bytes(base64.b64decode(shot));result.update(status='PASS',inventory=inventory,wrongCorrectWriting=True,persistenceReload=True,approvedSVGSelector=True,externalHTTPResources=resources,networkMode='local file with no external resources observed; system networking not disabled',console='WebKit/Chrome harness separately captures startup errors; no native Safari console-log claim')
except Exception as e:result.update(status='BLOCKED'if session is None else'FAIL',reason=str(e),requiredAction='Owner must enable Safari Allow Remote Automation if disabled; no setting enabled by this script')
finally:
 if session:
  try:call('/session/'+session,method='DELETE')
  except Exception:pass
 proc.terminate()
 try:proc.wait(timeout=5)
 except subprocess.TimeoutExpired:proc.kill();proc.wait()
 log.close();(OUT/'native-safari.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
