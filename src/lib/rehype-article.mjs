/*
 * Shapes Markdown blog posts like the hand-written ones:
 *   - each "## Heading" and the content after it becomes <section class="article-section">
 *   - fenced code blocks get the <div class="code-block"><span class="code-label">C++</span> wrapper
 * Only applies to files under src/content/blog/.
 */

const LABELS = { cpp: 'C++', csharp: 'C#', cs: 'C#', js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript',
  typescript: 'TypeScript', py: 'Python', python: 'Python', json: 'JSON', bash: 'Shell', sh: 'Shell', glsl: 'GLSL', hlsl: 'HLSL' };

const text = (node) => node.type === 'text' ? node.value : (node.children || []).map(text).join('');

export default function rehypeArticle() {
  return (tree, file) => {
    const path = String(file.path || file.history?.[0] || '').replace(/\\/g, '/');
    // Projects get only the code-block wrapper; blog posts also get sections.
    const isBlog = path.includes('/src/content/blog/');
    wrapCode(tree);
    if (!isBlog) return;
    const children = [];
    let section = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        // The heading keeps its id (added by Astro) so the "On this page" links land on it.
        section = { type: 'element', tagName: 'section', properties: { className: ['article-section'] }, children: [node] };
        children.push(section);
      } else if (section) {
        section.children.push(node);
      } else {
        children.push(node);
      }
    }
    tree.children = children;
  };
}

function wrapCode(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (child.type === 'element' && child.tagName === 'pre') {
      const code = child.children?.find((c) => c.tagName === 'code');
      const cls = (code?.properties?.className || []).find((c) => String(c).startsWith('language-'));
      const lang = cls ? String(cls).slice(9) : '';
      const label = LABELS[lang] || lang.toUpperCase();
      return { type: 'element', tagName: 'div', properties: { className: ['code-block'] }, children: [
        ...(label ? [{ type: 'element', tagName: 'span', properties: { className: ['code-label'] }, children: [{ type: 'text', value: label }] }] : []),
        child,
      ] };
    }
    wrapCode(child);
    return child;
  });
}
