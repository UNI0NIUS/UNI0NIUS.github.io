// Edit this file to publish translated books and articles. No build step is needed.
// Keep each book/article ID unique, and each chapter ID unique within its book.
// Remove example: true when replacing a template with your own translation.
window.TRANSLATIONS = {
  books: [
    {
      id: "sample-book",
      title: "Book translation template",
      originalTitle: "",
      author: "",
      translator: "", // Empty uses the name in profile.js.
      languagePair: "", // For example: "English → Chinese".
      sourceUrl: "",
      description: "A place for long-form translations, organized into chapters.",
      example: true,
      chapters: [
        {
          id: "preface",
          title: "Translator’s preface",
          body: [
            { type: "paragraph", text: "[Introduce the book, its author, and your reasons for translating it.]" },
            { type: "heading", text: "About this translation" },
            { type: "paragraph", text: "[Describe the original edition and your approach to terminology and notation.]" }
          ]
        },
        {
          id: "chapter-1",
          title: "Chapter 1 · Introduction",
          body: [
            { type: "paragraph", text: "[Add the opening chapter of your translation here.]" },
            { type: "heading", text: "1.1 First section" },
            { type: "paragraph", text: "[Add the translated text of this section.]" },
            { type: "quote", text: "[An optional translated quotation.]" }
          ]
        },
        {
          id: "chapter-2",
          title: "Chapter 2 · Further reading",
          body: [
            { type: "paragraph", text: "[Add the next chapter of your translation here.]" },
            { type: "heading", text: "Translator’s notes" },
            { type: "ordered-list", items: ["[Explain a translation choice or a term.]", "[Add a reference or contextual note.]"] }
          ]
        }
      ]
    }
  ],
  articles: [
    {
      id: "sample-article",
      title: "Article translation template",
      originalTitle: "",
      author: "",
      translator: "",
      languagePair: "",
      sourceUrl: "",
      description: "A place for translated essays, papers, and shorter articles.",
      example: true,
      body: [
        { type: "paragraph", text: "[Introduce the original article and add your translation here.]" },
        { type: "heading", text: "Translator’s notes" },
        { type: "paragraph", text: "[Add context, references, or notes on terminology.]" }
      ]
    }
  ]
};
