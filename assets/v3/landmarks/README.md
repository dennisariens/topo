# Italië-landmarks uit de masterset

Bron: `art/master` op de commit in `manifest.json`. De vijftien PNG-masters en hun bronmanifest staan alleen op die art-branch onder `assets/art/masters/italia/landmarks/`. TOPO_11 (Ferrari) is daar geschrapt.

Herbouw de runtime-exports met Pillow/WebP:

```sh
python3 scripts/build-v3-landmarks.py
node scripts/build-v3-preview.mjs
python3 scripts/qa-v3-landmarks.py
```

De bouwer leest gepinde Git-blobs, controleert bronhashes en 1024×1024 RGBA, en schaalt het volledige beeld met Lanczos naar WebP 128 en 256. Geen herkadering, herkleuring of nieuwe generatie. Manifest en exports worden deterministisch opgebouwd; de preview controleert de exporthashes.

- Alleen TOPO_01–10 worden offline ingebed. Een DPR van 1 gebruikt 128 px, een hogere DPR 256 px. Het geschilderde onderste midden van het icoon staat op de geografische positie; transparante marges verschuiven die positie niet.
- De meeste iconen hebben maximaal 34 px geschilderde afmeting; Pisa en Florence 26 px om overlap te voorkomen, zonder de geografische ankers te verplaatsen.
- `locations.json` is de bron voor de nieuwe decoratieve plekcoördinaten, met gepinde Wikidata-P625-claims en UNESCO-geografische gegevens. Vesuvius en Etna verwijzen naar de bestaande canonieke ITEMS-coördinaten. De bestaande gedeelde affine projectie blijft gelijk; geen leeritem, grens of DEM verandert.
- De gondel symboliseert Venetië met Rialto als expliciete geografische referentie; geen positie van een individuele boot wordt geclaimd. De nuraghe verwijst naar Su Nuraxi en het bergicoon naar Tre Cime di Lavaredo. Illustraties zijn geen ingemeten gebouwencontouren.
- Alleen Reis en toetsresultaat krijgen deze decoratie, uitsluitend bij Reliëf. De live leerkaart, Oefenen en Schoolkaart krijgen geen landmarks. Antwoordmarkeringen blijven erboven staan.
- TOPO_12–16 blijven uitsluitend in het manifest met status **V3.1 uitstapjes**, zonder exports of UI. TOPO_12 toont geen zichtbare logo’s of tekst, maar wel rood-zwarte tribunes: **kleurreview open**, niet als clubneutraal goedgekeurd.

Gerichte QA controleert bron- en exporthashes, alpha, formaat, exacte projectie, 128/256-selectie, de kaartschakelaar, bestaande examenflow, onveranderde leergeometrie en consolefouten. Alleen Reis en toetsresultaat worden vastgelegd op 1440×900 en 1080×810. Fysieke iPad/Safari blijft een afzonderlijke Hermes-check.
