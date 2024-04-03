"use strict";

const elements = {
  get profile() {
    return document.getElementById("profile");
  },
  get aws_access_key_id() {
    return document.getElementById("aws_access_key_id");
  },
  get aws_secret_access_key() {
    return document.getElementById("aws_secret_access_key");
  },
  get aws_session_token() {
    return document.getElementById("aws_session_token");
  },
};

function extractDomain(url) {
  const domainPattern =
    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im;
  const matches = url.match(domainPattern);
  return matches && matches[1];
}

function submit(event) {
  event.preventDefault();

  // Load the current tab's URL
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab.url) return;

    const tabDomain = extractDomain(currentTab.url);

    // Save the user preference for this specific URL
    const preference = {};
    preference[tabDomain] = {
      profile: elements.profile.value,
      aws_access_key_id: elements.aws_access_key_id.value,
      aws_secret_access_key: elements.aws_secret_access_key.value,
      aws_session_token: elements.aws_session_token.value,
    };
    save(preference);

    syncCredentials(currentTab.id);
  });

  window.close();
}

function save(preference) {
  chrome.storage.sync.set(preference, () => {
    if (chrome.runtime.error) {
      console.error("Error saving preference");
    } else {
      console.log("Preference saved");
    }
  });
}

function syncCredentials(tabId, payload) {
  chrome.tabs.sendMessage(tabId, {
    ...payload,
    type: "sync-credentials",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Load the current tab's URL
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab.url) return;

    const tabDomain = extractDomain(tabs[0].url);

    // Retrieve user preferences for this specific URL
    chrome.storage.sync.get([tabDomain], (preference) => {
      if (chrome.runtime.error) {
        console.error("Error retrieving user preference");
      } else {
        // Initialize form with current preference
        const {
          profile,
          aws_access_key_id,
          aws_secret_access_key,
          aws_session_token,
        } = preference[tabDomain] || {};
        elements.profile.value = profile || "";
        elements.aws_access_key_id.value = aws_access_key_id || "";
        elements.aws_secret_access_key.value = aws_secret_access_key || "";
        elements.aws_session_token.value = aws_session_token || "";
      }
    });
  });

  document
    .getElementById("preferences-form")
    .addEventListener("submit", submit);
});
