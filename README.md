# Bilibili Live Mask Remover

用于取消哔哩哔哩网页直播间播放器中的局部模糊/马赛克遮罩。项目同时提供 Chrome Manifest V3 扩展和 Tampermonkey/Violentmonkey 用户脚本。

## 特性

- 同时覆盖 `#web-player-module-area-mask-panel` 与 `.web-player-module-area-mask`。
- 在 `document-start` 阶段注入样式，尽量避免遮罩闪烁。
- 不直接删除页面节点，仅覆盖模糊、滤镜和背景样式，降低页面动态检查或重建节点造成的失效概率。
- Chrome 扩展提供启用/停用开关，设置通过 `chrome.storage.sync` 同步。
- 不读取直播内容，不收集数据，不发送网络请求，仅申请 `storage` 权限。

## 安装 Chrome 扩展

1. 下载或克隆本仓库。
2. 打开 `chrome://extensions/`。
3. 开启右上角的“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择仓库中的 `Chrome Extension` 目录。

安装后可点击工具栏图标启用或停用。设置修改后会在已打开的直播间中立即生效。

## 安装用户脚本

1. 安装 Tampermonkey 或 Violentmonkey。
2. 打开 `Tampermonkey/remove-bilibili-live-mask.user.js` 的 Raw 页面。
3. 确认安装。

用户脚本在匹配的直播间页面中默认启用。

## 工作原理

Bilibili 直播播放器的局部遮罩通常由以下选择器控制：

```css
#web-player-module-area-mask-panel
.web-player-module-area-mask
```

本项目通过高优先级 CSS 将 `backdrop-filter`、`filter`、背景和阴影重置，而不是移除对应 DOM。样式节点还会受到轻量级 `MutationObserver` 保护，若页面重建文档结构或删除样式，会自动恢复。

## 项目结构

```text
Chrome Extension/
├── content.js        # 页面样式注入与设置监听
├── manifest.json     # Manifest V3 配置
├── popup.css
├── popup.html
├── popup.js          # 启停开关
└── img/icon.png
Tampermonkey/
└── remove-bilibili-live-mask.user.js
.github/workflows/validate.yml
```

## 开发与校验

项目没有构建步骤。修改后可运行：

```bash
node --check "Chrome Extension/content.js"
node --check "Chrome Extension/popup.js"
node --check "Tampermonkey/remove-bilibili-live-mask.user.js"
node -e "JSON.parse(require('fs').readFileSync('Chrome Extension/manifest.json', 'utf8'))"
```

GitHub Actions 会在 push 和 pull request 时执行同样的基础校验。

## 兼容性与限制

- 当前面向 Chromium 系浏览器的 Manifest V3 扩展。
- 用户脚本可用于 Tampermonkey 与 Violentmonkey。
- Bilibili 若更换遮罩选择器，需要同步更新 Chrome 扩展和用户脚本中的 CSS。
- 本项目只改变本地页面显示，不改变直播源或服务端数据。

## License

[MIT](LICENSE)
