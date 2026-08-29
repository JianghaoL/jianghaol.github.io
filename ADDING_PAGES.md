# 新增网页与项目页面指南（供 AI Agent 执行）

本文档是本仓库新增网页、项目详情页及相关媒体内容时的执行规范。AI Agent 在开始工作前必须完整阅读本文档，并以仓库当前代码和现有页面为事实来源。

## 1. 固定原则

1. 从最新 `main` 创建独立分支，不直接修改或合并 `main`。
2. `src/site/` 是 HTML、CSS 和 JavaScript 的唯一长期可编辑源。
3. 根目录中的 `en/`、`zh/`、`project-pages/`、`css/`、`js/` 等文件是生成结果。
4. 媒体资源目前仍直接保存在根目录 `assets/` 下，不放入 `src/site/`。
5. 不删除、放宽或绕过内容合同、CSP、链接、资源、路由及安全检查。
6. 不臆造标题、正文、翻译、日期、角色、技术栈、项目描述或媒体说明。缺少内容时应向用户询问。
7. 不添加用户没有要求的 CTA、标签、角标、占位文案、营销文字或装饰组件。
8. 新页面必须同时满足桌面、平板、手机、键盘和无障碍偏好。
9. 只有构建、内容合同、路由、资源、交互和视觉回归全部通过后才能创建 PR。
10. 不自动合并 PR。

## 2. 开工前检查

```powershell
git switch main
git pull --ff-only
git status --short --branch
git switch -c codex/add-<page-slug>
```

要求：

- 分支名使用 `codex/` 前缀。
- `<page-slug>` 使用小写 kebab-case，例如 `audio-callback-system`。
- 如果工作树已有用户改动，不得覆盖、清理或顺带格式化。
- 不提交 `.idea/`、测试缓存、截图、临时构建目录或无关文件。

## 3. 先判断页面类型

### 3.1 普通页面

适用于 About、Blog、独立介绍页等。

通常需要创建：

```text
src/site/en/<slug>.html
src/site/zh/<slug>.html
src/site/<slug>.html
```

- `en/` 为英文页面。
- `zh/` 为中文页面。
- 无语言前缀的页面用于兼容旧 URL 和语言跳转。

复制结构最接近的现有页面，不要从空白 HTML 重新搭建。

### 3.2 项目详情页

通常需要创建完整的三路页面：

```text
src/site/en/project-pages/<slug>.html
src/site/zh/project-pages/<slug>.html
src/site/project-pages/<slug>.html
```

不要直接使用当前的 `src/site/project-template.html`。它包含旧路径和占位内容。应复制结构及媒体类型最接近的现有项目页，例如：

- 游戏开发项目：`whiteout.html`
- 音频工具或程序项目：`soundboard.html`
- Sound Redesign 项目：`ripout-redesign.html`

复制页面时保留原页面使用的公共 CSS、脚本、CSP、header partial 和 footer partial，再替换明确属于新项目的内容。

## 4. 页面必须保留的基础结构

