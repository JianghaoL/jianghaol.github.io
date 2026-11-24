import { ui } from './ui';

export const languages = ['en', 'zh'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'en';
export type UiKey = keyof (typeof ui)['en'];

/** Build-time translation lookup: t('nav.home'). */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    const value = ui[lang][key] ?? ui[defaultLang][key];
    if (value === undefined) throw new Error(`Missing UI string "${key}" for "${lang}"`);
    return value;
  };
}

/** <html lang> value. */
export const htmlLang = (lang: Lang) => (lang === 'zh' ? 'zh-CN' : 'en');

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'zh' : 'en');

/** Absolute URL of a page inside a language folder: url('en', 'about.html') -> /en/about.html */
export const url = (lang: Lang, path = 'index.html') => `/${lang}/${path.replace(/^\//, '')}`;

/** getStaticPaths() helper for pages that exist once per language. */
export const langPaths = () => languages.map((lang) => ({ params: { lang } }));

// Every key must exist in both languages.
const missing = (Object.keys(ui.en) as UiKey[]).filter((k) => !(k in ui.zh))
  .concat((Object.keys(ui.zh) as UiKey[]).filter((k) => !(k in ui.en)));
if (missing.length) throw new Error(`UI strings missing in one language: ${missing.join(', ')}`);
