# V4 Frankrijk · spoor A: lesstof en hoofdstukken

**Status:** draft, ter review in de V3-chat. Data: `data/fr/items.draft.json`.
**Enige bron:** het schoolblad "Topografie Frankrijk" (`docs/v4/bron/IMG_0802.HEIC`, origineel en ongewijzigd, zie de README daar). Achter elk item en elk hoofdstuk staat de plek op het blad (kolom › kopje › code). Wat niet op het blad staat, hoort niet bij de lesstof. Alle 44 plekken en codes zijn op 12-11 tegen het origineel gecontroleerd.

**Wat de school toetst** (blad, onder "TIP"): de namen foutloos schrijven, de plek op de kaart aanwijzen, en de plek op de kaart herkennen en opschrijven. Dat zijn precies de V3-stappen Aanwijzen en Namen schrijven. De nummers en letters zijn een opdracht op het werkblad ("Werkwijze" 3), geen toetsstof.

## De 44 plekken van het blad

| Kolom › kopje | Codes | Plekken | Aantal |
| --- | --- | --- | --- |
| Plaatsen › Belangrijke steden | 1–14 | Bordeaux, Calais, Le Havre, Lille, Lyon, Marseille, Metz, Montpellier, Nancy, Nantes, Nice, Parijs, Straatsburg, Toulouse | 14 |
| Gebieden › Eilanden | a | Corsica | 1 |
| Gebieden › Bergen en vulkanen | b–d | Alpen, Pyreneeën, Vogezen | 3 |
| Gebieden › Streken | e–i | Bretagne, Dordogne, Elzas, Normandië, Provence | 5 |
| Gebieden › Landen | a–i | Andorra, België, Duitsland, Groot-Brittannië, Italië, Luxemburg, Monaco, Spanje, Zwitserland | 9 |
| Wateren › Zeeën, oceanen | A–F | Noordzee, Atlantische Oceaan, Middellandse Zee, Het Kanaal, Nauw van Calais, Golf van Biskaje | 6 |
| Wateren › Rivieren | G–L | Garonne, Loire, Maas, Rhône, Rijn, Seine | 6 |
| **Totaal** | | | **44** |

Per item staan in de JSON: id, schoolcode, Nederlandse naam (zoals op het blad), Franse naam, type, hoofdstuk, plek op het blad en de toegestane schrijfvarianten. De Franse namen staan niet op het blad. Ze zijn er alleen voor de beleving en tellen in Namen schrijven niet als goed antwoord.

## 11 hoofdstukken

De indeling volgt het blad, net als bij Italië. De steden zijn in nummerblokken verdeeld, de rest volgt de kopjes en codes van het blad. Elk hoofdstuk heeft 3 tot 5 plekken (bij Italië 2 tot 6).

| # | Hoofdstuk | Plek op het blad | Plekken |
| --- | --- | --- | --- |
| 1 | Steden 1–5 | Plaatsen › Belangrijke steden › 1–5 | Bordeaux, Calais, Le Havre, Lille, Lyon |
| 2 | Steden 6–10 | Plaatsen › Belangrijke steden › 6–10 | Marseille, Metz, Montpellier, Nancy, Nantes |
| 3 | Steden 11–14 | Plaatsen › Belangrijke steden › 11–14 | Nice, Parijs, Straatsburg, Toulouse |
| 4 | Eiland en gebergten | Gebieden › Eilanden a + Bergen en vulkanen b–d | Corsica, Alpen, Pyreneeën, Vogezen |
| 5 | Streken | Gebieden › Streken e–i | Bretagne, Dordogne, Elzas, Normandië, Provence |
| 6 | Buurlanden a–e | Gebieden › Landen a–e | Andorra, België, Duitsland, Groot-Brittannië, Italië |
| 7 | Buurlanden f–i | Gebieden › Landen f–i | Luxemburg, Monaco, Spanje, Zwitserland |
| 8 | Zeeën A–C | Wateren › Zeeën, oceanen A–C | Noordzee, Atlantische Oceaan, Middellandse Zee |
| 9 | Zeeën D–F | Wateren › Zeeën, oceanen D–F | Het Kanaal, Nauw van Calais, Golf van Biskaje |
| 10 | Rivieren G–I | Wateren › Rivieren G–I | Garonne, Loire, Maas |
| 11 | Rivieren J–L | Wateren › Rivieren J–L | Rhône, Rijn, Seine |

Afgeleid, dus niet van het blad: de knip van de steden in 5/5/4, het samenvoegen van Eilanden met Bergen, en het splitsen van Landen, Zeeën en Rivieren in twee. Dat is nodig omdat de overdracht 11 hoofdstukken vastlegt, terwijl het blad 7 kopjes heeft.

## Aandachtspunten uit het blad

- **Dubbele codes a–i.** Op het blad lopen de letters a–i twee keer: bij Eilanden/Bergen/Streken (a = Corsica … i = Provence) en bij Landen (a = Andorra … i = Zwitserland). De V3-route vraagt geen schoolcodes, maar in de toets en op de print is "a" niet eenduidig. Daarom is `id` de sleutel, nooit de code. Komt er toch een codevraag, dan altijd met het kopje erbij ("Landen: a"). Bij Italië waren alle codes uniek.
- **"Bergen en vulkanen"** staat als kopje op het blad, maar er staan geen vulkanen onder. De lesstof bevat dus geen vulkanen.
- **Extra steden:** het vak "Extra steden:" (Plaatsen, onder nr. 14) is leeg op het origineel. Er komen dus geen extra steden bij.
- **"LeHavre":** zo staat het op het blad (Plaatsen › nr. 3). In de data staat "Le Havre", en de spelling van het blad telt ook als goed.
- **Dordogne** staat onder Streken. Het is dus een gebied en geen rivier.
- **Niet op het blad, dus geen lesstof:** Massif Central, Jura en verdere rivieren uit de overdracht (spoor B). Die kunnen hooguit reliëf of beleving zijn.

## Voor spoor C: hoofdstukbeelden (een per hoofdstuk, zonder tekst in beeld)

1. Wijngaarden van Bordeaux · 2. Oude haven van Marseille · 3. Daken van Parijs met de Eiffeltoren · 4. Alpen met Mont Blanc · 5. Lavendel in de Provence · 6. Pyreneeën bij Andorra · 7. Monaco aan zee · 8. Bretonse kust aan de Atlantische Oceaan · 9. Witte kliffen aan het Kanaal · 10. Een Loirekasteel aan de rivier · 11. Rijn bij Straatsburg

## Open (eigenaar)

- School en methode aanvullen in `docs/v4/bron/README.md` (staan niet op het blad).
- Besluiten: kopje noemen bij codevragen, akkoord met de 11 hoofdstukken, en of Franse namen goed tellen (voorstel: nee).
