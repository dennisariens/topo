# V3-ontwerpregels

**Richting:** Nino meets Apple iOS, op z'n Italiaans. De rust van Apple Notes, de reiswereld van Nino, één hoofdactie per scherm. Tokens: `scripts/v3/tokens.css`, alleen actief binnen `.v3`. Status: **voorstel, ter beoordeling door de eigenaar.**

## Typografie
Platformfont (SF Pro op iPad en Mac). Vijf stijlen naar iOS:

| Stijl | Maat | Gebruik |
| --- | --- | --- |
| Large title | 34/41 bold (telefoon 30/36) | één per scherm: de huidige halte |
| Title 2 | 22/28 bold | sectiekop |
| Headline | 17/22 semibold | knoppen, regels |
| Subheadline | 15/20 | statusregels |
| Footnote | 13/18 semibold, kapitalen | eyebrow ("Halte 2 van 11") |

Woorden breken nooit middenin. Een reeks als "7–12" blijft bij elkaar.

## Ruimte
Een 4-puntsraster: 4, 8, 12, 16, 20, 24, 32, 48. Kaarten 24 binnenmarge (telefoon 20). Tussen kaarten 24.

## Kleur
- Papier `#f8f3e8`, oppervlak `#fffdf8`, inkt forest `#073f3b`, secundaire inkt `#4f6a69`, lijnen 12% inkt.
- **Terracotta `#b9502f` alleen voor de hoofdactie** en de huidige halte.
- Groen `#167b59` = afgerond. Goud `#b8860b` = Gold, nergens anders. Grijs = op slot.
- Een staat wordt nooit alleen met kleur getoond: ook een vinkje, slot, zegel of woord.

## Knoppen
- Hoofdactie: 52 px, volle breedte, terracotta, wit 18 px. Eén per scherm.
- Hulpmiddel: ≥ 44 px, crème met donkergroen. Stil: onderstreepte tekst, ≥ 44 px raakvlak.
- Radius 12. Ingedrukt: schaal 0,98.

## Focus
3 px teal-ring (`#007c72`) met 3 px afstand, alleen bij toetsenbordfocus. Tabvolgorde volgt de leesvolgorde: hoofdactie, haltes 1–11, beloningen.

## Oppervlakken
Afgeronde kaarten (16) met een zachte schaduw op papier. Geen kaders om kaders. Detail voor een andere halte verschijnt in de routekaart, niet in een modaal venster.

## Beeld
- Elk beeld voor zijn eigen doel: hoofdstukicoon = halte, Nino travel = waar je nu bent, Nino welcome = zijn zin, Gold-zegel = goud, pizza = pizzapunten.
- Op slot: hetzelfde icoon, grijs. Er worden geen beelden verzonnen of bijgewerkt.
- De route is verhalend, geen landkaart.

## Beweging
Alleen om een verandering uit te leggen: selectie (280 ms) en het openen van het detail. Geen herhalende animaties. Bij verminderde beweging staat alles op 0 ms.
