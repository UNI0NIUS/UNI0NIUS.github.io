# Friction 校订阅读版

Anna Lowenhaupt Tsing，《Friction: An Ethnography of Global Connection》，Princeton University Press，2005。

本包包含中文/英汉对照阅读成果的规范数据、结构、校订证据和可复现生成器。保留1254条记录，其中1228个有效翻译单元（含218条原注）、26条合并指向；参考文献353条保留英文，19条编者校注与原注独立。

逐章语义校对、章末检查及全书术语统检已经完成。原作史实疑点按已获得的证据作有限说明，不表示逐条外部查证全部引文。英文是扫描底本整理稿，原始OCR及实际修订保留在规范数据或修订证据中。各阶段检查范围与适用哈希见work/review中的审计文件；早期章级哈希不代表最终生成版本。

范围：索引不译，环衬名录不重建；三部分部照片以核实的图注和说明呈现，两幅图示重绘。正文名录保留原编号及跳号。原始扫描PDF未放入源码包，来源定位采用底本PDF页序及印刷页码；前言另用罗马页码。原著版权©2005 Princeton University Press，保留所有权利。本包不授予原著新的许可，也不声明出版社授权。

## 目录与复现

保留解压后的Friction/work/review与Friction/output/reviewed相对路径。不要运行历史apply、accept、complete等一次性修订脚本；本包仅提供当前生成入口。无需重新翻译。

依赖：Python 3.11或以上、beautifulsoup4、PyMuPDF；Pandoc（Markdown导出）；XeLaTeX/TeX Live 2025及fontspec、xeCJK、TikZ、xurl等标准宏包。打印字体为Times New Roman与SimSun。其他系统应安装同名字体，或明确替换字体后重新做全书版面验收。脚本先从PATH定位Pandoc/XeLaTeX；Windows回退路径在脚本中标明，异机可按本机位置修改。

在解压根目录依次运行：

    python Friction/work/review/build_reading.py
    python Friction/work/review/audit_reading.py
    python Friction/work/review/audit_reading_structure.py
    python Friction/work/review/build_print.py
    python Friction/work/review/compile_print.py
    python Friction/work/review/audit_print.py
    python Friction/work/review/build_markdown.py
    python Friction/work/review/audit_markdown.py
    python Friction/work/review/export_site.py
    python Friction/work/review/audit_site.py

输出写入Friction/output/reviewed。Markdown的图示位于相邻figures目录；独立HTML内嵌样式和图示。PDF编译至目录收敛，最多三遍；编译成功仍须查看实际页面。审计会更新相应JSON报告，不自动宣布发布完成。网站导出仅写入本地site子目录，不自行推送。

网站导出使用既有阅读器的body逐段en/zh与notes结构，复用目录、语言切换、并排布局和段下原注。诗节、嵌套引语和图示采用通用结构token；不另设本书专用阅读器。未打包整个个人网站或其他书目。
