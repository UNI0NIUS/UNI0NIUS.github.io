"use strict";
(() => {
  const library = window.TRANSLATIONS || {};
  const books = library.books || [];
  const articles = library.articles || [];
  const target = document.getElementById("translation-content");
  const params = new URLSearchParams(location.search);
  const href = (kind, item, chapter) => {
    const query = new URLSearchParams({ id: item.id });
    if (chapter) query.set("chapter", chapter.id);
    return `${kind}.html?${query}`;
  };
  const link = (text, url, className) => {
    const a = el("a", text, className); a.href = url; return a;
  };
  function metadata(item, chapterCount) {
    const row = el("div", undefined, "translation-metadata");
    if (item.author) row.append(el("span", `By ${item.author}`));
    if (item.languagePair) row.append(el("span", item.languagePair));
    if (chapterCount !== undefined) row.append(el("span", `${chapterCount} ${chapterCount === 1 ? "chapter" : "chapters"}`));
    if (item.example) row.append(el("span", "Template", "example-badge"));
    return row;
  }
  function body(blocks, language) {
    const container = el("div", undefined, "post-body");
    if (language) container.lang = language;
    for (const block of blocks || []) {
      let node;
      switch (block.type) {
        case "heading": node = el("h2", block.text); break;
        case "subheading": node = el("h3", block.text); break;
        case "quote": node = el("blockquote", block.text); break;
        case "code": node = el("pre"); node.append(el("code", block.text)); break;
        case "list":
        case "ordered-list":
          node = el(block.type === "list" ? "ul" : "ol");
          (block.items || []).forEach(text => node.append(el("li", text)));
          break;
        case "link":
          node = el("p");
          node.append(resourceLink(block.text || "Reference", block.url) || el("span", block.text || "Reference"));
          break;
        case "image": {
          const url = safeUrl(block.src);
          if (!url) continue;
          node = el("figure");
          const img = el("img"); img.src = url; img.alt = block.alt || ""; img.loading = "lazy";
          node.append(img);
          if (block.caption) node.append(el("figcaption", block.caption));
          break;
        }
        default: node = el("p", block.text);
      }
      container.append(node);
    }
    return container;
  }
  function heading(item, title, position) {
    const header = el("header", undefined, "post-header");
    if (position) header.append(el("p", position, "chapter-position"));
    header.append(el("h1", title, "post-title"));
    if (item.originalTitle) header.append(el("p", item.originalTitle, "translation-original"));
    header.append(metadata(item));
    header.append(el("p", `Translated by ${item.translator || personName}`, "translation-source"));
    const source = resourceLink("Original source ↗", item.sourceUrl);
    if (source) { const row = el("p", undefined, "translation-source"); row.append(source); header.append(row); }
    return header;
  }
  function templateNote(item) {
    return item.example ? el("p", "This is a template. Translation content has not been added yet.", "template-note") : null;
  }
  function missing(title, message) {
    target.append(link("← All translations", "index.html", "back-link"), emptyState(title, message));
    document.title = `${title} | ${personName}`;
  }
  function section(title, items, kind) {
    const section = el("section", undefined, "translation-section");
    section.id = kind === "book" ? "books" : "articles";
    const heading = el("h2", title); heading.id = `${section.id}-title`;
    section.setAttribute("aria-labelledby", heading.id); section.append(heading);
    if (!items.length) section.append(el("p", "Translations will be added here soon.", "empty-note"));
    for (const item of items) {
      const card = el("article", undefined, "translation-card");
      card.append(metadata(item, kind === "book" ? (item.chapters || []).length : undefined));
      const title = el("h3"); title.append(link(item.title, href(kind, item))); card.append(title);
      if (item.description) card.append(el("p", item.description));
      card.append(link(kind === "book" ? "Read book →" : "Read article →", href(kind, item), "read-translation"));
      section.append(card);
    }
    return section;
  }
  if (page === "translations") {
    target.append(section("Books", books, "book"), section("Articles", articles, "article"));
    return;
  }
  const isBook = page === "translation-book";
  const item = (isBook ? books : articles).find(entry => entry.id === params.get("id"));
  if (!item) { missing("Translation not found", "Choose a book or article from the translations library."); return; }
  if (!isBook) {
    const article = el("article", undefined, "translation-reader");
    article.append(link("← All translations", "index.html#articles", "back-link"), heading(item, item.title));
    const note = templateNote(item); if (note) article.append(note);
    article.append(body(item.body, item.language));
    target.append(article);
    document.title = `${item.title} | ${personName}`;
  } else {
    const chapters = item.chapters || [];
    if (!chapters.length) { missing(item.title, "Chapters will be added soon."); return; }
    const chapterId = params.get("chapter");
    const index = chapterId === null ? 0 : chapters.findIndex(entry => entry.id === chapterId);
    if (index < 0) {
      missing("Chapter not found", "This chapter is unavailable. Start from the book’s first chapter.");
      target.append(link("Open first chapter →", href("book", item, chapters[0])));
      return;
    }
    const chapter = chapters[index];
    target.append(link("← All translations", "index.html#books", "back-link"));
    const layout = el("div", undefined, "book-layout");
    const sidebar = el("aside", undefined, "chapter-sidebar");
    sidebar.setAttribute("aria-label", "Book contents");
    sidebar.append(el("p", "Book translation", "book-label"), el("p", item.title, "book-name"));
    const directory = el("details", undefined, "chapter-directory");
    directory.append(el("summary", "Chapters"));
    const nav = el("nav"); nav.setAttribute("aria-label", "Chapters");
    const list = el("ol");
    chapters.forEach((entry, i) => {
      const li = el("li"); const a = link(entry.title, href("book", item, entry));
      if (i === index) a.setAttribute("aria-current", "page");
      li.append(a); list.append(li);
    });
    nav.append(list); directory.append(nav); sidebar.append(directory);
    const mobile = window.matchMedia("(max-width: 900px)");
    const adaptDirectory = () => { directory.open = !mobile.matches; };
    adaptDirectory(); mobile.addEventListener("change", adaptDirectory);
    const article = el("article", undefined, "chapter-article translation-reader");
    article.append(heading(item, chapter.title, `${item.title} · Chapter ${index + 1} of ${chapters.length}`));
    const note = templateNote(item); if (note) article.append(note);
    article.append(body(chapter.body, item.language));
    const nextPrevious = el("nav", undefined, "chapter-navigation");
    nextPrevious.setAttribute("aria-label", "Chapter navigation");
    for (const [offset, label, className] of [[-1, "← Previous chapter", "previous-chapter"], [1, "Next chapter →", "next-chapter"]]) {
      const adjacent = chapters[index + offset];
      if (!adjacent) continue;
      const a = link(adjacent.title, href("book", item, adjacent), className);
      a.prepend(el("span", label)); a.rel = offset < 0 ? "prev" : "next";
      nextPrevious.append(a);
    }
    if (nextPrevious.childElementCount) article.append(nextPrevious);
    layout.append(sidebar, article); target.append(layout);
    document.title = `${chapter.title} — ${item.title} | ${personName}`;
  }
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = item.description || `A translation of ${item.title}.`;
})();
