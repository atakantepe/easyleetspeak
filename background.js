chrome.runtime.onInstalled.addListener(() => {
  console.log("EasyLeetSpeak extension installed");

  chrome.contextMenus.create({
    id: "leetspeak-main",
    title: "LeetSpeak Tools",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "quick-encode",
    parentId: "leetspeak-main",
    title: "🔤 Encode to Leet Speak",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "quick-decode",
    parentId: "leetspeak-main",
    title: "📝 Decode from Leet Speak",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "separator1",
    parentId: "leetspeak-main",
    type: "separator",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "format-submenu",
    parentId: "leetspeak-main",
    title: "⚙️ Format Settings",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "format-basic",
    parentId: "format-submenu",
    title: "Basic",
    type: "radio",
    contexts: ["selection"],
    checked: true,
  });

  chrome.contextMenus.create({
    id: "format-intermediate",
    parentId: "format-submenu",
    title: "Intermediate",
    type: "radio",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "format-advanced",
    parentId: "format-submenu",
    title: "Advanced",
    type: "radio",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "separator2",
    parentId: "leetspeak-main",
    type: "separator",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "open-translator",
    parentId: "leetspeak-main",
    title: "🚀 Open Full Translator",
    contexts: ["selection"],
  });

  chrome.storage.local.get(["format"], (data) => {
    const format = data.format || "Basic";
    updateFormatMenus(format);
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("Context menu clicked:", info.menuItemId);

  const selectedText = info.selectionText || "";

  const data = await chrome.storage.local.get(["format"]);
  const format = data.format || "Basic";

  switch (info.menuItemId) {
    case "quick-encode":
      await handleQuickTranslation(tab.id, "encode", selectedText, format);
      break;

    case "quick-decode":
      await handleQuickTranslation(tab.id, "decode", selectedText, format);
      break;

    case "format-basic":
    case "format-intermediate":
    case "format-advanced":
      const newFormat = info.menuItemId.replace("format-", "");
      await updateFormat(
        newFormat.charAt(0).toUpperCase() + newFormat.slice(1)
      );
      break;

    case "open-translator":
      await openFullTranslator(selectedText, format);
      break;
  }
});

async function ensureContentScript(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!isAccessibleUrl(tab.url)) {
      console.log("Cannot access restricted URL:", tab.url);
      return false;
    }
  } catch (error) {
    console.error("Failed to get tab info:", error);
    return false;
  }

  try {
    console.log("Checking if content script is ready...");
    const response = await Promise.race([
      chrome.tabs.sendMessage(tabId, { action: "ping" }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 1000)
      ),
    ]);
    console.log("Content script is ready:", response);
    return true;
  } catch (error) {
    console.log("Content script not ready, injecting...", error.message);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"],
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Content script injected successfully");
      return true;
    } catch (injectError) {
      console.error("Failed to inject content script:", injectError);
      return false;
    }
  }
}

function isAccessibleUrl(url) {
  if (!url) return false;

  const restrictedProtocols = [
    "chrome://",
    "chrome-extension://",
    "chrome-devtools://",
    "moz-extension://",
    "about:",
    "edge://",
    "opera://",
  ];

  const restrictedUrls = [
    "chrome://newtab/",
    "chrome://settings/",
    "chrome://extensions/",
    "chrome://history/",
    "chrome://downloads/",
    "chrome://bookmarks/",
    "about:blank",
  ];

  for (const protocol of restrictedProtocols) {
    if (url.startsWith(protocol)) {
      return false;
    }
  }

  for (const restrictedUrl of restrictedUrls) {
    if (url.startsWith(restrictedUrl)) {
      return false;
    }
  }

  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("file://")
  );
}

async function handleQuickTranslation(tabId, action, text, format) {
  console.log(`Handling quick translation: ${action} for text: "${text}"`);

  const scriptReady = await ensureContentScript(tabId);
  if (!scriptReady) {
    console.error("Content script not available, opening popup as fallback");
    await openFullTranslator(text, format, action);
    return;
  }

  try {
    await chrome.tabs.sendMessage(tabId, {
      action: "quickTranslate",
      type: action,
      text: text,
      format: format,
    });
    console.log("Quick translation message sent successfully");
  } catch (error) {
    console.error("Failed to send quick translation message:", error);
    await openFullTranslator(text, format, action);
  }
}

async function updateFormat(format) {
  await chrome.storage.local.set({ format });
  updateFormatMenus(format);

  try {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "LeetSpeak Format Updated",
      message: `Format changed to ${format}`,
    });
  } catch (error) {
    console.log("Notification not available");
  }
}

function updateFormatMenus(format) {
  try {
    chrome.contextMenus.update("format-basic", { checked: format === "Basic" });
    chrome.contextMenus.update("format-intermediate", {
      checked: format === "Intermediate",
    });
    chrome.contextMenus.update("format-advanced", {
      checked: format === "Advanced",
    });
  } catch (error) {
    console.log("Failed to update format menus:", error);
  }
}

async function openFullTranslator(text, format, action = null) {
  console.log(
    `Opening full translator with text: "${text}", format: ${format}, action: ${action}`
  );

  await chrome.storage.local.set({
    text: text,
    format: format,
    type: action || (isLeetText(text) ? "decode" : "encode"),
  });

  try {
    await chrome.action.openPopup();
    console.log("Popup opened successfully");
  } catch (error) {
    console.error("Failed to open popup:", error);
  }
}

function isLeetText(text) {
  const leetChars = /[0-9@$#|+×†€£§Ø∂ƒИ¶¤√ω≥]/g;
  const leetMatches = text.match(leetChars);
  return leetMatches && leetMatches.length > text.length * 0.2;
}

chrome.commands.onCommand.addListener(async (command) => {
  console.log("Keyboard shortcut activated:", command);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  switch (command) {
    case "quick-translate":
      const scriptReady = await ensureContentScript(tab.id);
      if (scriptReady) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: "showQuickUI" });
        } catch (error) {
          console.error("Failed to show quick UI:", error);
        }
      }
      break;
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log("Extension icon clicked");

  const scriptReady = await ensureContentScript(tab.id);
  if (scriptReady) {
    try {
      const result = await chrome.tabs.sendMessage(tab.id, {
        action: "getSelection",
      });
      if (result && result.text) {
        await openFullTranslator(result.text, "Basic");
      } else {
        await chrome.action.openPopup();
      }
    } catch (error) {
      console.error("Failed to get selection:", error);
      await chrome.action.openPopup();
    }
  } else {
    await chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  switch (message.action) {
    case "openPopup":
      chrome.action.openPopup();
      break;

    case "updateFormat":
      updateFormat(message.format);
      break;

    case "showNotification":
      try {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: message.title || "LeetSpeak",
          message: message.message,
        });
      } catch (error) {
        console.log("Notification not available");
      }
      break;
  }
});

console.log("EasyLeetSpeak background script loaded");
