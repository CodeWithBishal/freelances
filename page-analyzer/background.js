// ── Message Router ───────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_PAGE") {
    handleAnalysis(sender.tab.id, request.prompt)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }

  if (request.action === "ANALYZE_SELECTION") {
    handleSelectionAnalysis(request.text, request.prompt)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }

  if (request.action === "ANALYZE_PAGE_MULTI") {
    handleMultiAnalysis(request.screenshots, request.pageText, request.prompt)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }

  if (request.action === "CAPTURE_VIEWPORT") {
    chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 60 })
      .then(dataUrl => sendResponse({ dataUrl }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});

function resolveSelectedModel(data) {
  if (data.SELECTED_MODEL) return data.SELECTED_MODEL;

  const hasGeminiKey = !!(data.GEMINI_API_KEY && data.GEMINI_API_KEY.trim());
  const hasQwenKey = !!(data.NVIDIA_API_KEY && data.NVIDIA_API_KEY.trim());
  if (hasQwenKey && !hasGeminiKey) return 'qwen';

  return 'gemini';
}

// ── Single Screenshot Analysis (Quiz Mode) ──────
async function handleAnalysis(tabId, customPrompt) {
  try {
    const data = await chrome.storage.local.get(['GEMINI_API_KEY', 'NVIDIA_API_KEY', 'SELECTED_MODEL', 'EXTENSION_ENABLED']);

    if (data.EXTENSION_ENABLED === false) {
      return { error: "Extension is disabled. Please enable it in the extension popup." };
    }

    const selectedModel = resolveSelectedModel(data);
    if (selectedModel === 'qwen' && !data.NVIDIA_API_KEY) {
      return { error: "Qwen API Key not configured. Please open the extension popup and save your NVIDIA API key." };
    }
    if (selectedModel === 'gemini' && !data.GEMINI_API_KEY) {
      return { error: "Gemini API Key not configured. Please open the extension popup and save your API key." };
    }

    let dataUrl;
    try {
      dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 60 });
    } catch (e) {
      return { error: "Cannot capture this page. It might be a restricted browser page." };
    }

    if (!dataUrl) {
      return { error: "Screenshot failed (undefined result)." };
    }

    let result;
    if (selectedModel === 'qwen') {
      result = await callQwenAPI(data.NVIDIA_API_KEY, [dataUrl], customPrompt, null);
    } else {
      result = await callGeminiAPI(data.GEMINI_API_KEY, [dataUrl], customPrompt, null);
    }
    
    return { success: true, data: [{ provider: selectedModel, result, error: null }] };

  } catch (error) {
    console.error("Analysis failed:", error);
    const fallbackData = await chrome.storage.local.get(['GEMINI_API_KEY', 'NVIDIA_API_KEY', 'SELECTED_MODEL']);
    const selectedModel = resolveSelectedModel(fallbackData);
    return { success: true, data: [{ provider: selectedModel, result: null, error: error.message }] };
  }
}

// ── Multi-Screenshot Analysis (Coding Mode) ─────
async function handleMultiAnalysis(screenshots, pageText, customPrompt) {
  try {
    const data = await chrome.storage.local.get(['GEMINI_API_KEY', 'NVIDIA_API_KEY', 'SELECTED_MODEL', 'EXTENSION_ENABLED']);

    if (data.EXTENSION_ENABLED === false) {
      return { error: "Extension is disabled." };
    }

    const selectedModel = resolveSelectedModel(data);
    if (selectedModel === 'qwen' && !data.NVIDIA_API_KEY) {
      return { error: "Qwen API Key not configured." };
    }
    if (selectedModel === 'gemini' && !data.GEMINI_API_KEY) {
      return { error: "Gemini API Key not configured." };
    }

    if (!screenshots || screenshots.length === 0) {
      return { error: "No screenshots captured." };
    }

    let result;
    if (selectedModel === 'qwen') {
      result = await callQwenAPI(data.NVIDIA_API_KEY, screenshots, customPrompt, pageText);
    } else {
      result = await callGeminiAPI(data.GEMINI_API_KEY, screenshots, customPrompt, pageText);
    }
    
    return { success: true, data: [{ provider: selectedModel, result, error: null }] };

  } catch (error) {
    console.error("Multi-analysis failed:", error);
    const fallbackData = await chrome.storage.local.get(['GEMINI_API_KEY', 'NVIDIA_API_KEY', 'SELECTED_MODEL']);
    const selectedModel = resolveSelectedModel(fallbackData);
    return { success: true, data: [{ provider: selectedModel, result: null, error: error.message }] };
  }
}

