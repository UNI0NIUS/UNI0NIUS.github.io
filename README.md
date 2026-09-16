# UNI0NIUS.github.io

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
