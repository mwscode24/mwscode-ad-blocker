// Cosmetic filtering: hides leftover ad containers
(async () => {
  const host = location.hostname;
  let enabled = true, allowlist = [];
  try {
    const s = await chrome.storage.local.get(["enabled", "allowlist"]);
    if (s.enabled === false) return;
    allowlist = s.allowlist || [];
  } catch (e) { return; }
  if (allowlist.some((h) => host === h || host.endsWith("." + h))) return;

  const selectors = [
    'ins.adsbygoogle', '[id^="google_ads"]', '[id^="div-gpt-ad"]',
    'iframe[src*="doubleclick.net"]', 'iframe[src*="googlesyndication.com"]',
    'iframe[id^="google_ads_iframe"]', 'iframe[src*="adnxs.com"]',
    '.ad-banner', '.ad-container', '.ad-wrapper', '.ad-slot', '.ad-unit',
    '.advert', '.advertisement', '.adsbox', '.ad_box', '.banner-ad',
    '.sponsored-ad', '.sponsored-content', '.google-ad', '.GoogleActiveViewElement',
    '[class*="taboola"]', '[id*="taboola"]', '[class*="outbrain"]', '[id*="outbrain"]',
    '[data-ad-slot]', '[data-ad-client]', '[aria-label="Advertisement"]',
    '[data-testid="adContainer"]', 'amp-ad', 'amp-embed[type="taboola"]'
  ];

  const style = document.createElement("style");
  style.id = "simple-adblocker-style";
  style.textContent = selectors.join(",\n") + " { display: none !important; }";
  (document.head || document.documentElement).appendChild(style);

  // Re-attach if a page wipes <head>
  new MutationObserver(() => {
    if (!document.getElementById("simple-adblocker-style")) {
      (document.head || document.documentElement).appendChild(style);
    }
  }).observe(document.documentElement, { childList: true });
})();
