# EasyLeetSpeak

### [Download From The Google Chrome Extension Store!](https://chromewebstore.google.com/detail/easyleetspeak/ejeeckeijcimcpikccilhcpdjjbkadee?authuser=0&hl=en-GB)

<img src="https://github.com/user-attachments/assets/f310de6b-fe34-4080-b08e-ebae2cf32b24" alt="Leet Speak Translator" width="500"/>

## Overview

EasyLeetSpeak is a streamlined browser extension that allows users to quickly encode and decode text in Leet Speak (also known as 1337 speak) through an intuitive popup interface, context menus, and quick action UI. The extension supports three levels of encoding: Basic, Intermediate, and Advanced.

## Features

### **Core Functionality**

- **Encode and Decode**: Convert regular text to Leet Speak and vice versa instantly
- **Multiple Formats**: Choose between Basic, Intermediate, and Advanced encoding styles
- **Smart Auto-Copy**: Translated text is automatically copied to clipboard

### **User Interface**

- **Context Menu Integration**: Right-click on selected text for quick encoding/decoding
- **Quick Action UI**: Floating buttons appear when text is selected for instant translation
- **Full Popup Translator**: Complete interface for extended text processing
- **Toast Notifications**: Visual feedback for all operations

### **Advanced Features**

- **Keyboard Shortcuts**: Quick access via keyboard commands
- **Smart URL Handling**: Works on all accessible websites with graceful fallbacks
- **Error Prevention**: Robust handling of restricted pages (chrome://, extension pages)
- **Format Persistence**: Remembers your preferred encoding format

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/atakantepe/easyleetspeak.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the cloned repository folder.

## Usage

### **Quick Translation (Recommended)**

1. **Select text** on any webpage
2. **Right-click** and choose from LeetSpeak Tools menu:
   - 🔤 Encode to Leet Speak
   - 📝 Decode from Leet Speak
3. Result is automatically copied to clipboard with visual confirmation

### **Quick Action UI**

1. **Select text** on any webpage
2. **Floating buttons** appear automatically
3. Click **"→ Leet"** to encode or **"→ Text"** to decode
4. Result is automatically copied with toast notification

### **Full Translator**

1. Click the extension icon in the browser toolbar
2. Enter text in the input field and select desired format
3. Click "Encode" or "Decode" or use the "Reset" button to clear fields

### **Format Settings**

- Access via context menu → ⚙️ Format Settings
- Choose between Basic, Intermediate, or Advanced encoding
- Settings are automatically saved and persistent

## Technical Improvements

### **Enhanced Reliability**

- **Smart Error Handling**: Extension gracefully handles restricted pages
- **URL Validation**: Prevents injection errors on chrome:// and extension pages
- **Fallback System**: Automatically opens popup when content scripts can't run

### **Performance Optimizations**

- **Code Cleanup**: Removed unused features for better performance
- **Streamlined Architecture**: Focused on core translation functionality
- **Efficient Script Injection**: Only loads when needed with proper validation

## Permissions

The extension requires the following permissions:

- `contextMenus`: Create context menu items for encoding and decoding
- `activeTab`: Access the currently active tab for text selection
- `scripting`: Execute content scripts for quick actions and UI
- `storage`: Store user preferences and format settings
- `notifications`: Display feedback notifications to users

## Browser Compatibility

- **Supported**: All HTTP/HTTPS websites
- **Restricted**: Chrome internal pages (settings, extensions, etc.) - falls back to popup
- **Fallback**: Automatic popup opening when content scripts can't be injected

## Development

### **Architecture**

- **background.js**: Service worker handling context menus and script injection
- **content.js**: Content script for text selection and quick UI
- **popup.html/js**: Full translator interface
- **leetSpeakTranslator.js**: Core encoding/decoding logic

### **Key Components**

- Context menu system with format settings
- Text selection handling with floating UI
- Clipboard integration with notifications
- URL validation and error handling

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

### **Development Setup**

1. Fork the repository
2. Make your changes
3. Test on various website types (regular sites, restricted pages)
4. Ensure proper error handling and user feedback
5. Submit a pull request

## Version History

### **Latest Version**

- ✅ Improved error handling for restricted pages
- ✅ Streamlined codebase with removed unused features
- ✅ Enhanced user experience with better notifications
- ✅ Robust URL validation system
- ✅ Optimized performance and reliability
