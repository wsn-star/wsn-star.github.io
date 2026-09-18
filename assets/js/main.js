(function () {
  "use strict";
  // 移动端菜单
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("site-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
  }
  // 目录当前项高亮（scrollspy）
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  var headings = tocLinks.map(function (link) {
    var id = link.getAttribute("href").slice(1);
    return document.getElementById(id);
  }).filter(Boolean);
  function onScroll() {
    var pos = window.scrollY + 90;
    var active = null;
    headings.forEach(function (heading) {
      if (heading.offsetTop <= pos) active = heading;
    });
    tocLinks.forEach(function (link) {
      var isActive = active && link.getAttribute("href") === "#" + active.id;
      link.style.color = isActive ? "var(--cinnabar)" : "";
      link.style.fontWeight = isActive ? "700" : "";
    });
  }
  if (tocLinks.length) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  // 阅读进度条
  var bar = document.createElement("div");
  bar.id = "reading-bar";
  document.body.appendChild(bar);
  var ticking = false;
  function updateProgress() {
    ticking = false;
    var doc = document.documentElement;
    var total = doc.scrollHeight - window.innerHeight;
    var ratio = total > 0 ? window.scrollY / total : 0;
    bar.style.width = (ratio * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
  // 代码块复制按钮
  document.querySelectorAll(".prose pre").forEach(function (pre) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "icon-btn";
    button.style.cssText = "position:absolute;top:8px;right:8px;width:28px;height:28px;font-size:12px;";
    button.textContent = "⧉";
    button.setAttribute("aria-label", "复制代码");
    pre.style.position = "relative";
    pre.appendChild(button);
    button.addEventListener("click", function () {
      var text = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          button.textContent = "✓";
          setTimeout(function () { button.textContent = "⧉"; }, 1200);
        });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        button.textContent = "✓";
        setTimeout(function () { button.textContent = "⧉"; }, 1200);
      }
    });
  });
})();