# UNI0NIUS.github.io

## 发布与站点分工

表站与里站共用此发布仓库。表站直接编辑静态文件；里站从本地 `preview-v2` 源码构建后发布到 `union.html`。完整步骤见 [表站与里站发布说明](PUBLISHING.md)。下面的旧版静态翻译维护说明只适用于表站；非 Lask 书籍已迁入里站。

## Projects

The **Projects** navigation link opens `/projects/`, a responsive collection of image-led project cards. The first project is NaF / CPS Formalization; its description is public while its source remains private.

Edit **`projects-data.js`** to add or update cards. Each entry supports `id`, `title`, `subtitle`, `image`, `imageAlt`, `tags`, `description`, `links`, and `sourceNote`. Entries appear in array order. Upload project figures under `images/projects/` and use a root-relative filename such as `images/projects/my-project.png`. Images are fitted without cropping; a missing or broken image falls back to the project title.

For a public project, add links such as:

```js
links: [
  { label: "View Source", url: "https://github.com/YOUR-USERNAME/YOUR-PROJECT" },
  { label: "Read Report", url: "files/projects/report.pdf" }
],
sourceNote: ""
```

Leave `links: []` for private projects. Commit changes to `main` to publish through GitHub Pages. The layout uses two columns for multiple projects, centers a single project, and stacks cards on small screens.

## Translations

Open `/translations/` for the books and articles library. All navigation and reader controls are in English; translation text can be in any language.

Edit **`translations-data.js`** on GitHub, then commit to `main`. GitHub Pages publishes the changes automatically. No build command is required.

### Add a book

1. Copy the sample entry in `books` (or replace it).
2. Fill in `title`, `author`, `description`, and optionally `originalTitle`, `translator`, `languagePair`, and `sourceUrl`. An empty translator uses your name from `profile.js`; other empty metadata is hidden.
3. Give the book a unique, stable `id`, such as `my-translated-book`. Set `example: false`.
4. Add entries to its `chapters` array in reading order. Each needs its own `id`, `title`, and `body`. The sidebar and previous/next chapter links update automatically.
5. Optionally add `language: "zh-CN"` to the book to identify the language of its text for screen readers.

Example chapter:

```js
{
  id: "chapter-3",
  title: "Chapter 3 · Symmetry",
  body: [
    { type: "paragraph", text: "Your translated text goes here." },
    { type: "heading", text: "3.1 Definitions" },
    { type: "paragraph", text: "Continue the translation here." }
  ]
}
```

Book links look like `translations/book.html?id=my-translated-book`. A chapter can be linked directly using `&chapter=chapter-3`. Keep IDs unchanged to preserve shared links. Desktop readers have a sticky chapter sidebar; on smaller screens the **Chapters** disclosure opens the table of contents.

### Add an article

Copy or replace an entry in `articles`, set its unique `id`, title and metadata, and write its translation in `body`. Set `example: false`. Article links look like `translations/article.html?id=my-article`.

### Content blocks

`body` is an array of blocks; text is rendered literally, without HTML or Markdown parsing:

| Type | Fields |
| --- | --- |
| `paragraph`, `heading`, `subheading`, `quote`, `code` | `text` |
| `list`, `ordered-list` | `items: ["First item", "Second item"]` |
| `link` | `text`, `url` |
| `image` | `src`, `alt`, optional `caption` |

Upload images or PDF files into a folder such as `images/translations/` or `files/translations/`, then reference them from the repository root, for example `src: "images/translations/figure-1.jpg"` or `{ type: "link", text: "Download PDF", url: "files/translations/book.pdf" }`.

Separate entries with commas, escape a literal quotation mark inside text as `\"`, and use `\n` for a line break inside a string. Remove the template entries when ready; empty book/article lists display a short empty-state message.

## Social profile icons

Edit `links` in `profile.js`. Use `icon: "github"`, `"x"`, `"scholar"`, or `"linkedin"` for a circular icon. Existing labels and recognized profile domains are also detected automatically. Set `url` to your own profile address; entries with empty URLs are hidden. Other links retain their text labels.

### Catalog layout and filters

The library uses compact entries with linked Chinese/original titles, author metadata, language, Chinese character counts and topic tags. Descriptions remain in the source data but are not displayed in the catalog. Edit `tags` (bilingual labels) and optional `authorZh` in `translations-data.js`. Search matches titles, authors, language and tags; selected tags use AND semantics and combine with search. The current query is preserved in the URL.

After changing published translation content, run `node scripts/build-catalog-counts.cjs` from this directory and include the generated `translations-counts.js`. Counts include Han characters in the Chinese reading body (including headings, captions and tables) and original notes; punctuation, Latin text, metadata and note markers are excluded. Counts describe the currently published reading data, not an assertion of translation completeness.
