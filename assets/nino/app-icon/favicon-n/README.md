# NINO favicon: N

Owner-supplied on 7 November 2026, for PR #71: a cream N on dark green, at 16 and 32 px.

- `scripts/embed-nino-micro-icons.mjs` embeds both PNGs as data URIs, so the offline HTML makes no icon requests. The build fails if the bytes differ from `manifest.json`.
- This replaces the PR65 micro favicons in `../micro-v2/`. Those files stay as history and are no longer embedded.
- The large illustrated app icon is unchanged.
