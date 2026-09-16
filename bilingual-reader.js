"use strict";
// Structured inline content uses DOM text nodes, never raw HTML or Markdown.
window.renderParallelBook = (() => {
  function inline(parent, tokens, language) {
    for (const token of tokens || []) {
      if (typeof token === "string") { parent.append(document.createTextNode(token)); continue; }
      if (token.type === "note") {
        const sup = el("sup", undefined, "note-ref");
        const a = el("a", token.id.split("-").at(-1));
        a.id = `ref-${language}-${token.id}`;
        a.href = `#note-${language}-${token.id}`;
        a.setAttribute("role", "doc-noteref");
        a.setAttribute("aria-label", `Footnote ${token.id}`);
        sup.append(a); parent.append(sup);
      } else if (["em", "strong", "sup", "sub"].includes(token.type)) {
        const node = el(token.type); inline(node, token.children, language); parent.append(node);
      } else if (token.type === "link") {
        const url = safeUrl(token.url, false);
        const node = url ? el("a") : el("span");
        if (url) { node.href = url; node.rel = "noopener noreferrer"; }
        inline(node, token.children, language); parent.append(node);
      }
    }
  }
  function noteIds(tokens) {
    return (tokens || []).flatMap(t => typeof t === "string" ? [] : t.type === "note" ? [t.id] : noteIds(t.children));
  }
  function cell(row, language, notes) {
    const container = el("div", undefined, `reader-cell reader-${language}`);
    container.lang = language === "zh" ? "zh-CN" : "en";
    container.dataset.language = language === "zh" ? "中文" : "English";
    const tag = {heading: "h2", subheading: "h3", quote: "blockquote", diagram: "pre"}[row.type] || "p";
    if (row.type === "diagram" && language === "en" && row.src) {
      const figure = el("figure"); const img = el("img");
      img.src = safeUrl(row.src); img.alt = row.en.join(""); img.loading = "lazy";
      figure.append(img); container.append(figure);
    } else {
      const node = el(tag); inline(node, row[language], language); container.append(node);
    }
    for (const id of noteIds(row[language])) {
      const note = notes[id];
      if (!note || !note[language]?.length) continue;
      const aside = el("aside", undefined, "paragraph-footnote");
      aside.id = `note-${language}-${id}`;
      aside.setAttribute("role", "doc-footnote");
      const content = el("p");
      const mark = el("span", `${id.split("-").at(-1)}. `, "footnote-number");
      content.append(mark); inline(content, note[language], language);
      const back = el("a", " ↩", "note-backlink");
      back.href = `#ref-${language}-${id}`;
      back.setAttribute("aria-label", `Back to reference ${id}`);
      content.append(back); aside.append(content); container.append(aside);
    }
    if (language === "zh" && row.review) {
      const details = el("details", undefined, "editorial-query");
      details.append(el("summary", "Editorial query · 校订疑点"), el("p", row.review));
      container.append(details);
    }
    return container;
  }
  function controls(view) {
    const nav = el("nav", undefined, "edition-switcher");
    nav.setAttribute("aria-label", "Reading language");
    for (const [mode, label] of [["parallel", "中文 / English"], ["zh", "中文"], ["en", "English"]]) {
      const url = new URL(location.href); url.searchParams.set("view", mode);
      const a = el("a", label); a.href = url.href;
      if (mode === view) a.setAttribute("aria-current", "true");
      a.addEventListener("click", () => {
        // Keep the paragraph currently being read when switching editions.
        const rows = [...document.querySelectorAll(".parallel-row[id]")];
        const visible = rows.find(row => row.getBoundingClientRect().bottom > 110);
        if (visible) { url.hash = visible.id; a.href = url.href; }
      });
      nav.append(a);
    }
    return nav;
  }
  function content(chapter, view) {
    const container = el("div", undefined, `post-body parallel-body view-${view}`);
    if (view === "parallel") {
      const labels = el("div", undefined, "parallel-row column-labels");
      labels.setAttribute("aria-hidden", "true");
      labels.append(el("span", "Page"), el("span", "中文"), el("span", "English"));
      container.append(labels);
    }
    for (const row of chapter.body) {
      const wrapper = el("section", undefined, "parallel-row");
      wrapper.id = row.id;
      const page = el("a", row.page ? `p. ${row.page}` : "", "printed-page");
      page.href = `#${row.id}`; page.setAttribute("aria-label", `Printed edition page ${row.page || ""}`);
      wrapper.append(page);
      for (const language of view === "parallel" ? ["zh", "en"] : [view]) wrapper.append(cell(row, language, chapter.notes || {}));
      container.append(wrapper);
    }
    return container;
  }
  return { controls, content };
})();