每个展示页面必须包含：

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="...">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="stylesheet" href="/css/reset.css">
<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/apple-refactor.css">
```

项目页还应包含：

```html
<link rel="stylesheet" href="/css/pages/project-detail.css">
```

要求：

- CSP 必须恰好出现一次。
- 不允许内联 `<script>`。
- 不允许 `style="..."`。
- 外链 `target="_blank"` 必须包含 `rel="noopener noreferrer"`。
- 页面内 `id` 必须唯一。
- 不使用动态 `innerHTML` 拼接用户或内容数据。
- 所有本地 `href`、`src`、`poster` 和 `data-audio` 必须存在。

## 5. Header、Footer 与 partial

源页面通过以下语法引用公共模板：

```html
{{> header/<existing-header-name>}}
{{> footer/<existing-footer-name>}}
```

partial 位于：

```text
src/partials/header/
src/partials/footer/
```

执行规则：

1. 优先复制同目录、同页面类型的现有页面并沿用其 partial。
2. 不要仅凭名称猜测相对路径是否正确。
3. 如果必须创建新的 partial，应确认所有相对导航链接在对应路由下正确。
4. 新增或重新分配 partial 后，同步更新 `src/partials/manifest.json` 的路由记录。
5. 不要在生成后的根目录 HTML 中长期维护重复 header/footer。

## 6. 媒体资源

媒体资源继续放在根目录 `assets/`：

```text
assets/images/
assets/audio/
assets/videos/
assets/documents/
```

项目图片建议放在：

```text
assets/images/project-pages/<Project Name>/
```

推荐使用站点绝对路径：

```html
<img src="/assets/images/project-pages/Example/cover.jpg" alt="准确描述图片内容" loading="lazy">
<audio src="/assets/audio/example.mp3"></audio>
<video poster="/assets/images/project-pages/Example/poster.jpg"></video>
```

要求：

- 图片必须有准确 `alt`；纯装饰图片才使用空 `alt`。
- 视频应提供 `poster`，除非现有同类组件明确不需要。
- 原始媒体永久保留。
- 不为了构建通过而把不存在的资源加入 `known-missing-references.json`。
- 新页面不得引入新的缺失资源。

## 7. 将项目加入 Work Gallery

Work Gallery 数据位于：

```text
src/site/work-gallery/gallery.js
```

在 `galleryData` 中添加一个对象：

```js
{
  id: 15,
  titleKey: "project.example.title",
  category: CATEGORIES.GAME_AUDIO,
  year: 2026,
  date: "2026-09-01",
  thumbnail: "/assets/images/thumbnails/example.jpg",
  descriptionKey: "project.example.summary",
  techStack: ["Wwise", "FMOD"],
  projectPage: "../project-pages/example.html",
  roles: ["Sound Design"],
  aiUsed: false
}
```

要求：

- `id` 唯一。
- `date` 使用 `YYYY-MM-DD`。
- 优先使用现有 `CATEGORIES`，除非用户明确要求新分类。
- 项目顺序必须符合用户要求；不要自行重新排序全部项目。
- `projectPage` 应指向当前语言目录中的项目页。
- 不添加没有实际内容的占位卡片。

标题和摘要翻译位于：

```text
src/site/js/translations.js
```

英文和中文对象中都需要加入：

```js
'project.example.title': 'Example',
'project.example.summary': 'User-provided English summary.',
```

```js
'project.example.title': '示例项目',
'project.example.summary': '用户提供的中文摘要。',
```

不得使用机器生成内容替代用户尚未提供的正式文案，除非用户明确授权。

## 8. 首页、导航或 Blog 的可选登记

只有用户明确要求时才把新页面加入以下位置：

- 首页 Selected Work
- 首页其他项目区域
- 全站导航
- Blog 目录
- 项目页 Previous/Next 导航

涉及双语内容时，应同时更新英文、中文及必要的无语言前缀源页面。

不要因为新增项目而自动改变现有项目顺序。

## 9. 内容合同：新增页面时的关键步骤

内容基线位于：

```text
tests/fixtures/content-baseline.json
```

`npm run build` 会先把 `src/site/` 构建到临时目录，再与旧基线比较。新增路由后，第一次构建被旧基线拦截是预期行为，不代表页面代码错误。

### 9.1 当前仓库的受控接受流程

本仓库目前没有独立的 `accept-content` 命令。因此，首次加入新路由时必须谨慎完成以下引导步骤：

1. 在 `src/site/` 中创建新的源页面。
2. 同时从相同现有页面复制对应的生成页面，路径等于移除 `src/site/` 前缀。
3. 分别编辑源页面和临时生成页面，使两者的可见文字和内容 URL 完全一致。
4. 源页面保留 `{{> ...}}` partial；生成页面必须保留已经展开的真实 header/footer，不能包含未展开 token。
5. 运行 `npm run baseline`，明确接受本次新增页面及用户授权的内容变化。
6. 立即运行 `npm run build`。构建会从源重新生成页面，并验证其内容与刚更新的基线一致。
7. 检查最终 Git diff，确认基线只新增或改变本次明确授权的路由。

路径映射示例：

```text
源：src/site/en/project-pages/example.html
生成：en/project-pages/example.html

源：src/site/zh/project-pages/example.html
生成：zh/project-pages/example.html

