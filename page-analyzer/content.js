// Configuration
const PREDEFINED_PROMPT = "I will upload you the questions of my quiz. Please answer them accurately and concisely without any explanation with option number and question number. If the question is multiple choice, give all the correct option which you are surely confident about.";

// 1. Check for API Key immediately
chrome.storage.local.get(['GEMINI_API_KEY', 'GROQ_API_KEY', 'HF_API_KEY', 'TOGETHER_API_KEY', 'EXTENSION_ENABLED'], (result) => {
  if (result.EXTENSION_ENABLED === false) {
    console.log("Page Analyzer: Extension is disabled.");
    return;
  }
  
  const hasAnyKey = result.GEMINI_API_KEY || result.GROQ_API_KEY || 
                    result.HF_API_KEY || result.TOGETHER_API_KEY;
  
  if (hasAnyKey) {
    const updateUI = createSidebarUI(); 
    // Wait a brief moment for dynamic content to settle, then analyze
    setTimeout(() => initAnalysis(updateUI), 2000);
  } else {
    console.log("Page Analyzer: No API Keys configured.");
  }
});

function initAnalysis(updateUI) {
  console.log("Page Analyzer: Requesting capture...");

  let responseHandled = false;

  // Safety timeout: If background doesn't respond in 30s, show error
  const timeoutId = setTimeout(() => {
    if (!responseHandled) {
      responseHandled = true;
      updateUI('error', { error: "Request timed out. The background service might be busy or failed." });
    }
  }, 30000);

  // Send message to background script
  chrome.runtime.sendMessage(
    { action: "ANALYZE_PAGE", prompt: PREDEFINED_PROMPT },
    (response) => {
      // Prevent race condition with timeout
      if (responseHandled) return;
      responseHandled = true;
      clearTimeout(timeoutId);

      // Check for connection errors (e.g., extension reloaded or background crashed)
      if (chrome.runtime.lastError) {
        updateUI('error', { error: "Connection Error: " + chrome.runtime.lastError.message });
        return;
      }

      if (response && response.success) {
        updateUI('success', response.data);
      } else {
        const errorMsg = response ? response.error : "Unknown error";
        updateUI('error', { error: errorMsg });
      }
    }
  );
}

// Creates the Sidebar UI and returns a function to update the content
function createSidebarUI() {
  const container = document.createElement('div');
  container.id = 'gemini-analyzer-host';
  
  // Use Shadow DOM to isolate styles
  const shadow = container.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      --sidebar-width: 350px;
      --bg-color: #ffffff;
      --header-bg: #2c3e50;
      --border-color: #dcdcdc;
      --text-color: #333333;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* 1. The Toggle Handle (Native-looking tab) */
    .toggle-handle {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 16px;
      height: 40px;
      background: #eeeeee;
      border: 1px solid var(--border-color);
      border-right: none;
      border-radius: 4px 0 0 4px;
      cursor: pointer;
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -2px 1px 4px rgba(0,0,0,0.05);
      transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.2s;
    }
    
    .toggle-handle:hover {
      background: #e0e0e0;
    }

    /* Chevron Icon (CSS Triangle) */
    .handle-icon {
      width: 0; 
      height: 0; 
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent; 
      border-right: 5px solid #666;
      transition: transform 0.3s;
    }
    
    /* Loading pulse for handle */
    .toggle-handle.loading .handle-icon {
      opacity: 0.5;
      animation: pulse 1s infinite alternate;
    }

    @keyframes pulse { from { opacity: 0.3; } to { opacity: 0.8; } }

    /* 2. The Sidebar */
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
      border-radius: 8px 0 0 8px;
      box-shadow: -5px 0 15px rgba(0,0,0,0.1);
      z-index: 2147483647;
      transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      display: flex;
      flex-direction: column;
      font-family: var(--font-family);
      box-sizing: border-box;
    }

    .sidebar.open {
      right: 0;
    }
    
    /* Push handle when sidebar opens */
    .sidebar.open + .toggle-handle,
    .toggle-handle.sidebar-open {
      right: var(--sidebar-width);
      border-right: 1px solid var(--border-color);
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 12px 14px;
      background: var(--header-bg);
      border-bottom: 1px solid var(--border-color);
      border-radius: 8px 0 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      line-height: 1;
      color: white;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.8;
    }
    .close-btn:hover { opacity: 1; }

    /* Tabs */
    .tabs {
      display: flex;
      background: #f5f5f5;
      border-bottom: 1px solid var(--border-color);
      overflow-x: auto;
    }
    
    .tab {
      padding: 10px 15px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: #666;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .tab:hover {
      background: #e8e8e8;
      color: #333;
    }
    
    .tab.active {
      color: #007bff;
      border-bottom-color: #007bff;
      background: white;
    }
    
    .tab.error {
      color: #dc3545;
    }
    
    .tab.loading {
      color: #999;
    }

    /* Tab Content */
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
    
    .tab-content.active {
      display: block;
    }
    
    .loading-text { 
      color: #888; 
      font-style: italic; 
      font-size: 12px; 
    }
    
    .error-text { 
      color: #d32f2f; 
      font-size: 12px; 
      line-height: 1.5;
    }

    /* Scrollbar */
    .tab-content::-webkit-scrollbar { width: 5px; }
    .tab-content::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    .tab-content::-webkit-scrollbar-track { background: transparent; }
    .tabs::-webkit-scrollbar { height: 4px; }
    .tabs::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
  `;

  // --- DOM Structure ---
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';
  
  const header = document.createElement('div');
  header.className = 'sidebar-header';
  header.innerHTML = `
    <span>AI Analyzer</span>
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

  // --- Interactions ---
  const toggleSidebar = () => {
    const isOpen = sidebar.classList.toggle('open');
    handle.classList.toggle('sidebar-open');
    
    // Rotate Icon
    const icon = handle.querySelector('.handle-icon');
    icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  };

  handle.addEventListener('click', toggleSidebar);
  header.addEventListener('click', toggleSidebar);

  // Store tabs data
  const tabsData = {};
  let activeTab = null;

  // Return update function
  return (status, data) => {
    handle.classList.remove('loading');
    
    if (status === 'success') {
      // data is an array of results from different AIs
      data.forEach(aiResult => {
        const { provider, result, error } = aiResult;
        
        // Create or update tab
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
          
          // Tab click handler
          tab.addEventListener('click', () => {
            // Deactivate all tabs
            Object.values(tabsData).forEach(({ tab: t, content: c }) => {
              t.classList.remove('active');
              c.classList.remove('active');
            });
            
            // Activate clicked tab
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
      
      // Activate first tab if none is active
      if (!activeTab && Object.keys(tabsData).length > 0) {
        const firstProvider = Object.keys(tabsData)[0];
        tabsData[firstProvider].tab.click();
      }
      
    } else {
      // Global error
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
  const names = {
    'gemini': '🔷 Gemini',
    'groq': '⚡ Groq',
    'huggingface': '🤗 HuggingFace',
    'together': '🌐 Together AI'
  };
  return names[provider] || provider;
}