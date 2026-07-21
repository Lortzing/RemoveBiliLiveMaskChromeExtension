(() => {
  'use strict';

  const STORAGE_KEY = 'enabled';
  const checkbox = document.getElementById('enabled');
  const status = document.getElementById('status');

  function render(enabled) {
    checkbox.checked = enabled;
    status.textContent = enabled ? '已启用' : '已停用';
  }

  chrome.storage.sync.get({ [STORAGE_KEY]: true }, (settings) => {
    const enabled = chrome.runtime.lastError ? true : Boolean(settings[STORAGE_KEY]);
    render(enabled);
    checkbox.disabled = false;
  });

  checkbox.addEventListener('change', () => {
    const enabled = checkbox.checked;
    checkbox.disabled = true;
    status.textContent = '正在保存…';

    chrome.storage.sync.set({ [STORAGE_KEY]: enabled }, () => {
      if (chrome.runtime.lastError) {
        render(!enabled);
        status.textContent = '保存失败';
      } else {
        render(enabled);
      }

      checkbox.disabled = false;
    });
  });
})();
