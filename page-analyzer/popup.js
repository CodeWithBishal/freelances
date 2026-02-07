document.addEventListener('DOMContentLoaded', () => {
  const geminiKeyInput = document.getElementById('geminiKey');
  const groqKeyInput = document.getElementById('groqKey');
  const hfKeyInput = document.getElementById('hfKey');
  const togetherKeyInput = document.getElementById('togetherKey');
  const extensionEnabled = document.getElementById('extensionEnabled');
  const statusDiv = document.getElementById('status');
  const saveBtn = document.getElementById('saveBtn');

  // Load existing configuration
  chrome.storage.local.get([
    'GEMINI_API_KEY', 
    'GROQ_API_KEY', 
    'HF_API_KEY', 
    'TOGETHER_API_KEY',
    'EXTENSION_ENABLED'
  ], (result) => {
    if (result.GEMINI_API_KEY) geminiKeyInput.value = result.GEMINI_API_KEY;
    if (result.GROQ_API_KEY) groqKeyInput.value = result.GROQ_API_KEY;
    if (result.HF_API_KEY) hfKeyInput.value = result.HF_API_KEY;
    if (result.TOGETHER_API_KEY) togetherKeyInput.value = result.TOGETHER_API_KEY;
    
    // Default to enabled if not set
    extensionEnabled.checked = result.EXTENSION_ENABLED !== false;
  });

  // Save configuration
  saveBtn.addEventListener('click', () => {
    const config = {
      GEMINI_API_KEY: geminiKeyInput.value.trim(),
      GROQ_API_KEY: groqKeyInput.value.trim(),
      HF_API_KEY: hfKeyInput.value.trim(),
      TOGETHER_API_KEY: togetherKeyInput.value.trim(),
      EXTENSION_ENABLED: extensionEnabled.checked
    };
    
    chrome.storage.local.set(config, () => {
      statusDiv.style.display = 'block';
      saveBtn.textContent = 'Saved!';
      setTimeout(() => {
        statusDiv.style.display = 'none';
        saveBtn.textContent = 'Save Configuration';
      }, 2000);
    });
  });
});