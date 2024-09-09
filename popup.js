import { leetSpeakEncode, leetSpeakDecode } from "./leetSpeakTranslator.js";

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve stored data
  chrome.storage.local.get(["type", "text"], (data) => {
    if (data.text) {
      document.getElementById("inputText").value = data.text;
    }
    if (data.type === "encode") {
      encodeText();
    } else if (data.type === "decode") {
      decodeText();
    }
  });

  document.getElementById("encodeBtn").addEventListener("click", encodeText);
  document.getElementById("decodeBtn").addEventListener("click", decodeText);
});

function encodeText() {
  const inputText = document.getElementById("inputText").value;

  const format = document.getElementById("format").value;
  console.log(format);
  const translatedText = leetSpeakEncode(inputText, format);
  document.getElementById("output").innerText = `Encoded Text:`;
  document.getElementById("translatedText").value = translatedText;
}

function decodeText() {
  const inputText = document.getElementById("inputText").value;
  const translatedText = leetSpeakDecode(inputText);
  document.getElementById("output").innerText = `Decoded Text:`;
  document.getElementById("translatedText").value = translatedText;
}
