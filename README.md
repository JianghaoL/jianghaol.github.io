# lijianghao.com

个人作品集网站，中英双语，用 [Astro](https://astro.build) 生成静态页面，部署在 GitHub Pages。

## 本地运行

需要 Node.js 22.23 以上（推荐 24 LTS）。

```powershell
npm install        # 第一次，或 package.json 变了之后
npm run dev        # 本地预览：http://localhost:4321/en/index.html ，改文件后自动刷新
npm run build      # 生成正式网站到 dist/（GitHub 会自动做，一般不用手动跑）
npm test           # Shepard tone 引擎的单元测试
```

## 目录结构

```
src/
  content/              ← 平时只改这里
    projects/<slug>/    每个项目一个文件夹：en.md(x) + zh.md(x)
    blog/<slug>/        每篇文章一个文件夹：en.md(x) + zh.md(x)
  i18n/ui.ts            导航、按钮、标题等界面文字（中英两份）
  pages/                路由模板：每种页面只有一个模板
    [lang]/index.astro              首页
    [lang]/about.astro              About
    [lang]/work-gallery/index.astro 作品展廊
    [lang]/blog/index.astro         博客列表
    [lang]/blog/[slug].astro        所有博客文章
    [lang]/project-pages/[slug].astro  所有项目页
  layouts/BaseLayout.astro  所有页面共用的 <head>、导航、页脚
  components/           Header、Footer、简历弹窗，以及 MDX 里可用的内容块
  lib/content.ts        读取内容、合并中英文
  styles/               全部样式（Astro 打包压缩），见下面"样式"
public/                 原样发布的文件
  assets/               图片、视频、音频、PDF
  js/                   前端脚本
  css/blog/             个别博客文章自带的 demo 样式
```

`[lang]` 会生成 `/en/` 和 `/zh/` 两份页面，网址和以前完全一样，比如 `/en/project-pages/mantle.html`。

## 加一个新项目

1. 把 `src/content/projects/_template/` 复制一份，文件夹改成项目网址名，例如 `my-game`。
2. 改 `en.mdx`：上面 `---` 之间是设置，下面是正文。
3. 改 `zh.mdx`：只写需要翻译的文字，日期、分类、缩略图等会自动沿用英文版。暂时不写 zh 也可以，中文页面会先显示英文内容。
4. 图片放进 `public/assets/images/...`，在文件里用 `/assets/images/...` 引用。

保存后会自动生成 `/en/project-pages/my-game.html` 和 `/zh/...`，作品展廊会出现这张卡片，首页"精选作品"也会出现（如果设置了 `featured`）。

正文有两种写法：

- `.md`：纯 Markdown，整篇放在一个居中的文字栏里。
- `.mdx`：可以用这些内容块组合版式（不需要 import）：
  `<TextBlock>`、`<FullImage>`、`<MediaText>`、`<Quote>`、`<Video>`、`<Links>`。
  用法见 `_template/en.mdx` 和 `src/components/blocks/` 里每个文件开头的注释。

旧项目迁移过来时保留了原来的 HTML 正文，放在同一文件夹的 `en.html` / `zh.html` 里。想改这些页面的正文，直接编辑对应的 `.html` 文件；也可以以后慢慢改写成 `.mdx`，然后删掉 `.html`。

## 写一篇博客

复制 `src/content/blog/_template/`，用 Markdown 写正文：

- 每个 `## 标题` 会自动变成一节，并出现在左侧"本页目录"里。
- ` ```cpp ` 这样的代码块会自动加上语言标签和高亮。
- 如果需要交互 demo，在 frontmatter 里写 `scripts:` / `styles:`，文件放在 `public/js/blog/`、`public/css/blog/`。Shepard tone 那篇就是这样做的。

## 样式

所有样式在 `src/styles/`，由 Astro 打包成一个压缩后的 CSS 文件（带哈希，浏览器缓存不会读到旧版）。

```
src/styles/
  tokens.css        设计变量：颜色、字体、圆角、阴影、动效。改主题只改这里
  base.css          重置 + 元素默认样式（body、标题、section、焦点框）
  layout.css        导航栏、section 外框、页脚
  components/       可复用组件：按钮、标签、播放器、简历弹窗、液态玻璃材质……
  pages/            页面专属样式
  blog/             博客列表、文章页
  global.css        按顺序引入以上文件；顺序就是层叠顺序
```

- 全站样式由 `BaseLayout.astro` 引入 `global.css`；作品展廊、博客、文章、项目页各自在模板里再引入自己的那份。
- 颜色、圆角、阴影请用 `tokens.css` 里的变量，不要写死数值。强调色的半透明版本写成 `rgb(var(--accent-rgb) / 0.2)`。
- `components/liquid-glass.css` 是玻璃材质（配合 `public/js/liquid-glass.js`），放在最后，所以能覆盖任何表面。

## 改界面文字

导航、按钮、首页和 About 页的文字都在 `src/i18n/ui.ts`，中英文各一份，key 要一一对应，少了 `npm run build` 会报错。

## 发布

- 在任何 branch 上 push，GitHub Actions 都会自动跑测试和构建，用来检查有没有出错。
- 合并或 push 到 `main` 后才会发布到 www.lijianghao.com。
- 平时开新 branch 做页面，用 `npm run dev` 在本地看效果，不需要 push。

## 旧网址

- `/about.html`、`/project-pages/xxx.html` 这类不带语言前缀的旧地址，会按访客的语言跳到 `/en/` 或 `/zh/`。
- 改过名的页面写在 `src/pages/[...legacy].astro` 的 `MOVED` 列表里。
