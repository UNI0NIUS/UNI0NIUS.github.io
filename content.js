// Publications and blog posts. Replace the examples with your own work.
// Set example: false after replacing an entry, or use [] for an empty page.
// URLs may be https:// links or paths relative to the dist folder.
window.CONTENT = {
  publications: [
    {
      id: "publication-template",
      example: true,
      title: "Your publication title",
      authors: ["Your Name", "Coauthor Name"],
      venue: "Journal or conference name",
      year: "",
      tags: ["Chemistry"],
      abstract: "[Summarize the research question, your approach, the main results, and their significance. This is a template entry, not a published paper.]",
      // Example: { label: "Paper", url: "papers/your-paper.pdf" }
      links: []
    }
  ],
  techPosts: [
    {
      id: "first-technical-post",
      example: true,
      title: "Your first technical post",
      // Use YYYY-MM-DD, or leave the date empty.
      date: "",
      tags: ["Chemistry", "Research notes"],
      excerpt: "[Add a short summary of a method, a paper you have read, or a question you are working through.]",
      body: [
        { type: "paragraph", text: "[Introduce the topic and explain the question this post addresses.]" },
        { type: "heading", text: "Background" },
        { type: "paragraph", text: "[Explain the background and define the key ideas a reader needs.]" },
        { type: "heading", text: "Method and observations" },
        { type: "paragraph", text: "[Describe your approach and discuss the observations. You can add paragraphs, lists, code, images, or links.]" },
        { type: "list", items: ["[First observation]", "[Second observation]", "[An open question]"] },
        { type: "heading", text: "Takeaways" },
        { type: "paragraph", text: "[Summarize what you learned and what you would like to explore next.]" }
      ]
    }
  ],
  personalPosts: [
    {
      id: "first-personal-post",
      example: true,
      title: "Your first personal post",
      date: "",
      tags: ["Life", "Reflections"],
      excerpt: "[Add a few sentences about the story, experience, or idea you want to share.]",
      body: [
        { type: "paragraph", text: "[Start with a moment, a thought, or a question that matters to you.]" },
        { type: "heading", text: "The story" },
        { type: "paragraph", text: "[Share the experience in your own words. Add as many paragraphs as you need.]" },
        { type: "quote", text: "[An idea you would like to remember.]" },
        { type: "heading", text: "Looking back" },
        { type: "paragraph", text: "[Reflect on what changed, what you learned, or what remains unresolved.]" }
      ]
    }
  ]
};
