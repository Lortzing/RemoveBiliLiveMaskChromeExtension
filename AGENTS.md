# Project Agent Rules

- Keep the Chromium extension and userscript behavior aligned, especially selectors and mask-neutralizing CSS.
- Preserve compatibility with both Google Chrome and Microsoft Edge; `Chrome Extension/` is the shared Manifest V3 source for both browsers.
- Use Manifest V3 and keep permissions minimal. Do not add remote scripts, analytics, tracking, or unnecessary network access.
- Prefer non-destructive CSS overrides over deleting Bilibili page nodes.
- Preserve support for both `#web-player-module-area-mask-panel` and `.web-player-module-area-mask` unless verified replacements are added.
- After JavaScript changes, run `node --check` on every changed script.
- After manifest changes, parse `Chrome Extension/manifest.json` as JSON.
- Keep Git tags, Release names, archive filenames, and the Manifest version aligned.
- Package the contents of `Chrome Extension/`, not the directory itself; `manifest.json` must be at the archive root.
- Publish one shared Chromium ZIP for Chrome and Edge; do not create browser-specific packages unless their contents diverge.
- Update `README.md` and this file when behavior, layout, installation, browser compatibility, release workflow, or maintenance rules change.
