// Inject web-content.js into web document. This allows access
// to window object.
const script = document.createElement("script");
script.src = chrome.runtime.getURL("scripts/web-content.js");
document.body.appendChild(script);
script.onload = script.parentNode.removeChild(script);

// Listen to messages from popup.js
async function onSyncCredentials(payload, sender, sendResponse) {
  const { type } = payload;
  if (type === "sync-credentials") {
    const tabDomain = window.location.host;

    chrome.storage.sync.get([tabDomain], (preference) => {
      const {
        profile,
        aws_access_key_id,
        aws_secret_access_key,
        aws_session_token,
      } = preference[tabDomain] || {};

      const eventData = {
        profile,
        aws_access_key_id,
        aws_secret_access_key,
        aws_session_token,
      };

      // Dispatch event to web-content
      document.dispatchEvent(
        new CustomEvent("sync-credentials", { detail: eventData })
      );
    });
  }
}

chrome.runtime.onMessage.addListener(onSyncCredentials);
