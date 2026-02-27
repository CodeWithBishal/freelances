document.addEventListener('DOMContentLoaded', () => {
  // ── Elements ──────────────────────────────────
  const pages = document.querySelectorAll('.page');
  const toast = document.getElementById('toast');

  // Setup page
  const setupGeminiInput = document.getElementById('setup-gemini');
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
    'GEMINI_API_KEY',
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

    if (!data.SETUP_COMPLETE || !data.GEMINI_API_KEY) {
      if (data.GEMINI_API_KEY) setupGeminiInput.value = data.GEMINI_API_KEY;
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
    setupSaveBtn.disabled = !setupGeminiInput.value.trim();
  }

  setupGeminiInput.addEventListener('input', validateSetup);

  setupSaveBtn.addEventListener('click', async () => {
    const config = {
      GEMINI_API_KEY: setupGeminiInput.value.trim(),
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

  settingsSaveBtn.addEventListener('click', async () => {
    const key = settingsGeminiInput.value.trim();
    if (!key) {
      showToast('Enter your Gemini API key');
      return;
    }

    await saveStorage({
      GEMINI_API_KEY: key,
      EXTENSION_ENABLED: settingsEnabled.checked
    });
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