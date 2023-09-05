const script = document.createElement("script");
script.src = chrome.runtime.getURL("scripts/web-content.js");
document.body.appendChild(script);
script.onload = script.parentNode.removeChild(script);

async function onSyncCredentials(payload, sender, sendResponse) {
  const { type } = payload;
  if (type === "sync-credentials") {
    const tabDomain = window.location.host;

    chrome.storage.sync.get([tabDomain], (preference) => {
      const { aws_access_key_id, aws_secret_access_key, aws_session_token } =
        preference[tabDomain] || {};

      const eventData = {
        aws_access_key_id,
        aws_secret_access_key,
        aws_session_token,
      };

      document.dispatchEvent(
        new CustomEvent("sync-credentials", { detail: eventData })
      );
    });
  }
}

async function onSetCredentials(event) {
  chrome.runtime.sendMessage({
    type: "set-credentials",
    body: { browser: event.detail },
  });
}

document.addEventListener("set-credentials", onSetCredentials);

chrome.runtime.onMessage.addListener(onSyncCredentials);
