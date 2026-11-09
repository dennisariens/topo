from pathlib import Path
import json
from collections import Counter
B=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-908b4a4'); O=B/'model'
proofs={p['id']:p for p in json.loads((O/'proof-manifest.json').read_text())}
def t(status,observatie): return {'status':status,'observatie':observatie}
base={
 'gezicht':t('PASS','Nino herkenbaar: warme bruine ogen, sproeten, klein rond neusje, brede vriendelijke glimlach, volle wenkbrauwen. Kandidaat iets gladder en ronder dan #75; geen losstaande identiteitsblokkade.'),
 'haar':t('PASS','Donkerbruin, volumineus krullend haar onder de helm. Grovere, sterker gescheiden lokken dan fijne canonieke krullen; kleur en silhouet blijven passend.'),
 'helm_en_bril':t('PASS','Olijfgroene vintage helm met bruine riemen; twee ronde amber/bronskleurige brilglazen bovenop. Geen verkeerde helmsoort of ontbrekende bril.'),
 'rode_sjaal':t('PASS','Rode gewikkelde sjaal met losse wapperende uiteinden; passend. Fijne canonieke stofpatronen minder prominent, geen modelblokkade.'),
 'blauw_shirt':t('PASS','Blauw geknoopt werkshirt met kraag, opgerolde mouwen en zichtbaar doorlopend blauw voorpand. Past bij canonieke exports en #75.'),
 'rugzak':t('PASS','Bruin leren rugzakje met brede schouderriemen, gespen en opgezette zijvakken; herkenbare materiaal- en kleurconsistentie. Detailindeling varieert, ook binnen referenties.'),
 'cargobroek':t('PASS','Olijfgroene cargobroek met zichtbare klepzak aan bovenbeen en omgeslagen pijp; passend bij referenties.'),
 'schoenen':t('PASS','Bruine hoge vetersneakers met lichte veters, rubber neus/lichte zool; passend. Geen laarzen of ander schoenmodel.'),
 'Vespa':t('PASS','Rode klassieke scooter: rond koplicht, ronde spatborden, gebogen beenschild, zwart zadel, metalen rand/voetplank en zijrooster. Glad, glanzend en minder verweerd dan canoniek, maar zelfde herkenbare voertuigtype. Spiegel-/roostervariatie niet op zichzelf afkeur; #75 heeft perspectiefvariatie.')}
rows=[]
for aid in ['NINO-PORTRET','SCENE-ROMA','SCENE-VENEZIA','SCENE-NAPOLI']:
 traits=json.loads(json.dumps(base)); verdict='PASS'; deviations=[]; mini=None; extra=[]
 if aid=='NINO-PORTRET':
  verdict='REWORK'
  traits['gezicht']=t('PASS','Sproeten, bruine ogen, brede wenkbrauwen, kleine neus en glimlach herkenbaar. Frontaliteit geeft symmetrischer/rondere indruk met grotere ronde oogopeningen; niet uitsluitend op deze subjectieve proporties afgekeurd.')
  traits['blauw_shirt']=t('REWORK','Master toont open blauw overshirt met wit/licht ondershirt, anders dan gesloten canoniek blauw werkshirt. In 512-export is alleen een blauwe schouderrand zichtbaar: exacte shirtconstructie daar N/A, niet BLOCKED.')
  traits['rugzak']=t('PASS','Bruine leren schouderriemen/gespen zichtbaar; de eigenlijke rugzak is achter het bovenlichaam niet te zien (volume en zakken N/A).')
  for k in ['cargobroek','schoenen','Vespa']: traits[k]=t('N/A','Buiten de bedoelde portretuitsnede; niet zichtbaar en niet verplicht voor een borstportret. Geen BLOCKED en geen modelafkeur hiervoor.')
  deviations=['Brief regel 42 vraagt driekwart naar links: master en export staan zichtbaar frontaal, ogen naar kijker. Dat is geen driekwartpose.', 'De master heeft borst/schouders; export snijdt vrijwel alles onder sjaal en schouders af. Hierdoor wordt het gevraagde borstportret een hoofdportret.', 'In de master ontbreekt het doorlopende gesloten blauwe voorpand: wit ondershirt zichtbaar. Dit is dezelfde outfitafwijking als Roma/Napoli, niet alleen een donkerder belichting.']
  extra=[str(O/'NINO-PORTRET-master-export-proof.png')]
 elif aid=='SCENE-ROMA':
  verdict='REWORK'; traits['blauw_shirt']=t('REWORK','Donkerblauw open overshirt met centrale lichte/witte ondershirtstrook, zichtbare knopen langs open rand. Canon toont gesloten blauw knoopwerkshirt. Mouwen/knopen zijn aanwezig, maar outfitconstructie is anders; niet alleen kleurgrading.')
  deviations=['Blauw shirt is als open overshirt over wit ondershirt getekend. Herstel gesloten canoniek blauw werkshirt; alleen lichter blauw maken lost witte middenstrook niet op.', 'Gezicht is iets ronder met grotere oogopeningen, krullen gladder/grover en scooter nieuwer/glanzender. Secundaire stijlvariatie: Nino blijft herkenbaar; geen afzonderlijke afkeur daarop.']
 elif aid=='SCENE-VENEZIA':
  deviations=['Geen blokkerende modelafwijking gezien. Blauw voorpand, kraag/knopen/opgerolde mouwen, rugzak, cargo en bruine hoge sneakers zijn voldoende consistent.', 'Hoofd is wat gladder/jonger en krullen grover; scooter minder verweerd. Verschillen vallen binnen illustratieve pose/lichtvariatie, niet hetzelfde als de expliciete witte-ondershirtwissel in Roma/Napoli.']
 elif aid=='SCENE-NAPOLI':
  verdict='REWORK'; traits['blauw_shirt']=t('REWORK','Open blauw overshirt met breed wit T-shirtvlak tussen kraag en buik; canon heeft gesloten blauw knoopshirt. Duidelijke outfitwissel, niet slechts schaduw of kleurtemperatuur.')
  traits['cargobroek']=t('PASS','Olijfgroene broek met zijzak aan bovenbeen. Pijp valt langer en mist de duidelijke canonieke omslag; stijl/detailafwijking genoteerd, niet zelfstandig afgekeurd. Been omlaag past bij stilstaand voertuig en komt ook in #75 voor.')
  deviations=['Groot wit ondershirt met open blauwe bovenlaag wijkt af van canoniek gesloten blauw werkshirt. Herstel outfitconstructie.', 'Broek minder duidelijk omgeslagen en langere pijp; hoofd en krullen gladder en scooter glanzender. Secundaire afwijkingen, niet losstaand BLOCKED. Voet aan de grond is toegestaan in stilstaande #75-composities.']
 if aid.startswith('SCENE'):
  mini={'status':'PASS','geen_Nino':True,'waarneming':'Volledig 480x270 bekeken: alleen landschap/architectuur/water/lucht. Geen hoofd, helm, sjaal, ledemaat, rugzak of Vespa-rest zichtbaar. Modelkenmerken in mini dus N/A; afwezigheid Nino voldoet aan brief regel 38.'}
 p=proofs[aid]
 rows.append({'id':aid,'verdict':verdict,'taal':'nl','scope':'Onafhankelijke zichtbare Nino-model-QA, geen algemene release-/alpha-/maat-/logo-/geografie-QA','pin':'908b4a498199ece40a047f19efb2e80fe62812b8','scene75_pin':'8a704cb23da97baf7197635df7fa12f06b864a24','traits':traits,'detailed_deviations':deviations,'miniature':mini,'proof_images':[p['proof']]+extra,'proof_metadata':p,'blocked_reasons':[]})
