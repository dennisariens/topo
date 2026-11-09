# V3.0 — resterende schermen

Opdracht eigenaar, 9 november 2026: Toets met resultaat, Voortgang, kennismaking, schoolbladknop en de nieuwe navigatie op alle schermen. Bron: het plan [TOPO V3 — Artwork, schoolblad, profielen en toetsen](https://claude.ai/artifact/Kow6yEonHSiQ1G67HBQUX9), `DESIGN_SYSTEM.md` V3 en `DECISIONS.md`. Niet in V3.0: meerdere profielen, leraarsmodus, groepstoets (V3.1).

**Vaste regels:** V3-laag over de ongewijzigde `index.html`; acties drukken V2-knoppen of roepen de bestaande V2-functies aan; geen tweede beoordelaar, beloningsregel of opslag van voortgang. Principe: geen taglines, hulpteksten of bijlabels; één duidelijke actie waar een handeling nodig is. Echte kaartgeometrie. Italia-thema, renderassets uit het manifest.

## 1. Navigatie op alle schermen

Zijbalk (telefoon: tabbalk) op elk scherm, ook tijdens lessen, Oefenen en Toets:

| Tab | Inhoud |
| --- | --- |
| Reis | bestaand V3-scherm |
| Oefenen | vrije oefenvormen: Ontdekken (vrije kaart, schoolkaart/reliëf), Aanwijzen, Namen schrijven, slim rondje, mijn fouten; keuze van groep |
| Toets | sectie 2 |
| Beloningen | bestaand V3-scherm |
| Voortgang | sectie 3 |
| Instellingen | onderaan; bestaand V2-menu (profiel, reservekopie, wissen) |

- Gold en Kaart worden geen eigen tab: Gold hoort bij een hoofdstuk op Reis, de vrije kaart is Ontdekken onder Oefenen.
- De V2-header, de V2-tabs, `nav.tabs` en `#focusMenu` verdwijnen overal; alles wat ze boden blijft bereikbaar via de nieuwe navigatie of Instellingen.
- Tijdens een les blijft de zijbalk zichtbaar maar rustig. De les behoudt het gedrag van Reis → Verder en Oefenen → Reis → Oefenen: dezelfde vraag, tekst en selectie.
- De actieve tab volgt de route die de leerling koos (DECISIONS 7-11).

## 2. Toets

Een eigen tab. De motor is de bestaande gewone toets van V2 (score, Nino-feedback, delen als tekst). Toetsen geven geen pizzapunten en geen goud.

1. **Instellen** (één scherm): hoofdstukken (standaard: wat afgerond is; anders alles), vorm (Aanwijzen · Namen schrijven · beide), lengte (10 · 20 · alle). Eén knop **Start toets**.
2. **Toets:** dezelfde lesweergave zonder hints, zonder schoolblad, zonder Nino-tussenmomenten en zonder beloningen. Bovenaan alleen `7 / 20`.
3. **Resultaat:**
   - grote score (`17 / 20`) en één passende Nino-pose;
   - de echte kaart met elke gevraagde plek groen ✓ of rood ×; bij een fout ook het juiste antwoord;
   - de lijst met fouten en de knop **Oefen deze fouten** (naar de bestaande foutenlijst);
   - **Delen:** tekst kopiëren en e-mailconcept (bestaat al), plus **Print** als A4 (naam, datum, score, kaart, fouten).
4. **Uitslagen:** de laatste 10 per profiel, getoond onder Voortgang. Opslag onder een eigen sleutel, los van de V2-voortgang. Neem de uitslagen op in de reservekopie zonder oude kopieën te breken, en leg dat vast in DECISIONS.

## 3. Voortgang

- **Kop:** `32 / 45 plekken` met een balk.
- **Kaart:** de echte kaart met elke plek gekleurd naar beheersing. Groen = beheerst, licht = bezig, neutraal = nog niet. Afleiden uit de bestaande skill-historie per plek; geen nieuwe regel verzinnen, de drempel vastleggen in DECISIONS.
- **Hoofdstukken:** de 11 met de drie lesstaven, ✓ en goud.
- **Dagdoel en kennis-paspoort:** bestaan al in V2; hierheen verplaatsen.
- **Toetsuitslagen:** de laatste 10.
- **Geen streak** (eerder afgewezen).

## 4. Kennismaking

- **Eén scène, twee stappen:** naam (optioneel) en favoriete pizza, met het Nino-portret of de welcome-pose.
- **Altijd een knop Start meteen;** daarna Reis met hoofdstuk 1 geselecteerd.
- **Profielschema 1 blijft gelijk;** de bestaande regel voor het eenmalig opnieuw aanbieden blijft.
- **Begin helemaal opnieuw** opent deze kennismaking.

## 5. Schoolbladknop

- **Knop Schoolblad** op Reis (naast Schoolkaart/Reliëf), in Oefenen › Ontdekken, en in de leskop van Ontdekken, Aanwijzen en Namen schrijven.
- **Toets `S` werkt overal, behalve in Toets en de Gouden proef.** Daar is ook de knop er niet.
- Opent het bestaande V2-schoolbladvenster (zoom, verschuiven, Escape, focusherstel). Vraag, concept en selectie blijven bewaard.

## Bewijs en oplevering

- **Per scherm:** desktop, iPad (staand en liggend), telefoon en 320 px; Chromium. Echte flows: toets maken tot het resultaat, delen, printen; Voortgang tegen de V2-gegevens.
- **Controles:** toetsenbord, focus, verminderde beweging, en geen overlap of afkapping. `index.html` blijft byte-gelijk.
- **QA-scripts uitbreiden;** lint, test en build groen.
- **Per onderdeel committen;** de preview niet committen. Daarna één hertestverzoek op #76 voor Hermes.
