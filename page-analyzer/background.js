// ── Message Router ───────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_PAGE") {
    handleAnalysis(sender.tab.id, request.prompt).then(sendResponse);
    return true;
  }

  if (request.action === "ANALYZE_PAGE_MULTI") {
    handleMultiAnalysis(request.screenshots, request.pageText, request.prompt).then(sendResponse);
    return true;
  }

  if (request.action === "CAPTURE_VIEWPORT") {
    chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 60 })
      .then(dataUrl => sendResponse({ dataUrl }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});

// ── Single Screenshot Analysis (Quiz Mode) ──────
async function handleAnalysis(tabId, customPrompt) {
  try {
    const data = await chrome.storage.local.get([
      'GEMINI_API_KEY', 'GROQ_API_KEY', 'HF_API_KEY', 'TOGETHER_API_KEY',
      'EXTENSION_ENABLED'
    ]);

    if (data.EXTENSION_ENABLED === false) {
      return { error: "Extension is disabled. Please enable it in the extension popup." };
    }

    const hasAnyKey = data.GEMINI_API_KEY || data.GROQ_API_KEY ||
      data.HF_API_KEY || data.TOGETHER_API_KEY;

    if (!hasAnyKey) {
      return { error: "No API Keys configured. Please open the extension popup and save at least one API key." };
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

    const results = await callAllAIs(data, [dataUrl], customPrompt, null);
    return { success: true, data: results };

  } catch (error) {
    console.error("Analysis failed:", error);
    return { error: error.message };
  }
}

// ── Multi-Screenshot Analysis (Coding Mode) ─────
async function handleMultiAnalysis(screenshots, pageText, customPrompt) {
  try {
    const data = await chrome.storage.local.get([
      'GEMINI_API_KEY', 'GROQ_API_KEY', 'HF_API_KEY', 'TOGETHER_API_KEY',
      'EXTENSION_ENABLED'
    ]);

    if (data.EXTENSION_ENABLED === false) {
      return { error: "Extension is disabled." };
    }

    const hasAnyKey = data.GEMINI_API_KEY || data.GROQ_API_KEY ||
      data.HF_API_KEY || data.TOGETHER_API_KEY;

    if (!hasAnyKey) {
      return { error: "No API Keys configured." };
    }

    if (!screenshots || screenshots.length === 0) {
      return { error: "No screenshots captured." };
    }

    const results = await callAllAIs(data, screenshots, customPrompt, pageText);
    return { success: true, data: results };

  } catch (error) {
    console.error("Multi-analysis failed:", error);
    return { error: error.message };
  }
}

// ── Call All Configured AIs ─────────────────────
async function callAllAIs(apiKeys, screenshotUrls, promptText, pageText) {
  const promises = [];

  // Build combined prompt with page text if available
  const fullPrompt = pageText
    ? `${promptText}\n\n--- PAGE TEXT ---\n${pageText.substring(0, 8000)}`
    : promptText;

  // Gemini (supports multiple images natively)
  if (apiKeys.GEMINI_API_KEY) {
    promises.push(
      callGeminiAPI(apiKeys.GEMINI_API_KEY, screenshotUrls, fullPrompt)
        .then(result => ({ provider: 'gemini', result, error: null }))
        .catch(error => ({ provider: 'gemini', result: null, error: error.message }))
    );
  }

  // Groq (supports multiple images via OpenAI format)
  if (apiKeys.GROQ_API_KEY) {
    promises.push(
      callGroqAPI(apiKeys.GROQ_API_KEY, screenshotUrls, fullPrompt)
        .then(result => ({ provider: 'groq', result, error: null }))
        .catch(error => ({ provider: 'groq', result: null, error: error.message }))
    );
  }

  // Hugging Face (text-only for multi-image, single image for single)
  if (apiKeys.HF_API_KEY) {
    promises.push(
      callHuggingFaceAPI(apiKeys.HF_API_KEY, screenshotUrls, fullPrompt)
        .then(result => ({ provider: 'huggingface', result, error: null }))
        .catch(error => ({ provider: 'huggingface', result: null, error: error.message }))
    );
  }

  // Together AI (supports multiple images via OpenAI format)
  if (apiKeys.TOGETHER_API_KEY) {
    promises.push(
      callTogetherAPI(apiKeys.TOGETHER_API_KEY, screenshotUrls, fullPrompt)
        .then(result => ({ provider: 'together', result, error: null }))
        .catch(error => ({ provider: 'together', result: null, error: error.message }))
    );
  }

  return await Promise.all(promises);
}

// ── Gemini API (multi-image support) ────────────
async function callGeminiAPI(apiKey, screenshotUrls, promptText) {
  const modelVersion = 'gemini-2.0-flash-exp';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelVersion}:generateContent?key=${apiKey}`;

  // Build parts: text prompt + all images
  const parts = [{ text: promptText }];
  for (const dataUrl of screenshotUrls) {
    const base64Data = dataUrl.split(',')[1];
    parts.push({
      inline_data: { mime_type: "image/jpeg", data: base64Data }
    });
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

// ── Groq API (multi-image via OpenAI format) ────
async function callGroqAPI(apiKey, screenshotUrls, promptText) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const content = [{ type: "text", text: promptText }];
  for (const dataUrl of screenshotUrls) {
    const base64Data = dataUrl.split(',')[1];
    content.push({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${base64Data}` }
    });
  }

  const payload = {
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    messages: [{ role: "user", content }],
    temperature: 0.1,
    max_tokens: 4096
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  return json.choices[0].message.content;
}

// ── Hugging Face API ─────────────────────────────
async function callHuggingFaceAPI(apiKey, screenshotUrls, promptText) {
  // HF only supports single image well, use first screenshot
  const url = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';

  const base64Data = screenshotUrls[0].split(',')[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}` },
    body: bytes
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Hugging Face API Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  if (json && json[0] && json[0].generated_text) {
    return `${promptText}\n\nImage Analysis: ${json[0].generated_text}`;
  }
  throw new Error("No caption generated");
}

// ── Together AI API (multi-image support) ────────
async function callTogetherAPI(apiKey, screenshotUrls, promptText) {
  const url = 'https://api.together.xyz/v1/chat/completions';

  const content = [{ type: "text", text: promptText }];
  for (const dataUrl of screenshotUrls) {
    const base64Data = dataUrl.split(',')[1];
    content.push({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${base64Data}` }
    });
  }

  const payload = {
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    messages: [{ role: "user", content }],
    max_tokens: 2048,
    temperature: 0.7
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Together AI Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  return json.choices[0].message.content;
}