report={'scope':'Alle vier logische renderassets; masters + runtime-export zichtbaar gecontroleerd; drie miniaturen volledig zonder Nino. Geen assets bewerkt, gegenereerd, gecorrigeerd of gepubliceerd. Eigenaarakkoord en manifestnotities niet als visuele QA gebruikt.',
 'method':'Werkelijk volledige beelden geladen voor uitsnedes; native detailcrops vergeleken. Bewijsborden bevatten uitsluitend crops, schaling, achtergrondcompositie en tekst/kaders buiten de bronillustratie. Referentie-contactboards volledig bekeken en vervolgens in twee helften nader bekeken.',
 'reference_coverage':{'manifest':str(B/'reference-manifest.json'),'canonical_nino_count':7,'pinned_scene_count':8,'canonical_board_crops_halfopen':[[0,0,840,360],[840,0,1680,360]],'scene_board_crops_halfopen':[[0,0,1000,640],[0,640,1000,1280]],'individual_full_references':['nino-guide.webp','nino-travel.webp','topo-steden-firenze.png'],'details_in_full_loaded_first':True},
 'status_semantics':{'PASS':'Voldoende modelconsistent of expliciet afwezig in mini. Niet automatisch releaseakkoord.','REWORK':'Concreet zichtbare afwijking van canon of portretbrief.','BLOCKED':'Noodzakelijk bewijs ontbreekt; hier niet van toepassing.','N/A':'Kenmerk is buiten beeld/occluded; geen fout en geen onterechte blocker.'},'assets':rows,'counts':dict(Counter(x['verdict'] for x in rows))}
assert len(rows)==4 and len({x['id'] for x in rows})==4
assert all(len(x['traits'])==9 for x in rows)
for x in rows:
 assert all(Path(p).is_file() for p in x['proof_images'])
 (O/(x['id']+'-findings.json')).write_text(json.dumps(x,ensure_ascii=False,indent=2))
(O/'findings.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
md=['# Onafhankelijke Nino-modelaudit','', 'Pin: `908b4a498199ece40a047f19efb2e80fe62812b8`. Alleen model en portretbrief; geen integraal releaseakkoord.','']
for x in rows:
 md.extend(['## '+x['id']+' — '+x['verdict'],'']+['- '+d for d in x['detailed_deviations']]+['- Miniatuur: '+('PASS, zonder Nino/Vespa.' if x['miniature'] else 'N/A voor portret.'),'']+['Bewijs: `'+p+'`' for p in x['proof_images']]+[''])
md+=['## Niet blokkeren op onzichtbare kenmerken','','Portret: broek, schoenen en Vespa N/A; rugzakvolume N/A achter schouders. In portretexport is shirtconstructie N/A, maar de master toont de concrete outfitafwijking. Alle vereiste bronnen zijn beschikbaar: geen BLOCKED.','', 'Vier individuele JSONs en `findings.json` bevatten negen kenmerken per asset. Drie miniaturen afzonderlijk visueel PASS. Geen bestanden buiten deze modelmap geschreven.']
(O/'MODEL-AUDIT.md').write_text('\n'.join(md))
# Re-open final JSON for programmed delivered-count verification
saved=json.loads((O/'findings.json').read_text())
print(json.dumps({'verified_asset_count':len(saved['assets']),'unique_ids':sorted({x['id'] for x in saved['assets']}),'verdict_counts':saved['counts'],'miniature_pass_count':sum(x['miniature'] is not None and x['miniature']['status']=='PASS' for x in saved['assets']),'all_proof_images_exist':all(Path(p).is_file() for x in saved['assets'] for p in x['proof_images'])},indent=2))
