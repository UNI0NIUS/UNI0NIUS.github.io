# Reading fonts

Self-hosted WOFF2 subsets of Noto Serif and Noto Serif SC under SIL OFL 1.1; licenses are included alongside the fonts. The original font names and copyright notices are retained in their metadata.

- Noto Serif normal and italic: https://github.com/google/fonts/tree/main/ofl/notoserif
- Noto Serif SC variable: https://github.com/google/fonts/tree/main/ofl/notoserifsc

`reading-serif` contains Latin, combining marks, Greek, polytonic Greek and common punctuation, with real normal/italic weights from 400 to 700. `reading-cjk` contains the current translation library's CJK characters and punctuation, with real weights from 400 to 600. CSS tries the western font first and then CJK, so accented letters in a word use the same family. Font loads use `swap`, with local serif fallbacks; there is no external font request at reading time.

After adding Chinese text, rebuild the CJK subset so new characters receive the same typography (uncovered characters still use the local fallback). Install `fonttools[woff]` and supply the upstream variable TTF files:

```sh
python scripts/build-reading-fonts.py --cjk /path/NotoSerifSC-VF.ttf --serif /path/NotoSerif.ttf --italic /path/NotoSerif-Italic.ttf
```

Keep both OFL text files with redistributed fonts.
