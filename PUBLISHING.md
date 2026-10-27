# 表站与里站发布说明

## 目录与入口

两站共用 `UNI0NIUS/UNI0NIUS.github.io` 仓库的 `main` 分支。可以只提交其中一站的改动；推送后，GitHub Pages 会重新部署整个站点。

| 项目 | 本地位置（相对于工作目录 `co`） | 用途 |
| --- | --- | --- |
| 表站与发布仓库 | `release-site/` | 实名主页的可编辑静态文件，以及里站的构建产物；从这里提交和推送 |
| 里站源码 | `preview-v2/src/`、`preview-v2/public/`、`preview-v2/index.html` | 修改里站布局、功能与内容 |
| 里站构建输出 | `preview-v2/dist/` | `npm run build` 生成，不直接编辑 |
| 表站预览副本 | `preview-v2/public/personal/` | 供开发预览返回实名主页；这里的修改不会自动发布到表站 |
| 最初下载的原版 | `homepage/` | 保留原样；不是当前发布目录 |
| 早期设计版本 | `preview-v1/`、`preview-v2-k3/` | 历史设计参考，不用于发布 |

| 页面 | 开发预览 | 正式入口 |
| --- | --- | --- |
| 表站 | `http://127.0.0.1:8771/personal/index.html` | <https://uni0nius.github.io/> |
| 里站 | `http://127.0.0.1:8771/#/archive/writing` | <https://uni0nius.github.io/union.html#/archive/writing> |

表站左上角链接指向 `/union.html#/archive`；里站返回按钮在正式环境指向 `/index.html`。正式环境需要 `union.html`，不能用里站构建生成的 `index.html` 覆盖表站首页。

里站源码目前保存在本地 `preview-v2/`，发布仓库保存的是构建产物。单独克隆 GitHub 发布仓库不能还原里站的全部开发源码；备份时同时保留 `preview-v2/`（可排除 `node_modules/`、`dist/`）及其锁文件。

## 开始一次更新

以下 PowerShell 命令均从工作目录运行：

```powershell
Set-Location -LiteralPath 'C:\Users\Union\Documents\Codex\2026-10-25\co'
git -C .\release-site status --short
```

确认已有改动的归属。工作区干净时，先同步线上版本，再开始编辑：

```powershell
git -C .\release-site pull --ff-only origin main
```

如果已有未提交的改动，先保留并处理这些改动，再同步；不要用重置命令覆盖它们。若远端已前进且无法快进，先检查双方差异，不强制推送。

## 只更新表站

直接编辑 `release-site/` 中对应文件：

| 内容 | 文件 |
| --- | --- |
| 个人资料、头像配置 | `profile.js` |
| 首页结构、样式、通用逻辑 | `index.html`、`styles.css`、`site.js` |
| 项目 | `projects-data.js`、`projects/`、相关图片 |
| 出版物 | `publications/` 及其引用的数据文件 |
| Lask 三卷本、用户指定的并行书目及表站文章 | `translations-data.js`、对应 `translations/` 文件 |

表站是静态网站，无需执行里站的 Vite 构建或打包。修改译文后，从发布仓库重建字数索引，并检查页面引用的资源版本号是否需要更新：

```powershell
Push-Location .\release-site
node scripts/build-catalog-counts.cjs
Pop-Location
```

本地预览可另开终端运行（端口被占用时换一个）：

```powershell
python -m http.server 8773 --bind 127.0.0.1 --directory .\release-site
```

打开 `http://127.0.0.1:8773/index.html` 检查。需要在 8771 开发预览中看到相同内容时，再将改过的表站文件同步到 `preview-v2/public/personal/`；该预览副本的里站入口仍应使用 `/#/archive`。

## 只更新里站

1. 编辑 `preview-v2/` 源码，在 8771 开发预览检查。
2. 构建，再将产物打包进发布仓库：

```powershell
npm --prefix .\preview-v2 run build
node .\preview-v2\scripts\package-release.mjs
git -C .\release-site status --short
git -C .\release-site diff --stat
git -C .\release-site diff -- union.html
```

需要启动开发服务时：

```powershell
npm --prefix .\preview-v2 run dev -- --port 8771 --strictPort
```

