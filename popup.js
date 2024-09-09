import { leetSpeakEncode, leetSpeakDecode } from "./leetSpeakTranslator.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const translatedText = document.getElementById("translatedText");
  const formatSelect = document.getElementById("format");
  const resetBtn = document.getElementById("resetBtn");

  // Retrieve stored data
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

  document.getElementById("encodeBtn").addEventListener("click", encodeText);
  document.getElementById("decodeBtn").addEventListener("click", decodeText);
  resetBtn.addEventListener("click", resetFields);
  formatSelect.addEventListener("change", saveFormat);

  function encodeText() {
    const format = formatSelect.value;
    const encoded = leetSpeakEncode(inputText.value, format);
    translatedText.value = encoded;
  }

  function decodeText() {
    const decoded = leetSpeakDecode(inputText.value);
    translatedText.value = decoded;
  }

  function resetFields() {
    inputText.value = "";
    translatedText.value = "";
    chrome.storage.local.remove(["type", "text"]);
  }

  function saveFormat() {
    chrome.storage.local.set({ format: formatSelect.value });
  }
});
