# Toegepaste eigenaarbesluiten

Bron `codex/topo-v3@cdcf30dbf7caef2da5ab989f12b5055bdc250727`, `docs/DECISIONS.md`. Niet aanwezig in de artpin; rechtstreeks gelezen uit deze gepinde documentatiecommit, aangevuld door de expliciete opdracht van de eigenaar.

## 2026-11-09 — Artwork: visuele kwaliteit boven bestandsgrootte; Nino-kenmerken

- **Achtergronden:** BG-01, BG-02 en BG-03 blijven alle drie in de app. Visuele kwaliteit gaat voor; de groei van het bestand (+7,4 MB) lossen we technisch op: eerst meten op een echte iPad, daarna zo nodig AVIF in plaats van WebP en decoderen wanneer zichtbaar. De bronresolutie van 1586×992 (maximum van de beeldgenerator) is een vastgelegde uitzondering op de brief. Budgetten gelden in KiB.
- **Nino-model:** vast zijn gezicht, groene helm met bril, rode sjaal, blauw bovenstuk, rugzak en rode Vespa. De precieze snit van shirt of jasje mag per scène wat variëren. Uitzondering: het portret (altijd zichtbaar in de zijbalk) moet exact canoniek zijn: gesloten blauw werkshirt.
- **Gevolg voor Hermes 908b4a4:** BG-01 t/m BG-03 vallen onder de uitzondering. Roma en Napoli zijn binnen de modelregel geaccepteerd. Het portret gaat terug voor het shirt; de uitsnede (hoofd en schouders) en de lichte haarrand op donker zijn geaccepteerd.


## 2026-11-09 — Nino draagt overal hetzelfde shirt

- **Besluit eigenaar:** Nino draagt in elk beeld het gesloten blauwe werkshirt uit de canonieke referenties, dichtgeknoopt met kraag, zonder wit shirt eronder. **Supersedes** de regel van vandaag dat de snit per scène mag variëren.
- **Gevolg:** portret, scène Roma en scène Napoli gaan terug voor het shirt (Hermes 908b4a4); Venezia en de #75-scènes blijven.
