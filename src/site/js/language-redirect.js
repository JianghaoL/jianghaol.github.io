(() => {
  const pathname = window.location.pathname;
  if (pathname.startsWith("/en/") || pathname.startsWith("/zh/")) return;

  // A stored choice has priority. Access may be denied in privacy modes, so
  // language routing must remain functional even when localStorage is blocked.
  let storedLanguage = null;
  try {
    storedLanguage = window.localStorage.getItem("preferred-lang");
  } catch {
    storedLanguage = null;
  }

  const browserLanguage = window.navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  const language = storedLanguage === "zh" || storedLanguage === "en" ? storedLanguage : browserLanguage;
  const suffix = pathname === "/" ? "/index.html" : pathname;
  window.location.replace(`/${language}${suffix}`);
})();
