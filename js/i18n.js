/**
 * i18n — Internationalisation Module
 *
 * Detects the active language from the URL path (/en/… or /zh/…),
 * applies translations to elements carrying `data-i18n` attributes,
 * and wires up the language-toggle button to redirect between versions.
 *
 * Requires: translations.js (must be loaded BEFORE this script).
 *
 * Supports:
 *   data-i18n="key"            → sets element.textContent
 *   data-i18n-html="key"       → sets element.innerHTML
 *   data-i18n-placeholder="key"→ sets element.placeholder
 *   data-i18n-aria="key"       → sets element.getAttribute('aria-label')
 *
 * Adding a new language:
 *   1. Add a new object in translations.js  (e.g.  ja: { … })
 *   2. Create a /ja/ directory with the same page files
 *   3. Update the SUPPORTED_LANGS array below
 */

(function () {
  'use strict';

  // Languages the site supports — extend this list to add more.
  var SUPPORTED_LANGS = ['en', 'zh'];
  var DEFAULT_LANG = 'en';

  // ---------------------------------------------------------------
  // Detect language from URL path
  // ---------------------------------------------------------------
  function detectLang() {
    var path = window.location.pathname;       // e.g. /en/about.html
    for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
      var prefix = '/' + SUPPORTED_LANGS[i] + '/';
      if (path.indexOf(prefix) === 0 || path === '/' + SUPPORTED_LANGS[i]) {
        return SUPPORTED_LANGS[i];
      }
    }
    // Fallback: localStorage → browser language → default
    var stored = localStorage.getItem('preferred-lang');
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;
    if (navigator.language && navigator.language.toLowerCase().indexOf('zh') === 0) return 'zh';
    return DEFAULT_LANG;
  }

  // ---------------------------------------------------------------
  // Translation lookup
  // ---------------------------------------------------------------
  var translations = window.__translations || {};

  function t(key, lang) {
    var dict = translations[lang] || translations[DEFAULT_LANG] || {};
    return dict[key] !== undefined ? dict[key] : null;
  }

  // ---------------------------------------------------------------
  // Apply translations to the DOM
  // ---------------------------------------------------------------
  function applyTranslations(lang) {
    // Set <html lang="">
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : lang;

    // data-i18n  →  textContent
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      var val = t(key, lang);
      if (val !== null) els[i].textContent = val;
    }

    // data-i18n-html  →  innerHTML
    els = document.querySelectorAll('[data-i18n-html]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-html');
      var val = t(key, lang);
      if (val !== null) els[i].innerHTML = val;
    }

    // data-i18n-placeholder  →  placeholder attribute
    els = document.querySelectorAll('[data-i18n-placeholder]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-placeholder');
      var val = t(key, lang);
      if (val !== null) els[i].setAttribute('placeholder', val);
    }

    // data-i18n-aria  →  aria-label attribute
    els = document.querySelectorAll('[data-i18n-aria]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-aria');
      var val = t(key, lang);
      if (val !== null) els[i].setAttribute('aria-label', val);
    }
  }

  // ---------------------------------------------------------------
  // Build the URL for the other language version of the current page
  // ---------------------------------------------------------------
  function getAlternateUrl(currentLang) {
    var newLang = (currentLang === 'en') ? 'zh' : 'en';
    var path = window.location.pathname;
    // Replace the language prefix in the path
    var newPath = path.replace(
      new RegExp('^\/' + currentLang + '(\/|$)'),
      '/' + newLang + '$1'
    );
    return newPath + window.location.search + window.location.hash;
  }

  // ---------------------------------------------------------------
  // Wire up the language toggle button
  // ---------------------------------------------------------------
  function setupToggle(lang) {
    var btn = document.querySelector('.lang-toggle');
    if (!btn) return;

    // Set button text to show the OTHER language option
    var toggleText = t('lang.toggle', lang);
    if (toggleText !== null) btn.textContent = toggleText;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var newLang = (lang === 'en') ? 'zh' : 'en';
      localStorage.setItem('preferred-lang', newLang);
      window.location.href = getAlternateUrl(lang);
    });
  }

  // ---------------------------------------------------------------
  // Public API — exposed on window.i18n
  // ---------------------------------------------------------------
  var currentLang = detectLang();
  localStorage.setItem('preferred-lang', currentLang);

  window.i18n = {
    lang:  currentLang,
    t:     function (key) { return t(key, currentLang); },
    langs: SUPPORTED_LANGS
  };

  // ---------------------------------------------------------------
  // Initialise when DOM is ready
  // ---------------------------------------------------------------
  function init() {
    applyTranslations(currentLang);
    setupToggle(currentLang);
    // Dispatch custom event to notify that translations are ready
    document.dispatchEvent(new CustomEvent('i18nReady', { detail: { lang: currentLang } }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
