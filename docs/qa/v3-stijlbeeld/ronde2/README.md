# V3.0 — Ronde 2

Opdracht: docs/v3/OVERDRACHT.md › Ronde 2. Eén commit per punt. Gerichte bewijsbestanden `point-N.json`; de volledige matrix en vergelijkingen volgen bij punt 6.

1. BG-03 Kust is standaard, BG-01 en BG-02 blijven kiesbaar. Standaard en drie expliciete keuzes gecontroleerd; lint groen.
2. Zijbalk wit 70%, saturatie .6; de lokale witte wash is alleen achter de zijbalk. CIE76/D65-check op Home én Les, op alle drie achtergronden: maximaal ΔE 8. De `sidebar-*.png` tonen alleen het materiaal (inhoud verborgen), niet het gewone scherm.
3. Voortgang: op 1440×900 passen kaart, elf rijen en de drie tegels volledig binnen het frame. Toetsen en het kennis-paspoort beginnen daaronder, zonder afsnijding. `voortgang-fit-*.png` en `point-3.json`; bestaande fase-B-Voortgangcontrole 5/5 groen.
4. Reliëf opnieuw gekleurd uit exact hetzelfde vastgepinde DEM; registratie, hoogtegegevens en kustclip gelijk. Doelpalet en encoder staan in `assets/v3/relief-r2-provenance.json`. `relief-*.png` en `point-4.json` controleren palet, rasterhash en contrast 1,3; geografische validatie groen.

5. Beloningen: de vier zichtbare iconen zijn op desktop/iPad 72 px, met 40/700 voor de cijfers. Bronmarges blijven behouden; de presentatie compenseert transparante ruimte. De gerichte regressie is rood op de CSS van punt 4 (Pizza 60,75 px zichtbaar), groen met de correctie op standaard en BG-01/02/03. De bestaande telefoonindeling blijft behouden; de fase-B-beloningentest controleert de vier formaten en de alles-vrijgespeeld-stand.
