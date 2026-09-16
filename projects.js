"use strict";
(() => {
  const container = document.getElementById("project-list");
  const projects = window.PROJECTS || [];
  if (!projects.length) {
    container.append(emptyState("Projects coming soon", "Research and independent projects will appear here."));
    return;
  }
  for (const project of projects) {
    const card = el("article", undefined, "project-card");
    if (project.id) card.id = project.id;
    const media = el("div", undefined, "project-media");
    const imageUrl = safeUrl(project.image);
    const fallback = () => {
      media.replaceChildren(el("span", project.title, "project-image-fallback"));
      media.classList.add("without-image");
    };
    if (imageUrl) {
      const img = el("img");
      img.alt = project.imageAlt || project.title;
      img.width = 800; img.height = 400; img.loading = "lazy";
      img.addEventListener("error", fallback, { once: true });
      img.src = imageUrl; media.append(img);
    } else fallback();
    const content = el("div", undefined, "project-copy");
    if (project.tags?.length) content.append(tags(project.tags));
    content.append(el("h2", project.title, "project-title"));
    if (project.subtitle) content.append(el("p", project.subtitle, "project-subtitle"));
    if (project.description) content.append(el("p", project.description, "project-description"));
    const footer = el("footer", undefined, "project-footer");
    for (const item of project.links || []) {
      const a = resourceLink(item.label, item.url);
      if (!a) continue;
      a.className = "project-link";
      const arrow = el("span", " ↗"); arrow.setAttribute("aria-hidden", "true"); a.append(arrow);
      footer.append(a);
    }
    if (project.sourceNote) footer.append(el("p", project.sourceNote, "project-source-note"));
    card.append(media, content);
    if (footer.childElementCount) card.append(footer);
    container.append(card);
  }
})();
