> **Update 2026-10-24 — six standalone renders now provided in this chat (supercedes the earlier pending-render statuses below).** Guide, Encourage, Success, Gold, Welcome and Arrival were collected with the owner-supplied original scooter art, original Italian panorama, earlier 1024px source versions, football concept and earlier art-direction board. A complete Git-ready archive was verified locally: `topo-nino-art-git-ready-2026-10-24.zip` (35,405,200 bytes; SHA-256 `73a9743d3b2d9998a270893924ca88de964554628215b98bc9461fbdd6291188`). The archive has **12 PNG originals plus 6 WebP exports**, a SHA-256/dimensions manifest, README and safe Git push script. The archive is a **conversation-local file**, NOT hosted on GitHub. The actual images have **NOT been pushed**: the available Github connector cannot transfer binary files from the container to repository Git blobs; a Git-authenticated Mac must run the included `PUSH_TO_GITHUB.sh` after downloading the archive. The script creates branch `art/nino-complete-20261024` from this design branch without merging or deploying. All files verified locally. Encourage contains small yellow thumb accents contrary to the no-decoration brief and is marked candidate-needs-review. Do not confuse presence in chat with repository upload.\n\n# Topo Nino art — upload and integration ledger (2026-10-24)

**GitHub PR:** #6 (design/art planning). **App PR:** #9 Release 1.1, unaffected.

## Source of truth and honest status

Original owner-created Nino (curly dark hair, green pilot cap and goggles, blue shirt, red scarf, brown backpack, classic red scooter) is the **approved character identity**. One original on-scooter transparent PNG and an approved illustrated Italian scene are available in the current Topo conversation archive; the Release 1 app already embeds the original Nino art.

The user states the following **final separate renders are created/saved locally**, but those original files **have not yet been supplied as attachments in this thread / are not in this GitHub branch**:

| Intended path (pending upload) | Asset | Owner status |
| --- | --- | --- |
| `assets/nino/characters/nino-guide.png` | Map guide | Created; full-res PNG not yet transferred |
| `assets/nino/characters/nino-success.png` | Six-question success | Created; full-res PNG not yet transferred |
| `assets/nino/characters/nino-gold.png` | Gold achievement | Created; full-res PNG not yet transferred |
| `assets/nino/characters/nino-welcome.png` | Welcome on scooter | Created; full-res PNG not yet transferred |
| `assets/nino/characters/nino-encourage.png` | Wrong answer support | Not yet created as final image |
| `assets/nino/scenes/nino-arrival.png` | Travel destination scene | Not yet created as final image |

Do **not** confuse previously produced cropped contact-sheet assets (about 200 pixels high, cream backgrounds) with full-resolution transparent owner-approved character renders. Those crops are prototypes only. Never represent them as final alpha PNGs.

## Other available source material, currently outside GitHub

- `references/`: original Nino-on-scooter PNG, original approved Italian scene, secondary atmosphere reference scenes (different character identity, mood only).
- `app-icons/`: prepared 1024-master Riviera-blue and terracotta icon variants, exported Apple-touch/favicons/manifest sizes; *owner's selection and production wiring still pending*.
- `art-prototypes/`: 11 cropped chapter-icon concepts, low-resolution Nino expressions, four postcard crops and two Eilanden scene crops; *concept only, not integration-ready*.
- `concepts/`: standalone football/Turin illustrations and prior full contact sheets; *archive/design studies, not necessarily approved Nino product poses*.

A curated staging ZIP and detailed SHA256/dimension manifest were produced as conversation-local artifacts. They are **not** available at a GitHub or public URL and have **not** been committed to this PR. They must be supplied as source files before GitHub ingestion. No claim is made that a filesystem package has been pushed to the repository.

## Ingestion rules for Codex/Hermes

1. Obtain the **actual final files**, e.g. one ZIP attachment of the four owner-created character renders and available other art, without recreating them from prompts or compressing for archival storage.
2. Build a dedicated art-only GitHub branch/PR. Keep original full-resolution masters under `assets/nino/`; derivatives in distinct `assets/nino/exports/` paths.
3. Verify image magic bytes, dimensions, alpha channel where expected, and SHA-256; record identity/version/source/approval state in `assets/nino/manifest.json`.
4. Do not silently substitute mockups/contact-sheet crops or replace established original Nino WebP bytes. Preserve all application routes and local-storage keys.
5. App icon: Riviera and terracotta are still **candidates**; no icon selection or deployment until owner approval.
6. Keep the football variations as optional design archive; they are not school geography targets.
7. Art-only PR is **not** an app deploy. After visual owner sign-off, make a separate bounded integration PR against current verified integration branch.
8. Do not merge or deploy autonomously.

## Remaining actions

- Receive the four completed final images from the owner as real files (ideally one ZIP).
- Produce Encourage and Arrival separately when desired, update this ledger.
- Commit the actual curated binaries to GitHub and independently review their integrity.
