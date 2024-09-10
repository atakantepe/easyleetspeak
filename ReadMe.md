# EasyLeetSpeak

### Coming Soon to the Google Chrome Extension Store!
<img src="https://github.com/user-attachments/assets/f310de6b-fe34-4080-b08e-ebae2cf32b24" alt="Leet Speak Translator" width="500"/>


## Overview
EasyLeetSpeak is a browser extension that allows users to encode and decode text in Leet Speak (also known as 1337 speak) through a user-friendly popup interface or context menu. The extension supports three levels of encoding: Basic, Intermediate, and Advanced.

## Features
- **Encode and Decode**: Convert regular text to Leet Speak and vice versa.
- **Multiple Formats**: Choose between Basic, Intermediate, and Advanced encoding styles.
- **Context Menu Integration**: Easily encode or decode selected text from any webpage.
- **Reset Functionality**: Clear input and output fields with a single button.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/atakantepe/easyleetspeak.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the cloned repository folder.

## Usage
1. Click the extension icon in the browser toolbar to open the popup.
2. Enter text in the input field and select the desired encoding format.
3. Click "Encode" to convert the text or "Decode" to revert it back.
4. Use the "Reset" button to clear the fields.

## Permissions
The extension requires the following permissions:
- `contextMenus`: To create context menu items for encoding and decoding.
- `activeTab`: To access the currently active tab.
- `scripting`: To execute scripts in the context of the active tab.
- `storage`: To store user preferences and data.

## Development
- The extension is built using HTML, CSS, and JavaScript.
- The encoding and decoding logic is implemented in `leetSpeakTranslator.js`.
- The popup interface is defined in `popup.html`.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

