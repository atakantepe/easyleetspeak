chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "translate") {
    const selectedText = window.getSelection().toString();
    const translatedText = leetSpeakEncode(selectedText, message.format);

    chrome.storage.local.set({ translatedText });
    chrome.action.openPopup();
  }
});

function translateLeetSpeak(text, format) {
  const leetDictionary = {
    a: ["4", "@", "/-\\"],
    e: ["3", "€", "[-"],
    l: ["1", "|", "£"],
    s: ["5", "$", "§"],
    t: ["7", "+", "†"],
    o: ["0", "()", "Ø"],
    i: ["1", "!", "|"],
    b: ["8", "|3", "ß"],
  };

  let leetText = text.toLowerCase();
  for (const [key, value] of Object.entries(leetDictionary)) {
    let replacement = value[0]; // Default to Basic
    if (format === "Intermediate") replacement = value[1];
    else if (format === "Advanced") replacement = value[2];

    const regex = new RegExp(key, "g");
    leetText = leetText.replace(regex, replacement);
  }

  return leetText;
}
