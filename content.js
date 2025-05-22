let quickActionUI = null;
let currentSelection = null;
let isUIVisible = false;

initializeContentScript();

function initializeContentScript() {
  console.log("EasyLeetSpeak content script loaded");

  document.addEventListener("mouseup", handleTextSelection);
  document.addEventListener("keyup", handleTextSelection);
  document.addEventListener("click", handleDocumentClick);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content script received message:", message);
    handleMessage(message, sender, sendResponse);
    return true;
  });
}

function handleMessage(message, sender, sendResponse) {
  switch (message.action) {
    case "ping":
      console.log("Content script responding to ping");
      sendResponse({ success: true, ready: true });
      break;
    case "quickTranslate":
      handleQuickTranslate(message);
      sendResponse({ success: true });
      break;
    case "getSelection":
      const selection = window.getSelection().toString().trim();
      sendResponse({ text: selection });
      break;
    case "showQuickUI":
      if (currentSelection) {
        showQuickActionUI({ clientX: 0, clientY: 0 });
      }
      sendResponse({ success: true });
      break;
    default:
      console.log("Unknown action:", message.action);
      sendResponse({ success: false, error: "Unknown action" });
  }
}

function simpleEncode(text, format = "Basic") {
  const basicMap = {
    a: "4",
    e: "3",
    l: "1",
    s: "5",
    t: "7",
    o: "0",
    i: "1",
    b: "8",
    c: "(",
    d: "|)",
    f: "|=",
    g: "6",
    h: "|-|",
    j: ";",
    k: "|<",
    m: "|V|",
    n: "|\\|",
    p: "|*",
    q: "9",
    r: "|2",
    u: "|_|",
    v: "\\/",
    w: "\\/\\/",
    x: "><",
    y: "`/",
    z: "2",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => basicMap[char] || char)
    .join("");
}

function simpleDecode(text) {
  const decodeMap = {
    4: "a",
    3: "e",
    1: "l",
    5: "s",
    7: "t",
    0: "o",
    8: "b",
    "(": "c",
    "|)": "d",
    "|=": "f",
    6: "g",
    "|-|": "h",
    ";": "j",
    "|<": "k",
    "|V|": "m",
    "|\\|": "n",
    "|*": "p",
    9: "g",
    "|2": "r",
    "|_|": "u",
    "\\/": "v",
    "\\/\\/": "w",
    "><": "x",
    "`/": "y",
    2: "z",
  };

  let result = text;
  Object.keys(decodeMap)
    .sort((a, b) => b.length - a.length)
    .forEach((leet) => {
      result = result.replace(
        new RegExp(escapeRegex(leet), "g"),
        decodeMap[leet]
      );
    });

  return result;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isLeetText(text) {
  const leetChars = /[0-9@$#|+×†€£§Ø∂ƒИ¶¤√ω≥]/g;
  const leetMatches = text.match(leetChars);
  return leetMatches && leetMatches.length > text.length * 0.2;
}

function handleTextSelection(event) {
  setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText && selectedText.length > 1 && selection.rangeCount > 0) {
      try {
        currentSelection = {
          text: selectedText,
          range: selection.getRangeAt(0).cloneRange(),
          element: selection.anchorNode,
        };

        showQuickActionUI(event);
      } catch (error) {
        console.error("Error handling text selection:", error);
        currentSelection = null;
      }
    } else {
      hideQuickActionUI();
      currentSelection = null;
    }
  }, 100);
}

function handleDocumentClick(event) {
  if (quickActionUI && !quickActionUI.contains(event.target)) {
    hideQuickActionUI();
  }
}

function handleQuickTranslate(message) {
  const { type, text, format } = message;
  let result;

  if (type === "encode") {
    result = simpleEncode(text, format);
    showTranslationToast(result, "Encoded to Leet Speak");
  } else {
    result = simpleDecode(text);
    showTranslationToast(result, "Decoded from Leet Speak");
  }

  copyToClipboard(result);
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      console.log("Text copied via Clipboard API:", text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (success) {
        console.log("Text copied via execCommand:", text);
      } else {
        throw new Error("execCommand failed");
      }
    }
  } catch (err) {
    console.error("Failed to copy text:", err);
    throw err;
  }
}

