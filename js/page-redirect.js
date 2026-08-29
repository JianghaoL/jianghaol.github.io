(() => {
  const script = document.currentScript;
  const target = script?.dataset.target;

  // Targets live in authored HTML and are restricted to same-origin absolute
  // paths so this helper can never become an open redirect.
  if (target?.startsWith("/") && !target.startsWith("//")) {
    window.location.replace(target);
  }
})();
