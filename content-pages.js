"use strict";
const content = window.CONTENT || {};
const byDate = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));

function dateLabel(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
}
function postMeta(post) {
  const meta = el("div", undefined, "post-meta");
  if (post.example) meta.append(el("span", "Example post", "example-badge"));
  if (post.date) { const time = el("time", dateLabel(post.date)); time.dateTime = post.date; meta.append(time); }
  const words = (post.body || []).map(block => block.text || (block.items || []).join(" ")).join(" ").trim().split(/\s+/).filter(Boolean).length;
  meta.append(el("span", `${Math.max(1, Math.ceil(words / 200))} min read`));
  return meta;
}

if (page === "publications") {
  const publications = content.publications || [];
  const target = $("#publication-list");
  const filters = $("#publication-filters");
  const topics = [...new Set(publications.flatMap(item => item.tags || []))];
  function renderPublications(topic) {
    target.replaceChildren();
    const visible = publications.filter(item => topic === null || (item.tags || []).includes(topic));
    if (!visible.length) { target.append(emptyState("No publications yet", "Publications will appear here when available.")); return; }
    const groups = [...new Set(visible.map(item => String(item.year || "")))].sort((a, b) => b.localeCompare(a));
    groups.forEach(year => {
      const section = el("section", undefined, "publication-year");
      section.append(el("h2", year || "To be added", "year-heading"));
      visible.filter(item => String(item.year || "") === year).forEach(item => {
        const article = el("article", undefined, "publication-card");
        if (item.example) article.append(el("span", "Example publication", "example-badge"));
        const heading = el("h3", undefined, "publication-title");
        const primary = (item.links || []).find(link => safeUrl(link.url));
        heading.append(primary ? resourceLink(item.title, primary.url) : document.createTextNode(item.title));
        article.append(heading);
        const authors = el("p", undefined, "publication-authors");
        (item.authors || []).forEach((author, i) => { if (i) authors.append(document.createTextNode(", ")); authors.append(author === personName ? el("strong", author) : document.createTextNode(author)); });
        article.append(authors);
        if (item.venue) article.append(el("p", item.venue, "publication-venue"));
        const actions = el("div", undefined, "publication-actions");
        (item.links || []).forEach(link => { const a = resourceLink(link.label, link.url); if (a) { a.className = "paper-link"; actions.append(a); } });
        if (actions.childElementCount) article.append(actions);
        if (item.abstract) {
          const details = el("details", undefined, "abstract");
          details.append(el("summary", "Abstract"), el("p", item.abstract)); article.append(details);
        }
        if (item.tags?.length) article.append(tags(item.tags));
        section.append(article);
      });
      target.append(section);
    });
  }
  if (publications.length) {
    [null, ...topics].forEach(topic => {
      const button = el("button", topic === null ? "All" : topic, "filter-pill"); button.type = "button";
      button.setAttribute("aria-pressed", String(topic === null));
      button.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach(other => other.setAttribute("aria-pressed", String(other === button)));
        renderPublications(topic);
      }); filters.append(button);
    });
  } else filters.hidden = true;
  renderPublications(null);
}

const isTech = page === "tech-blog" || page === "tech-post";
const posts = [...(isTech ? content.techPosts || [] : content.personalPosts || [])].sort(byDate);
const blogTitle = isTech ? "Tech Blog" : "Personal Blog";
const postHref = post => `post.html?id=${encodeURIComponent(post.id)}`;

if (page === "tech-blog" || page === "personal-blog") {
  const target = $("#post-list"); target.replaceChildren();
  if (!posts.length) target.append(emptyState("No posts yet", "New writing will appear here."));
  posts.forEach(post => {
    const card = el("article", undefined, "blog-card");
    const heading = el("h2", undefined, "blog-title");
    const link = el("a", post.title); link.href = postHref(post); heading.append(link);
    card.append(heading, postMeta(post));
    if (post.excerpt) card.append(el("p", post.excerpt, "post-excerpt"));
    if (post.tags?.length) card.append(tags(post.tags));
    target.append(card);
  });
}

if (page === "tech-post" || page === "personal-post") {
  const id = new URLSearchParams(location.search).get("id");
  const index = posts.findIndex(post => post.id === id);
  const post = posts[index];
  const target = $("#article-content"); target.replaceChildren();
  const back = el("a", `← Back to ${blogTitle}`, "back-link"); back.href = "index.html";
  target.append(back);
  if (!post) {
    target.append(emptyState("Post not found", "This post is unavailable. Return to the blog to browse the latest writing."));
    document.title = `Post not found | ${personName}`;
  } else {
    document.title = `${post.title} | ${personName}`;
    $("meta[name=description]").content = post.excerpt || post.title;
    const header = el("header", undefined, "post-header");
    header.append(el("h1", post.title, "post-title"), postMeta(post));
    if (post.tags?.length) header.append(tags(post.tags));
    target.append(header);
    if (post.example) target.append(el("p", "This is an example post with placeholder text.", "template-note"));
    const body = el("div", undefined, "post-body");
    (post.body || []).forEach(block => {
      if (block.type === "heading") body.append(el("h2", block.text));
      else if (block.type === "subheading") body.append(el("h3", block.text));
      else if (block.type === "quote") body.append(el("blockquote", block.text));
      else if (block.type === "code") { const pre = el("pre"); pre.append(el("code", block.text)); body.append(pre); }
      else if (block.type === "list" || block.type === "ordered-list") { const list = el(block.type === "list" ? "ul" : "ol"); (block.items || []).forEach(item => list.append(el("li", item))); body.append(list); }
      else if (block.type === "link") { const a = resourceLink(block.text, block.url); if (a) { const p = el("p"); p.append(a); body.append(p); } }
      else if (block.type === "image" && safeUrl(block.src)) {
        const figure = el("figure"); const img = el("img"); img.src = safeUrl(block.src); img.alt = block.alt || ""; img.loading = "lazy"; figure.append(img);
        if (block.caption) figure.append(el("figcaption", block.caption)); body.append(figure);
      } else body.append(el("p", block.text || ""));
    });
    target.append(body);
    const footer = el("footer", undefined, "post-footer");
    const returnLink = el("a", `← Back to ${blogTitle}`, "back-link"); returnLink.href = "index.html"; footer.append(returnLink);
    const adjacent = el("nav", undefined, "post-navigation"); adjacent.setAttribute("aria-label", "More posts");
    if (posts[index + 1]) { const a = el("a", `← ${posts[index + 1].title}`); a.href = postHref(posts[index + 1]); adjacent.append(a); }
    if (posts[index - 1]) { const a = el("a", `${posts[index - 1].title} →`); a.href = postHref(posts[index - 1]); adjacent.append(a); }
    footer.append(adjacent); target.append(footer);
  }
}
