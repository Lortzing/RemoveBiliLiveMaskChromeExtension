(() => {
  'use strict';

  const STYLE_ID = 'bilibili-live-mask-remover-style';
  const STORAGE_KEY = 'enabled';
  const MASK_CSS = `
#web-player-module-area-mask-panel,
.web-player-module-area-mask,
#web-player-module-area-mask-panel *,
.web-player-module-area-mask * {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  filter: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

#web-player-module-area-mask-panel,
.web-player-module-area-mask {
  pointer-events: none !important;
}
`;

  let enabled = true;
  let observer = null;

  function getStyleHost() {
    return document.head || document.documentElement;
  }

  function installStyle() {
    if (!enabled || document.getElementById(STYLE_ID)) {
      return;
    }

    const host = getStyleHost();
    if (!host) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = MASK_CSS;
    host.appendChild(style);
  }

  function removeStyle() {
    document.getElementById(STYLE_ID)?.remove();
  }

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);

    if (enabled) {
      installStyle();
    } else {
      removeStyle();
    }
  }

  function startStyleGuard() {
    if (observer || !document.documentElement) {
      return;
    }

    observer = new MutationObserver(() => {
      if (enabled && !document.getElementById(STYLE_ID)) {
        installStyle();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  chrome.storage.sync.get({ [STORAGE_KEY]: true }, (settings) => {
    if (chrome.runtime.lastError) {
      setEnabled(true);
    } else {
      setEnabled(settings[STORAGE_KEY]);
    }

    startStyleGuard();
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes[STORAGE_KEY]) {
      setEnabled(changes[STORAGE_KEY].newValue);
    }
  });
})();
