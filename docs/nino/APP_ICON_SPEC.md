# Topo / Italië — Nino App Icon Specification v1.0
**Status:** visual concepts prepared for owner review. No deployed icon or app-file changes.
**Links:** Issue #8 (iPad/home-screen asset task); PR #6 (Nino art & content); PR #3 (Release 1 baseline).
**Original character source:** owner's 2026-09-28 transparent original Nino aboard the red scooter. This is the identity reference, not a stock mascotte.

## 1. Recommendation: Riviera-blue hero icon

The app icon needs a different composition from the panoramic Nino hero:
- **Hero subject:** Nino's genuine face + substantial red front of his scooter visible as one memorable silhouette.
- **Background:** simple Mediterranean Riviera blue with sun/warm coast accents; no small, photo-real city elements that vanish at icon size.
- **Italy signal:** small green/ivory/red travel tricolore (a visual accent rather than a flag over the whole image).
- **Typography:** no text at the 60px iPad icon scale; the iPad app label is rendered by iOS. Avoid trying to fit `TOPO ITALIË` in 32px.
- **Shape:** deliver full-square master; operating system applies corner masking. Keep safety margins for Nino's eyes and scooter lamp.
- **Alternative:** terracotta/cream background, same exact foreground. Prefer Riviera-blue because the red scooter stands out better in the observed 32–64px review.
- The existing approved hero and other Nino illustrations remain unchanged. Nino's face, pet, goggles, blue blouse and red scarf are *identity locks*.

## 2. Concept files produced separately in the current chat

Visual candidates were composed using the actual owner-supplied large original Nino PNG (not an upscaled 200px contact-sheet crop):
- `topo-nino-icon-riviera-1024.png` (candidate A, preferred)
- `topo-nino-icon-terracotta-1024.png` (candidate B)
- Each version exported at `512, 192, 180, 120, 64, 48, 32, 16` PNG sizes and a multiresolution `.ico`.
- `topo-icon-comparison.png` (side-by-side 390px, 64px, 48px and 32px)
- `README.json` includes original source SHA-256 and candidate status.

**Distribution:** user-visible `topo-nino-app-icon-v1.zip` from current conversation. The GitHub design PR contains this design specification and production plan, **not these binary images**. Do not pretend the downloadable ZIP is already part of the repo. Codex may use the explicit approved artifact provided by the owner.

## 3. Hosted app implementation targets

| Target | Asset | Minimum |
|---|---|---|
| iPad/iPhone Add to Home Screen | `apple-touch-icon.png` | 180×180 PNG (full-square, opaque) |
| Manifest normal | `icon-192.png` | 192×192 PNG |
| Manifest large | `icon-512.png` | 512×512 PNG |
| Browser | `favicon.ico`, `favicon-32.png` and `favicon-16.png` | 16/32 multi-resolution |
| Source/design | `app-icon-master.png` | 1024×1024 PNG |

**Head wiring (examples, adapt paths/build configuration):**
```html
<link rel="icon" type="image/png" sizes="32x32" href="./icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="./icons/favicon-16.png">
<link rel="icon" href="./icons/favicon.ico" sizes="any">
<link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon.png">
<link rel="manifest" href="./site.webmanifest">
<meta name="theme-color" content="#136E83">
```
Real paths must match the actual output directory. The generated `index.html` and downloadable self-contained `topo-italie-duolingo.html` must remain functional offline when external icon files are missing. A data URI can supply a standalone icon fallback if appropriate. Adding a webmanifest alone does **not** mean that the app supports offline installation or cloud sync.

**Manifest guidance:**
```json
{
  "name": "Topo / Italië",
  "short_name": "Topo",
  "lang": "nl-NL",
  "display": "standalone",
  "start_url": "./",
  "scope": "./",
  "background_color": "#F5F2E9",
  "theme_color": "#136E83",
  "icons": [
    {"src": "./icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
    {"src": "./icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}
  ]
}
```
Optional `maskable` icon should be prepared separately with adequate safe-area testing, **not** declared just because a square PNG exists.

## 4. iPad acceptance

Check **real physical iPad Safari**:
1. Open preview via HTTPS; choose Share → Add to Home Screen.
2. Verify full Nino face, helmet and red scooter visible, no clipped chin, headlight, or tiny nonsensical text.
3. Check at normal home screen size, dark/light wallpaper and system tint treatment where applicable; compare to original icon if retrievable.
4. Launch from Home Screen, verify app starts, map taps, writing keyboard, progress persistence and backup.
5. Reinstall shortcut / flush Safari cache to rule out stale previous icon.
6. Confirm standalone downloaded HTML still boots without HTTP; do not rely on an external manifest there.
7. Check desktop browser favicon, sizes, network errors and build tests.

Do **not** publish to production before owner approval and independent QA. New icon deployment may change browser-cache behaviour, not progress storage; do not alter `topo-italie-v3`.

## 5. Ownership and task split

- Main / visual direction: owner approves A or B based on iPad mockup.
- Codex: focused assets integration, manifest/head/build parity and automated coverage after selection.
- Hermes: independent device/browser icon testing plus regression around saved learning.
- No duplicate large redraw of Nino/hero, no Work orchestration needed.
