(function () {
  var themes = [
    { name: "default", bg: "#ffffff", fg: "#45372b", accent: "#ff6347" },
    { name: "pistachio", bg: "#1d2021", fg: "#ebdbb2", accent: "#8ec07c" },
    { name: "pink-panther", bg: "#1a170f", fg: "#eceae5", accent: "#ee82cf" },
    { name: "matrix", bg: "#000000", fg: "#4EEE85", accent: "#4EEE85" },
    { name: "terminal-light", bg: "#ffffff", fg: "#454545", accent: "#b9975c" }
  ];

  var STORAGE_KEY = "rk-theme-index";
  var LAST_SEEN_KEY = "rk-theme-last-seen";
  var IDLE_RESET_MS = 60 * 60 * 1000; // 1 hour

  function applyTheme(idx) {
    var theme = themes[idx];
    var root = document.documentElement;
    root.style.setProperty("--background", theme.bg);
    root.style.setProperty("--foreground", theme.fg);
    root.style.setProperty("--accent", theme.accent);
    root.setAttribute("data-theme", theme.name);
  }

  function getIndex() {
    var raw = 0;
    try {
      var lastSeen = parseInt(localStorage.getItem(LAST_SEEN_KEY), 10);
      if (!isNaN(lastSeen) && (Date.now() - lastSeen) > IDLE_RESET_MS) {
        return 0;
      }
      raw = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    } catch (e) {}
    if (isNaN(raw) || raw < 0 || raw >= themes.length) raw = 0;
    return raw;
  }

  function setIndex(idx) {
    try {
      localStorage.setItem(STORAGE_KEY, String(idx));
    } catch (e) {}
  }

  function touchLastSeen() {
    try {
      localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
    } catch (e) {}
  }

  var initialIdx = getIndex();
  applyTheme(initialIdx);
  setIndex(initialIdx);
  touchLastSeen();

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".theme-switcher");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var next = (getIndex() + 1) % themes.length;
        setIndex(next);
        touchLastSeen();
        applyTheme(next);
      });
    });
  });
})();
