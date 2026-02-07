# Quick Start Guide

## Setup (First Time)

1. **Install the extension**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `page-analyzer` folder

2. **Configure API Keys**
   - Click the extension icon in Chrome toolbar
   - You'll see a settings popup with:
     - ✅ Extension Enable/Disable toggle
     - 🔷 Gemini API key field
     - ⚡ Groq API key field (Fast & Free!)
     - 🤗 Hugging Face API key field
     - 🌐 Together AI key field
   
3. **Get Free API Keys**
   
   **Groq (Recommended - Very Fast & Free)**
   - Visit: https://console.groq.com/keys
   - Sign up and create an API key
   - Copy and paste into Groq field
   
   **Gemini**
   - Visit: https://aistudio.google.com/app/apikey
   - Create API key
   - Paste into Gemini field
   
   **Hugging Face**
   - Visit: https://huggingface.co/settings/tokens
   - Create a new token
   - Paste into HuggingFace field
   
   **Together AI**
   - Visit: https://api.together.xyz/settings/api-keys
   - Create API key
   - Paste into Together AI field

4. **Save Configuration**
   - Click "Save Configuration" button
   - You'll see a success message
   - Reload your tabs

## Using the Extension

### Visual Flow:

```
1. Navigate to any webpage
   ↓
2. Wait 2 seconds (auto-analysis)
   ↓
3. Small handle appears on right edge → [▶]
   ↓
4. Click handle to open sidebar
   ↓
5. Sidebar opens with tabs:
   ┌─────────────────────────────┐
   │ 🔷 Gemini | ⚡ Groq | 🤗 HF │ ← Click tabs to switch
   ├─────────────────────────────┤
   │                             │
   │  AI Response appears here   │
   │                             │
   │  Each tab shows results     │
   │  from different AI model    │
   │                             │
   └─────────────────────────────┘
```

### Interface Elements:

- **Toggle Handle**: Small arrow on right edge of page
  - Click to open/close sidebar
  - Shows loading animation while processing

- **Sidebar Header**: 
  - Title: "AI Analyzer"
  - Close button (×)
  - Click anywhere on header to close

- **Tabs**:
  - 🔷 Gemini - Google's AI
  - ⚡ Groq - Lightning fast responses
  - 🤗 HuggingFace - Open source models
  - 🌐 Together AI - Community models
  
- **Tab States**:
  - Blue = Active/Selected
  - Red = Error occurred
  - Gray = Loading
  - Normal = Ready/Success

### Tips:

✅ **Use multiple APIs** - Compare results across different AI models
✅ **Enable only needed ones** - Save API quota by configuring only the APIs you want
✅ **Groq is fastest** - If speed matters, Groq typically responds quickest
✅ **Toggle extension** - Disable when not needed to save resources

### Example Use Cases:

1. **Quiz Helper**
   - Open quiz page
   - Extension captures and analyzes
   - View answers from multiple AIs
   - Compare for accuracy

2. **Document Analysis**
   - Open any document/article
   - Get AI insights
   - Compare interpretations

3. **Form Assistance**
   - Capture complex forms
   - Get AI suggestions
   - Multiple perspectives

## Keyboard Shortcuts

Currently none - all interaction via mouse/touch

## Troubleshooting

### "No API Keys configured"
→ Open popup, add at least one API key, save

### "Extension is disabled"
→ Open popup, toggle switch to ON, save

### Tabs show errors
→ Check that specific API key is valid
→ Verify you have quota remaining

### Handle doesn't appear
→ Check console (F12) for errors
→ Ensure extension is enabled
→ Try refreshing page

### Blank results
→ AI might have content policy restrictions
→ Try different page or simpler content

## Customization

### Change Analysis Prompt

Edit line 2 in `content.js`:
```javascript
const PREDEFINED_PROMPT = "Your custom prompt here";
```

Common prompts:
- Quiz helper: "Answer the quiz questions accurately..."
- Document summary: "Summarize the main points..."
- Form assistance: "Help fill this form with appropriate information..."
- Code review: "Review the code and suggest improvements..."

## Privacy

- API keys stored locally in Chrome
- Screenshots sent only to configured AI APIs
- No data sent to other servers
- No tracking or analytics

## Performance

- **Initial load**: ~2 seconds wait before analysis
- **Groq**: Usually responds in 1-2 seconds
- **Gemini**: 2-5 seconds typically
- **Others**: 3-10 seconds depending on load

All APIs are called **in parallel**, so total time = slowest API response time.

## Recommended Configuration

**For Speed**:
- Enable: Groq only

**For Accuracy**:
- Enable: Gemini + Groq
- Compare results between tabs

**For Free Usage**:
- All providers have free tiers
- Groq has generous free limits
- Rotate between providers as needed
