# 实验北京：译校交付源码

底本：Sasha Su-Ling Welland, Experimental Beijing: Gender and Globalization in Chinese Contemporary Art, Duke University Press, 2018。

本包含同一规范数据生成的中文稿、中英逐段对照稿、网页数据、图像与可编辑 XeLaTeX 源码。原书页码与本稿页码分开标示。原注按章列出，PDF有双向链接；网页原注紧随对应段落。

## 重新生成

需要 Python 3.11+、Pillow、XeLaTeX（TeX Live 2025）、Times New Roman、SimSun、SimHei。字体使用系统已安装版本，不在本包另行分发。跨平台需自行安装相应字体或明确调整 render_print.py 的字体设置，并重新验收版面。

在本包根目录运行：

```
python export_reader.py
python render_print.py
cd delivery/print
xelatex -interaction=nonstopmode -halt-on-error zh.tex
xelatex -interaction=nonstopmode -halt-on-error zh.tex
xelatex -interaction=nonstopmode -halt-on-error bilingual.tex
xelatex -interaction=nonstopmode -halt-on-error bilingual.tex
```

build/canonical_book.json 是本交付版本冻结的统一生成输入，保留原文、译文、原页定位、字体及图像映射。canonical_zh 与 aligned 保存校对后的可维护数据及对应关系；两者改动后须同步对齐和哈希，重新生成规范包，不应直接重跑上游翻译程序。旧翻译批次生成器不随包交付。

网页数据兼容个人主页现有 bilingual-reader.js / translations.js。delivery/registration.json 为目录注册项；web-reader/ 保存验收时的阅读器代码与样式参考。正式网址以交付记录为准。

PDF 的创建时间等元数据可能随重编译改变；可复现指内容、结构和排版来源可重建，不保证不固定工具链时间戳时PDF字节完全相同。验收和线上下载使用实际发行文件的SHA256。

## 校对范围

全书首轮语义对照、463条原注、图注与附属材料已处理。书目和索引保留原文。完整译校限制、专名与底本差异见 editorial_note.md；语义校对不代表独立核实全部历史陈述。evidence/ 含对应的验收与修订证据。

## 权利与授权记录

原书版权及图像署名按底本保留，底本声明 all rights reserved。本工作区未取得另行的出版方开放许可记录，不将用户的操作授权描述为出版方授权。用户于2026-10-19明确要求在翻译完成后校对并发布至其个人主页，之后要求作为持续goal完成。本包不赋予第三方额外的版权许可。