构建已关闭 `build.copyPublicDir`，不再把表站预览和静态资源重复复制进 dist。`package-release.mjs` 从 dist 取编译后的 assets 和首页，从 public 取 audio、images、vendor、writing 和 favicon；逐文件比较内容，只写入变化文件。重复运行应显示 0 changed。dist 不再是可单独部署的完整站点，发布验证使用组装后的 release-site 静态服务。

它将构建首页改名为 `release-site/union.html`，不复制 `public/personal/`，也不覆盖实名首页或 Lask 章节。图片、vendor 和 favicon 属于共享路径，提交前检查实际文件差异。不会自动清理旧文件，以免误删共享资源或旧页面仍引用的哈希资源。

纯译文 JSON 或本地音源更新（没有改 src、index.html、依赖或字体）可以在已有有效 dist 的前提下仅运行打包脚本；书目、标签或界面变动仍需构建。提交仅包含本次改动的路径，避免把历史产物纳入 PR。Git 本身只推送新增对象；GitHub Pages 的整站部署仍会发生。本地构建与发布打包优化不会改变远端部署模式。

使用上一节的静态服务打开 `http://127.0.0.1:8773/union.html#/archive/writing`，检查正式路径下的表现。不要只依赖开发服务的检查。

### 里站书籍与资源

- 书目、章节顺序、tag：`preview-v2/src/content/writing.json`。
- 正文和注释：`preview-v2/public/writing/<书籍标识>/<章节标识>.json`。
- 现有书籍中的原图、图版及页影仍引用 `release-site/translations/books/` 或 `release-site/images/` 下的原始资源；开发环境从 `public/personal/` 的对应路径读取。不能仅因书目迁走就删除这些资源。
- 修改正文时同步更新该章节的 `readingUnits`，算法见 `src/writing.js` 的 `readingUnits()`；它用于全书阅读进度。
- 读书记录使用 `preview-v2/src/content/reading.json`，地点与重复到访记录使用 `places.json`，当地示例照片使用 `preview-photos.json`（均在同一目录）；音乐使用 `preview-v2/public/audio/playlist.json` 和本地音源文件。旧的 `CONTENT-GUIDE.md` 含早期布局说明，字段以当前数据和渲染代码为准。

修改书籍或阅读器时运行现有检查：

```powershell
Push-Location .\preview-v2
node --test tests/records.test.mjs tests/writing.test.mjs
Pop-Location
```

其中迁移完整性测试以最初迁移的 13 本、466 个章节为基准。新增书目或正式修订正文时，应同步维护测试基准，而非覆盖回旧稿。纯样式调整通常只需构建和实际页面检查。

## 不属于日常发布的迁移脚本

| 脚本 | 实际作用 |
| --- | --- |
| `import-books.mjs` | 根据 `release-catalog.js` 快照和 `release-site` 中旧书籍源文件，重新生成里站书目及正文副本；会覆盖里站相应内容 |
| `import-preview-book.mjs` | 上述脚本的兼容入口，现在同样导入全部非 Lask 书籍 |
| `prepare-release.mjs` | 根据旧的完整书目快照重写表站目录、迁移跳转和预览副本；可能覆盖后来新增的表站书目、文章元数据 |
| `package-release.mjs` | 将刚构建的里站产物复制到发布仓库；这是日常里站更新使用的脚本 |

`release-catalog.js` 和 `migration-manifest.json` 是迁移记录，不是持续维护的线上完整书目。普通改版不执行前三个脚本。确实要重做迁移时，先核对并更新输入快照，保留后续编辑，再检查生成差异。

## 提交与上线（两站通用）

先检查实际改动，暂存本次需要发布的文件，不混入无关的本地工作。以下为操作示例，文件列表按实际改动填写：

```powershell
# 表站：例如只更新个人资料
git -C .\release-site add -- profile.js

# 里站：暂存 union.html 及它引用的新构建文件；本次更新的数据、图片、音源另行加入
git -C .\release-site add -- union.html assets/

git -C .\release-site diff --cached --stat
git -C .\release-site diff --cached --name-status
git -C .\release-site commit -m "Describe this website update"
git -C .\release-site push origin main
```

上面两种 `git add` 示例按实际更新选择，不能把占位提交说明当作正式说明。构建后的 JS/CSS 文件名带哈希，每次必须连同 `union.html` 一起提交。

首次提交若提示缺少作者身份，只为这个仓库设置合适的 `user.name` 和 `user.email`，不必修改全局配置。

