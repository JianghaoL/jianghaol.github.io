import { getCollection, type CollectionEntry } from 'astro:content';
import { languages, type Lang } from '../i18n/utils';

/*
 * Loads projects / blog posts and merges languages:
 *   - zh.md inherits every field it does not set from en.md
 *     (except cardTitle / labels / seoDescription, which default to zh's own text)
 *   - if a language file is missing entirely, that page shows the other language
 *     (so you can publish in English first and translate later)
 * A page body comes from the Markdown/MDX below the frontmatter, or - for pages
 * migrated from the old site - from a sibling en.html / zh.html file.
 */

const projectHtml = import.meta.glob('/src/content/projects/*/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const blogHtml = import.meta.glob('/src/content/blog/*/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

type Name = 'projects' | 'blog';

export interface Localized<N extends Name> {
  slug: string;
  lang: Lang;
  /** merged frontmatter for this language */
  data: CollectionEntry<N>['data'];
  /** English data (used e.g. for A-Z sorting) */
  en: CollectionEntry<N>['data'];
  /** entry to pass to render() when there is no legacy html body */
  entry: CollectionEntry<N>;
  /** raw HTML body for migrated pages, if present */
  html?: string;
  /** true when this language had no file and shows the other language */
  fallback: boolean;
}

const REQUIRED: Record<Name, string[]> = {
  projects: ['title', 'category', 'date', 'thumbnail'],
  blog: ['title', 'date', 'category', 'excerpt'],
};

// Fields whose default depends on this language's own text, so they are never
// copied from the other language (e.g. cardTitle falls back to this file's title).
const NO_INHERIT = ['cardTitle', 'labels', 'seoDescription'];

const cache = new Map<Name, Promise<Localized<any>[]>>();

function loadAll<N extends Name>(name: N): Promise<Localized<N>[]> {
  if (!cache.has(name)) cache.set(name, build(name));
  return cache.get(name)!;
}

async function build<N extends Name>(name: N): Promise<Localized<N>[]> {
  const entries = (await getCollection(name)) as CollectionEntry<N>[];
  const bySlug = new Map<string, Partial<Record<Lang, CollectionEntry<N>>>>();
  for (const entry of entries) {
    const [slug, lang] = entry.id.split('/') as [string, Lang];
    if (!bySlug.has(slug)) bySlug.set(slug, {});
    bySlug.get(slug)![lang] = entry;
  }

  const htmlMap = name === 'projects' ? projectHtml : blogHtml;
  const out: Localized<N>[] = [];
  for (const [slug, files] of bySlug) {
    const base = files.en ?? files.zh!;
    for (const lang of languages) {
      const own = files[lang];
      const entry = own ?? base;
      const inherited = own && own !== base
        ? Object.fromEntries(Object.entries(base.data).filter(([k]) => !NO_INHERIT.includes(k)))
        : base.data;
      const data = { ...inherited, ...(own?.data ?? {}) } as CollectionEntry<N>['data'];
      const bodyLang = entry.id.split('/')[1];
      for (const field of REQUIRED[name]) {
        if ((data as any)[field] === undefined) {
          throw new Error(`src/content/${name}/${slug}/${lang}.md is missing "${field}" (add it to en.md or ${lang}.md)`);
        }
      }
      if ((data as any).draft && import.meta.env.PROD) continue;
      out.push({
        slug, lang, data, entry,
        en: (files.en ?? base).data,
        html: htmlMap[`/src/content/${name}/${slug}/${bodyLang}.html`],
        fallback: !own,
      });
    }
  }
  return out.sort((a, b) => String((b.data as any).date).localeCompare(String((a.data as any).date)));
}

export const getProjects = async (lang: Lang) => (await loadAll('projects')).filter((p) => p.lang === lang);
export const getPosts = async (lang: Lang) => (await loadAll('blog')).filter((p) => p.lang === lang);

/** Projects that get their own detail page. */
export const hasPage = (p: Localized<'projects'>) => p.data.page !== false;

export const projectUrl = (lang: Lang, slug: string) => `/${lang}/project-pages/${slug}.html`;
export const postUrl = (lang: Lang, slug: string) => `/${lang}/blog/${slug}.html`;
