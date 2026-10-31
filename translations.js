"use strict";
(async () => {
  const library = window.TRANSLATIONS || {};
  const books = library.books || [];
  const articles = library.articles || [];
  const target = document.getElementById("translation-content");
  const params = new URLSearchParams(location.search);
  const href = (kind, item, chapter) => {
    const query = new URLSearchParams({ id: item.id });
    if (chapter) query.set("chapter", chapter.id);
    if (item.bilingual && ["zh", "en", "parallel"].includes(params.get("view"))) query.set("view", params.get("view"));
    return `${kind}.html?${query}`;
  };
  const link = (text, url, className) => {
    const a = el("a", text, className); a.href = url; return a;
  };
  function metadata(item, chapterCount) {
    const row = el("div", undefined, "translation-metadata");
    if (item.author) row.append(el("span", `${item.contentKind === "reading-guide" ? "原文作者：" : "By "}${item.author}`));
    if (item.contentKind === "reading-guide") row.append(el("span", "中文导读 · 非全文译文"));
    if (item.languagePair) row.append(el("span", item.languagePair));
    if (chapterCount !== undefined) row.append(el("span", `${item.parts?.length ? item.parts.length + " parts · " : ""}${chapterCount} ${item.parts?.length ? "sections" : chapterCount === 1 ? "chapter" : "chapters"}`));
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
    header.append(el("p", `${item.contentKind === "reading-guide" ? "中文导读：" : item.englishTranslator ? "Chinese: " : "Translated by "}${item.translator || personName}`, "translation-source"));
    if (item.englishTranslator) header.append(el("p", `English translation: ${item.englishTranslator}`, "translation-source"));
    const source = resourceLink("Original source ↗", item.sourceUrl);
    if (source) { const row = el("p", undefined, "translation-source"); row.append(source); header.append(row); }
    if (item.originalEdition) {
      const edition = item.originalEdition;
      const details = el("details", undefined, "original-edition");
      details.append(el("summary", "意大利语原版 · Italiano"));
      const title = el("p", `${edition.title}. ${edition.subtitle || ""}`);
      title.lang = edition.language;
      details.append(title, el("p", `${edition.publisher}, ${edition.year} · ISBN ${edition.isbn}`));
      const reference = resourceLink("原版书目 ↗", edition.referenceUrl);
      if (reference) details.append(reference);
      if (edition.status === "awaiting-scan") details.append(el("p", "扫描件待补；意大利语原文尚未上线。", "edition-status"));
      header.append(details);
    }
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
    section.id = kind === "book" ? "books" : kind === "guide" ? "guides" : "articles";
    const heading = el("h2", title); heading.id = `${section.id}-title`;
    section.setAttribute("aria-labelledby", heading.id); section.append(heading);
    if (!items.length) section.append(el("p", "Translations will be added here soon.", "empty-note"));
    for (const item of items) {
      const card = el("article", undefined, "translation-card");
      const route = kind === "guide" ? "article" : kind;
      const title = el("h3"); title.append(link(item.title, href(route, item))); card.append(title);
      if (item.originalTitle) card.append(link(item.originalTitle, href(route, item), "catalog-original"));
      const details = metadata(item, kind === "book" ? (item.chapters || []).length : undefined);
      if (item.authorZh) details.firstElementChild.textContent = `${item.authorZh} / ${item.author}`;
      const count = window.TRANSLATION_COUNTS?.[item.id];
      if (Number.isInteger(count)) {
        const label = el("span", `中文 ${count.toLocaleString("en-US")} 字`);
        label.title = "已上线中文正文与原注的汉字数，含标题和图注，不含标点及外文。";
        details.append(label);
      }
      card.append(details);
      const tags = el("div", undefined, "catalog-item-tags");
      for (const tag of item.tags || []) {
        const button = el("button", tag, "catalog-tag"); button.type = "button";
        button.setAttribute("aria-label", `筛选标签：${tag}`);
        button.addEventListener("click", () => selectCatalogTag(tag));
        tags.append(button);
      }
      card.append(tags);
      section.append(card);
    }
    return section;
  }
  let selectCatalogTag = () => {};
  if (page === "translations") {
    const all = [...books, ...articles];
    const selected = new Set(params.getAll("tag"));
    const controls = el("div", undefined, "catalog-controls");
    const label = el("label", "搜索 / Search"); label.htmlFor = "catalog-search";
    const search = el("input"); search.type = "search"; search.id = "catalog-search";
    search.placeholder = "书名、原文名、作者、标签…"; search.value = params.get("q") || "";
    const filters = el("div", undefined, "catalog-filters");
    filters.setAttribute("role", "group"); filters.setAttribute("aria-label", "标签筛选（多选须同时匹配）");
    const tagButtons = new Map();
    for (const tag of [...new Set(all.flatMap(item => item.tags || []))].sort((a, b) => a.localeCompare(b, "zh"))) {
      const button = el("button", tag, "catalog-tag"); button.type = "button";
      button.addEventListener("click", () => { selected.has(tag) ? selected.delete(tag) : selected.add(tag); render(); });
      tagButtons.set(tag, button); filters.append(button);
    }
    const clear = el("button", "清除筛选 / Clear", "catalog-clear"); clear.type = "button";
    const status = el("p", undefined, "catalog-status"); status.setAttribute("role", "status");
    const results = el("div");
    controls.append(label, search, el("p", "可多选标签，结果须同时匹配；搜索可与标签组合。", "catalog-help"), filters, clear, status);
    target.append(controls, results);
    const normalize = value => value.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase();
    function render() {
      const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
      const matches = item => {
        const text = normalize([item.title, item.originalTitle, item.author, item.authorZh, item.languagePair, ...(item.tags || [])].filter(Boolean).join(" "));
        return words.every(word => text.includes(word)) && [...selected].every(tag => item.tags?.includes(tag));
      };
      const filteredBooks = books.filter(matches), filteredArticles = articles.filter(matches);
      results.replaceChildren();
      if (filteredBooks.length) results.append(section("Books / 书籍", filteredBooks, "book"));
      const regular = filteredArticles.filter(item => item.contentKind !== "reading-guide");
      const guides = filteredArticles.filter(item => item.contentKind === "reading-guide");
      if (regular.length) results.append(section("Articles / 文章", regular, "article"));
      if (guides.length) results.append(section("中文导读 · Reading guides", guides, "guide"));
      const count = filteredBooks.length + filteredArticles.length;
      status.textContent = `${count} / ${all.length} 项`;
      if (!count) results.append(el("p", "没有匹配结果。试试其他关键词或清除筛选。", "empty-note"));
      tagButtons.forEach((button, tag) => button.setAttribute("aria-pressed", String(selected.has(tag))));
      clear.disabled = !search.value && !selected.size;
      const url = new URL(location.href); url.searchParams.delete("q"); url.searchParams.delete("tag");
      if (search.value.trim()) url.searchParams.set("q", search.value.trim());
      selected.forEach(tag => url.searchParams.append("tag", tag));
      history.replaceState(null, "", url);
    }
    selectCatalogTag = tag => { selected.add(tag); render(); search.focus(); controls.scrollIntoView({ block: "start" }); };
    search.addEventListener("input", render);
    clear.addEventListener("click", () => { search.value = ""; selected.clear(); render(); search.focus(); });
    render();
    return;
  }
  const isBook = page === "translation-book";
  const item = (isBook ? books : articles).find(entry => entry.id === params.get("id"));
  if (!item) { missing("Translation not found", "Choose a book or article from the translations library."); return; }
  if (isBook && item.id === "cohen-system-der-philosophie-3-1") document.getElementById("main").classList.add("cohen-aesthetik-font");
  if (!isBook) {
    const article = el("article", undefined, "translation-reader");
    article.append(link("← All translations", item.contentKind === "reading-guide" ? "index.html#guides" : "index.html#articles", "back-link"), heading(item, item.title));
    const note = templateNote(item); if (note) article.append(note);
    if (item.bilingual && item.dataUrl && window.renderParallelBook) {
      const view = ["zh", "en", "parallel"].includes(params.get("view")) ? params.get("view") : "parallel";
      document.getElementById("main").classList.add("bilingual-book");
      article.append(window.renderParallelBook.controls(view, item));
      if (item.editionNotice) article.append(el("p", item.editionNotice, "edition-notice"));
      if (item.downloads?.length) {
        const downloads = el("nav", undefined, "edition-switcher");
        downloads.setAttribute("aria-label", "Download reading editions");
        for (const file of item.downloads) {
          const url = safeUrl(file.url); if (!url) continue;
          const a = link(file.label, url); a.download = ""; downloads.append(a);
        }
        article.append(downloads);
      }
      const loading = el("p", "Loading article…"); loading.setAttribute("role", "status"); article.append(loading);
      try {
        const url = safeUrl(item.dataUrl);
        if (!url || new URL(url).origin !== location.origin) throw new Error("Invalid article URL");
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.id !== item.id || !Array.isArray(data.body)) throw new Error("Invalid article data");
        loading.replaceWith(window.renderParallelBook.content(data, view));
        if (data.figureTranslation) {
          const figureNotes = el("details", undefined, "editorial-query");
          figureNotes.append(el("summary", "图中文字对照"), el("p", data.figureTranslation)); article.append(figureNotes);
        }
        if (data.editorialNotes?.length) {
          const notes = el("details", undefined, "editorial-query"); notes.append(el("summary", "译者说明与校订记录"));
          for (const text of data.editorialNotes) notes.append(el("p", text));
          article.append(notes);
        }
      } catch (error) {
        loading.textContent = "This article could not be loaded. Please reload the page to try again.";
        loading.setAttribute("role", "alert"); console.error("Article load failed", error);
      }
    } else article.append(body(item.body, item.language));
    target.append(article);
    document.title = `${item.title} | ${personName}`;
    if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
  } else {
    const chapters = item.chapters || [];
    if (!chapters.length) { missing(item.title, "Chapters will be added soon."); return; }
    let chapterId = params.get("chapter");
    const alias = item.chapterAliases?.[chapterId];
    if (alias && chapters.some(entry => entry.id === alias.chapter)) {
      chapterId = alias.chapter;
      params.set("chapter", chapterId);
      const redirected = new URL(location.href);
      redirected.search = params.toString();
      if (!redirected.hash && alias.anchor) redirected.hash = alias.anchor;
      history.replaceState(null, "", redirected);
    }
    const index = chapterId === null ? 0 : chapters.findIndex(entry => entry.id === chapterId);
    if (index < 0) {
      missing("Chapter not found", "This chapter is unavailable. Start from the book’s first chapter.");
      target.append(link("Open first chapter →", href("book", item, chapters[0])));
      return;
    }
    const chapter = chapters[index];
    const currentPart = (item.parts || []).find(part => part.id === chapter.partId);
    const availableViews = item.views || ["zh", "en", "parallel"];
    const view = availableViews.includes(params.get("view")) ? params.get("view") : availableViews.includes("parallel") ? "parallel" : availableViews[0];
    const chapterTitle = entry => item.bilingual && view === "en" ? entry.originalTitle || entry.title : entry.title;
    target.append(link("← All translations", "index.html#books", "back-link"));
    const layout = el("div", undefined, "book-layout");
    const sidebar = el("aside", undefined, "chapter-sidebar");
    sidebar.setAttribute("aria-label", "Book contents");
    sidebar.append(el("p", "Book translation", "book-label"), el("p", item.title, "book-name"));
    const directory = el("details", undefined, "chapter-directory");
    directory.append(el("summary", "Chapters"));
    const nav = el("nav"); nav.setAttribute("aria-label", "Chapters");
    const list = el("ol");
    const chapterLink = entry => {
      const li = el("li");
      const title = view === "en" ? entry.shortOriginalTitle || chapterTitle(entry) : entry.shortTitle || chapterTitle(entry);
      const a = link(title, href("book", item, entry));
      if (entry.id === chapter.id) a.setAttribute("aria-current", "page");
      li.append(a);
      if (entry.outline?.length) {
        const details = el("details", undefined, "chapter-outline");
        details.open = entry.id === chapter.id;
        details.append(el("summary", view === "en" ? (item.sourceLanguage === "de" ? "Kapitelinhalt" : "Bölüm içindekiler") : "章内目录"));
        const root = { level: 0, children: [] };
        const stack = [root];
        for (const heading of entry.outline) {
          const level = Math.max(1, heading.level || 1);
          while (stack.length > 1 && stack.at(-1).level >= level) stack.pop();
          const node = { ...heading, level, children: [] };
          stack.at(-1).children.push(node);
          stack.push(node);
        }
        const outlineList = nodes => {
          const ol = el("ol");
          for (const node of nodes) {
            const child = el("li");
            const label = view === "en" ? node.originalTitle || node.title : node.title;
            const url = (entry.id === chapter.id ? "" : href("book", item, entry)) + "#" + encodeURIComponent(node.anchor);
            child.append(link(label, url));
            if (node.children.length) child.append(outlineList(node.children));
            ol.append(child);
          }
          return ol;
        };
        details.append(outlineList(root.children));
        li.append(details);
      }
      return li;
    };
    if (chapters.some(entry => entry.parentId)) {
      list.classList.add("chapter-tree");
      const byId = new Map(chapters.map(entry => [entry.id, entry]));
      const activePath = new Set();
      for (let entry = chapter; entry && !activePath.has(entry.id); entry = byId.get(entry.parentId)) activePath.add(entry.id);
      const children = new Map();
      for (const entry of chapters) {
        const parent = byId.has(entry.parentId) ? entry.parentId : null;
        if (!children.has(parent)) children.set(parent, []);
        children.get(parent).push(entry);
      }
      const appendBranch = (parent, container) => {
        for (const entry of children.get(parent) || []) {
          const li = chapterLink(entry);
          if (children.has(entry.id)) {
            const details = el("details", undefined, "chapter-branch");
            details.open = activePath.has(entry.id);
            const summary = el("summary");
            summary.append(li.firstElementChild);
            const nested = el("ol");
            appendBranch(entry.id, nested);
            details.append(summary, nested);
            li.prepend(details);
          }
          container.append(li);
        }
      };
      appendBranch(null, list);
    } else {
    const groups = new Map();
    for (const entry of chapters) {
      const part = (item.parts || []).find(part => part.id === entry.partId);
      if (!part) { list.append(chapterLink(entry)); continue; }
      if (!groups.has(part.id)) {
        const li = el("li", undefined, "chapter-part");
        const group = el("details"); group.open = chapter.partId === part.id;
        const title = view === "en" ? part.originalTitle || part.title : part.title;
        group.append(el("summary", title));
        const children = el("ol");
        group.append(children); li.append(group); list.append(li);
        groups.set(part.id, children);
      }
      groups.get(part.id).append(chapterLink(entry));
    }
    }
    nav.append(list); directory.append(nav); sidebar.append(directory);
    const mobile = window.matchMedia("(max-width: 900px)");
    const adaptDirectory = () => { directory.open = !mobile.matches; };
    adaptDirectory(); mobile.addEventListener("change", adaptDirectory);
    const article = el("article", undefined, "chapter-article translation-reader");
    article.append(heading(item, chapterTitle(chapter), `${currentPart ? (view === "en" ? currentPart.originalTitle || currentPart.title : currentPart.title) : item.title} · Section ${index + 1} of ${chapters.length}`));
    const note = templateNote(item); if (note) article.append(note);
    if ((item.bilingual || item.structured) && window.renderParallelBook) {
      document.getElementById("main").classList.add("bilingual-book");
      article.append(window.renderParallelBook.controls(view, item));
      article.append(el("p", item.editionNotice || "Chinese reviewed working draft · 2026-09-16. Page labels refer to the printed English edition, not PDF sheet numbers. English wording is retained from the supplied EPUB; editorial uncertainties are flagged beside the Chinese text.", "edition-notice"));
      if (item.downloads?.length) {
        const downloads = el("nav", undefined, "edition-switcher");
        downloads.setAttribute("aria-label", item.id === "cohen-system-der-philosophie-3-1" ? "Download editions" : "Download working draft");
        for (const file of item.downloads) {
          const url = safeUrl(file.url); if (!url) continue;
          const link = el("a", file.label); link.href = url; link.download = "";
          downloads.append(link);
        }
        article.append(downloads);
      }
      const loading = el("p", "Loading section…"); loading.setAttribute("role", "status");
      article.append(loading);
      try {
        const url = safeUrl(chapter.dataUrl);
        if (!url || new URL(url).origin !== location.origin) throw new Error("Invalid chapter URL");
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.id !== chapter.id || !Array.isArray(data.body)) throw new Error("Invalid chapter data");
        loading.replaceWith(window.renderParallelBook.content(data, view));
        if (data.editorialNotes?.length) {
          const review = el("details", undefined, "editorial-query");
          review.append(el("summary", "本节校订记录"));
          for (const note of data.editorialNotes) review.append(el("p", note));
          article.append(review);
        }
      } catch (error) {
        loading.textContent = "This section could not be loaded. Please reload the page to try again.";
        loading.setAttribute("role", "alert");
        console.error("Book section load failed", error);
      }
    } else article.append(body(chapter.body, item.language));
    const nextPrevious = el("nav", undefined, "chapter-navigation");
    nextPrevious.setAttribute("aria-label", "Chapter navigation");
    for (const [offset, label, className] of [[-1, "← Previous chapter", "previous-chapter"], [1, "Next chapter →", "next-chapter"]]) {
      const adjacent = chapters[index + offset];
      if (!adjacent) continue;
      const a = link(chapterTitle(adjacent), href("book", item, adjacent), className);
      a.prepend(el("span", label)); a.rel = offset < 0 ? "prev" : "next";
      nextPrevious.append(a);
    }
    if (nextPrevious.childElementCount) article.append(nextPrevious);
    layout.append(sidebar, article); target.append(layout);
    document.title = `${chapter.title} — ${item.title} | ${personName}`;
    if (location.hash) requestAnimationFrame(() => {
      const anchor = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (anchor) anchor.scrollIntoView();
    });
  }
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = item.description || `A translation of ${item.title}.`;
})();