推送成功后，在 [GitHub Actions](https://github.com/UNI0NIUS/UNI0NIUS.github.io/actions) 等待对应提交的 **pages build and deployment** 成功，再核对线上页面。`npm run build`、打包和本地 commit 都不代表已经上线。

发布后检查：

- 表站原布局、Lask 三卷本及文章能打开；导航没有两个旧 Blog 栏目。
- 左上角进入里站，里站能返回表站；旧书籍链接跳到对应章节。
- 里站 Writing 搜索、tag、章节、语言切换、注释与全书进度正常；相关图片、公式和页影能加载。
- 若改了播放器、地图或相册，检查相应功能；共享 favicon 内外一致。

## 回退

从 Git 历史找到要撤销的发布提交。在工作区干净、已核对后续依赖时，用 `git revert <提交SHA>` 创建撤销提交，然后推送 `main` 并等待 Pages 成功。不要用 `reset --hard` 加强制推送改写发布历史。若一次发布包含多个提交，按从新到旧的顺序撤销。

回退里站时，`union.html` 与它引用的资源必须匹配。发布仓库的回退不会自动回退本地 `preview-v2` 源码；后续构建前要同步相应源码，否则下一次发布会重新带入已撤销的改动。

## 当前发布记录

- 2026-10-26：`2a52aa12cc7aaff14e59a540816643b21746bb05`，上线里站、迁入 13 本书（466 个章节），表站保留 Lask 三卷本，移除两个 Blog 栏目。
- 2026-10-26：`9434bd85bc23feaa25ea8786d110c981b5ffa3b4`，将作者与 tag 右对齐并缩小条目间距；GitHub Pages 部署成功，已核对线上新 JS/CSS 资源和右对齐样式。
- 本说明是在本地补充，编写说明本身不会触发网站部署。之后每次发布请更新本节。

- 2026-10-26：本次增加《逐出永恒》15个阅读章节、328条原注、46项图像及书目/英文索引原页影像，目录为15本495章；阅读器支持影印页阅读权重、独立共享校注及单次显示双语插图。保留无下载控件设计及表站首页。源稿和本地交付清单见 D:/Data/translate/Sociology/Evicted from eternity/output/final；实际部署与线上验收另记录于本书检查点。

- 2026-10-26：本次发布包新增李凯尔特《认识的对象》（1915第三版）：52阅读分节、184主原注，里站目录16本547章。三版PDF及Markdown/源码包位于translations/books/rickert-gegenstand-der-erkenntnis/；保持里站无下载控件设计。现用preview-v2已同步本书源码与注册项，其他15本记录不变。提交、部署和线上验收以本书工作区检查点及publication_check.json/online_verification.json为准。

- 2026-10-26 用户补充要求：《认识的对象》须同时按原表站标准发布。表站新增独立书目、52节完整阅读、六项下载及字数/双语标签；保留里站版本。本书从migrated-book.js跳转集合移除，其他旧书跳转不变。表站不再仅限Lask三卷：今后保留用户明确指定的并行书目，不运行旧迁移脚本覆盖。此次仅复用已验收文本与文件，不重编PDF。部署和线上验收记录见本书work/review/outer_release。

- 2026-10-26：《逐出永恒》阅读页新增默认关闭的“修订对照”开关（compare=1），中文/双语视图可展开原译、校订片段和已有校对记录；829个中文版整理文本修订单元、37个补译初稿修订单元分列。15章对照数据按需加载，原15章正文JSON、328原注、readingUnits及PDF/MD不变；保持16本547章及其他任务并行书目。21项检查和本地桌面/窄屏验收通过。部署和线上结果见本书comparison_*报告。

- 2026-10-27：表站新增赫尔曼·柯亨《哲学体系第一部：纯粹认识的逻辑》：38个原书结构阅读入口、原注与六项下载；扩充既有中文阅读字体并保留原有字形。仅更新表站，未注册或构建里站。提交、部署及线上验收以本书工作区检查点为准。

- 2026-10-27：表站新增赫尔曼·柯亨《康德的经验理论》（1885重新修订第二版）：47个原作结构阅读入口（25子节）、404条实际原注、含完整论题提要的原目录及六项下载；保留既有全部书目和中文字体旧字形。仅表站新增，未注册或构建里站。语义、覆盖、版面、导出、推送、部署及线上验收分别记录于本书work/review检查点及outer_release/。
