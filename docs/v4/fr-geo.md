# V4 Frankrijk · spoor B: schoolkaart (geografie)

**Status:** klaar voor review in de V3-chat. Alleen data en scripts, de V3-app is niet aangeraakt. Daarnaast is er een losse offline oefenkaart voor de overhoring van dinsdag 17-11 (zie onderaan).

## Bron

- **Natural Earth 10m** (publiek domein, [terms of use](https://www.naturalearthdata.com/about/terms-of-use/)), via [nvkelso/natural-earth-vector](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson). Versiebestand `5.2.0-pre`, commit `ca96624a56bd078437bca8184e78163e5039ad19`, opgehaald op 12-11-2026.
- Gebruikte lagen en hun SHA256: `data/fr/bron/natural-earth.sha256` (`admin_0_countries`, `admin_1_states_provinces`, `populated_places`, `rivers_lake_centerlines`, `geography_regions_polys`, `geography_marine_polys`, `lakes`, `lakes_europe`).
- De ruwe GeoJSON (± 95 MB) staat niet in Git, net als bij Italië. Nabouwen: haal de bestanden op bij die commit, controleer de hashes en draai de build.

## Projectie en uitsnede

Een affiene lon/lat-projectie, zoals bij Italië:

```
x = 47.169811 * (lon + 7.6)
y = 68.655    * (52.4 - lat)      (47.169811 / cos 46.6°)
viewBox = 0 0 1000 796.4
```

- **Uitsnede:** lengte −6 tot 13, breedte 40.8 tot 52.4. Dat komt overeen met het leerblad (`bron/IMG_0801.HEIC`): Zuid-Engeland tot Corsica, Bretagne tot Noord-Italië.
- **Vereenvoudiging:** 0,25 SVG-eenheid, onder een halve pixel.

## Geometrie per soort

| Soort | Bron | Bewerking |
| --- | --- | --- |
| 14 steden | `populated_places` (Frankrijk) | Punt op de echte coördinaat, niet verschoven |
| 6 rivieren | `rivers_lake_centerlines`: Seine, Loire, Garonne, Rhône, Rhine/Rhin, Maas | Middenlijn, binnen de uitsnede |
| 9 buurlanden | `admin_0_countries` | Echte landsgrens. Monaco en Andorra hebben ook een symbolische locator (ruitje) |
| Corsica, Bretagne, Normandië, Elzas, Dordogne | `admin_1` (departementen) | Samengevoegd tot regio of departement |
| Alpen, Pyreneeën, Vogezen | `geography_regions_polys` (Range/mtn) | Educatief vlak van Natural Earth, geen gemeten grens |
| Noordzee, Het Kanaal, Golf van Biskaje, Middellandse Zee | `geography_marine_polys` | Min het land. Bij de Middellandse Zee horen ook Golfe du Lion, Ligurische, Balearische en Tyrreense Zee |
| **Zones** (geen eigen bronvlak) | | **Provence:** Bouches-du-Rhône, Var, Vaucluse en Alpes-de-Haute-Provence. **Nauw van Calais:** water tussen de lijnen Dungeness–Cap Gris-Nez en Leathercoat Point–Walde. **Atlantische Oceaan:** het open water ten westen van de IHO-lijnen Pointe de Penmarch–Cap Ortegal en Ouessant–Land's End. Natural Earth rekent dat water tot de Golf van Biskaje en Het Kanaal, waardoor de oceaan anders bijna verdwijnt. Golf van Biskaje en Het Kanaal zijn daarom afgesneden op die lijnen |

Elke zone staat ook in `data/fr/map.json` bij het item (`zone`).

Op de kaart zelf staan, net als op het schoolblad, alleen de landsgrenzen, de rivieren en de stippen. Streken, gebergten en zeeën zijn onzichtbare vlakken voor het aanwijzen, en worden alleen gekleurd bij leren en bij feedback.

## Geometriecheck

`python3 scripts/fr/check-map.py` doet **93 controles, 0 fouten**:
- 44 items, allemaal binnen de kaart;
- steden in Frankrijk;
- steden aan hun rivier (Parijs–Seine, Nantes–Loire, Bordeaux en Toulouse–Garonne, Lyon–Rhône, Straatsburg–Rijn);
- steden aan hun zee (Calais, Le Havre, Marseille, Nice);
- steden in hun streek (Le Havre, Straatsburg, Marseille);
- Andorra in de Pyreneeën;
- riviermondingen;
- geen water over land;
- het Nauw van Calais tussen Het Kanaal en de Noordzee.

## Bouwen

```
pip install shapely
python3 scripts/fr/build-map.py <map met de Natural Earth-GeoJSON>   # -> data/fr/map.json, data/fr/schoolkaart.svg
python3 scripts/fr/check-map.py
```

`data/fr/schoolkaart.svg` is het controlebeeld met alle namen. Leg het naast `bron/IMG_0801.HEIC`.

## Losse oefenkaart voor 17-11 (tijdelijk, naast V3)

`output/fr/TOPO-Frankrijk-oefenkaart.html` is één offline bestand van 346 KB, in de opzet van v1:
- **Leren:** per hoofdstuk, of alle namen tonen.
- **Aanwijzen:**
  - stippen en rivieren: binnen 22 px, alleen de dichtstbijzijnde telt (Metz/Nancy);
  - vlakken: binnen de vorm, of tot 14 px naast de rand;
  - kleine vlakken (Luxemburg, Nauw van Calais, Monaco, Andorra): die marge geldt ook als je net in het buurvlak tikt;
  - overlappende soorten (Elzas/Vogezen, Provence/Alpen, stad aan rivier of zee): alleen de gevraagde soort telt;
  - een tik in de Golf van Biskaje telt ook voor de Atlantische Oceaan.
  - `scripts/fr/test-edges.py` test 32 van zulke randgevallen op iPad-formaat.
- **Namen schrijven:** hoofdletters tellen niet. Zonder accent meldt hij "bijna" met de juiste schrijfwijze. De spelling "LeHavre" van het blad telt als goed.
- **Toets:** elke plek één keer, om en om aanwijzen en schrijven, met uitslag en cijfer. In de toets moet de schrijfwijze foutloos zijn.
- **Mijn fouten:** een apart hoofdstuk.
- **Beloning (besluit eigenaar 12-11):** elk goed antwoord bij het oefenen levert een Frans gebakje op, in deze volgorde: croissant, pain au chocolat, macaron, éclair, tartelette, chou à la crème, mille-feuille, madeleine. Acht gebakjes vullen een bakkerijdoos (zoals 8 pizzapunten), en drie volle dozen geven een Vespa-rit (de rode master-Vespa met Nino) naar de volgende Franse stad. In de toets zijn er geen beloningen. Bij "verminderde beweging" staat er geen rij-animatie, alleen de melding.
- **Opslag:** de voortgang staat in `topo-frankrijk-v1`, alleen op het apparaat.

Bouwen en testen:

```
python3 scripts/fr/build-app.py
python3 scripts/fr/test-app.py chromium
```

De test tikt alle 44 plekken goed aan en schrijft alle 44 namen. Daarnaast test hij varianten, een fout antwoord en een toets. Screenshots staan in `output/fr/screens/`.

**Niet getest hier:** WebKit/Safari (niet installeerbaar in deze omgeving). De iPad-test doet de eigenaar.

**Voor de V3-chat:** de doos heeft 8 gebakjes, dus de kernregel (8 per beloning, 3 per rit) blijft voor Frankrijk gelijk. Alleen het beeld verschilt. De gebakjes zijn eenvoudige SVG-iconen; een inventarisatie van Franse lekkernijen en de echte artwork volgen in spoor C.

Deze kaart is geen V3-scherm. In V4 gaat dezelfde `data/fr/map.json` mee in het landpakket `src/lands/fr/`.
