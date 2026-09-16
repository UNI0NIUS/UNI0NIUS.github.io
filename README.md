# UNI0NIUS.github.io

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
