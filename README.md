# Simple Ad Blocker for Opera: How to Use

A lightweight ad blocker for Opera (works in other Chromium browsers too). It blocks ad and tracker requests and hides leftover ad boxes on pages.

---

## 1. Installation

1. **Unzip** `opera-adblocker.zip`. You should get a folder named `opera-adblocker`.
2. Open Opera and go to `opera://extensions`.
3. Turn on **Developer mode** (toggle at the top right).
4. Click **Load unpacked**.
5. Select the `opera-adblocker` folder (the one containing `manifest.json`).
6. Click the puzzle icon in the toolbar and **pin** the extension so it is always visible.

> **Note:** Do not delete or move the folder after installing. Opera loads the extension directly from it.

---

## 2. Using the Extension

Click the red extension icon in the toolbar to open the popup.

| Control | What it does |
|---|---|
| **Blocked on this page** | Shows how many ad requests were blocked on the current tab. |
| **Ad blocking** switch | Turns blocking on or off for all sites. Green means on. |
| **Allow ads on this site** switch | Disables blocking only for the current website (allowlist). |
| **Reload page** | Reloads the tab so changes take effect. |

After changing any switch, click **Reload page** to see the result.

### Allowing ads on a site you want to support
1. Open the site.
2. Click the extension icon.
3. Turn on **Allow ads on this site**.
4. Click **Reload page**.

To undo it, turn the switch off again.

### Fixing a broken website
If a site looks wrong or something stops working (videos, login, checkout):
1. Open the popup and turn on **Allow ads on this site**.
2. Reload the page.

---

## 3. Customizing

### Block more domains
Open `rules/ads.json` and copy an existing rule, then change the `id` (must be unique) and the domain:

```json
{
  "id": 66,
  "priority": 1,
  "action": { "type": "block" },
  "condition": {
    "urlFilter": "||example-ad-network.com^",
    "resourceTypes": ["script", "image", "sub_frame", "xmlhttprequest", "stylesheet", "media", "ping", "font", "object", "other"]
  }
}
```

### Hide more ad boxes
Open `content.js` and add a CSS selector to the `selectors` list, for example:

```js
'.my-annoying-banner',
'div[id^="promo-"]',
```

### Apply your changes
1. Go to `opera://extensions`.
2. Find **Simple Ad Blocker** and click the **reload** icon.
3. Refresh the website you are testing.

---

## 4. Troubleshooting

| Problem | Fix |
|---|---|
| Extension does not load | Make sure you selected the folder containing `manifest.json`, not the zip or a parent folder. |
| "Manifest file is invalid" error | Check `rules/ads.json` and `manifest.json` for typos or missing commas. |
| Counter always shows 0 | The counter only works for **unpacked** installs, and it resets on each page load. |
| Ads still appear | Some sites serve ads from their own domain. Add a selector in `content.js` or a rule in `rules/ads.json`. |
| Site is broken | Use **Allow ads on this site** and reload. |
| Changes not showing | Reload the extension at `opera://extensions`, then refresh the page. |
| Extension disappeared after restart | Opera may disable unpacked extensions. Re-enable it at `opera://extensions`. |

---

## 5. Project Structure

```
opera-adblocker/
├── manifest.json      Extension configuration
├── background.js      Toggle logic, allowlist, blocked counter
├── content.js         Hides ad containers on pages
├── popup.html / .js   The toolbar popup
├── rules/ads.json     List of blocked ad domains
├── icons/             Extension icons
├── HOW_TO_USE.md      This guide
└── README.md          Short overview
```

---

## 6. Limitations

- Blocks about 65 well-known ad networks, far fewer than full ad blockers like uBlock Origin.
- Cannot block ads served from the same domain as the content (for example, some video ads).
- Does not auto-update its blocklist. Edit `rules/ads.json` to add more.

Use it as a starter and extend it to fit your needs.
