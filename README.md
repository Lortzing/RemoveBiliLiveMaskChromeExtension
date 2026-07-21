# Bilibili Live Mask Remover

用于取消哔哩哔哩网页直播间播放器中的局部模糊/马赛克遮罩。项目同时提供适用于 Google Chrome、Microsoft Edge 等 Chromium 浏览器的 Manifest V3 扩展，以及 Tampermonkey/Violentmonkey 用户脚本。

## 特性

- 同时覆盖 `#web-player-module-area-mask-panel` 与 `.web-player-module-area-mask`。
- 在 `document-start` 阶段注入样式，尽量避免遮罩闪烁。
- 不直接删除页面节点，仅覆盖模糊、滤镜和背景样式，降低页面动态检查或重建节点造成的失效概率。
- Chrome / Edge 扩展提供启用/停用开关，设置通过 `chrome.storage.sync` 同步。
- Chrome 与 Edge 共用同一个扩展安装包，不需要单独构建 Edge 版本。
- 不读取直播内容，不收集数据，不发送网络请求，仅申请 `storage` 权限。

## 安装 Chrome / Edge 扩展

从 GitHub Release 下载 Chromium 扩展 ZIP 并解压，或直接克隆本仓库。Chrome 与 Edge 使用相同的解压目录。

### Google Chrome

1. 打开 `chrome://extensions/`。
2. 开启右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择 Release ZIP 解压后的目录，或仓库中的 `Chrome Extension` 目录。

### Microsoft Edge

1. 打开 `edge://extensions/`。
2. 开启左侧的“开发人员模式”。
3. 点击“加载解压缩的扩展”。
4. 选择 Release ZIP 解压后的目录，或仓库中的 `Chrome Extension` 目录。

安装后可点击浏览器工具栏中的扩展图标启用或停用。设置修改后会在已打开的直播间中立即生效。

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
Chrome Extension/       # Chrome / Edge 共用的 Chromium 扩展源码
├── content.js          # 页面样式注入与设置监听
├── manifest.json       # Manifest V3 配置
├── popup.css
├── popup.html
├── popup.js            # 启停开关
└── img/icon.png
Tampermonkey/
└── remove-bilibili-live-mask.user.js
.github/workflows/
├── validate.yml        # 基础语法与 Manifest 校验
└── release.yml         # Chromium 扩展打包与 Release 发布
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

## 打包与发布

在 GitHub Actions 中手动运行 **Package Chromium Extension**，即可生成可同时安装到 Chrome 和 Edge、且仅包含 `Chrome Extension/` 内部文件的 ZIP Artifact。

正式发布时，先确保 `Chrome Extension/manifest.json` 中的版本号正确，然后推送相同版本的标签：

```bash
git tag v1.1.0
git push origin v1.1.0
```

工作流会检查标签与 Manifest 版本是否一致，并自动：

- 将 `Chrome Extension/` 内部内容打包为 Chromium 扩展 ZIP，确保 `manifest.json` 位于压缩包根目录；
- 上传保留 30 天的 GitHub Actions Artifact；
- 创建或更新对应的 GitHub Release；
- 将同一个扩展 ZIP 作为 Chrome / Edge 共用的 Release Asset。

## 兼容性与限制

- 支持 Google Chrome、Microsoft Edge 及其他兼容 Manifest V3 的 Chromium 系浏览器。
- Chrome 和 Edge 使用同一份扩展代码与 Release ZIP；当前无需浏览器专属构建。
- 用户脚本可用于 Tampermonkey 与 Violentmonkey。
- Bilibili 若更换遮罩选择器，需要同步更新 Chromium 扩展和用户脚本中的 CSS。
- 本项目只改变本地页面显示，不改变直播源或服务端数据。

## License

[MIT](LICENSE)
