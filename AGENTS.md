# Project Agent Rules

- Keep the Chrome extension and userscript behavior aligned, especially selectors and mask-neutralizing CSS.
- Use Manifest V3 and keep permissions minimal. Do not add remote scripts, analytics, tracking, or unnecessary network access.
- Prefer non-destructive CSS overrides over deleting Bilibili page nodes.
- Preserve support for both `#web-player-module-area-mask-panel` and `.web-player-module-area-mask` unless verified replacements are added.
- After JavaScript changes, run `node --check` on every changed script.
- After manifest changes, parse `Chrome Extension/manifest.json` as JSON.
- Update `README.md` and this file when behavior, layout, installation, or maintenance rules change.
