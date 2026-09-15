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
  (profile.links || []).forEach(item => { const a = resourceLink(item.label, item.url); if (a) $("#social-links").append(a); });
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
