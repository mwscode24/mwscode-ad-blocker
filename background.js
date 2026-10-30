// Per-tab blocked counter (stored in session storage because MV3 workers sleep)
const KEY = "blockedCounts";

async function getCounts() {
  const r = await chrome.storage.session.get(KEY);
  return r[KEY] || {};
}

async function bump(tabId) {
  if (tabId < 0) return;
  const counts = await getCounts();
  counts[tabId] = (counts[tabId] || 0) + 1;
  await chrome.storage.session.set({ [KEY]: counts });
  chrome.action.setBadgeBackgroundColor({ tabId, color: "#dc2626" });
  chrome.action.setBadgeText({ tabId, text: String(counts[tabId]) });
}

// Only fires for unpacked extensions (fine for developer-mode installs)
try {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
    bump(info.request.tabId);
  });
} catch (e) { /* ignore */ }

// Reset counter when a tab navigates
chrome.tabs.onUpdated.addListener(async (tabId, change) => {
  if (change.status === "loading" && change.url !== undefined) {
    const counts = await getCounts();
    delete counts[tabId];
    await chrome.storage.session.set({ [KEY]: counts });
    chrome.action.setBadgeText({ tabId, text: "" });
  }
});

// Messages from popup
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg.type === "setEnabled") {
      await chrome.storage.local.set({ enabled: msg.enabled });
      await chrome.declarativeNetRequest.updateEnabledRulesets(
        msg.enabled ? { enableRulesetIds: ["ads"] } : { disableRulesetIds: ["ads"] }
      );
    } else if (msg.type === "setSiteAllowed") {
      const { allowlist = [] } = await chrome.storage.local.get("allowlist");
      const set = new Set(allowlist);
      msg.allowed ? set.add(msg.host) : set.delete(msg.host);
      const list = [...set];
      await chrome.storage.local.set({ allowlist: list });
      await syncAllowRules(list);
    } else if (msg.type === "getCount") {
      const counts = await getCounts();
      sendResponse({ count: counts[msg.tabId] || 0 });
      return;
    }
    sendResponse({ ok: true });
  })();
  return true; // async response
});

// Allowlisted sites: higher-priority rule that allows all requests for that site
async function syncAllowRules(list) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const rules = list.map((host, i) => ({
    id: i + 1,
    priority: 100,
    action: { type: "allowAllRequests" },
    condition: { requestDomains: [host], resourceTypes: ["main_frame", "sub_frame"] }
  }));
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules: rules
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get("enabled");
  if (enabled === undefined) await chrome.storage.local.set({ enabled: true, allowlist: [] });
});
