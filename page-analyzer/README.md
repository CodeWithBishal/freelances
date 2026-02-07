# Page Analyzer Extension

A Chrome extension that captures page screenshots and analyzes them using multiple AI models to provide insights and answer questions.

## Features

- 🔷 **Multiple AI Support**: Gemini, Groq, Hugging Face, Together AI
- 📑 **Tabbed Interface**: View results from different AI models side-by-side
- 🎯 **Toggle Extension**: Enable/disable the extension as needed
- 🎨 **Clean UI**: Elegant sidebar with tabs for each AI provider
- 🚀 **Free APIs**: All supported APIs have free tiers available

## Supported AI Models

### 1. Gemini (Google AI)
- **Model**: `gemini-2.0-flash-exp`
- **Get API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Free Tier**: Generous free usage limit

### 2. Groq ⚡ (Fast & Free)
- **Model**: `llama-3.2-90b-vision-preview`
- **Get API Key**: [Groq Console](https://console.groq.com/keys)
- **Free Tier**: Fast inference with free credits

### 3. Hugging Face 🤗
- **Model**: `Salesforce/blip-image-captioning-large`
- **Get API Key**: [Hugging Face Tokens](https://huggingface.co/settings/tokens)
- **Free Tier**: Free inference API available

### 4. Together AI 🌐
- **Model**: `meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo`
- **Get API Key**: [Together AI](https://api.together.xyz/settings/api-keys)
- **Free Tier**: Free credits for new users

## Installation

1. **Clone or Download** this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the extension directory

## Configuration

1. Click the extension icon in Chrome toolbar
2. **Enable/Disable** the extension using the toggle switch
3. Enter API keys for the AI models you want to use:
   - You can use one or multiple APIs
   - The extension will query all configured APIs in parallel
4. Click **Save Configuration**
5. Reload your tabs for changes to take effect

## Usage

1. **Navigate** to any webpage (quiz, article, etc.)
2. The extension **automatically analyzes** the page after 2 seconds
3. A small **handle** appears on the right edge of the page
4. **Click the handle** to open the sidebar
5. View results in **different tabs** - one for each AI model
6. Click between tabs to compare results

## How It Works

1. **Screenshot**: Captures the visible page as a JPEG
2. **AI Analysis**: Sends the screenshot to configured AI APIs with the predefined prompt
3. **Results Display**: Shows responses in a tabbed sidebar interface
4. **Error Handling**: Each AI tab shows errors independently

## Customization

### Change the Analysis Prompt

Edit the `PREDEFINED_PROMPT` in [content.js](content.js:2):

```javascript
const PREDEFINED_PROMPT = "Your custom prompt here";
```

### Add More AI Providers

1. Add API key field in [popup.html](popup.html)
2. Update [popup.js](popup.js) to save the key
3. Add API call function in [background.js](background.js)
4. Update provider display name in [content.js](content.js)

## Troubleshooting

### Extension Not Working
- Check if extension is **enabled** in popup
- Verify at least one **API key is configured**
- Check browser console for errors (F12)

### No API Keys Configured
- Open extension popup
- Add at least one API key
- Save configuration

### Screenshot Failed
- Some pages (like `chrome://` pages) cannot be captured
- Try on regular web pages

### API Errors
- Verify your API keys are valid
- Check if you have remaining quota
- Some APIs may take longer to respond

## Privacy & Security

- API keys are stored locally in Chrome's storage
- Screenshots are sent directly to AI APIs (not stored)
- No data is sent to third-party servers except AI providers

## Files Structure

```
page-analyzer/
├── manifest.json          # Extension configuration
├── popup.html            # Settings UI
├── popup.js              # Settings logic
├── background.js         # Background service worker (API calls)
├── content.js            # Content script (UI & screenshot)
└── README.md            # This file
```

## License

MIT License - Feel free to modify and distribute

## Contributing

Contributions are welcome! Feel free to:
- Add more AI providers
- Improve the UI
- Fix bugs
- Add new features

---

**Note**: This extension is designed for educational purposes. Make sure to comply with the terms of service of each AI provider you use.
