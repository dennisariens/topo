import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),out=new URL('docs/qa/integration-lead-20261030/',root);
const read=p=>JSON.parse(readFileSync(new URL(p,out))),hash=p=>createHash('sha256').update(readFileSync(new URL(p,root))).digest('hex');
const expected='422f39dd06cb2ea2d6524ce07e4524738aa425aef5c5e54d63b55d90b54143a9';
const artifact='output/html/TOPO-NINO-Computer-Release.html';assert.equal(hash(artifact),expected);
const engines={};let ids;
for(const [name,dir]of [['Google Chrome','integrity'],['Playwright WebKit, NOT native Safari','webkit']]){
 const s=read(dir+'/summary.json'),rows=read(dir+'/ledger.json');assert.equal(s.sha256,expected);assert.equal(rows.length,45);
 const unique=[...new Set(rows.map(r=>r.id))].sort();assert.equal(unique.length,45);if(ids)assert.deepEqual(unique,ids);ids=unique;
 for(const r of rows){assert(r.status.startsWith('PASS'));assert.deepEqual(r.runs.map(r=>r.style).sort(),['discovery','school']);for(const run of r.runs){assert.equal(run.wrong.correct,false);assert.equal(run.correct.length,2);assert(run.correct.every(t=>t.correct&&t.selectedId===r.id));assert(Object.values(run.writing).every(v=>v===true));}}
 assert(s.goldWrongCannotPass&&s.reloadExact);assert.deepEqual(s.errors,[]);assert.deepEqual(s.consoleErrors,[]);assert.deepEqual(s.external,[]);
 engines[name]=s;
}
const physical=read('physical/physical-results.json'),passed=physical.records.filter(r=>r.status.startsWith('PASS')).length,excluded=physical.records.filter(r=>r.status.startsWith('NO ADDRESSABLE')).length;
assert.equal(passed+excluded,physical.records.length);assert.equal(passed,679);assert.equal(excluded,120);assert.deepEqual(physical.errors,[]);assert.deepEqual(physical.external,[]);
const selection=read('selection/browser-results.json'),sessions=read('sessions/session-results.json'),fidelity=read('fidelity/results.json'),focus=read('focus/browser-results.json'),download=read('download/verification.json'),backup=read('backup/backup-transfer-results.json'),daily=read('daily-import/browser-results.json');
for(const r of [selection,sessions,fidelity,focus,download,backup,daily]){assert.deepEqual(r.errors,[]);if(r.consoleErrors)assert.deepEqual(r.consoleErrors,[]);if(r.external)assert.deepEqual(r.external,[]);}
assert.equal(download.sha256,expected);assert.equal(fidelity.artifactSha256,expected);assert.equal(hash('assets/map-selection/TOPO-Rome-Vaticaanstad-approved-refined.svg'),fidelity.assetSha256);
assert(backup.realBackupTransferToFreshContext&&backup.invalidNestedImportPreservesMemoryAndDisk&&backup.canceledImportPreservesMemoryAndDisk);assert(daily.QA2.memoryAndStorageByteEquivalent);
const programs=JSON.parse(readFileSync(new URL('package.json',root))).scripts.test.split('&&').length;assert.equal(programs,17);
const result={role:'Hermes lead-integration verification; NOT independent Codex acceptance',implementationCommit:'b3540f72b2e21ede842bd38051e6a7015eaa0aa6',reviewTarget:'Exact final SHA in PR61 lead-integration handoff comment; do not use a moving branch',artifact:{path:artifact,bytes:readFileSync(new URL(artifact,root)).length,sha256:expected,url:download.url},ownerSVG:{sha256:fidelity.assetSha256,sourceBytesUnchanged:true},engines,objectIDs:ids,testPrograms:programs,selectionCases:selection.records.length,selectionLayouts:selection.layoutRecords.length,sessionCases:sessions.records.length,physical:{enumeratedCells:physical.records.length,passed,excludedNotPass:excluded,actualMouseTaps:passed*2,method:physical.method},fidelityCases:fidelity.records.length,focusViewports:focus.runs.length,download,backup,daily,nativeSafari:read('native-safari.json'),limits:['Per-item question fixtures are not a full natural-route all45 playthrough; DOM regression separately covers all eleven chapters.','Geography compares pinned source/projection baselines; eight schematic extents are not independently GIS-certified.','679/799 finite overlap cells pass; 120 unaddressable integer-pixel border samples excluded, not passes. Not continuous-space coverage.','Native Safari blocked by Allow Remote Automation being disabled; WebKit is NOT a native Safari approval.','Physical iPad, OS keyboard, IME and VoiceOver not tested.','Independent Codex review and owner approval remain required. No merge or deployment.']};
writeFileSync(new URL('summary.json',out),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({objects:ids.length,engines:Object.keys(engines),physical:result.physical,artifact:result.artifact,nativeSafari:result.nativeSafari.status},null,2));
