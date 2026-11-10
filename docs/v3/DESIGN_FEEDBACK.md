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
| 2026-11-09 | iconen | Gele scooter? Nee: één rode Vespa (die van Nino); staat via kleur of grijs. Idee: gouden Vespa als eindbeloning bij 11× goud, naast Esploratore d'oro | identiteit | idee, nog niet besloten; brief › Iconen |
| 2026-11-09 | iconen | Pizzapunt voor tellers (eenheid = punt), hele pizza voor meter en Beloningen | inhoud | ARTWORK_BRIEF › Iconen |
| 2026-11-09 | artwork | Alle drie de achtergronden houden; visueel top gaat voor grootte | beeld | DECISIONS 9-11 › Artwork kwaliteit |
| 2026-11-09 | artwork | Shirtvariatie van Nino per scène is acceptabel; portret moet exact | identiteit | ARTWORK_BRIEF › Vaste regels |
| 2026-11-10 | alle (V3.0) | **Incident, tweede keer:** schermen ogen niet als de render; geen artwork, ondoorzichtige plaat, saaie formulieren, zwakke typografie en knoppen | identiteit, lay-out, beeld | docs/v3/DESIGN_AUDIT_V3_0.md; eerst een render per scherm plus een vergelijkingscheck; nieuwe QA-checks (achtergrond, plaatbreedte, kaartrand) |
| 2026-11-10 | Les | Les moet zijn: kaart op de voorgrond boven het artwork, niet de beige focusmodus | lay-out, beeld | DESIGN_AUDIT › Les |
| 2026-11-10 | Schoolkaart | Buurlanden horen in landkleur, niet in zeekleur | inhoud | DESIGN_AUDIT; geometrie- of stijlcheck op fill van buurlanden |
| 2026-11-10 | Reliëf | Witte waas over het reliëf; moet volle kracht en een scherpe kust hebben | beeld | DESIGN_AUDIT › Reliëf; check op kaartrand-opacity |
| 2026-11-10 | Beloningen | Losse knop Open Reisboekje dubbel (het boek is de knop); pizza's boven de Vespa; uitlijning artwork op de eerste pagina | interactie, lay-out | DESIGN_AUDIT › Beloningen |
| 2026-11-10 | Voortgang | Hoofdstukken met ✓ en ★ ogen goedkoop; graag zoals de rijen in de render | beeld | DESIGN_AUDIT › Voortgang |
| 2026-11-10 | alle | Twijfel terracotta tegenover paars; advies: violet als basis, land als accent | identiteit | besluit eigenaar open |
| 2026-11-10 | alle (fase B) | Opbouw klopt; de build oogt melkig, dun en klein naast de doelbeelden. Oorzaak: wash, glasdekking, typeschaal en kaartgrootte (de verfijning schoot door) | identiteit, hiërarchie | renders/README › Afwerking na fase B; checks op tekst ≥ 13 px en kaart ≥ 45% |