// ── Text Selection Analysis (Selection Mode) ─────
async function handleSelectionAnalysis(text, customPrompt) {
  try {
    const data = await chrome.storage.local.get(['GEMINI_API_KEY', 'NVIDIA_API_KEY', 'SELECTED_MODEL', 'EXTENSION_ENABLED']);

    if (data.EXTENSION_ENABLED === false) {
      return { error: "Extension is disabled." };
    }

    const selectedModel = resolveSelectedModel(data);
    if (selectedModel === 'qwen' && !data.NVIDIA_API_KEY) {
      return { error: "Qwen API Key not configured." };
    }
    if (selectedModel === 'gemini' && !data.GEMINI_API_KEY) {
      return { error: "Gemini API Key not configured." };
    }

    if (!text || text.trim() === '') {
      return { error: "No text selected." };
    }

    console.log("Selection mode - sending text to " + selectedModel + ":", text.substring(0, 100));

    let result;
    if (selectedModel === 'qwen') {
      result = await callQwenTextOnly(data.NVIDIA_API_KEY, customPrompt, text);
    } else {
      result = await callGeminiTextOnly(data.GEMINI_API_KEY, customPrompt, text);
    }
    
    return { success: true, data: [{ provider: selectedModel, result, error: null }] };

  } catch (error) {
    console.error("Selection analysis failed:", error);
    const fallbackData = await chrome.storage.local.get(['GEMINI_API_KEY', 'NVIDIA_API_KEY', 'SELECTED_MODEL']);
    const selectedModel = resolveSelectedModel(fallbackData);
    return { success: true, data: [{ provider: selectedModel, result: null, error: error.message }] };
  }
}

// ── Gemini Text-Only API (Selection Mode) ───────
async function callGeminiTextOnly(apiKey, promptText, selectedText) {
  const modelVersion = 'gemini-3-flash-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelVersion}:generateContent?key=${apiKey}`;

  const fullPrompt = `${promptText}\n\n${selectedText.substring(0, 8000)}`;

  const payload = {
    contents: [{ parts: [{ text: fullPrompt }] }]
  };

  console.log("Calling Gemini text-only API...");

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutHandle);

    if (!response.ok) {
      let errorMsg = `API Error (${response.status})`;
      try {
        const errorBody = await response.json();
        if (errorBody.error && errorBody.error.message) {
          errorMsg += `: ${errorBody.error.message}`;
        }
      } catch (e) {
        if (response.statusText) errorMsg += `: ${response.statusText}`;
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();

    if (!json.candidates || !json.candidates[0] || !json.candidates[0].content) {
      const finishReason = json.promptFeedback?.blockReason || "Unknown";
      throw new Error(`AI generated no content. Reason: ${finishReason}`);
    }

    console.log("Gemini text-only API response received.");
    return json.candidates[0].content.parts[0].text;
  } catch (err) {
    clearTimeout(timeoutHandle);
    if (err.name === 'AbortError') {
      throw new Error('Gemini API request timed out after 25 seconds.');
    }
    throw err;
  }
}

