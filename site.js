"use strict";
const profile = window.PROFILE || {};
const root = document.body.dataset.root || "./";
const page = document.body.dataset.page || "home";
const personName = profile.name || "Your Name";
const $ = selector => document.querySelector(selector);
const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
document.querySelectorAll("[data-name]").forEach(node => node.textContent = personName);
document.title = `${document.body.dataset.title || "Home"} | ${personName}`;
$("#year").textContent = new Date().getFullYear();

function safeUrl(value, allowLocal = true) {
  if (!value) return null;
  try {
    const url = new URL(value, new URL(root, location.href));
    if (["http:", "https:"].includes(url.protocol)) return url.href;
    if (allowLocal && url.protocol === "file:" && location.protocol === "file:") return url.href;
  } catch { /* Ignore incomplete links. */ }
  return null;
}
function resourceLink(label, href) {
  const url = safeUrl(href);
  if (!url) return null;
  const a = el("a", label); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; return a;
}
const socialIconPaths = {
  github: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  scholar: "M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
};
function socialLink(item) {
  const link = resourceLink(item.label, item.url);
  if (!link) return null;
  const hostname = new URL(link.href).hostname.toLowerCase();
  const key = String(item.icon || item.label || "").toLowerCase().replace(/[\s_-]/g, "");
  const aliases = { github: "github", x: "x", twitter: "x", scholar: "scholar", googlescholar: "scholar", linkedin: "linkedin" };
  const domains = { "github.com": "github", "x.com": "x", "twitter.com": "x", "scholar.google.com": "scholar", "linkedin.com": "linkedin" };
  const platform = aliases[key] || domains[hostname.replace(/^www\./, "")];
  const names = { github: "GitHub", x: "X", scholar: "Google Scholar", linkedin: "LinkedIn" };
  if (!platform) return link;
  const label = item.label || names[platform];
  link.className = "social-icon";
  link.title = label;
  link.setAttribute("aria-label", label);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", socialIconPaths[platform]);
  path.setAttribute("fill", "currentColor");
  svg.append(path);
  link.replaceChildren(svg);
  return link;
}
function emptyState(title, message) {
  const box = el("div", undefined, "empty-state");
  box.append(el("h2", title), el("p", message)); return box;
}
function badge(text) { return el("span", text, "tag"); }
function tags(items) { const row = el("div", undefined, "tags"); (items || []).forEach(tag => row.append(badge(tag))); return row; }

if (page === "home") {
  if (profile.affiliation?.length) {
    $("#affiliation").replaceChildren();
    profile.affiliation.forEach((line, i) => {
      if (i) $("#affiliation").append(el("br"));
      $("#affiliation").append(document.createTextNode(line));
    });
  }
  const initials = personName.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join("").toUpperCase();
  $("#avatar span").textContent = initials;
  if (safeUrl(profile.avatar)) {
    const img = el("img"); img.alt = personName;
    img.addEventListener("load", () => $("#avatar").replaceChildren(img));
    img.src = safeUrl(profile.avatar);
  }
  if (profile.research?.length) $("#research-copy").replaceChildren(...profile.research.map(text => el("p", text, text.startsWith("[") ? "placeholder" : "")));
  function fillExperience(id, items) {
    const target = document.getElementById(id);
    if (!items?.length) { target.replaceChildren(el("p", "To be added.", "empty-note")); return; }
    target.replaceChildren(...items.map(item => {
      const article = el("article", undefined, "experience-item");
      const mark = el("div", item.mark || item.name.slice(0, 2), "institution-mark"); mark.setAttribute("aria-hidden", "true");
      const logoUrl = safeUrl(item.logo);
      if (logoUrl) {
        const logo = el("img");
        logo.alt = "";
        logo.width = 52;
        logo.height = 52;
        logo.addEventListener("error", () => {
          mark.textContent = item.mark || item.name.slice(0, 2);
          mark.classList.remove("has-logo");
        }, { once: true });
        mark.classList.add("has-logo");
        mark.replaceChildren(logo);
        logo.src = logoUrl;
      }
      const detail = el("div", undefined, "experience-detail"); detail.append(el("h3", item.name));
      if (item.detail) detail.append(el("p", item.detail));
      if (item.date) detail.append(el("p", item.date, "date"));
      article.append(mark, detail); return article;
    }));
  }
  fillExperience("education-list", profile.education);
  fillExperience("experience-list", profile.experience);
  if (profile.email) {
    const link = el("a", profile.email); link.href = `mailto:${profile.email}`;
    $("#email").replaceWith(link);
  }
  (profile.links || []).forEach(item => { const a = socialLink(item); if (a) $("#social-links").append(a); });
}

const toggle = $(".menu-toggle");
const nav = $("#nav-links");
function closeMenu() { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open navigation menu"); nav.classList.remove("open"); }
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu"); nav.classList.toggle("open", open);
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { closeMenu(); toggle.focus(); } });
document.addEventListener("click", e => { if (!e.target.closest(".navigation")) closeMenu(); });
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
