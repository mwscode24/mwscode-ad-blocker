# Simple Ad Blocker (Opera)

## Install in Opera
1. Open `opera://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select this folder (`opera-adblocker`)
4. Pin the extension from the puzzle icon in the toolbar

## Features
- Blocks ~70 major ad/tracker networks via declarativeNetRequest
- Hides leftover ad containers (cosmetic filtering)
- Global on/off switch and per-site allowlist
- Blocked-request badge counter (unpacked installs)

## Extend
Add domains to `rules/ads.json` (copy a rule, use a new unique `id`) or add CSS selectors in `content.js`.
