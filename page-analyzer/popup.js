document.addEventListener('DOMContentLoaded', () => {
  // ── Elements ──────────────────────────────────
  const pages = document.querySelectorAll('.page');
  const toast = document.getElementById('toast');

  // Setup page
  const setupInputs = {
    gemini: document.getElementById('setup-gemini'),
    groq: document.getElementById('setup-groq'),
    hf: document.getElementById('setup-hf'),
    together: document.getElementById('setup-together')
  };
  const setupSaveBtn = document.getElementById('setup-save-btn');

  // Home page
  const cardQuiz = document.getElementById('card-quiz');
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
  const settingsInputs = {
    gemini: document.getElementById('settings-gemini'),
    groq: document.getElementById('settings-groq'),
    hf: document.getElementById('settings-hf'),
    together: document.getElementById('settings-together')
  };
  const settingsSaveBtn = document.getElementById('settings-save-btn');

  // ── State ─────────────────────────────────────
  let selectedQuizOption = null; // 'auto' | 'manual'

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
    'GEMINI_API_KEY', 'GROQ_API_KEY', 'HF_API_KEY', 'TOGETHER_API_KEY',
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

  function hasAnyKey(data) {
    return !!(data.GEMINI_API_KEY || data.GROQ_API_KEY || data.HF_API_KEY || data.TOGETHER_API_KEY);
  }

  // ── Init ──────────────────────────────────────
  async function init() {
    const data = await loadStorage();

    if (!data.SETUP_COMPLETE || !hasAnyKey(data)) {
      // Pre-fill setup inputs if keys exist (e.g. partial setup)
      if (data.GEMINI_API_KEY) setupInputs.gemini.value = data.GEMINI_API_KEY;
      if (data.GROQ_API_KEY) setupInputs.groq.value = data.GROQ_API_KEY;
      if (data.HF_API_KEY) setupInputs.hf.value = data.HF_API_KEY;
      if (data.TOGETHER_API_KEY) setupInputs.together.value = data.TOGETHER_API_KEY;
      validateSetup();
      showPage('page-setup');
    } else {
      showHomePage(data);
    }
  }

  function showHomePage(data) {
    // Show active mode indicator if one is set
    if (data && data.ACTIVE_MODE) {
      activeModeBar.classList.add('visible');
      const modeLabels = { quiz: '📝 Quiz Mode', coding: '💻 Coding Mode' };
      activeModeName.textContent = modeLabels[data.ACTIVE_MODE] || data.ACTIVE_MODE;
    } else {
      activeModeBar.classList.remove('visible');
    }
    showPage('page-home');
  }

  // ── Setup Page Logic ──────────────────────────
  function validateSetup() {
    const anyFilled = Object.values(setupInputs).some(input => input.value.trim().length > 0);
    setupSaveBtn.disabled = !anyFilled;
  }

  Object.values(setupInputs).forEach(input => {
    input.addEventListener('input', validateSetup);
  });

  setupSaveBtn.addEventListener('click', async () => {
    const config = {
      GEMINI_API_KEY: setupInputs.gemini.value.trim(),
      GROQ_API_KEY: setupInputs.groq.value.trim(),
      HF_API_KEY: setupInputs.hf.value.trim(),
      TOGETHER_API_KEY: setupInputs.together.value.trim(),
      EXTENSION_ENABLED: true,
      SETUP_COMPLETE: true
    };
    await saveStorage(config);
    showToast('Setup complete! 🎉');
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
    // Reload existing tabs to apply mode
    notifyTabsOfModeChange('coding');
  });

  btnSettings.addEventListener('click', async () => {
    const data = await loadStorage();
    settingsEnabled.checked = data.EXTENSION_ENABLED !== false;
    if (data.GEMINI_API_KEY) settingsInputs.gemini.value = data.GEMINI_API_KEY;
    if (data.GROQ_API_KEY) settingsInputs.groq.value = data.GROQ_API_KEY;
    if (data.HF_API_KEY) settingsInputs.hf.value = data.HF_API_KEY;
    if (data.TOGETHER_API_KEY) settingsInputs.together.value = data.TOGETHER_API_KEY;
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

    // Go back to home after brief delay
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

  settingsSaveBtn.addEventListener('click', async () => {
    const config = {
      GEMINI_API_KEY: settingsInputs.gemini.value.trim(),
      GROQ_API_KEY: settingsInputs.groq.value.trim(),
      HF_API_KEY: settingsInputs.hf.value.trim(),
      TOGETHER_API_KEY: settingsInputs.together.value.trim(),
      EXTENSION_ENABLED: settingsEnabled.checked
    };

    // Validate at least one key is present
    const anyKey = config.GEMINI_API_KEY || config.GROQ_API_KEY ||
      config.HF_API_KEY || config.TOGETHER_API_KEY;
    if (!anyKey) {
      showToast('Add at least one API key');
      return;
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