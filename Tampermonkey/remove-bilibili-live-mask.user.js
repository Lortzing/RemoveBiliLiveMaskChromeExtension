// ==UserScript==
// @name         Bilibili Live Mask Remover
// @name:zh-CN   哔哩哔哩直播遮罩移除
// @namespace    https://github.com/Lortzing/RemoveBiliLiveMaskChromeExtension
// @version      1.1.0
// @description  Neutralize blur masks in Bilibili live rooms without removing page nodes.
// @description:zh-CN  非破坏式取消哔哩哔哩直播间播放器中的局部模糊遮罩。
// @author       Lortzing
// @match        https://live.bilibili.com/*
// @match        http://live.bilibili.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 'bilibili-live-mask-remover-userscript-style';
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

  function installStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const host = document.head || document.documentElement;
    if (!host) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = MASK_CSS;
    host.appendChild(style);
  }

  installStyle();

  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID)) {
      installStyle();
    }
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
