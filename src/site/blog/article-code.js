/**
 * Tiny, dependency-free C++ highlighter for the static snippets in blog posts.
 * It builds text nodes and token spans instead of injecting untrusted markup.
 */
(function () {
  'use strict';

  var keywordTokens = new Set([
    'alignas', 'alignof', 'break', 'case', 'catch', 'class', 'const',
    'constexpr', 'continue', 'default', 'delete', 'do', 'else', 'enum',
    'explicit', 'export', 'extern', 'for', 'friend', 'if', 'inline',
    'namespace', 'new', 'noexcept', 'operator', 'private', 'protected',
    'public', 'return', 'sizeof', 'static', 'struct', 'switch', 'template',
    'this', 'throw', 'try', 'typedef', 'typename', 'union', 'using',
    'virtual', 'volatile', 'while'
  ]);

  var typeTokens = new Set([
    'auto', 'bool', 'char', 'double', 'float', 'int', 'long', 'short',
    'signed', 'unsigned', 'void', 'wchar_t', 'size_t'
  ]);

  var literalTokens = new Set(['false', 'nullptr', 'true']);
  var tokenPattern = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#\s*[A-Za-z_]\w*|\b[A-Za-z_]\w*\b|\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)[fFuUlL]*\b|(?:->|::|==|!=|<=|>=|\+\+|--|&&|\|\||[+\-*\/%=&|!<>?:])/g;

  function classify(token, source, endIndex) {
    if (token.startsWith('//') || token.startsWith('/*')) return 'comment';
    if (token.startsWith('"') || token.startsWith("'")) return 'string';
    if (token.startsWith('#')) return 'directive';
    if (keywordTokens.has(token)) return 'keyword';
    if (typeTokens.has(token)) return 'type';
    if (literalTokens.has(token)) return 'literal';
    if (/^(?:0[xX][\da-fA-F]+|\d)/.test(token)) return 'number';
    if (/^(?:->|::|==|!=|<=|>=|\+\+|--|&&|\|\||[+\-*\/%=&|!<>?:])$/.test(token)) return 'operator';
    if (/^\s*\(/.test(source.slice(endIndex))) return 'function';
    return '';
  }

  function highlight(code) {
    var source = code.textContent || '';
    var fragment = document.createDocumentFragment();
    var cursor = 0;
    var match;

    tokenPattern.lastIndex = 0;
    while ((match = tokenPattern.exec(source)) !== null) {
      if (match.index > cursor) {
        fragment.appendChild(document.createTextNode(source.slice(cursor, match.index)));
      }

      var tokenClass = classify(match[0], source, tokenPattern.lastIndex);
      if (tokenClass) {
        var span = document.createElement('span');
        span.className = 'syntax-token syntax-' + tokenClass;
        span.textContent = match[0];
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(match[0]));
      }

      cursor = tokenPattern.lastIndex;
    }

    if (cursor < source.length) {
      fragment.appendChild(document.createTextNode(source.slice(cursor)));
    }

    code.replaceChildren(fragment);
    code.classList.add('syntax-highlighted');
  }

  function init() {
    document.querySelectorAll('code.language-cpp:not(.syntax-highlighted)').forEach(highlight);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
