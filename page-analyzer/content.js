// ── Prompts ──────────────────────────────────────
const QUIZ_PROMPT = "I will upload you the questions of my quiz. Please answer them accurately and concisely without any explanation with option number and question number. If the question is multiple choice, give all the correct option which you are surely confident about. Don't explain just answer with the correct option";

const CODING_PROMPT = "I will show you a coding question/problem from a webpage. The page text and screenshots are provided. Please:\n1. Read and understand the full problem statement\n2. Provide a clear, optimal solution with code\n3. Explain the approach and time/space complexity\n4. If there are edge cases, mention them\nAnswer accurately and provide working code.";

const SELECTION_PROMPT = "I will upload you the questions of my quiz. Please answer them accurately and concisely without any explanation with option number and question number. If the question is multiple choice, give all the correct option which you are surely confident about. Don't explain just answer with the correct option";

// ── Main Init ────────────────────────────────────
chrome.storage.local.get([
  'GEMINI_API_KEY',
  'EXTENSION_ENABLED', 'ACTIVE_MODE', 'QUIZ_AUTO_CAPTURE'
], (result) => {
  if (result.EXTENSION_ENABLED === false) {
    console.log("Page Analyzer: Extension is disabled.");
    return;
  }

  if (!result.GEMINI_API_KEY) {
    console.log("Page Analyzer: Gemini API Key not configured.");
    return;
  }

  const mode = result.ACTIVE_MODE || 'quiz';
  const autoCapture = result.QUIZ_AUTO_CAPTURE !== false;

  const updateUI = createSidebarUI(mode);

  if (mode === 'quiz') {
    if (autoCapture) {
      // Auto-analyze on load (original behavior)
      setTimeout(() => initQuizAnalysis(updateUI), 2000);
    } else {
      // Show manual answer button
      createAnswerButton(updateUI);
    }
  } else if (mode === 'selection') {
    initSelectionMode(updateUI);
  } else if (mode === 'coding') {
    // Coding mode: multi-capture + text extraction
    setTimeout(() => initCodingAnalysis(updateUI), 2000);
  }
});

// Listen for mode changes from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'MODE_CHANGED') {
    // Reload the page to apply the new mode
    location.reload();
  }
});

// ── Quiz Analysis (single screenshot) ────────────
function initQuizAnalysis(updateUI) {
  console.log("Page Analyzer: Quiz mode - requesting capture...");

  let responseHandled = false;
  const timeoutId = setTimeout(() => {
    if (!responseHandled) {
      responseHandled = true;
      updateUI('error', { error: "Request timed out." });
    }
  }, 30000);

  chrome.runtime.sendMessage(
    { action: "ANALYZE_PAGE", prompt: QUIZ_PROMPT },
    (response) => {
      if (responseHandled) return;
      responseHandled = true;
      clearTimeout(timeoutId);

      if (chrome.runtime.lastError) {
        updateUI('error', { error: "Connection Error: " + chrome.runtime.lastError.message });
        return;
      }

      if (response && response.success) {
        updateUI('success', response.data);
      } else {
        updateUI('error', { error: response ? response.error : "Unknown error" });
      }
    }
  );
}

// ── Coding Analysis (multi-capture + text) ───────
async function initCodingAnalysis(updateUI) {
  console.log("Page Analyzer: Coding mode - starting multi-capture...");

  try {
    // 1. Extract page text
    const pageText = document.body.innerText || '';

    // 2. Scrolling multi-capture
    const screenshots = await captureScrollingScreenshots();

    // 3. Send to background for AI analysis
    let responseHandled = false;
    const timeoutId = setTimeout(() => {
      if (!responseHandled) {
        responseHandled = true;
        updateUI('error', { error: "Request timed out." });
      }
    }, 60000); // Longer timeout for multi-capture

    chrome.runtime.sendMessage(
      {
        action: "ANALYZE_PAGE_MULTI",
        prompt: CODING_PROMPT,
        screenshots: screenshots,
        pageText: pageText
      },
      (response) => {
        if (responseHandled) return;
        responseHandled = true;
        clearTimeout(timeoutId);

        if (chrome.runtime.lastError) {
          updateUI('error', { error: "Connection Error: " + chrome.runtime.lastError.message });
          return;
        }

        if (response && response.success) {
          updateUI('success', response.data);
        } else {
          updateUI('error', { error: response ? response.error : "Unknown error" });
        }
      }
    );
  } catch (err) {
    updateUI('error', { error: "Capture failed: " + err.message });
  }
}

