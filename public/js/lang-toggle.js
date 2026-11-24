/**
 * Language toggle. The other-language URL is computed at build time
 * (data-href on the button); this only remembers the visitor's choice so the
 * root redirect (/js/language-redirect.js) sends them to the same language next time.
 */
(function () {
  'use strict';
  var lang = document.documentElement.lang.indexOf('zh') === 0 ? 'zh' : 'en';
  try { localStorage.setItem('preferred-lang', lang); } catch (_) { /* storage is optional */ }

  var btn = document.querySelector('.lang-toggle');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    try { localStorage.setItem('preferred-lang', btn.getAttribute('data-lang')); } catch (_) { /* ignore */ }
    window.location.href = btn.getAttribute('data-href') + window.location.hash;
  });
})();
