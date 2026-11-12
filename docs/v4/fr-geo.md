# V4 Frankrijk · spoor B: schoolkaart (geografie)

**Status:** klaar voor review in de V3-chat. Alleen data en scripts, de V3-app is niet aangeraakt. Daarnaast is er een losse offline oefenkaart voor de overhoring van dinsdag 17-11 (zie onderaan).

## Bron

- **Natural Earth 10m** (publiek domein, [terms of use](https://www.naturalearthdata.com/about/terms-of-use/)), via [nvkelso/natural-earth-vector](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson). Versiebestand `5.2.0-pre`, commit `ca96624a56bd078437bca8184e78163e5039ad19`, opgehaald op 12-11-2026.
- Gebruikte lagen en hun SHA256: `data/fr/bron/natural-earth.sha256` (`admin_0_countries`, `admin_1_states_provinces`, `populated_places`, `rivers_lake_centerlines`, `geography_regions_polys`, `geography_marine_polys`, `lakes`, `lakes_europe`).
- De ruwe GeoJSON (± 95 MB) staat niet in Git, net als bij Italië. Nabouwen: haal de bestanden op bij die commit, controleer de hashes en draai de build.

## Projectie en uitsnede

Een affiene lon/lat-projectie, zoals bij Italië:

```
x = 52.631579 * (lon + 6)
y = 76.607    * (52.4 - lat)      (52.631579 / cos 46.6°)
viewBox = 0 0 1000 888.6
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
| **Zones** (geen eigen bronvlak) | | **Provence:** Bouches-du-Rhône, Var, Vaucluse en Alpes-de-Haute-Provence. **Nauw van Calais:** water tussen de lijnen Dungeness–Cap Gris-Nez en Leathercoat Point–Walde. **Atlantische Oceaan:** het open water ten westen van 0°, zonder Golf van Biskaje, Kanaal en Noordzee |

Elke zone staat ook in `data/fr/map.json` bij het item (`zone`).

Op de kaart zelf staan, net als op het schoolblad, alleen de landsgrenzen, de rivieren en de stippen. Streken, gebergten en zeeën zijn onzichtbare vlakken voor het aanwijzen, en worden alleen gekleurd bij leren en bij feedback.

## Geometriecheck

`python3 scripts/fr/check-map.py` doet **90 controles, 0 fouten**:
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
- **Aanwijzen:** tikken binnen 22 px van een stip of rivier, of binnen het vlak.
- **Namen schrijven:** hoofdletters tellen niet. Zonder accent meldt hij "bijna" met de juiste schrijfwijze. De spelling "LeHavre" van het blad telt als goed.
- **Toets:** elke plek één keer, om en om aanwijzen en schrijven, met uitslag en cijfer. In de toets moet de schrijfwijze foutloos zijn.
- **Mijn fouten:** een apart hoofdstuk.
- **Opslag:** de voortgang staat in `topo-frankrijk-v1`, alleen op het apparaat.

Bouwen en testen:

```
python3 scripts/fr/build-app.py
python3 scripts/fr/test-app.py chromium
```

De test tikt alle 44 plekken goed aan en schrijft alle 44 namen. Daarnaast test hij varianten, een fout antwoord en een toets. Screenshots staan in `output/fr/screens/`.

**Niet getest hier:** WebKit/Safari (niet installeerbaar in deze omgeving). De iPad-test doet de eigenaar.

Deze kaart is geen V3-scherm. In V4 gaat dezelfde `data/fr/map.json` mee in het landpakket `src/lands/fr/`.
