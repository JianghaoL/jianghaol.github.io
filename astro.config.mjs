// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import rehypeArticle from './src/lib/rehype-article.mjs';

export default defineConfig({
  site: 'https://www.lijianghao.com',
  // Keep the existing URL shape: src/pages/[lang]/about.astro -> /en/about.html,
  // src/pages/[lang]/work-gallery/index.astro -> /en/work-gallery/index.html
  build: { format: 'preserve' },
  devToolbar: { enabled: false },
  vite: {
    build: {
      // Browsers the CSS bundle is compiled for. Lightning CSS adds the vendor
      // prefixes these need (e.g. -webkit-backdrop-filter for Safari < 18), so
      // the stylesheets in src/styles only ever use standard properties.
      cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
    },
  },
  integrations: [mdx()],
  markdown: {
    // Code blocks keep the site's own highlighter (public/js/blog/article-code.js).
    syntaxHighlight: false,
    processor: unified({ rehypePlugins: [rehypeArticle] }),
  },
});
