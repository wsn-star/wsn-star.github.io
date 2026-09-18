(function () {
  "use strict";
  var panel = document.getElementById("search-panel");
  var input = document.getElementById("search-input");
  var status = document.getElementById("search-status");
  var results = document.getElementById("search-results");
  var openBtn = document.getElementById("search-open");
  var closeBtn = document.getElementById("search-close");
  var INDEX = null;
  var lastQuery = "";

  // 索引里的 url 是“站点根相对”（如 posts/foo/index.html）。
  // 搜索面板在所有页面都能打开，各页深度不同，需补 ../ 前缀。
  // 构建时已把每页的 root（../ 前缀）注入 window.BLOG_ROOT（base.html），直接用；
  // file:// 或其它情况按 pathname 兜底。
  function rootPrefix() {
    if (typeof window.BLOG_ROOT === "string") return window.BLOG_ROOT;
    var path = window.location.pathname;
    var depth = path.split("/").filter(Boolean).length;
    if (/\.[a-z0-9]+$/i.test(path)) depth -= 1;
    if (depth < 0) depth = 0;
    return depth > 0 ? new Array(depth).join("../") + "../" : "";
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function highlight(text, terms) {
    var output = escapeHtml(text);
    terms.forEach(function (term) {
      if (!term) return;
      var re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      output = output.replace(re, "<mark>$1</mark>");
    });
    return output;
  }
  function search(term) {
    term = term.trim().toLowerCase();
    if (!term) return [];
    var terms = term.split(/\s+/);
    return (INDEX && INDEX.items || []).map(function (item) {
      var haystack = (item.title + " " + item.tags.join(" ") + " " + item.summary + " " + item.text).toLowerCase();
      var score = 0;
      terms.forEach(function (t) {
        if (!t) return;
        if (item.title.toLowerCase().indexOf(t) !== -1) score += 6;
        if (item.tags.join(",").toLowerCase().indexOf(t) !== -1) score += 4;
        var inBody = item.text.toLowerCase().indexOf(t);
        if (inBody !== -1) score += 1;
        if (haystack.indexOf(t) === -1) score = -1;
      });
      return { item: item, score: score };
    }).filter(function (hit) { return hit.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 12);
  }
  function render() {
    var term = input.value;
    var hits = search(term);
    if (!term) {
      status.textContent = INDEX ? "输入关键词开始搜索。" : "搜索索引加载中…";
      results.innerHTML = "";
      return;
    }
    if (!hits.length) {
      status.textContent = "没有找到与「" + term + "」相关的篇章。";
      results.innerHTML = '<li class="search-empty">换个词试试，例如「剑诀」「丹方」。</li>';
      return;
    }
    status.textContent = "共找到 " + hits.length + " 篇相关文章。";
    var terms = term.split(/\s+/);
    results.innerHTML = hits.map(function (hit) {
      var item = hit.item;
      var snippet = item.summary || item.text || "";
      return '<li><a href="' + escapeHtml(item.url.charAt(0) === "/" ? item.url : rootPrefix() + item.url) + '">' +
        '<span class="search-hit-title">' + highlight(item.title, terms) + "</span>" +
        '<span class="search-hit-meta">' + escapeHtml(item.date) + " · " +
        escapeHtml(item.tags.join(" / ")) + " · 约 " + item.reading + " 分钟</span>" +
        '<span class="search-hit-snippet">' + highlight(snippet, terms) + "</span>" +
        "</a></li>";
    }).join("");
  }
  function open() {
    if (!panel) return;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    setTimeout(function () { if (input) input.focus(); }, 30);
  }
  function close() {
    if (!panel) return;
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
  }
  function onKey(event) {
    if (event.key === "Escape") close();
    if (event.key === "Enter" && results.querySelector("a")) {
      window.location.href = results.querySelector("a").getAttribute("href");
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (!panel) return;
    INDEX = window.BLOG_SEARCH_INDEX || null;
    if (openBtn) openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (input) {
      input.addEventListener("input", function () {
        clearTimeout(panel.__timer);
        panel.__timer = setTimeout(render, 120);
      });
      input.addEventListener("keydown", onKey);
    }
    document.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        panel.hidden ? open() : close();
      }
    });
    render();
  });
})();