// ── Selection Analysis ───────────────────────────
function initSelectionMode(updateUI) {
  console.log("Page Analyzer: Selection mode active");

  const btnId = 'page-analyzer-selection-btn';
  let analyzeBtn = document.getElementById(btnId);

  if (!analyzeBtn) {
    analyzeBtn = document.createElement('button');
    analyzeBtn.id = btnId;
    analyzeBtn.className = 'page-analyzer-hover-btn';
    analyzeBtn.innerHTML = '✨ Analyze';
    analyzeBtn.title = 'Analyze selected text with Gemini';

    const style = document.createElement('style');
    style.textContent = `
      .page-analyzer-hover-btn {
        position: absolute;
        background: linear-gradient(135deg, #6c63ff 0%, #48c6ef 100%);
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 6px 12px;
        font-family: -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        z-index: 2147483647;
        box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
        display: none;
        transition: transform 0.2s;
      }
      .page-analyzer-hover-btn:hover {
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(analyzeBtn);
  }

  document.addEventListener('mouseup', (e) => {
    if (e.target.id === btnId) return;

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        analyzeBtn.style.display = 'block';
        analyzeBtn.style.top = (window.scrollY + rect.bottom + 5) + 'px';
        analyzeBtn.style.left = (window.scrollX + rect.left + (rect.width / 2) - (analyzeBtn.offsetWidth / 2)) + 'px';

        analyzeBtn.dataset.text = text;
      } else {
        analyzeBtn.style.display = 'none';
      }
    }, 10);
  });

  analyzeBtn.addEventListener('click', () => {
    const text = analyzeBtn.dataset.text;
    if (!text) return;

    analyzeBtn.style.display = 'none';
    window.getSelection().removeAllRanges();

    // Set UI to loading state immediately
    updateUI('loading');

    let responseHandled = false;
    const timeoutId = setTimeout(() => {
      if (!responseHandled) {
        responseHandled = true;
        updateUI('error', { error: "Request timed out." });
      }
    }, 30000);

    chrome.runtime.sendMessage(
      { action: "ANALYZE_SELECTION", text: text, prompt: SELECTION_PROMPT },
      (response) => {
        if (responseHandled) return;
        responseHandled = true;
        clearTimeout(timeoutId);

        if (chrome.runtime.lastError) {
          updateUI('error', { error: "Connection Error: " + chrome.runtime.lastError.message });
          return;
        }

        if (response && response.success) {
          console.log(response.data)
          updateUI('success', response.data);
        } else {
          updateUI('error', { error: response ? response.error : "Unknown error" });
        }
      }
    );
  });
}

// ── Scrolling Screenshot Capture ─────────────────
function captureScrollingScreenshots() {
  return new Promise(async (resolve) => {
    const viewportHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight;
    const originalScroll = window.scrollY;
    const screenshots = [];
    const maxCaptures = 8; // Safety limit

    let currentY = 0;
    let captureCount = 0;

    while (currentY < totalHeight && captureCount < maxCaptures) {
      window.scrollTo(0, currentY);

      // Wait for scroll to settle and paint
      await new Promise(r => setTimeout(r, 300));

      // Ask background to capture this viewport
      try {
        const dataUrl = await new Promise((res, rej) => {
          chrome.runtime.sendMessage(
            { action: "CAPTURE_VIEWPORT" },
            (response) => {
              if (chrome.runtime.lastError) {
                rej(new Error(chrome.runtime.lastError.message));
              } else if (response && response.dataUrl) {
                res(response.dataUrl);
              } else {
                rej(new Error("Capture failed"));
              }
            }
          );
        });
        screenshots.push(dataUrl);
      } catch (e) {
        console.warn("Viewport capture failed at position", currentY, e);
      }

      currentY += viewportHeight;
      captureCount++;
    }

    // Restore original scroll position
    window.scrollTo(0, originalScroll);

    // If no screenshots captured, fall back to at least one
    if (screenshots.length === 0) {
      try {
        const fallback = await new Promise((res, rej) => {
          chrome.runtime.sendMessage({ action: "CAPTURE_VIEWPORT" }, (r) => {
            if (r && r.dataUrl) res(r.dataUrl);
            else rej(new Error("fallback capture failed"));
          });
        });
        screenshots.push(fallback);
      } catch (e) {
        console.warn("Fallback capture also failed");
      }
    }

    resolve(screenshots);
  });
}

// ── Manual Answer Button (Quiz manual mode) ──────
function createAnswerButton(updateUI) {
  const container = document.createElement('div');
  container.id = 'page-analyzer-answer-host';
  const shadow = container.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    .answer-btn {
      position: fixed;
      top: calc(50% + 28px);
      right: 0;
      width: 16px;
      height: 28px;
      background: #ffffff;
      border: none;
      border-radius: 4px 0 0 4px;
      cursor: pointer;
      z-index: 2147483645;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -2px 1px 6px rgba(0,0,0,0.2);
      transition: all 0.2s;
    }
    .answer-btn:hover {
      width: 22px;
      background: #e0e0e0;
      box-shadow: -3px 2px 10px rgba(0,0,0,0.3);
    }
    .answer-btn::after {
      content: '?';
      color: #000;
      font-size: 11px;
      font-weight: 700;
      font-family: -apple-system, sans-serif;
    }
    .answer-btn.loading {
      pointer-events: none;
      animation: pulse 0.8s infinite alternate;
    }
    @keyframes pulse {
      from { opacity: 0.5; }
      to { opacity: 1; }
    }
  `;

  const btn = document.createElement('button');
  btn.className = 'answer-btn';
  btn.title = 'Get Answer';

  btn.addEventListener('click', () => {
    btn.classList.add('loading');
    initQuizAnalysis((status, data) => {
      btn.classList.remove('loading');
      updateUI(status, data);
    });
  });

  shadow.appendChild(style);
  shadow.appendChild(btn);
  document.body.appendChild(container);
}

// ── Sidebar UI ───────────────────────────────────
function createSidebarUI(mode) {
  const container = document.createElement('div');
  container.id = 'gemini-analyzer-host';

  const shadow = container.attachShadow({ mode: 'open' });

  const modeBadge = mode === 'coding' ? '💻 Coding' : mode === 'selection' ? '🖱️ Selection' : '📝 Quiz';

  const style = document.createElement('style');
  style.textContent = `
    :host {
      --sidebar-width: 350px;
      --bg-color: #ffffff;
      --header-bg: #f0f0f0;
      --border-color: #ddd;
      --text-color: #111111;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .toggle-handle {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 16px;
      height: 40px;
      background: #f0f0f0;
      border: 1px solid var(--border-color);
      border-right: none;
      border-radius: 4px 0 0 4px;
      cursor: pointer;
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -2px 1px 4px rgba(0,0,0,0.1);
      transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.2s;
    }
    .toggle-handle:hover { background: #e0e0e0; }

    .handle-icon {
      width: 0; height: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 5px solid #333333;
      transition: transform 0.3s;
    }

    .toggle-handle.loading .handle-icon {
      opacity: 0.5;
      animation: pulse 1s infinite alternate;
    }
    @keyframes pulse { from { opacity: 0.3; } to { opacity: 0.8; } }

    .sidebar {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      right: calc(var(--sidebar-width) * -1.1);
      width: var(--sidebar-width);
      height: auto;
      max-height: 80vh;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-right: none;
      border-radius: 12px 0 0 12px;
      box-shadow: -5px 0 15px rgba(0,0,0,0.1);
      z-index: 2147483647;
      transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex;
      flex-direction: column;
      font-family: var(--font-family);
      box-sizing: border-box;
    }

    .sidebar.open { right: 0; }

    .sidebar.open + .toggle-handle,
    .toggle-handle.sidebar-open {
      right: var(--sidebar-width);
      border-right: 1px solid var(--border-color);
    }

    .sidebar-header {
      padding: 12px 14px;
      background: var(--header-bg);
      border-bottom: 1px solid var(--border-color);
      border-radius: 12px 0 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      color: #000000;
      letter-spacing: 0.5px;
      cursor: pointer;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      line-height: 1;
      color: #000000;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.8;
    }
    .close-btn:hover { opacity: 1; }

    .tabs {
      display: flex;
      background: #f8f8f8;
      border-bottom: 1px solid var(--border-color);
      overflow-x: auto;
    }

    .tab {
      padding: 10px 15px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: #888;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tab:hover { background: #eeeeee; color: #333; }
    .tab.active { color: #111111; border-bottom-color: #111111; background: #ffffff; }
    .tab.error { color: #666; }
    .tab.loading { color: #aaa; }

    .tab-content {
      display: none;
      padding: 15px;
      overflow-y: auto;
      font-size: 13px;
      line-height: 1.6;
      color: var(--text-color);
      white-space: pre-wrap;
      flex: 1;
    }
    .tab-content.active { display: block; }

    .loading-text { color: #999; font-style: italic; font-size: 12px; }
    .error-text { color: #555; font-size: 12px; line-height: 1.5; }

    .tab-content::-webkit-scrollbar { width: 5px; }
    .tab-content::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    .tab-content::-webkit-scrollbar-track { background: transparent; }
    .tabs::-webkit-scrollbar { height: 4px; }
    .tabs::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
  `;

  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';

  const header = document.createElement('div');
  header.className = 'sidebar-header';
  header.innerHTML = `
    <span>${modeBadge} AI Analyzer</span>
    <button class="close-btn" title="Close">&times;</button>
  `;

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs';

  const contentContainer = document.createElement('div');
  contentContainer.className = 'content-container';
  contentContainer.style.cssText = 'flex: 1; overflow: hidden; display: flex; flex-direction: column;';

  sidebar.appendChild(header);
  sidebar.appendChild(tabsContainer);
  sidebar.appendChild(contentContainer);

  const handle = document.createElement('div');
  handle.className = 'toggle-handle loading';
  handle.title = "View Details";
  handle.innerHTML = `<div class="handle-icon"></div>`;

  shadow.appendChild(style);
  shadow.appendChild(sidebar);
  shadow.appendChild(handle);
  document.body.appendChild(container);

  // Interactions
  const toggleSidebar = () => {
    const isOpen = sidebar.classList.toggle('open');
    handle.classList.toggle('sidebar-open');
    const icon = handle.querySelector('.handle-icon');
    icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  };

  handle.addEventListener('click', toggleSidebar);
  header.addEventListener('click', toggleSidebar);

  // Expose toggle capability globally for the active mode's use
  window.__analyzerToggleSidebar = toggleSidebar;

  const tabsData = {};
  let activeTab = null;

  return (status, data) => {
    handle.classList.remove('loading');

    if (status === 'success') {
      data.forEach(aiResult => {
        const { provider, result, error } = aiResult;

        if (!tabsData[provider]) {
          const tab = document.createElement('div');
          tab.className = 'tab';
          tab.dataset.provider = provider;
          tab.textContent = getProviderDisplayName(provider);

          const content = document.createElement('div');
          content.className = 'tab-content';
          content.dataset.provider = provider;

          tabsContainer.appendChild(tab);
          contentContainer.appendChild(content);
          tabsData[provider] = { tab, content };

          // Default state for new tab
          if (status === 'loading') {
            tab.classList.add('loading');
            content.innerHTML = `<span class="loading-text">Thinking...</span>`;
          }

          tab.addEventListener('click', () => {
            Object.values(tabsData).forEach(({ tab: t, content: c }) => {
              t.classList.remove('active');
              c.classList.remove('active');
            });
            tab.classList.add('active');
            content.classList.add('active');
            activeTab = provider;
          });
        }

        const { tab, content } = tabsData[provider];

        if (error) {
          tab.classList.add('error');
          tab.classList.remove('loading');
          content.innerHTML = `<span class="error-text">Error: ${error}</span>`;
        } else {
          tab.classList.remove('loading', 'error');
          content.textContent = result;
        }
      });

      if (!activeTab && Object.keys(tabsData).length > 0) {
        const firstProvider = Object.keys(tabsData)[0];
        tabsData[firstProvider].tab.click();
      }
    } else if (status === 'loading') {
      // Clear previous tabs/content before showing loading
      tabsContainer.innerHTML = '';
      contentContainer.innerHTML = '';
      Object.keys(tabsData).forEach(k => delete tabsData[k]);
      activeTab = null;

      // Set to loading
      handle.classList.add('loading');
      if (!tabsData['gemini']) {
        const provider = 'gemini';
        const tab = document.createElement('div');
        tab.className = 'tab loading';
        tab.dataset.provider = provider;
        tab.textContent = getProviderDisplayName(provider);

        const content = document.createElement('div');
        content.className = 'tab-content';
        content.dataset.provider = provider;
        content.innerHTML = `<span class="loading-text">Thinking...</span>`;

        tabsContainer.appendChild(tab);
        contentContainer.appendChild(content);
        tabsData[provider] = { tab, content };

        tab.addEventListener('click', () => {
          Object.values(tabsData).forEach(({ tab: t, content: c }) => {
            t.classList.remove('active');
            c.classList.remove('active');
          });
          tab.classList.add('active');
          content.classList.add('active');
          activeTab = provider;
        });
      } else {
        const { tab, content } = tabsData['gemini'];
        tab.classList.add('loading');
        tab.classList.remove('error');
        content.innerHTML = `<span class="loading-text">Thinking...</span>`;
      }

      if (!activeTab && Object.keys(tabsData).length > 0) {
        const firstProvider = Object.keys(tabsData)[0];
        tabsData[firstProvider].tab.click();
      }
    } else {
      const errorTab = document.createElement('div');
      errorTab.className = 'tab active error';
      errorTab.textContent = 'Error';

      const errorContent = document.createElement('div');
      errorContent.className = 'tab-content active';
      errorContent.innerHTML = `<span class="error-text">${data.error || 'Unknown error'}</span>`;

      tabsContainer.appendChild(errorTab);
      contentContainer.appendChild(errorContent);
    }
  };
}

function getProviderDisplayName(provider) {
  return provider === 'gemini' ? 'Gemini' : provider;
}