# RUNLOG

Append-only, één regel per run. Elke vrijdag rolt de weekreview oudere weken op tot één samenvattingsregel.

Formaat:
`YYYY-MM-DD HH:MM | agent/model | taak | PASS/FAIL/BLOCKED | pin | creditgebruik (laag/mid/hoog) | één zin`

---
2026-11-13 22:30 | claude/opus | setup | — | — | mid | ops/ geïnstalleerd, wacht op G0
2026-11-13 22:50 | claude/opus | setup | — | — | laag | Besluiten Dennis verwerkt (GO, B2C+B2B, groep 7, FR-code pauze, parallel op Codex 🟡); ops/ naar repo
2026-11-13 23:00 | claude/opus | domein | — | — | laag | Dennis koopt ninotopo.nl; BL-011 internationale domeinstrategie toegevoegd
2026-11-13 23:15 | claude/opus | nachtrun-install | — | — | laag | install-nightly.sh: launchd 01:00, script vers van main, paden voor ~/topo-claude
2026-11-14 01:30 | claude/sonnet | night | BL-001 | PASS* | mid | Branch-inventaris 107 branches (0 delete, 95 archive); *C4 indirect getoetst, cherry niet gedraaid (sandbox)
2026-11-14 08:50 | claude/opus | nachtrun-fix | — | — | laag | Nacht 1 geanalyseerd: werkt end-to-end, stopte na BL-001 door te smalle Bash-rechten; fix: bypassPermissions + deny-lijst, main fetchen, machine-feiten in rapport
2026-11-14 11:30 | claude/opus | model-routing | — | — | laag | Subagents builder (Sonnet), scout (Haiku), codex-worker (Codex); hoofdsessie orkestreert op Opus; TOPO_MAIN_MODEL-override
2026-11-14 16:30 | claude/fable+sonnet | taak | BL-005 | PASS* | mid | Integratieplan + proefintegratie (DRY df72c39, lint/test/build 0); run 1 FAIL op C11 (sync -X theirs overschrijft art), run 2 PASS; *uitsluitingen breken ±240 doc-links, door hoofdsessie in rapport gezet, niet herevalueerd; schijf vol → nulmeting sparse
2026-11-14 17:00 | claude/fable | domein | BL-009 | — | laag | ninotopo.nl gekocht door Dennis; BL-009 gedeblokkeerd, wacht op DNS-gegevens
2026-11-14 17:40 | claude/fable | besluit | BL-012 | — | laag | Favicon R3 (Vespa zijaanzicht) vastgelegd in DECISIONS; assets nog niet in repo
2026-11-14 17:50 | claude/fable | art | BL-012 | — | laag | R3-merkassets (favicon, Nino Welcome, Logo R3.1) op art/master b9e4a38; logo-SVG's bevatten ingebedde rasterafbeelding (525 KB)
2026-11-14 18:10 | claude/fable | taak | BL-013 | review | mid | Portal R3 gebouwd als site-root, Italië op /italie/; browsercheck 4 formaten zonder fouten; wacht op evaluator en G1
2026-11-14 18:30 | claude/fable | taak | BL-013 | fail(1) → herstel | mid | Evaluator FAIL: namen afgesneden op iPad, labels <13 px en contrast; hersteld en op 7 formaten gemeten (0 afgesneden, 0 overlap)
