# TOPO-HARNESS-001 — executed preflight evidence

This is baseline evidence only, not a quality-gate or implementation acceptance report.

## Remote inspection
GitHub open PR inspection: no harness PR. `git ls-remote --heads origin agent/topo-harness-v1` and harness-name variants returned no branch. main fetched successfully. PR61/PR64 remain open, unchanged.

## Exact source comparison

```json
{
  "main": {
    "sha": "7e38160cb2f1f1c159c907e0150464b78c761f38",
    "testPrograms": 7,
    "routeStages": "['discover', 'point', 'write', 'codes']",
    "discoveryMapModulePresent": false,
    "TopoAtlasInHtml": false,
    "htmlBytes": 694547,
    "htmlSha256": "79e11c495f4b6ecae54a88602d30ee24b73c484a4571448345139eba41a2992e",
    "typecheck": "node -e \"console.log('No type checker configured: standalone JavaScript baseline')\"",
    "packageScripts": [
      "dev",
      "lint",
      "typecheck",
      "test",
      "build"
    ]
  },
  "PR61": {
    "sha": "1bf86b3e1c69319bed8ef877243070a64d97a12e",
    "testPrograms": 17,
    "routeStages": "['discover', 'point', 'write']",
    "discoveryMapModulePresent": true,
    "TopoAtlasInHtml": true,
    "htmlBytes": 3152649,
    "htmlSha256": "422f39dd06cb2ea2d6524ce07e4524738aa425aef5c5e54d63b55d90b54143a9",
    "typecheck": "node -e \"console.log('No type checker configured: standalone JavaScript baseline')\"",
    "packageScripts": [
      "dev",
      "lint",
      "typecheck",
      "test",
      "build",
      "release:check",
      "geography:lakes",
      "qa:lakes",
      "qa:release-1-2",
      "audit:release-1-2",
      "qa:schoolblad",
      "qa:discovery",
      "qa:map-hit",
      "qa:focus"
    ]
  },
  "PR64": {
    "sha": "940a6a50ec74331a2b2864a904ad4d3c04f5645d",
    "testPrograms": 17,
    "routeStages": "['discover', 'point', 'write']",
    "discoveryMapModulePresent": true,
    "TopoAtlasInHtml": true,
    "htmlBytes": 3152649,
    "htmlSha256": "422f39dd06cb2ea2d6524ce07e4524738aa425aef5c5e54d63b55d90b54143a9",
    "typecheck": "node -e \"console.log('No type checker configured: standalone JavaScript baseline')\"",
    "packageScripts": [
      "dev",
      "lint",
      "typecheck",
      "test",
      "build",
      "release:check",
      "geography:lakes",
      "qa:lakes",
      "qa:release-1-2",
      "audit:release-1-2",
      "qa:schoolblad",
      "qa:discovery",
      "qa:map-hit",
      "qa:focus",
      "qa:ux52"
    ]
  }
}
```

main's docs/PROJECT_STATE.md explicitly describes four phases ending in Schoolcodes, a worksheet photograph overlay and7 test programs. PR61 contains the later Discovery style, three-stage route and17 programs. PR64's declared base is PR61 and adds scripts/ux-desktop-52.js/css and a dedicated preview; it is not merged into main. This confirms a task/base mismatch, not an inferred runtime failure.

## iMac visibility limitation
A previous read-only SSH probe from mac-mini.lan to imac-van-dennis.lan failed authentication. No iMac task STATE/logs were read, so its actual stopping reason remains unconfirmed. The initial mission supplied by the owner was sufficient to identify the baseline conflict locally.

## Delivery status
Only these persistent contract/state/evidence files have been added. check.sh, enforcement, CI, deliberate-failure test and full quality gate are NOT IMPLEMENTED/NOT EXECUTED. No GATE: PASS or completion claim. No app/art/test changes and no PR61/64 edits.
