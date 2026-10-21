// Run after changing translation content: node scripts/build-catalog-counts.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
global.window = {};
require(path.join(root, 'translations-data.js'));
const han = text => (text.match(/\p{Script=Han}/gu) || []).length;
function textCount(value) {
  if (typeof value === 'string') return han(value);
  if (Array.isArray(value)) return value.reduce((n, v) => n + textCount(v), 0);
  if (!value || typeof value !== 'object' || value.type === 'note') return 0;
  return textCount(value.children || value.text || value.items || value.rows || value.tex || []);
}
function count(data) {
  return (data.body || []).reduce((n, block) => n + textCount(block.zh ?? (block.en ? [] : block)), 0)
    + Object.values(data.notes || {}).reduce((n, note) => n + textCount(note.zh || []), 0);
}
const counts = {};
for (const item of [...window.TRANSLATIONS.books, ...window.TRANSLATIONS.articles]) {
  const seen = new Set();
  counts[item.id] = (item.chapters || [item]).reduce((n, chapter) => {
    if (!chapter.dataUrl) return n + count(chapter);
    const file = chapter.dataUrl.split('?')[0];
    if (seen.has(file)) return n;
    seen.add(file);
    return n + count(JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')));
  }, 0);
}
fs.writeFileSync(path.join(root, 'translations-counts.js'), '// Generated: Han characters in published Chinese body and original notes, including headings/captions; excludes punctuation and Latin text.\nwindow.TRANSLATION_COUNTS = ' + JSON.stringify(counts, null, 2) + ';\n');
console.log(`Updated ${Object.keys(counts).length} catalog counts.`);