// ── Gemini API (multi-image support) ────────────
async function callGeminiAPI(apiKey, screenshotUrls, promptText, pageText) {
  const modelVersion = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelVersion}:generateContent?key=${apiKey}`;

  // Build combined prompt with page text if available
  const fullPrompt = pageText
    ? `${promptText}\n\n--- PAGE TEXT ---\n${pageText.substring(0, 8000)}`
    : promptText;

  // Build parts: text prompt + all images
  const parts = [{ text: fullPrompt }];

  if (screenshotUrls && screenshotUrls.length > 0) {
    for (const dataUrl of screenshotUrls) {
      if (dataUrl) {
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
          parts.push({
            inline_data: { mime_type: "image/jpeg", data: base64Data }
          });
        }
      }
    }
  }

  const payload = {
    contents: [{ parts }]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorMsg = `API Error (${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody.error && errorBody.error.message) {
        errorMsg += `: ${errorBody.error.message}`;
      }
    } catch (e) {
      if (response.statusText) errorMsg += `: ${response.statusText}`;
    }
    throw new Error(errorMsg);
  }

  const json = await response.json();

  if (!json.candidates || !json.candidates[0] || !json.candidates[0].content) {
    const finishReason = json.promptFeedback?.blockReason || "Unknown";
    throw new Error(`AI generated no content. Reason: ${finishReason}`);
  }

  return json.candidates[0].content.parts[0].text;
}

// ── Qwen API (multi-image support) ──────────────
async function callQwenAPI(apiKey, screenshotUrls, promptText, pageText) {
  const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
  const model = "qwen/qwen3.5-122b-a10b";

  // Build combined prompt with page text if available
  const fullPrompt = pageText
    ? `${promptText}\n\n--- PAGE TEXT ---\n${pageText.substring(0, 8000)}`
    : promptText;

  // Build content parts: text + images
  const content = [{ type: "text", text: fullPrompt }];

  if (screenshotUrls && screenshotUrls.length > 0) {
    for (const dataUrl of screenshotUrls) {
      if (dataUrl) {
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
          content.push({
            type: "image_url",
            image_url: {
              url: dataUrl
            }
          });
        }
      }
    }
  }

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  const payload = {
    model: model,
    messages: [
      {
        role: "user",
        content: content
      }
    ],
    max_tokens: 16384,
    temperature: 0.60,
    top_p: 0.95,
    stream: false
  };

  const response = await fetch(invokeUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorMsg = `Qwen API Error (${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody.error && errorBody.error.message) {
        errorMsg += `: ${errorBody.error.message}`;
      }
    } catch (e) {
      if (response.statusText) errorMsg += `: ${response.statusText}`;
    }
    throw new Error(errorMsg);
  }

  const json = await response.json();

  if (!json.choices || !json.choices[0] || !json.choices[0].message) {
    throw new Error("Qwen API generated no content.");
  }

  return json.choices[0].message.content;
}

// ── Qwen Text-Only API (Selection Mode) ─────────
async function callQwenTextOnly(apiKey, promptText, selectedText) {
  const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
  const model = "qwen/qwen3.5-122b-a10b";

  const fullPrompt = `${promptText}\n\n${selectedText.substring(0, 8000)}`;

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  const payload = {
    model: model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: fullPrompt
          }
        ]
      }
    ],
    max_tokens: 16384,
    temperature: 0.60,
    top_p: 0.95,
    stream: false
  };

  console.log("Calling Qwen API for text-only...");

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(invokeUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutHandle);

    if (!response.ok) {
      let errorMsg = `Qwen API Error (${response.status})`;
      try {
        const errorBody = await response.json();
        if (errorBody.error && errorBody.error.message) {
          errorMsg += `: ${errorBody.error.message}`;
        }
      } catch (e) {
        if (response.statusText) errorMsg += `: ${response.statusText}`;
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();

    if (!json.choices || !json.choices[0] || !json.choices[0].message) {
      throw new Error("Qwen API generated no content.");
    }

    console.log("Qwen API response received.");
    return json.choices[0].message.content;
  } catch (err) {
    clearTimeout(timeoutHandle);
    if (err.name === 'AbortError') {
      throw new Error('Qwen API request timed out after 25 seconds.');
    }
    throw err;
  }
}
