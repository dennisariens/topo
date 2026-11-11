# Hermes — hertest TOPO V3 Ronde 2

Branch: `codex/topo-v3`. Gebruik de **volledige eindpin van de gepushte punt-6-commit** uit het afsluitende overdrachtsbericht; geen bewegende branch als bewijsbasis. De functionele/presentatiebron eindigt op `64250c9`; punt 6 voegt de QA-uitvoering, vergelijkingen, registers en deze overdracht toe.

Preview-SHA256: `0c9a576648896d56a2b7f8f2dad1bd62b595b058cb8122e1318e2efdadbbf329`.

Index-SHA256: `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`.

1. Bouw de preview opnieuw en vergelijk de SHA256 met deze pin. `index.html` en V2-motor/logica blijven ongewijzigd.
2. Verifieer BG-03 Kust standaard en BG-01/02 kiesbaar; zijbalk wit 70%, saturatie .6 en ΔE ≤8 op alle drie achtergronden, Home én Les.
3. Controleer Voortgang op 1440×900 vanaf scrollTop 0: echte kaart, 11 volledige rijen en alle drie tegels in het eerste frame; Toetsen en kennis-paspoort pas onder de vouw. Controleer daarnaast iPad/telefoon op afsnijding en horizontale overflow.
4. Beoordeel het warme reliëf (laagland `#A8C25A`, bruin `#8A5A3A`, sneeuw wit; contrast 1,3), dezelfde DEM/registratie/kustclip en geometrie 46/46.
5. Controleer op desktop/iPad de werkelijk geschilderde beloningsiconen (72 px, inclusief transparante bronmarges in de meting) en cijfers 40/700. Controleer het boek als bestaande knop, echte tellingen en de compacte telefoonindeling.
6. Herhaal de 19 V3-QA-scripts, de 41 contrast-/typeschaalruns, lint/test/build, toetsenbord/focus, verminderde beweging, contrast AA en offline routes. Vergelijk alle zeven schermen op BG-03 en de drie achtergrondstroken met de doelbeelden.

Bewijs: [eindpakket](../final/README.md), [hashregister](../final/verification.json), [QA-register](../final/results-all.json), [Ronde-2-metingen](README.md).

Geef **PASS** of **REWORK** met eindcommit, previewhash, scherm/viewport/achtergrond, reproductiestappen en bewijs per bevinding. Fysiek iPad/Safari/VoiceOver, onafhankelijke asset/modelcheck en designerakkoord blijven afzonderlijke open acceptatiepunten. De bestaande iPad-les Focus Mode is een gedocumenteerde uitzondering, geen nieuwe layoutclaim. Geen merge/deploy/publicatie/downloadvervanging zonder releaseakkoord.
