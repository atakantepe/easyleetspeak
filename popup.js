import {
  leetSpeakEncode,
  leetSpeakDecode,
  leetSpeakDecodeSimple,
} from "./leetSpeakTranslator.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const translatedText = document.getElementById("translatedText");
  const formatSelect = document.getElementById("format");
  const resetBtn = document.getElementById("resetBtn");
  const encodeBtn = document.getElementById("encodeBtn");
  const decodeBtn = document.getElementById("decodeBtn");

  const confidenceContainer = createConfidenceDisplay();
  const alternativesContainer = createAlternativesDisplay();
  const copyContainer = createCopyContainer();
  const toastContainer = createToastContainer();

  translatedText.parentNode.insertBefore(
    copyContainer,
    translatedText.nextSibling
  );
  translatedText.parentNode.insertBefore(
    confidenceContainer,
    copyContainer.nextSibling
  );
  translatedText.parentNode.insertBefore(
    alternativesContainer,
    confidenceContainer.nextSibling
  );
  document.body.appendChild(toastContainer);

  chrome.storage.local.get(["type", "text", "format"], (data) => {
    if (data.text) {
      inputText.value = data.text;
    }
    if (data.format) {
      formatSelect.value = data.format;
    }
    if (data.type === "encode") {
      encodeText();
    } else if (data.type === "decode") {
      decodeText();
    }
  });

  encodeBtn.addEventListener("click", encodeText);
  decodeBtn.addEventListener("click", decodeText);
  resetBtn.addEventListener("click", resetFields);
  formatSelect.addEventListener("change", saveFormat);
  document.addEventListener("keydown", handleKeyboardShortcuts);
  translatedText.addEventListener("focus", handleOutputFocus);
  translatedText.addEventListener("blur", handleOutputBlur);

  function handleOutputFocus() {
    translatedText.addEventListener("keydown", handleOutputKeyboard);
    setTimeout(() => {
      if (translatedText.value.trim()) {
        translatedText.select();
      }
    }, 10);
  }

  function handleOutputBlur() {
    translatedText.removeEventListener("keydown", handleOutputKeyboard);
  }

  function createCopyContainer() {
    const container = document.createElement("div");
    container.id = "copyContainer";
    container.style.cssText = `
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      margin: 5px 0;
      padding: 0;
    `;

    const copyBtn = document.createElement("button");
    copyBtn.id = "copyBtn";
    copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
    copyBtn.style.cssText = `
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #22d3ee;
      background-color: #22d3ee;
      color: #020617;
      cursor: pointer;
      font-size: 0.85em;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    `;

    copyBtn.addEventListener("mouseenter", () => {
      copyBtn.style.backgroundColor = "#67e8f9";
      copyBtn.style.transform = "translateY(-1px)";
    });

    copyBtn.addEventListener("mouseleave", () => {
      copyBtn.style.backgroundColor = "#22d3ee";
      copyBtn.style.transform = "translateY(0)";
    });

    copyBtn.addEventListener("click", copyToClipboard);

    const shortcutHint = document.createElement("span");
    shortcutHint.textContent = "Ctrl+C";
    shortcutHint.style.cssText = `
      font-size: 0.75em;
      color: #94a3b8;
      background-color: #334155;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    `;

    container.appendChild(copyBtn);
    container.appendChild(shortcutHint);

    return container;
  }

  function createToastContainer() {
    const container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    return container;
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.style.cssText = `
      background-color: ${type === "success" ? "#22c55e" : "#ef4444"};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 0.9em;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      margin-bottom: 8px;
      transform: translateX(100%);
      transition: all 0.3s ease;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 200px;
    `;

    const icon = document.createElement("i");
    icon.className =
      type === "success"
        ? "fa-solid fa-check-circle"
        : "fa-solid fa-exclamation-circle";

    const text = document.createElement("span");
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);

    const toastContainer = document.getElementById("toastContainer");
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  async function copyToClipboard() {
    const textToCopy = translatedText.value.trim();

    if (!textToCopy) {
      showToast("No text to copy!", "error");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        showToast("Text copied to clipboard!");

        const copyBtn = document.getElementById("copyBtn");
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        copyBtn.style.backgroundColor = "#22c55e";

        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.style.backgroundColor = "#22d3ee";
        }, 1500);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        if (document.execCommand("copy")) {
          showToast("Text copied to clipboard!");
        } else {
          throw new Error("Copy command failed");
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showToast("Failed to copy text", "error");
    }
  }

  function handleKeyboardShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case "c":
          const selection = window.getSelection().toString();
          if (
            !selection &&
            translatedText.value.trim() &&
            (document.activeElement === translatedText ||
              document.activeElement === document.body)
          ) {
            event.preventDefault();
            copyToClipboard();
          }
          break;
        case "enter":
          event.preventDefault();
          if (event.shiftKey) {
            decodeText();
          } else {
            encodeText();
          }
          break;
        case "r":
          if (event.shiftKey) {
            event.preventDefault();
            resetFields();
          }
          break;
      }
    }
  }

  function handleOutputKeyboard(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
      event.preventDefault();
      copyToClipboard();
    }
  }

  function createConfidenceDisplay() {
    const container = document.createElement("div");
    container.id = "confidenceContainer";
    container.style.cssText = `
      display: none;
      margin: 5px 0;
      padding: 8px;
      border-radius: 5px;
      background-color: #1e293b;
      border: 1px solid #334155;
    `;

    const label = document.createElement("span");
    label.textContent = "Confidence: ";
    label.style.cssText = "color: #94a3b8; font-size: 0.9em;";

    const bar = document.createElement("div");
    bar.style.cssText = `
      display: inline-block;
      width: 100px;
      height: 8px;
      background-color: #334155;
      border-radius: 4px;
      margin: 0 8px;
      position: relative;
      vertical-align: middle;
    `;

    const fill = document.createElement("div");
    fill.id = "confidenceFill";
    fill.style.cssText = `
      height: 100%;
      border-radius: 4px;
      transition: all 0.3s ease;
      width: 0%;
    `;
    bar.appendChild(fill);

    const percentage = document.createElement("span");
    percentage.id = "confidencePercentage";
    percentage.style.cssText =
      "color: #e2e8f0; font-weight: bold; font-size: 0.9em;";

    container.appendChild(label);
    container.appendChild(bar);
    container.appendChild(percentage);

    return container;
  }

  function createAlternativesDisplay() {
    const container = document.createElement("div");
    container.id = "alternativesContainer";
    container.style.cssText = `
      display: none;
      margin: 5px 0;
      max-height: 120px;
      overflow-y: auto;
    `;

    const title = document.createElement("div");
    title.textContent = "Alternative interpretations:";
    title.style.cssText = `
      color: #94a3b8;
      font-size: 0.85em;
      margin-bottom: 5px;
      font-weight: 500;
    `;
    container.appendChild(title);

    const alternativesList = document.createElement("div");
    alternativesList.id = "alternativesList";
    container.appendChild(alternativesList);

    return container;
  }

  function updateConfidenceDisplay(confidence) {
    const container = document.getElementById("confidenceContainer");
    const fill = document.getElementById("confidenceFill");
    const percentage = document.getElementById("confidencePercentage");

    if (confidence !== undefined) {
      container.style.display = "block";
      fill.style.width = confidence + "%";
      percentage.textContent = confidence + "%";

      if (confidence >= 80) {
        fill.style.backgroundColor = "#22c55e";
      } else if (confidence >= 60) {
        fill.style.backgroundColor = "#eab308";
      } else if (confidence >= 40) {
        fill.style.backgroundColor = "#f97316";
      } else {
        fill.style.backgroundColor = "#ef4444";
      }
    } else {
      container.style.display = "none";
    }
  }

  function updateAlternativesDisplay(alternatives) {
    const container = document.getElementById("alternativesContainer");
    const list = document.getElementById("alternativesList");

    if (alternatives && alternatives.length > 0) {
      container.style.display = "block";
      list.innerHTML = "";

      alternatives.forEach((alt, index) => {
        if (index < 3) {
          const altDiv = document.createElement("div");
          altDiv.style.cssText = `
            padding: 4px 8px;
            margin: 2px 0;
            background-color: #334155;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            position: relative;
          `;

          altDiv.innerHTML = `
            <span style="color: #e2e8f0; font-size: 0.9em;">${alt.text}</span>
            <span style="color: #94a3b8; font-size: 0.8em; float: right;">${alt.confidence}%</span>
            <button class="alt-copy-btn" style="
              position: absolute;
              right: 45px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              color: #94a3b8;
              cursor: pointer;
              padding: 2px 4px;
              border-radius: 2px;
              font-size: 0.7em;
              opacity: 0;
              transition: all 0.2s ease;
            "><i class="fa-solid fa-copy"></i></button>
          `;

          altDiv.addEventListener("mouseenter", () => {
            altDiv.style.backgroundColor = "#475569";
            altDiv.style.borderColor = "#64748b";
            const copyBtn = altDiv.querySelector(".alt-copy-btn");
            copyBtn.style.opacity = "1";
          });

          altDiv.addEventListener("mouseleave", () => {
            altDiv.style.backgroundColor = "#334155";
            altDiv.style.borderColor = "transparent";
            const copyBtn = altDiv.querySelector(".alt-copy-btn");
            copyBtn.style.opacity = "0";
          });

          altDiv.addEventListener("click", (e) => {
            if (!e.target.closest(".alt-copy-btn")) {
              translatedText.value = alt.text;
              updateConfidenceDisplay(alt.confidence);
              container.style.display = "none";
            }
          });

          const copyBtn = altDiv.querySelector(".alt-copy-btn");
          copyBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            try {
              if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(alt.text);
                showToast("Alternative text copied!");
              }
            } catch (err) {
              console.error("Failed to copy alternative text: ", err);
              showToast("Failed to copy text", "error");
            }
          });

          list.appendChild(altDiv);
        }
      });
    } else {
      container.style.display = "none";
    }
  }

  function encodeText() {
    const format = formatSelect.value;
    const encoded = leetSpeakEncode(inputText.value, format);
    translatedText.value = encoded;
    updateConfidenceDisplay();
    updateAlternativesDisplay();
  }

  function decodeText() {
    const result = leetSpeakDecode(inputText.value);
    if (typeof result === "string") {
      translatedText.value = result;
      updateConfidenceDisplay();
      updateAlternativesDisplay();
    } else {
      translatedText.value = result.text;
      updateConfidenceDisplay(result.confidence);
      updateAlternativesDisplay(result.alternatives);
    }
  }

  function resetFields() {
    inputText.value = "";
    translatedText.value = "";
    updateConfidenceDisplay();
    updateAlternativesDisplay();
    chrome.storage.local.remove(["type", "text"]);
  }

  function saveFormat() {
    chrome.storage.local.set({ format: formatSelect.value });
  }

  const addTooltips = () => {
    const confidenceContainer = document.getElementById("confidenceContainer");
    if (confidenceContainer) {
      confidenceContainer.title =
        "Confidence score based on English language patterns, common words, and letter frequency analysis";
    }

    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
      copyBtn.title = "Copy translated text to clipboard (Ctrl+C)";
    }
  };

  setTimeout(addTooltips, 100);
});
