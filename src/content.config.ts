import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Each project / post is a folder with one file per language:
 *   src/content/projects/<slug>/en.md   (or .mdx)
 *   src/content/projects/<slug>/zh.md
 * Folders starting with "_" (like _template) are ignored.
 *
 * Shared fields (category, date, thumbnail...) only need to be written in en.md;
 * zh.md inherits anything it does not set. See src/lib/content.ts.
 */
const keepCase = ({ entry }: { entry: string }) => entry.replace(/\.mdx?$/, '');

const list = z.array(z.string());
// Accept `date: 2026-12-01` with or without quotes; always stored as "YYYY-MM-DD".
const day = z.union([z.date(), z.string()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const projects = defineCollection({
  loader: glob({ pattern: '[!_]*/{en,zh}.{md,mdx}', base: './src/content/projects', generateId: keepCase }),
  schema: z.object({
    // ---- text shown on the project page (per language) ----
    title: z.string().optional(),
    summary: z.string().optional(),
    meta: list.optional(),            // the three hero chips: year · type · duration
    tech: list.optional(),
    roles: list.optional(),
    team: list.optional(),
    labels: z.object({ tech: z.string(), roles: z.string(), team: z.string() }).partial().optional(),
    metaIcons: z.array(z.enum(['calendar', 'folder', 'clock', 'platform'])).optional(),
    breadcrumb: z.object({ label: z.string(), href: z.string(), current: z.string() }).optional(),
    backLink: z.object({ label: z.string(), href: z.string() }).optional(), // replaces "All Projects" at the bottom
    seoDescription: z.string().optional(),
    // ---- text shown on cards (per language) ----
    cardTitle: z.string().optional(),  // defaults to title
    description: z.string().optional(),// gallery card back
    tagline: z.string().optional(),    // home page "Selected Work" line
    // ---- shared settings (write once in en.md) ----
    category: z.enum(['gameDevelopment', 'gameAudio', 'developmentTool', 'audioTool',
      'audioProduction', 'soundRedesignReels', 'theater']).optional(),
    date: day.optional(),
    thumbnail: z.string().optional(),
    featured: z.number().optional(),   // position in home "Selected Work" (1 = first)
    gallery: z.union([z.literal(false), z.object({
      tech: list.optional(), roles: list.optional(),
      star: z.boolean().optional(), aiUsed: z.boolean().optional(), mediaType: z.enum(['video']).optional(),
    })]).optional(),
    page: z.boolean().optional(),      // false = gallery card only, no detail page
    scripts: list.optional(),          // extra <script src> for this page
    styles: list.optional(),           // extra stylesheets for this page
    draft: z.boolean().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '[!_]*/{en,zh}.{md,mdx}', base: './src/content/blog', generateId: keepCase }),
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    date: day.optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    excerpt: z.string().optional(),
    fullExcerpt: z.string().optional(),
    image: z.string().optional(),
    tags: list.optional(),
    cardTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    scripts: list.optional(),
    styles: list.optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { projects, blog };
