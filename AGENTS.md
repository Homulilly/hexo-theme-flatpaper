# AGENTS.md

本文件为在本仓库中工作的 AI 编码助手提供指引，内容与具体工具无关。

## 这是什么

FlatPaper 是一个 **Hexo 主题**（而非独立应用）。当前目录即为主题本体，它被检出在某个 Hexo 演示站点内部，站点根目录位于上级路径。Hexo 从 `themes/flatpaper/` 加载本主题，并用它渲染演示站点的文章。

主题自身没有 `package.json`、lint 或测试配置——所有工具链都在演示站点根目录。

## 命令

以下命令需在**演示站点根目录**（`../..`）执行，而不是在主题目录：

```bash
pnpm server                                          # hexo server —— 本地预览 http://localhost:4000
pnpm build                                           # hexo generate —— 渲染到 public/
pnpm clean                                           # hexo clean —— 清空 db.json 与 public/
pnpm build -- --config _config.yml,_config.flatpaper.yml   # 叠加主题配置后构建（见下方“配置约定”）
```

常用的编辑—预览循环：`hexo cl && hexo g && hexo s`。Stylus 与 EJS 的改动在 `hexo server` 下会随热重载生效；新增的 `scripts/`（Hexo 扩展）需要重启 server 才能加载。

没有自动化测试套件。改动通过构建后查看渲染结果来验证。

## 架构

Hexo 接入了三种渲染器：**EJS** 模板（`layout/`）、**Stylus** 样式（`source/css/`）、**Marked** Markdown。`scripts/` 目录**不是**构建脚本——其中每个文件都在加载时注册 Hexo 扩展（helper、tag、filter、generator）。

### 渲染流程

- **`layout/layout.ejs`** 是唯一的顶层 HTML 外壳，也是核心的**配置 → DOM 桥梁**：它读取几乎所有 `theme.*` 选项（强调色、代码主题、note 样式、按钮样式、背景样式、胶带开关、首页 hero），并以 `data-*` 属性和 `class` 词元的形式输出到 `<body>`。CSS 与 `main.js` 再依据这些属性工作。新增可配置的视觉变体时，对应开关就在这里读取。
- 各页面布局（`index`、`post`、`archive`、`category`、`tag` 等）渲染进 `layout.ejs` 的 `body` 插槽。**`page.ejs` 是基于 `type:` 的路由**——front-matter 中的 `type: links|tags|categories|friends-feed|404|…` 会分发到对应的 partial（兼容 NexT 风格别名）。
- **侧栏左右对调（重要陷阱）：** 视觉上的**左**栏由 `_partial/sidebar-right.ejs` 渲染（个人资料、TOC、分类、标签、移动端抽屉）；视觉上的**右**栏是 `_partial/sidebar-left.ejs`（欢迎卡片、随机文章）。这样命名是为了让更有用的侧栏在移动端变成汉堡抽屉。文章页/独立页为两栏布局，会去掉 `sidebar-left`。

### Hexo 扩展（`scripts/`）

- **`i18n.js`** —— 注册 `flatpaper_i18n('key.path', ...args)`、`flatpaper_i18n_language()`、`flatpaper_i18n_json()`。读取 `languages/{zh-CN,en}.yml`，将嵌套键扁平化为点号路径。`layout.ejs` 把整张表序列化进 `window.FLATPAPER_I18N`，使 `main.js` 在运行时解析**相同的键**。`zh-CN` 是兜底语言。
- **`tags.js`** —— `{% note %}` 与 `{% tabs %}` 自定义标签，外加 helper `flatpaper_safe_url`（URL 净化）与 `flatpaper_sorted_posts`（按时间倒序的文章缓存，由 `before_generate` filter 失效，使 watch 重建能感知到编辑）。
- **`note-container.js`** —— 一个 `before_post_render` filter，将 VitePress 风格的 `::: type title … :::` 块重写为 `{% note %}` 标签，使二者共用同一套渲染逻辑。它会先遮罩围栏代码/缩进代码，使代码示例中的 `:::` 得以保留。
- **`search-index.js`** —— generator，产出 `/flatpaper-search.json`（搜索打开时由 `main.js` 懒加载；取代了旧的逐页内联索引）。遵循 `theme.search.limit`。
- **`fcl-friend-json.js`** —— generator，从 `source/_data/links.yml` 中配置了 `rss` 的条目产出 `/friend.json`，供 Friend-Circle-Lite 使用。
- **`menu-helpers.js`** —— `flatpaper_menu_helpers()` 返回一组闭包，用于渲染嵌套的 `theme.menu` 条目（桌面端 header 与移动端抽屉共用）。

### 样式与客户端 JS

- **`source/css/style.styl`** 是唯一入口，按顺序 `@import` 各 partial。导入顺序很重要：`_mode/`（代码主题）与 `_layout/responsive` **最后**导入，以便在层叠中胜出。各 partial 是 Stylus 直接透传的纯 CSS，编译为 `/css/style.css`。
- **`source/js/main.js`** 是单一的客户端 bundle，负责暗色模式、强调色选择器、搜索弹窗、TOC scrollspy、特色轮播、移动端抽屉、代码块复制/折叠、tabs、reactions、Fancybox 包裹等。它从 `window.FLATPAPER_I18N` 读取本地化字符串。

## 约定

- **配置同步：** `_config.yml`（中文注释/默认值）与 `_config.en.yml`（英文）必须保持同步——**键结构完全一致**。只有 `_config.yml` 是实际加载的默认配置；`_config.en.yml` 是模板。改一个主题选项就要同时改两个文件。站点通过 `<site>/_config.flatpaper.yml` 覆盖，并用 `--config _config.yml,_config.flatpaper.yml` 叠加。
- **注释约定：** 向 `_config.yml` 新增配置时，注释说明的部分保持简洁。
- **向后兼容：** 任何可能改变现有布局的新特性，在站点配置中默认**关闭/禁用**，使站点能先更新主题、再按需主动开启。
- **配置示例：** 新增功能时，在 `docs/configuration.md` 与 `docs/zh/configuration.md` 中同步增加对应章节，并提供设置示例。
- **i18n：** 新增界面字符串时，要在 `languages/zh-CN.yml` 与 `languages/en.yml` **两个文件**中都加键。模板中用 `flatpaper_i18n` helper，`main.js` 中通过 `window.FLATPAPER_I18N` 取相同的键。代码注释及中文文档/配置示例不做提取。
- 文档位于 `docs/`（英文）与 `docs/zh/`（中文）——两者都要保持更新。`.docs/` 是私有的、被 gitignore 的草稿笔记。

## Git

默认工作分支是 `dev`；PR 目标分支为 `main`。

### Git 分支规范

提交前必须确认当前分支不是 `main` 分支：

```bash
git branch --show-current
```

禁止在 `main` 分支直接创建提交。所有修改、提交和推送都应在 `dev` 或或特定工作分支完成。

如果当前位于 `main` 分支，停止操作并提示用户。

### Commit Messages

所有 Git 提交信息都应使用 Conventional Commits 规范。

格式:  

```bash
git commit -m "<type>(<scope>): <description>"
```

对于较短或简单的改动，可以省略 scope：

```bash
git commit -m "<type>: <description>"
```

当改动较大、涉及较多文件，或需要说明多个细节时，使用第二个 -m 添加提交正文：
```bash
git commit -m "<type>(<scope>): <description>" -m "<body>"
```
