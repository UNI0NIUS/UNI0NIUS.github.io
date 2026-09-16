"""Build reading subsets; see fonts/README.md for source fonts and usage."""
from pathlib import Path
import argparse
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

parser = argparse.ArgumentParser()
parser.add_argument('--cjk', type=Path, required=True)
parser.add_argument('--serif', type=Path, required=True)
parser.add_argument('--italic', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / 'fonts'
out.mkdir(exist_ok=True)
texts = [p.read_text('utf-8') for p in (root / 'translations').rglob('*.json')]
texts += [(root / f).read_text('utf-8') for f in ['translations-data.js', 'translations.js', 'bilingual-reader.js']]
cjk_chars = {ord(c) for c in ''.join(texts) if ord(c) >= 0x2e80 or 0x2100 <= ord(c) < 0x2300}
# Keep all Latin, combining marks, Greek (including polytonic), and common punctuation.
western_chars = set(range(0x0000, 0x0530)) | set(range(0x1e00, 0x2300))
for source, name, chars, weights in [
    (args.cjk, 'reading-cjk', cjk_chars, (400, 400, 600)),
    (args.serif, 'reading-serif', western_chars, (400, 400, 700)),
    (args.italic, 'reading-serif-italic', western_chars, (400, 400, 700)),
]:
    font = TTFont(source)
    options = subset.Options()
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=chars)
    sub.subset(font)
    axes = {'wght': weights}
    if any(a.axisTag == 'wdth' for a in font['fvar'].axes): axes['wdth'] = 100
    instantiateVariableFont(font, axes, inplace=True)
    font.flavor = 'woff2'
    path = out / (name + '.woff2')
    font.save(path)
    print(f'{path.name}: {path.stat().st_size:,} bytes; {len(font.getBestCmap())} glyph code points')