源：src/site/project-pages/example.html
生成：project-pages/example.html
```

### 9.2 内容合同禁止事项

- 不删除 `content-baseline.json`。
- 不让构建在合同失败时继续同步输出。
- 不修改合同提取规则以忽略新增文字或链接。
- 不把整个仓库的无关内容变化一起接受。
- 不运行 `npm run baseline` 后跳过 diff 审查。
- 不把新缺失资源加入 legacy 白名单。

如果无法确保生成页面与源页面一致，应停止并请求用户确认，或先单独实现一个经过审查的 `accept-content` 工具，不得临时关闭安全检查。

## 10. 构建与本地预览

需要 Node.js 22 或更高版本。

```powershell
npm run build
npm run check
npm run dev
```

命令用途：

- `npm run build`：展开 partial、验证内容合同并同步静态输出。
- `npm run check`：检查全部路由、内容、资源、重复 ID、CSP 和外链隔离。
- `npm run dev`：启动本地静态预览。

不得把“构建成功”等同于“页面完成”。

## 11. 必须完成的页面回归

至少检查：

1. 英文页面。
2. 中文页面。
3. 无语言前缀 URL 和语言跳转。
4. Work Gallery 卡片与详情页链接。
5. 图片、音频、视频、PDF 和外链。
6. Header、Footer、浏览进度条和返回导航。
7. 桌面约 1280px。
8. 平板约 768px。
9. 手机约 390px。
10. 横向溢出必须为 0。
11. 键盘焦点、Esc、弹窗焦点恢复（如页面包含弹窗）。
12. `prefers-reduced-motion`。
13. `prefers-reduced-transparency`。
14. `prefers-contrast: more`。
15. 浏览器控制台不得出现新错误或警告。

## 12. 提交与 PR

推荐按实际范围提交，例如：

```powershell
git add -- <明确列出的文件>
git commit -m "feat: add <project-name> project page"
```

提交后重新验证生成可复现：

```powershell
npm run build
git diff --exit-code
npm run check
```

然后推送并创建 PR：

```powershell
git push -u origin codex/add-<page-slug>
```

PR 必须列明：

- 新增路由。
- 新增或复用的媒体资源。
- Work Gallery、翻译、导航或首页登记变化。
- 内容基线中被明确接受的变化。
- 构建和检查结果。
- 桌面、平板、手机视觉结果。
- 任何未修改的原站遗留问题。

等待 GitHub Actions 成功后再交付 PR；不要自动合并。

## 13. 可直接交给 AI Agent 的请求模板

```text
请完整阅读仓库根目录 ADDING_PAGES.md，并严格按照其中流程执行。

请从最新 main 创建 codex/add-<slug> 分支，新增以下页面/项目：
- 页面类型：<普通页面 / 项目详情页>
- slug：<slug>
- 英文标题：<title>
- 中文标题：<title>
- 英文正文或项目资料：<完整内容>
- 中文正文或项目资料：<完整内容>
- 日期：<YYYY-MM-DD>
- 分类：<现有分类>
- 技术栈：<列表>
- 我的角色：<列表>
- 团队信息：<内容>
- 图片、音频、视频或 PDF：<明确文件路径>
- 是否加入 Work Gallery：<是/否>
- 是否加入首页：<是/否>
- 指定项目顺序：<位置或“不改变现有顺序”>

这是一次明确授权的内容新增。只更新上述路由及其直接依赖的翻译、媒体登记和内容基线；不要改写或重排其他内容，不要添加任何未要求的文字或组件。

完成后运行 build、check 和桌面/平板/手机浏览器回归，推送分支并创建 PR。不要合并 main。
```

## 14. 最终验收定义

满足以下所有条件才算完成：

- 新页面在所有约定 URL 可访问。
- 英文和中文内容准确。
- Work Gallery 或其他入口按要求可达。
- 全部媒体正常加载和播放。
- 没有新增缺失资源。
- 内容基线只包含授权变化。
- 全部检查通过。
- 三种主要断点没有遮挡、截断、错位或横向溢出。
- GitHub Actions 成功。
- PR 已创建但未合并。