function showTranslationToast(text, message, type = "success") {
  const existingToasts = document.querySelectorAll(".leet-toast");
  existingToasts.forEach((toast) => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  });

  const toast = document.createElement("div");
  toast.className = "leet-toast";
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#22c55e" : "#ef4444"};
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10002;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-width: 300px;
    word-wrap: break-word;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;

  const messageDiv = document.createElement("div");
  messageDiv.style.cssText =
    "font-size: 12px; opacity: 0.9; margin-bottom: 4px;";
  messageDiv.textContent = message;

  const textDiv = document.createElement("div");
  textDiv.style.cssText = "font-weight: 600;";
  textDiv.textContent = text.length > 50 ? text.substring(0, 50) + "..." : text;

  toast.appendChild(messageDiv);
  if (text) toast.appendChild(textDiv);

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function showQuickActionUI(event) {
  if (!currentSelection) return;

  hideQuickActionUI();

  quickActionUI = createQuickActionUI();
  document.body.appendChild(quickActionUI);

  const rect = currentSelection.range.getBoundingClientRect();

  let top = rect.bottom + window.scrollY + 10;
  let left = rect.left + window.scrollX;

  const uiWidth = 200;
  const uiHeight = 50;

  if (left + uiWidth > window.innerWidth) {
    left = window.innerWidth - uiWidth - 10;
  }
  if (left < 10) {
    left = 10;
  }

  if (top + uiHeight > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - uiHeight - 10;
  }

  quickActionUI.style.top = top + "px";
  quickActionUI.style.left = left + "px";

  isUIVisible = true;

  requestAnimationFrame(() => {
    quickActionUI.style.opacity = "1";
    quickActionUI.style.transform = "translateY(0) scale(1)";
  });
}

function hideQuickActionUI() {
  if (quickActionUI) {
    quickActionUI.style.opacity = "0";
    quickActionUI.style.transform = "translateY(-10px) scale(0.95)";

    setTimeout(() => {
      if (quickActionUI && quickActionUI.parentNode) {
        quickActionUI.parentNode.removeChild(quickActionUI);
      }
      quickActionUI = null;
      isUIVisible = false;
    }, 200);
  }
}

function createQuickActionUI() {
  const ui = document.createElement("div");
  ui.className = "leet-quick-actions";
  ui.style.cssText = `
    position: absolute;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
    transition: all 0.2s ease;
    display: flex;
    gap: 4px;
    max-width: 200px;
  `;

  const buttons = [
    { text: "→ Leet", action: "encode", title: "Encode to Leet Speak" },
    { text: "→ Text", action: "decode", title: "Decode from Leet Speak" },
  ];

  buttons.forEach((btn) => {
    const button = document.createElement("button");
    button.textContent = btn.text;
    button.title = btn.title;
    button.style.cssText = `
      background: #334155;
      color: #e2e8f0;
      border: 1px solid #475569;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex: 1;
    `;

    button.addEventListener("mouseenter", () => {
      button.style.background = "#475569";
      button.style.borderColor = "#64748b";
      button.style.transform = "translateY(-1px)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.background = "#334155";
      button.style.borderColor = "#475569";
      button.style.transform = "translateY(0)";
    });

    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleQuickAction(btn.action);
    });

    ui.appendChild(button);
  });

  return ui;
}

function handleQuickAction(action) {
  if (!currentSelection) {
    console.error("No current selection for quick action");
    return;
  }

  const selectedText = currentSelection.text;
  console.log("Handling quick action:", action, "for text:", selectedText);

  switch (action) {
    case "encode":
      const encoded = simpleEncode(selectedText);
      copyToClipboard(encoded)
        .then(() => {
          showTranslationToast(encoded, "Encoded to Leet Speak and copied");
        })
        .catch(() => {
          showTranslationToast("", "Failed to copy encoded text", "error");
        });
      break;

    case "decode":
      const decoded = simpleDecode(selectedText);
      copyToClipboard(decoded)
        .then(() => {
          showTranslationToast(decoded, "Decoded from Leet Speak and copied");
        })
        .catch(() => {
          showTranslationToast("", "Failed to copy decoded text", "error");
        });
      break;
  }

  hideQuickActionUI();
}

console.log("EasyLeetSpeak content script initialized and ready");
