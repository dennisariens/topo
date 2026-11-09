# V3 — ontwerpfeedback van de eigenaar

Design Taste-protocol: elke correctie krijgt een categorie (lay-out, identiteit, hiërarchie, inhoud, interactie, motion) en een plek waar de les blijft (regel, token, check of Golden Screen). Komt dezelfde correctie twee keer terug, dan wordt ze een incident en gaat de fix in de regel of check, niet alleen in het scherm.

| Datum | Scherm | Correctie | Categorie | Vastgelegd in |
| --- | --- | --- | --- | --- |
| 2026-11-09 | Reis v1 | Gestapelde kaarten met route-iconen voelden als V2; richting = de concepten: zijbalk · lijst · kaart · één actie | lay-out, hiërarchie | DESIGN_SYSTEM V3 › Structuur |
| 2026-11-09 | alle | Principe: geen taglines, hulpteksten of bijlabels; anders klopt de lay-out niet | inhoud | DESIGN_SYSTEM V3 › Principe; QA-check op nog te bouwen tekstbudget |
| 2026-11-09 | alle | Kleur per land (Italia nu, later Frankrijk) in plaats van één accent | identiteit | DESIGN_SYSTEM V3 › Landthema's; `data-theme` |
| 2026-11-09 | Reis | Schoolkaart blijft basis; reliëf als schakelaar gewenst | inhoud, interactie | DESIGN_SYSTEM V3 › Kaart |
| 2026-11-09 | Reis v3b | Rand-fade niet te sterk: referentiekader (buurlanden, zeeën) is nodig om te leren | lay-out, inhoud | DESIGN_SYSTEM V3 › Kaart (kaderregel); check `mapFrameShort` in `qa-v3-reis.py`; verwerkt 9-11 |
| 2026-11-09 | Les (GE01) | Lesstappen boven de kaart (topo-ui-design, PR #64) | hiërarchie | DESIGN_SYSTEM V3 › Les; check `stepsRight` in `qa-v3-les.py` |
| 2026-11-09 | Beloningen | Boek in V3-stijl? Gekozen: B, rustig kader en rijk renaissance-boek; niet het donkere venster (A) of vlak modern (C) | identiteit, lay-out | DECISIONS 9-11 › Beloningen; DESIGN_SYSTEM › Beeld |
| 2026-11-09 | alle | Het renderniveau is het doel; nieuw artwork is dat waard | identiteit, beeld | DECISIONS 9-11 › Renderniveau; docs/v3/ARTWORK_BRIEF.md |
| 2026-11-09 | alle | Renderniveau: app zweeft boven landschap, levend reliëf, rijke hoofdstukbeelden | identiteit, beeld | DECISIONS › Renderniveau; ARTWORK_BRIEF; stijlbeeld `docs/qa/v3-stijlbeeld` (oordeel open) |
