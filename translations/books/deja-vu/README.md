# Déjà Vu and the End of History / 既视感与历史终结

One book, one stable catalog ID: `deja-vu-and-the-end-of-history`.

- Author: Paolo Virno. English translation: David Broder.
- Chinese: Xiaoyang Hao's AI-assisted working translation, reviewed 2026-09-16; still subject to editorial correction.
- English text and inline emphasis come from the supplied EPUB. Chinese comes from the reviewed Chinese Markdown, not the older bilingual PDF or translation cache.
- Scope: all three parts (including their epigraphs), 257 prose units, 26 section headings, all 150 original notes, 2 Chinese editorial notes, one diagram, and the 49-entry name index. Publisher front matter is not part of this reading edition.
- English readings are retained even where the Chinese review flags a possible source problem. Eight such uncertainties are displayed as expandable editorial queries. This is not a claim to a final critical edition.

## Reading

`/translations/book.html?id=deja-vu-and-the-end-of-history`

The default is paragraph-aligned Chinese/English. `&view=zh` or `&view=en` selects a single language without creating another book. `&chapter=part-ii-section-8` addresses a section; `#pii-b093` addresses a paragraph. Small screens stack the two languages paragraph by paragraph.

Printed English pagination is shown in the margin as `p. xx` (or a span where a paragraph crosses a page boundary). These are not PDF sheet numbers. Footnotes appear directly beneath their referring paragraph in each language, with forward and return links, rather than in a separate endnote section.

## Data and maintenance

The catalog remains in `translations-data.js`; each chapter descriptor has a `dataUrl`. The reader loads only the selected chapter JSON. Each body row has a stable `id`, `type`, printed `page`, and structured `zh` / `en` inline arrays. Strings render literally; allowed inline objects are `em`, `strong`, `sup`, `sub`, `link`, and `note`. No arbitrary HTML is interpreted.

Do not strip individual inline text fragments: their leading/trailing whitespace is significant around English emphasis. Do not renumber original notes across parts: IDs such as `I-6` and `II-6` are distinct. `I-X1` and `I-X2` are Chinese editorial notes and do not belong in the English text.

Keep paragraph IDs and chapter IDs stable when editing so language switching, note backlinks, and shared URLs continue to work. `book-metadata.json` is an export of the book metadata; the live catalog is `translations-data.js`. No build service or extra external runtime dependency is required.

## Source integrity at export

Chinese Markdown SHA-256: `6c7a49164067f679369ce5fe0f6cdace442e1509a9064f1359679860048aa597`.

Supplied EPUB SHA-256: `6587844d8dd33756107d86fe4f3c418d6f7dc633741dcd0471b952274959bdd6`.

The export validates all 433 original heading/prose/note units against their source or reviewed translation, plus both editorial notes. All rights in the original work and English translation remain with their respective holders; this publication does not relicense them.

## Parts, typography, and the Italian reference edition

The catalog explicitly defines three `parts`; chapter `partId` fields nest the existing chapter links under those parts. The current part opens automatically; the index remains separate. IDs and paragraph anchors are unchanged. `shortTitle` and `shortOriginalTitle` avoid repeating part numerals on child links.

The original Italian reference edition is *Il ricordo del presente. Saggio sul tempo storico* (Bollati Boringhieri, 1999; ISBN 9788833911335). Its bibliographic link is available in the reader header. `originalEdition.status` is `awaiting-scan`: no Italian text or downloadable scan is currently provided. Add the verified scan and source information when received; do not label the English translation as Italian or fabricate aligned Italian paragraphs.

The self-hosted reading fonts include real 400–600 Chinese weights and regular/italic Latin and Greek glyphs, including combining marks and polytonic Greek. Chinese emphasis uses 600, with synthetic weight and slant disabled. Latin and Greek take precedence over CJK fonts to keep words with accents in one typeface. See `fonts/README.md` for rebuilding the Chinese subset when adding new text.
