# 《土耳其文学中的城市权利小说：从20世纪60年代至今》

N. Buket Cengiz（N. 布凯特·坚吉兹），2021年。全书中文工作译本，2026-10-17。

## 阅读与文件

- right_city_bilingual.pdf：中英逐段对照，左中文右英文，223页。
- right_city_en.pdf：完整英文整理版，118页。
- right_city_zh.md：完整中文Markdown，原注使用标准脚注语法；离线图片位于同级images目录，见源码包。
- glossary.md：术语、题名及人名表。
- review.md：校对记录、底本疑点及实际完成的外部核验。
- right_city_source.zip：逐段双语数据、源文行定位、TeX、生成脚本、图片及校对资料。

原版256页均已覆盖，包括出版前置材料、九章、57条原注、304条各章书目、封面和地图、完整索引。目录与索引数字为原书印刷页码。

网页阅读：https://uni0nius.github.io/translations/book.html?id=right-to-the-city-novels

## 源码复现

ZIP内保持tools目录与本书目录并列。规范译文在本书work/packets/*.json，reading_order指定顺序，source_blocks定位到work/source_pages.json。每个单元具有稳定ID；跨页段落保留完整来源。优先编辑规范包，不要直接改生成PDF。

从解压根目录运行 python tools/render_right_city.py，再运行 python tools/compile_right_city.py。需要Python 3、XeLaTeX、Times New Roman和SimSun；编译器路径可在compile_right_city.py内改为本机xelatex。audit_right_city.py另需PyMuPDF。不要为重排而重跑早期分章builder：这些是历史翻译生成脚本，后续修订已汇总到规范包。

源码包含生成TeX，可在本书output目录直接对两个.tex文件分别执行两遍xelatex。source_pages.json是所供PDF的带字体与坐标文本抽取，可据此重新检查覆盖。原PDF哈希：1d9cc5ba28b73ebc116dee74d9fac212484d51b4851a153c5eecb1f632d0c5a7。

英文原作及原图的权利归各自权利人所有。中文为AI辅助工作译本，不代表授权出版中译本；引文经所供英文底本转译。
