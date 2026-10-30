const $ = (id) => document.getElementById(id);

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let host = "";
  try { host = new URL(tab.url).hostname; } catch (e) {}

  const { enabled = true, allowlist = [] } = await chrome.storage.local.get(["enabled", "allowlist"]);
  $("enabled").checked = enabled;
  $("host").textContent = host || "N/A";
  $("site").checked = allowlist.includes(host);
  $("site").disabled = !host;

  chrome.runtime.sendMessage({ type: "getCount", tabId: tab.id }, (r) => {
    $("count").textContent = r?.count ?? 0;
  });

  $("enabled").addEventListener("change", (e) =>
    chrome.runtime.sendMessage({ type: "setEnabled", enabled: e.target.checked }));

  $("site").addEventListener("change", (e) =>
    chrome.runtime.sendMessage({ type: "setSiteAllowed", host, allowed: e.target.checked }));

  $("reload").addEventListener("click", () => { chrome.tabs.reload(tab.id); window.close(); });
})();
