# 从“希腊人的帝国”到“拜占庭”

Anthony Kaldellis，2021，第十三章，原书349–367页。
底本为用户提供的PDF；原著权利归原权利人。本版为非官方中文校订阅读版。

正文40个双语单元、49条原注、3条独立校注。网页、Markdown、PDF均来自同一article.json。
原页数字表示段落起始页，endPage保存跨页范围；source_refs可回溯source_blocks.json。
双语PDF18页，英文PDF10页。实际校对和检查范围见review.json；不代表所有历史引文均已独立核实。

## 复现

直接修改work/article.json，再运行render_kaldellis.py；不要重跑初译修订或一次性prepare脚本。
目录须保持：本脚本位于Article目录，work与output位于其下以From开头的任务目录。
需要Python3、XeLaTeX、Times New Roman、SimSun字体及paracol、xeCJK等标准TeX包。
运行xelatex -interaction=nonstopmode -halt-on-error article_bilingual.tex和article_en.tex。
检查脚本使用PyMuPDF与Pillow；本机依赖位于工作区tools/python_libs，异机可安装相应包后调整导入路径。
TeX源文件也可直接编译，无须重建规范数据。
