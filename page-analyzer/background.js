chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_PAGE") {
    handleAnalysis(sender.tab.id, request.prompt).then(sendResponse);
    return true; 
  }
});

async function handleAnalysis(tabId, customPrompt) {
  try {
    const data = await chrome.storage.local.get([
      'GEMINI_API_KEY', 
      'GROQ_API_KEY', 
      'HF_API_KEY', 
      'TOGETHER_API_KEY',
      'EXTENSION_ENABLED'
    ]);

    if (data.EXTENSION_ENABLED === false) {
      return { error: "Extension is disabled. Please enable it in the extension popup." };
    }

    // Check if at least one API key is configured
    const hasAnyKey = data.GEMINI_API_KEY || data.GROQ_API_KEY || 
                      data.HF_API_KEY || data.TOGETHER_API_KEY;
    
    if (!hasAnyKey) {
      return { error: "No API Keys configured. Please open the extension popup and save at least one API key." };
    }

    // 1. Capture Screenshot
    let dataUrl;
    try {
      dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 60 });
      console.log("Screenshot captured");
    } catch (e) {
      return { error: "Cannot capture this page. It might be a restricted browser page (like settings)." };
    }

    if (!dataUrl) {
      return { error: "Screenshot failed (undefined result)." };
    }

    // 2. Call all configured AI APIs in parallel
    const results = await callAllAIs(data, dataUrl, customPrompt);
    
    return { success: true, data: results };

  } catch (error) {
    console.error("Analysis failed:", error);
    return { error: error.message };
  }
}

async function callAllAIs(apiKeys, dataUrl, promptText) {
  const promises = [];
  const base64Data = dataUrl.split(',')[1];

  // Gemini
  if (apiKeys.GEMINI_API_KEY) {
    promises.push(
      callGeminiAPI(apiKeys.GEMINI_API_KEY, dataUrl, promptText)
        .then(result => ({ provider: 'gemini', result, error: null }))
        .catch(error => ({ provider: 'gemini', result: null, error: error.message }))
    );
  }

  // Groq
  if (apiKeys.GROQ_API_KEY) {
    promises.push(
      callGroqAPI(apiKeys.GROQ_API_KEY, base64Data, promptText)
        .then(result => ({ provider: 'groq', result, error: null }))
        .catch(error => ({ provider: 'groq', result: null, error: error.message }))
    );
  }

  // Hugging Face
  if (apiKeys.HF_API_KEY) {
    promises.push(
      callHuggingFaceAPI(apiKeys.HF_API_KEY, base64Data, promptText)
        .then(result => ({ provider: 'huggingface', result, error: null }))
        .catch(error => ({ provider: 'huggingface', result: null, error: error.message }))
    );
  }

  // Together AI
  if (apiKeys.TOGETHER_API_KEY) {
    promises.push(
      callTogetherAPI(apiKeys.TOGETHER_API_KEY, base64Data, promptText)
        .then(result => ({ provider: 'together', result, error: null }))
        .catch(error => ({ provider: 'together', result: null, error: error.message }))
    );
  }

  return await Promise.all(promises);
}

async function callGeminiAPI(apiKey, base64ImageURI, promptText) {
  const modelVersion = 'gemini-2.0-flash-exp';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelVersion}:generateContent?key=${apiKey}`;
  
  const base64Data = base64ImageURI.split(',')[1];

  const payload = {
    contents: [{
      parts: [
        { text: promptText },
        { inline_data: { mime_type: "image/jpeg", data: base64Data } }
      ]
    }]
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

async function callGroqAPI(apiKey, base64Data, promptText) {
  // Groq uses llama-3.2-90b-vision-preview for vision tasks
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  
  const payload = {
    model: "llama-3.2-90b-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: promptText },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`
            }
          }
        ]
      }
    ],
    temperature: 0.7,
    max_tokens: 1024
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

async function callHuggingFaceAPI(apiKey, base64Data, promptText) {
  // Using a vision-capable model from Hugging Face
  const url = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';
  
  // Convert base64 to blob
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    body: bytes
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Hugging Face API Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  // HF returns array of captions
  if (json && json[0] && json[0].generated_text) {
    return `${promptText}\n\nImage Analysis: ${json[0].generated_text}`;
  }
  throw new Error("No caption generated");
}

async function callTogetherAPI(apiKey, base64Data, promptText) {
  // Together AI supports various vision models
  const url = 'https://api.together.xyz/v1/chat/completions';
  
  const payload = {
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: promptText },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`
            }
          }
        ]
      }
    ],
    max_tokens: 1024,
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