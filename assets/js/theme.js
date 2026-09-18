(function () {
  "use strict";
  var STORAGE_KEY = "xianxia-theme";
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.textContent = theme === "dark" ? "☀" : "🌙";
      button.setAttribute("aria-label", theme === "dark" ? "切换到明亮主题" : "切换到暗夜主题");
      button.title = theme === "dark" ? "切换明亮" : "切换暗夜";
    }
  }
  function current() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
  function toggle() {
    var next = current() === "dark" ? "light" : "dark";
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    apply(next);
  }
  document.addEventListener("DOMContentLoaded", function () {
    apply(current());
    var button = document.getElementById("theme-toggle");
    if (button) button.addEventListener("click", toggle);
  });
})();