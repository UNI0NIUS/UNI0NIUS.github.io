"use strict";
// Structured inline content uses DOM text nodes, never raw HTML or Markdown.
window.renderParallelBook = (() => {
  function inline(parent, tokens, language, anchors = {}) {
    for (const token of tokens || []) {
      if (typeof token === "string") { parent.append(document.createTextNode(token)); continue; }
      if (token.type === "note") {
        const sup = el("sup", undefined, "note-ref");
        const a = el("a", token.id.split("-").at(-1));
        const anchor = anchors[token.id] || token.id;
        a.id = `ref-${language}-${anchor}`;
        a.href = `#note-${language}-${anchor}`;
        a.setAttribute("role", "doc-noteref");
        a.setAttribute("aria-label", `Footnote ${token.id}`);
        sup.append(a); parent.append(sup);
      } else if (["em", "strong", "sup", "sub"].includes(token.type)) {
        const node = el(token.type); inline(node, token.children, language, anchors); parent.append(node);
      } else if (token.type === "link") {
        const url = safeUrl(token.url, false);
        const node = url ? el("a") : el("span");
        if (url) { node.href = url; node.rel = "noopener noreferrer"; }
        inline(node, token.children, language, anchors); parent.append(node);
      } else if (token.type === "table") {
        const wrap = el("div", undefined, "source-table-wrap");
        const table = el("table", undefined, "source-table");
        const tbody = el("tbody");
        for (const cells of token.rows) {
          const tr = el("tr");
          for (const tokens of cells) { const td = el("td"); inline(td, tokens, language, anchors); tr.append(td); }
          tbody.append(tr);
        }
        table.append(tbody); wrap.append(table); parent.append(wrap);
      } else if (token.type === "verse") {
        const verse = el("div", undefined, "source-verse");
        inline(verse, token.children, language, anchors); parent.append(verse);
      } else if (token.type === "break") {
        parent.append(document.createElement("br"), document.createElement("br"));
      } else if (token.type === "page") {
        const marker = el("span", `〔p. ${token.page}〕`, "inline-source-page");
        marker.id = token.id; marker.title = `原书第${token.page}页 · 续段`;
        parent.append(marker);
      } else if (token.type === "math") {
        const node = el("span", token.tex, "source-math");
        if (window.katex) {
          try { window.katex.render(token.tex, node, {displayMode: !!token.display, throwOnError: true, trust: false}); }
          catch (error) { node.classList.add("math-error"); node.title = error.message; }
        }
        parent.append(node);
      }
    }
  }
  function noteIds(tokens) {
    return (tokens || []).flatMap(t => typeof t === "string" ? [] : t.type === "note" ? [t.id] : [...noteIds(t.children), ...(t.rows || []).flatMap(row => row.flatMap(noteIds))]);
  }
  function cell(row, language, notes, source, seen) {
    const anchors = {};
    for (const id of noteIds(row[language])) {
      const key = `${language}-${id}`;
      anchors[id] = seen.has(key) ? `${id}-${row.id}` : id;
      seen.add(key);
    }
    const container = el("div", undefined, `reader-cell reader-${language}`);
    container.lang = language === "zh" ? "zh-CN" : source.sourceLanguage || "en";
    container.dataset.language = language === "zh" ? "中文" : source.sourceLanguageLabel || "English";
    const tag = {heading: "h2", subheading: "h3", quote: "blockquote", diagram: "pre", code: "pre"}[row.type] || "p";
    if (row.indent) container.classList.add("source-subentry");
    if (row.type === "figure" && row.src) {
      const figure = el("figure"); const img = el("img");
      img.src = safeUrl(row.src); img.alt = (row[language] || []).filter(t => typeof t === "string").join(""); img.loading = "lazy";
      const caption = el("figcaption"); inline(caption, row[language], language, anchors);
      figure.append(img, caption); container.append(figure);
    } else if (row.type === "diagram" && language === "en" && row.src) {
      const figure = el("figure"); const img = el("img");
      img.src = safeUrl(row.src); img.alt = row.en.join(""); img.loading = "lazy";
      figure.append(img); container.append(figure);
    } else {
      const hasBlocks = (row[language] || []).some(t => t.type === "table" || t.type === "verse");
      const node = el(hasBlocks ? "div" : tag); inline(node, row[language], language, anchors); container.append(node);
      if (language === "en" && row.sourceItalic) node.classList.add("source-italic");
    }
    for (const id of noteIds(row[language])) {
      const note = notes[id];
      if (!note || !note[language]?.length) continue;
      const aside = el("aside", undefined, "paragraph-footnote");
      aside.id = `note-${language}-${anchors[id]}`;
      aside.setAttribute("role", "doc-footnote");
      const content = el("div", undefined, "footnote-content");
      const mark = el("span", `${id.split("-").at(-1)}. `, "footnote-number");
      content.append(mark); inline(content, note[language], language);
      if (language === "zh" && note.review) content.append(el("p", `校注：${note.review}`, "note-editorial"));
      const back = el("a", " ↩", "note-backlink");
      back.href = `#ref-${language}-${anchors[id]}`;
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
  function controls(view, source = {}) {
    const nav = el("nav", undefined, "edition-switcher");
    nav.setAttribute("aria-label", "Reading language");
    const sourceLabel = source.sourceLanguageLabel || "English";
    for (const [mode, label] of [["parallel", `中文 / ${sourceLabel}`], ["zh", "中文"], ["en", sourceLabel]]) {
      if (source.views && !source.views.includes(mode)) continue;
      const url = new URL(location.href); url.searchParams.set("view", mode);
      const a = el("a", label); a.href = url.href;
      if (mode === view) a.setAttribute("aria-current", "true");
      a.addEventListener("click", () => {
        // Keep the paragraph currently being read when switching editions.
        const rows = [...document.querySelectorAll(".parallel-row[id]")];
        const visible = rows.find(row => row.getBoundingClientRect().bottom > 110);
        if (visible) { url.hash = visible.dataset.switchAnchor || visible.id; a.href = url.href; }
      });
      nav.append(a);
    }
    return nav;
  }
  function restoredRows(chapter, body = chapter.body) {
    const links = new Map((chapter.paragraphLinks || []).map(x => [x.from, x]));
    const consumed = new Set([...links.values()].map(x => x.to));
    const lookup = new Map(chapter.body.map(x => [x.id, x]));
    return body.filter(row => !consumed.has(row.id)).map(row => {
      if (!links.has(row.id)) return row;
      const merged = { ...row, zh: JSON.parse(JSON.stringify(row.zh)) };
      let current = row.id;
      while (links.has(current)) {
        const edge = links.get(current);
        if (edge.trim_end) {
          const last = merged.zh.at(-1);
          if (typeof last !== "string" || !last.endsWith(edge.trim_end)) throw new Error("Paragraph evidence mismatch");
          merged.zh[merged.zh.length - 1] = last.slice(0, -edge.trim_end.length);
        }
        const tail = JSON.parse(JSON.stringify(lookup.get(edge.to).zh));
        if (edge.trim_start) tail[0] = tail[0].slice(edge.trim_start.length);
        if (edge.joiner) merged.zh.push(edge.joiner);
        merged.zh.push({type:"page",page:edge.page,id:edge.to}, ...tail);
        current = edge.to;
      }
      return merged;
    });
  }
  function facsimileGroups(chapter) {
    const joins = new Set((chapter.paragraphLinks || []).map(x => x.page));
    const groups = [];
    for (const page of chapter.facsimilePages) {
      if (joins.has(Number(page.page)) && groups.length) groups.at(-1).push(page);
      else groups.push([page]);
    }
    return groups;
  }
  // Page-aligned scans retain every Chinese paragraph ID. The OCR transcript
  // is deliberately separate from the authoritative image of the source page.
  function facsimileContent(chapter, view) {
    const container = el("div", undefined, `post-body parallel-body view-${view}`);
    const rows = new Map(chapter.body.map(row => [row.id, row]));
    const seen = new Set();
    for (const sources of facsimileGroups(chapter)) {
      const source = sources[0];
      const wrapper = el("section", undefined, "parallel-row facsimile-page");
      wrapper.id = source.id;
      wrapper.dataset.switchAnchor = source.rows[0] || source.id;
      const label = source.pageKind === "pdf" ? `PDF ${source.page}` : `p. ${source.page}${sources.length > 1 ? "–" + sources.at(-1).page : ""}`;
      const page = el("a", label, "printed-page");
      page.href = `#${source.id}`;
      wrapper.append(page);
      if (view === "parallel") {
        const chinese = el("div", undefined, "reader-cell reader-zh");
        chinese.lang = "zh-CN"; chinese.dataset.language = "中文";
        const ids = sources.flatMap(p => p.rows);
        for (const row of restoredRows(chapter, ids.map(id => rows.get(id)))) {
          const segment = cell(row, "zh", chapter.notes || {}, chapter, seen);
          segment.className = "reader-segment";
          segment.id = row.id;
          chinese.append(segment);
        }
        wrapper.append(chinese);
      }
      const original = el("div", undefined, "reader-cell reader-en");
      original.lang = chapter.sourceLanguage || "tr";
      original.dataset.language = chapter.sourceLanguageLabel || "Türkçe";
      if (view === "en") for (const id of sources.flatMap(p => p.rows)) {
        const anchor = el("span"); anchor.id = id; original.append(anchor);
      }
      for (const sourcePage of sources) {
      const source = sourcePage;
      const label = source.pageKind === "pdf" ? `PDF ${source.page}` : `p. ${source.page}`;
      const figure = el("figure", undefined, "source-facsimile");
      if (source.id !== wrapper.id) figure.id = source.id;
      const imageLink = el("a"); imageLink.href = safeUrl(source.src);
      imageLink.target = "_blank"; imageLink.rel = "noopener";
      imageLink.setAttribute("aria-label", `Türkçe · ${label} · Orijinal sayfayı büyüt`);
      const image = el("img"); image.src = safeUrl(source.src);
      image.alt = `Yıkarak Yapmak · Türkçe · ${label}`;
      image.width = source.width; image.height = source.height; image.loading = "lazy";
      imageLink.append(image); figure.append(imageLink);
      figure.append(el("figcaption", `Türkçe · ${label}`)); original.append(figure);
      if (source.ocrBlocks?.length) {
        const details = el("details", undefined, "source-ocr");
        details.append(el("summary", "OCR · 检索文字（以页影为准）"));
        for (const text of source.ocrBlocks) details.append(el("p", text));
        original.append(details);
      }
      }
      wrapper.append(original); container.append(wrapper);
    }
    return container;
  }
  function content(chapter, view) {
    if (chapter.renderFormat === "friction-v1") return window.renderFrictionBook(chapter, view);
    if (chapter.sourceMode === "facsimile" && view !== "zh") return facsimileContent(chapter, view);
    const container = el("div", undefined, `post-body parallel-body view-${view}`);
    if (view === "parallel") {
      const labels = el("div", undefined, "parallel-row column-labels");
      labels.setAttribute("aria-hidden", "true");
      labels.append(el("span", "Page"), el("span", "中文"), el("span", chapter.sourceLanguageLabel || "English"));
      container.append(labels);
    }
    const seen = new Set();
    for (const row of restoredRows(chapter)) {
      const wrapper = el("section", undefined, "parallel-row");
      wrapper.id = row.id;
      const pdfPage = row.pageKind === "pdf";
      const page = el("a", row.page ? (pdfPage ? row.page : `p. ${row.page}`) : "", "printed-page");
      page.href = `#${row.id}`; page.setAttribute("aria-label", pdfPage ? `Source ${row.page}` : `Printed edition page ${row.page || ""}`);
      wrapper.append(page);
      for (const language of view === "parallel" ? ["zh", "en"] : [view]) wrapper.append(cell(row, language, chapter.notes || {}, chapter, seen));
      container.append(wrapper);
    }
    return container;
  }
  return { controls, content };
})();
