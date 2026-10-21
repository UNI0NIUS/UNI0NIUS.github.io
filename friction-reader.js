"use strict";
// Versioned, allowlisted DOM data. No raw HTML or event attributes are accepted.
window.renderFrictionBook = (chapter, view) => {
  const tags = new Set("section header div span p h1 h2 h3 h4 strong em i b sup sub a br ul li figure figcaption svg defs marker path g text".split(" "));
  const attributes = new Set("id class lang role aria-label data-unit data-joined-units viewbox refx refy markerwidth markerheight orient d fill stroke stroke-width marker-start marker-end text-anchor font-size x y".split(" "));
  const cases = {viewbox:"viewBox",refx:"refX",refy:"refY",markerwidth:"markerWidth",markerheight:"markerHeight"};
  function node(data, svg = false) {
    if (typeof data === "string") return document.createTextNode(data);
    if (!tags.has(data.tag)) throw new Error("Unsupported Friction node");
    svg = svg || data.tag === "svg";
    const element = svg ? document.createElementNS("http://www.w3.org/2000/svg",data.tag) : document.createElement(data.tag);
    for (const [key,value] of Object.entries(data.attrs || {})) {
      if (attributes.has(key)) element.setAttribute(cases[key] || key,String(value));
    }
    if (data.tag === "a" && data.attrs.href) {
      const href = data.attrs.href;
      if (href.startsWith("#")) {
        const destination = data.attrs["data-target-chapter"];
        const url = new URL(location.href);
        url.searchParams.set("chapter",destination);
        const targetLanguage = href.endsWith("-en") ? "en" : href.endsWith("-zh") ? "zh" : null;
        url.searchParams.set("view",view !== "parallel" && targetLanguage ? targetLanguage : view);
        url.hash = href;
        element.href = destination === chapter.id && url.searchParams.get("view") === view ? href : url.href;
      } else {
        const url = new URL(href,location.href);
        if (["https:","http:"].includes(url.protocol)) {element.href=url.href;element.rel="noopener noreferrer";}
      }
    }
    for (const child of data.children || []) element.append(node(child,svg));
    return element;
  }
  const content = document.createElement("div");
  content.className = "friction-content view-" + view;
  for (const item of chapter.body) content.append(node(item));
  return content;
};
