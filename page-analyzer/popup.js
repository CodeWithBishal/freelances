document.addEventListener('DOMContentLoaded', () => {
  // ── Elements ──────────────────────────────────
  const pages = document.querySelectorAll('.page');
  const toast = document.getElementById('toast');

  // Setup page
  const setupGeminiInput = document.getElementById('setup-gemini');
  const setupNvidiaInput = document.getElementById('setup-nvidia');
  const setupModelSelect = document.getElementById('setup-model');
  const setupSaveBtn = document.getElementById('setup-save-btn');

  // Home page
  const cardQuiz = document.getElementById('card-quiz');
  const cardSelection = document.getElementById('card-selection');
  const cardCoding = document.getElementById('card-coding');
  const btnSettings = document.getElementById('btn-settings');
  const activeModeBar = document.getElementById('active-mode-bar');
  const activeModeName = document.getElementById('active-mode-name');

  // Quiz page
  const quizBack = document.getElementById('quiz-back');
  const optAuto = document.getElementById('opt-auto');
  const optManual = document.getElementById('opt-manual');
  const quizActivateBtn = document.getElementById('quiz-activate-btn');

  // Settings page
  const settingsBack = document.getElementById('settings-back');
  const settingsEnabled = document.getElementById('settings-enabled');
  const settingsGeminiInput = document.getElementById('settings-gemini');
  const settingsNvidiaInput = document.getElementById('settings-nvidia');
  const settingsModelSelect = document.getElementById('settings-model');
  const settingsSaveBtn = document.getElementById('settings-save-btn');

  // ── State ─────────────────────────────────────
  let selectedQuizOption = null; // 'auto' | 'manual'
  let selectedModel = 'gemini'; // 'gemini' | 'qwen'

  // ── Navigation ────────────────────────────────
  function showPage(id) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ── Storage helpers ───────────────────────────
  const STORAGE_KEYS = [
    'GEMINI_API_KEY', 'NVIDIA_API_KEY', 'SELECTED_MODEL',
    'EXTENSION_ENABLED', 'SETUP_COMPLETE', 'ACTIVE_MODE', 'QUIZ_AUTO_CAPTURE'
  ];

  function loadStorage() {
    return new Promise(resolve => {
      chrome.storage.local.get(STORAGE_KEYS, resolve);
    });
  }

  function saveStorage(data) {
    return new Promise(resolve => {
      chrome.storage.local.set(data, resolve);
    });
  }

  // ── Init ──────────────────────────────────────
  async function init() {
    const data = await loadStorage();

    const hasGeminiKey = !!(data.GEMINI_API_KEY && data.GEMINI_API_KEY.trim());
    const hasQwenKey = !!(data.NVIDIA_API_KEY && data.NVIDIA_API_KEY.trim());

    if (!data.SELECTED_MODEL && hasQwenKey && !hasGeminiKey) {
      selectedModel = 'qwen';
    }

    // Load selected model
    if (data.SELECTED_MODEL) {
      selectedModel = data.SELECTED_MODEL;
      if (setupModelSelect) setupModelSelect.value = selectedModel;
      if (settingsModelSelect) settingsModelSelect.value = selectedModel;
    }

    if (setupModelSelect) setupModelSelect.value = selectedModel;
    if (settingsModelSelect) settingsModelSelect.value = selectedModel;

    const hasRequiredKey = selectedModel === 'qwen' ? hasQwenKey : hasGeminiKey;
    const isSetupComplete = !!data.SETUP_COMPLETE && hasRequiredKey;

    if (!isSetupComplete) {
      if (data.GEMINI_API_KEY) setupGeminiInput.value = data.GEMINI_API_KEY;
      if (data.NVIDIA_API_KEY) setupNvidiaInput.value = data.NVIDIA_API_KEY;
      validateSetup();
      showPage('page-setup');
    } else {
      showHomePage(data);
    }
  }

  function showHomePage(data) {
    if (data && data.ACTIVE_MODE) {
      activeModeBar.classList.add('visible');
      const modeLabels = { quiz: '📝 Quiz Mode', coding: '💻 Coding Mode', selection: '🖱️ Selection Mode' };
      activeModeName.textContent = modeLabels[data.ACTIVE_MODE] || data.ACTIVE_MODE;
    } else {
      activeModeBar.classList.remove('visible');
    }
    showPage('page-home');
  }

  // ── Setup Page Logic ──────────────────────────
  function validateSetup() {
    const model = setupModelSelect?.value || 'gemini';
    const hasRequiredKey = model === 'qwen'
      ? setupNvidiaInput.value.trim()
      : setupGeminiInput.value.trim();
    setupSaveBtn.disabled = !hasRequiredKey;
  }

  setupGeminiInput?.addEventListener('input', validateSetup);
  setupNvidiaInput?.addEventListener('input', validateSetup);
  setupModelSelect?.addEventListener('change', validateSetup);

  setupSaveBtn.addEventListener('click', async () => {
    const model = setupModelSelect?.value || 'gemini';
    const config = {
      EXTENSION_ENABLED: true,
      SETUP_COMPLETE: true,
      SELECTED_MODEL: model
    };
    
    if (model === 'qwen') {
      config.NVIDIA_API_KEY = setupNvidiaInput.value.trim();
    } else {
      config.GEMINI_API_KEY = setupGeminiInput.value.trim();
    }
    
    await saveStorage(config);
    showToast(`Setup complete with ${model.toUpperCase()}! 🎉`);
    setTimeout(() => showHomePage(config), 300);
  });

  // ── Home Page Logic ───────────────────────────
  cardQuiz.addEventListener('click', () => {
    selectedQuizOption = null;
    optAuto.classList.remove('selected');
    optManual.classList.remove('selected');
    quizActivateBtn.disabled = true;
    showPage('page-quiz');
  });

  cardCoding.addEventListener('click', async () => {
    await saveStorage({ ACTIVE_MODE: 'coding' });
    showToast('Coding mode activated! 💻');
    notifyTabsOfModeChange('coding');
  });

  cardSelection.addEventListener('click', async () => {
    await saveStorage({ ACTIVE_MODE: 'selection' });
    showToast('Selection mode activated! 🖱️');
    notifyTabsOfModeChange('selection');
  });

  btnSettings.addEventListener('click', async () => {
    const data = await loadStorage();
    settingsEnabled.checked = data.EXTENSION_ENABLED !== false;
    if (data.GEMINI_API_KEY) settingsGeminiInput.value = data.GEMINI_API_KEY;
    if (data.NVIDIA_API_KEY) settingsNvidiaInput.value = data.NVIDIA_API_KEY;
    if (data.SELECTED_MODEL) {
      settingsModelSelect.value = data.SELECTED_MODEL;
      selectedModel = data.SELECTED_MODEL;
    }
    showPage('page-settings');
  });

  // ── Quiz Options Page Logic ───────────────────
  quizBack.addEventListener('click', async () => {
    const data = await loadStorage();
    showHomePage(data);
  });

  optAuto.addEventListener('click', () => {
    selectedQuizOption = 'auto';
    optAuto.classList.add('selected');
    optManual.classList.remove('selected');
    quizActivateBtn.disabled = false;
  });

  optManual.addEventListener('click', () => {
    selectedQuizOption = 'manual';
    optManual.classList.add('selected');
    optAuto.classList.remove('selected');
    quizActivateBtn.disabled = false;
  });

  quizActivateBtn.addEventListener('click', async () => {
    if (!selectedQuizOption) return;
    const isAutoCapture = selectedQuizOption === 'auto';
    await saveStorage({
      ACTIVE_MODE: 'quiz',
      QUIZ_AUTO_CAPTURE: isAutoCapture
    });
    showToast(isAutoCapture ? 'Auto-capture quiz mode on! 🔄' : 'Manual quiz mode on! 👆');
    notifyTabsOfModeChange('quiz');

    setTimeout(async () => {
      const data = await loadStorage();
      showHomePage(data);
    }, 400);
  });

  // ── Settings Page Logic ───────────────────────
  settingsBack.addEventListener('click', async () => {
    const data = await loadStorage();
    showHomePage(data);
  });

  settingsModelSelect?.addEventListener('change', async (e) => {
    selectedModel = e.target.value;
    await saveStorage({ SELECTED_MODEL: selectedModel });
  });

  settingsSaveBtn.addEventListener('click', async () => {
    const model = settingsModelSelect?.value || 'gemini';
    const config = {
      EXTENSION_ENABLED: settingsEnabled.checked,
      SELECTED_MODEL: model
    };
    
    if (model === 'qwen') {
      const nvidiaKey = settingsNvidiaInput.value.trim();
      if (!nvidiaKey) {
        showToast('Enter your NVIDIA API key');
        return;
      }
      config.NVIDIA_API_KEY = nvidiaKey;
    } else {
      const geminiKey = settingsGeminiInput.value.trim();
      if (!geminiKey) {
        showToast('Enter your Gemini API key');
        return;
      }
      config.GEMINI_API_KEY = geminiKey;
    }

    await saveStorage(config);
    showToast('Settings saved! ✅');
  });

  // ── Notify content scripts of mode change ─────
  function notifyTabsOfModeChange(mode) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id && !tab.url?.startsWith('chrome://')) {
          chrome.tabs.sendMessage(tab.id, { action: 'MODE_CHANGED', mode }).catch(() => { });
        }
      });
    });
  }

  // ── Start ─────────────────────────────────────
  init();
});