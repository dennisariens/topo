# RUNLOG

Append-only, één regel per run. Elke vrijdag rolt de weekreview oudere weken op tot één samenvattingsregel.

Formaat:
`YYYY-MM-DD HH:MM | agent/model | taak | PASS/FAIL/BLOCKED | pin | creditgebruik (laag/mid/hoog) | één zin`

---
2026-11-13 22:30 | claude/opus | setup | — | — | mid | ops/ geïnstalleerd, wacht op G0
2026-11-13 22:50 | claude/opus | setup | — | — | laag | Besluiten Dennis verwerkt (GO, B2C+B2B, groep 7, FR-code pauze, parallel op Codex 🟡); ops/ naar repo
2026-11-13 23:00 | claude/opus | domein | — | — | laag | Dennis koopt ninotopo.nl; BL-011 internationale domeinstrategie toegevoegd
2026-11-13 23:15 | claude/opus | nachtrun-install | — | — | laag | install-nightly.sh: launchd 01:00, script vers van main, paden voor ~/topo-claude
2026-11-14 08:50 | claude/opus | nachtrun-fix | — | — | laag | Nacht 1 geanalyseerd: werkt end-to-end, stopte na BL-001 door te smalle Bash-rechten; fix: bypassPermissions + deny-lijst, main fetchen, machine-feiten in rapport
