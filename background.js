chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "encode",
    title: "Encode to Leet Speak",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "decode",
    title: "Decode from Leet Speak",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "encode") {
    const selectedText = info.selectionText;
    chrome.storage.local.set({ type: "encode", text: selectedText });
    chrome.action.openPopup();
  } else if (info.menuItemId === "decode") {
    const selectedText = info.selectionText;
    chrome.storage.local.set({ type: "decode", text: selectedText });
    chrome.action.openPopup();
  }
});
