# FlatPaper

FlatPaper 是一个受扁平插画与纸质卡片启发的 Hexo 主题，包含虚线描边、便签、胶带条以及柔和低对比度的阅读界面。主题基于模块化 Stylus partial、小量 EJS 模板层构建，没有运行时依赖。

- **[Demo 站点](https://flatpaper.nep.me/)**
- **[预览：Aroes 的博客](https://homulilly.com/)**

## 文档

多语言文档：

- **English** — [README.md](README.md)

## 实时预览

| 浅色模式 | 深色模式 |
| --- | --- |
| ![home light](preview/home.webp) | ![home dark](preview/home-dark.webp) |

## 安装

```bash
# 在你的 Hexo 站点内
git clone https://github.com/Homulilly/hexo-theme-flatpaper.git themes/flatpaper
# 或者直接复制该文件夹

# 在 <site>/_config.yml 中启用
theme: flatpaper

# 复制并编辑主题配置
cp themes/flatpaper/_config.yml _config.flatpaper.yml

hexo g && hexo s
```

打开 <http://localhost:4000>。

建议在**站点** 的 `_config.yml` 中设置分页：

```yaml
index_generator:
  per_page: 10
  order_by: -date

per_page: 10
```

启用 RSS feed：

```bash
pnpm add hexo-generator-feed
```

```yaml
# 站点 _config.yml
feed:
  enable: true
  type: atom
  path: atom.xml
  limit: 20
  content: true
```

## 配置

所有选项都位于 `themes/flatpaper/_config.yml`。正确做法是在编辑前将它复制为 `<site>/_config.flatpaper.yml`。

> 站点名称（header 中的品牌文字）与 `<meta name="description">` 直接取自 Hexo 站点 `_config.yml` 的 `title` 与 `description`，主题不再重复配置。

```yaml
menu:
  首页:
    link: /
    icon: home
  归档:
    link: /archives/
    icon: archive
  # 友链:
  #   link: /links/
  #   icon: link
  # 二级菜单示例：
  # 站点:
  #   icon: folder
  #   item:
  #     分类:
  #       link: /categories/
  #       icon: folder
  #     标签:
  #       link: /tags/
  #       icon: tag
  #     关于:
  #       link: /about/
  #       icon: user

profile:
  role: 日常记录
  bio: 介绍一下自己 — 一两句话，写写你想被别人记住的部分。
  avatar:                             # 站点 source/ 下的图片路径；留空使用 CSS 绘制的默认头像
  avatar_shape: square                # square 或 circle
  site_info:                          # 为空 / false 隐藏，true 显示无链接，其他非空值渲染为链接
    # posts: /archives/
    # categories: /categories/
    # tags: /tags/
  social:
    # 内置图标键名：github, twitter, x, mail/email, rss, steam, bilibili,
    # youtube, facebook, instagram, telegram, weibo
    # GitHub: https://github.com/yourname
    # X: https://x.com/yourname
    # Email: mailto:you@example.com
    # Mastodon:
    #   url: https://mastodon.social/@yourname
    #   icon: send
    # 知乎:
    #   url: https://www.zhihu.com/people/yourname
    #   svg: '<path d="M2 2 L22 22"/>'
  rss:
    enable: true
    path: /atom.xml

welcome:
  label: 今日份记录
  title: 把日子，慢慢写下来
  text: 生活不是每天都精彩，但总有值得收藏的片段。
  cta_text: 开始阅读
  cta_link: archives/
  # image: /images/welcome.jpg        # 可选 16:9 封面图；留空保留 CSS 山景

excerpt_length: 96
recent_posts: 6                       # 侧边栏随机文章数量
random_posts_pool: 100                # 候选池取生成期最新 N 篇；0 或留空表示不限
related_posts: 4                      # 0 表示禁用相关文章

search:
  limit: 0                            # 0 或留空表示不限

tags:
  style: tape                         # tape | pill

featured:
  # - hello-world
  # - markdown-elements-showcase
featured_autoplay: 5000               # 毫秒；0 表示关闭自动播放
featured_image_zigzag: true

color: green                          # green | pink | blue | orange | sakura

tape:
  enable: true

footer:
  left: '© {year} By {name}'          # 占位符：{year}、{name}、{theme}
  right: 'Powered by Theme {theme}'

note:
  style: flat                         # flat | simple | modern | disabled
  icons: true

code:
  theme: dark                         # dark | sand | light

umami:
  enable: false
  host:                               # 例如：analytics.example.com
  website_id:                         # 例如：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  # domains: example.com,www.example.com

adsense:
  enable: false
  client:                             # 例如：ca-pub-1234567890123456
  account: false
  slots:
    post_top:
    post_bottom:
    sidebar:

comments:                             # twikoo | artalk；留空表示关闭评论

twikoo:
  envId:                              # 例如：https://twikoo.example.com
  # cdn:

artalk:
  server:                             # 例如：https://artalk.example.com
  site:
  # cdn_css:
  # cdn_js:

fancybox:
  enable: true
  # cdn_css:
  # cdn_js:

inject:
  head:
    # - <link rel="stylesheet" href="/css/custom.css" media="defer" onload="this.media='all'">
    # - <script src="/js/extra.js"></script>
  bottom:
    # - <script src="/js/extra.js" defer></script>
```

启用 Umami 后，会在每个页面 `</head>` 之前注入：

```html
<script defer src="https://<host>/script.js" data-website-id="<website_id>" data-domains="..."></script>
```

- `host` 仅接受形如 `analytics.example.com` 或 `localhost:3000` 的纯域名 / 域名+端口；带协议的写法（`https://...`）会被自动清洗，其他特殊字符会被拒绝，脚本不会注入。
- `domains` 是 Umami 自带的**博客域名白名单**：只有当访客打开的页面 `hostname` 在列表里时 tracker 才会上报，用来排除 `localhost`、临时预览域名、或别人 clone 部署到自己域名的情况。字段可省略；可写成逗号分隔的字符串或 YAML 列表。

**评论系统**通过顶层 `comments:` 选择器开启：写入 `twikoo` 或 `artalk` 即启用对应系统（前提是该系统的必填字段也已填写——Twikoo 是 `envId`，Artalk 是 `server`）；留空 / 删除则不渲染评论区。评论会在**文章页**与**独立页面**（about / 友链等 `layout: page`）的正文之后渲染；索引页（首页 / 归档 / 分类 / 标签）始终不渲染评论。两种系统都需要自行部署后端：

- Twikoo：参考 [Twikoo 快速开始](https://twikoo.js.org/quick-start.html)。容器 id 为 `#tcomment`。
- Artalk：参考 [Artalk 部署文档](https://artalk.js.org/guide/deploy.html)。容器 id 为 `#artalk-comments`，初始化通过 `Artalk.init({...})` 调用，`pageKey` 默认使用 `page.permalink`，`pageTitle` 用 `page.title`，`site` 字段需与 Artalk 后台已注册的站点名一致。

### UI 选项与当前默认值

### 精选轮播

- `featured` 接受文章 slug、完整 permalink 路径、最后一段路径或精确标题。匹配不区分大小写。
- `featured_image_zigzag: false` 可关闭 featured 图片左侧折线特效。
- 只在首页分页的**第 1 页**渲染。
- 1 篇文章渲染为单张静态卡片。2–4 篇文章渲染为轮播，包含箭头、圆点指示器、键盘方向键和悬停 / 聚焦暂停的自动轮播。

### 封面图

```yaml
---
title: 周末散步
date: 2026-05-16
cover: /images/walk.jpg               # 或绝对 URL
---
```

解析顺序为：`cover` → `thumbnail` → `image` → `banner` → 渲染正文中的第一张内联 `<img>`，第一个命中项生效。都没有时，回退到 CSS 场景（太阳 + 云 + 山 / 电脑 / 相机）。

图片使用 `object-fit: cover; object-position: 50% 50%`，宽图会保留可见的垂直中心线。

### 相关文章

文章页会在正文下方自动追加一个**独立的"相关文章"卡片**。评分函数：

- 每个相同分类 +3
- 每个相同标签 +2
- 0 分文章会被完全排除；没有相关文章时，该卡片不会渲染
- 分数相同时，较新的文章优先

设置 `related_posts`（或回退到 `recent_posts`）可控制展示卡片数量。将 `related_posts` 显式设为 `0` 可完全禁用该模块（整块卡片不渲染）。

### 搜索

点击 header 中的放大镜按钮，或在任意位置按 **Ctrl + K / Cmd + K**。按 **Esc** 关闭。默认基于全部文章的内联 JSON 索引进行过滤；可通过 `search.limit` 限制为最新 N 篇。关键词会用 `<mark>` 高亮。

### 深色模式

Header 中的圆形切换按钮会将状态存储到 `localStorage['flatpaper-mode']`。切换按钮会在绘制前读取已存储状态，以避免 FOUC 闪烁。

### 主题色

在主题配置里设置 `color: green`、`pink`、`sakura`、`blue` 或 `orange` 可指定默认主题色。Header 中的调色盘按钮会打开颜色菜单，并将选择写入 `flatpaper-accent` cookie。

### 代码块主题

`code.theme` 接受 `dark`、`sand` 或 `light`。`sand` 是奶油 / 浅色代码主题；`light` 是白色代码主题。该值会写入 `<body data-code-theme="...">`，一个 CSS scope 会覆盖所有代码块。

单个代码块 UI：

- macOS 风格标题栏，包含三个彩色圆点
- 左侧语言徽标，会从 highlight.js class 自动检测（例如 `figure.highlight.js → JavaScript`）。`plain / plaintext / text / txt / none / raw` 会解析为空并隐藏徽标。
- 支持复制
- 支持折叠（chevron，旋转 180°）

**行号交互**：

- **单击行号**：高亮对应行（行号 + 代码行同时加上淡黄色背景），可独立点击多行，再次单击同一行号取消高亮。
- **双击行号**：把对应代码行的文本写入剪贴板，行号闪绿色 ~500ms 表示已复制。
- 整行行号都是热区，不需要精确点中数字。

### 头像与欢迎卡

- `profile.avatar`：站点 `source/` 下的图片路径（如 `/images/avatar.png`），或绝对 URL；留空则使用 CSS 绘制的默认头像。
- `profile.avatar_shape`：`square`（默认）按 10px 微圆角的方形呈现；`circle` 应用圆形遮罩。
- `profile.site_info`：Profile 卡片里的站点统计。空值和 `false` 会隐藏某一项，`true` 只显示文本，其他非空值会作为该项链接渲染。
- `profile.social`：Profile 卡片里的社交链接；键名会自动匹配内置图标，对象写法可覆盖图标或提供内联 SVG。
- `profile.rss`：`enable: true` 时在 Profile 社交链接行追加 RSS 图标。
- `welcome.image`：欢迎卡封面图；填值后容器变成 16:9 自适应比例并贴卡片内边沿（`overflow: hidden` + 顶部 12px 圆角）。留空则保留默认 CSS 山景动画。

### Note 提示块外观

`note.style` 支持四种风格，与 NexT 主题的对应外观一致：

- **`flat`**（默认）：左侧实色条 + 淡背景填充，圆角卡片。
- **`simple`**：左侧实色条 + 1px 细边框，无背景填充。
- **`modern`**：完全填充的圆角盒，无左侧条，搭配 1px inset 边框。
- **`disabled`**：去掉所有装饰但保留 `<details>` 折叠语义，正文用站点正文样式。

`note.icons: true | false` 控制是否在内容/标题前显示圆形图标徽章；关闭后正文会回收图标列，左对齐贴齐 padding。

### 自定义注入

`inject.head` / `inject.bottom` 是字符串数组，每个条目原样输出到 `</head>` 或 `</body>` 之前。可以注入：

- 自定义 CSS：`- <link rel="stylesheet" href="/css/custom.css">`
- 自定义 JS：`- <script src="/js/extra.js" defer></script>`
- 内联 `<style>` / `<script>` 块、第三方 SDK 等任意 HTML 片段。

注入内容**不会被转义**，等于把你的配置直接拼进页面，所以只能放可信内容。

## 亮点

- **自适应布局**：首页 / 列表页为三栏，文章页为两栏，窄屏下切换为单栏抽屉模式。
- **TOC 粘性**：文章页 TOC 卡片会在整篇文章范围内保持粘性；首页 / 列表页侧栏跟随页面正常滚动。
- **精选轮播**：可在 `_config.yml` 中置顶最多四篇文章，自动轮播并支持悬停暂停。
- **封面图**：读取 `cover` / `thumbnail` / `image` / `banner` / 第一张正文内联 `<img>`；没有图片时回退到 CSS 场景。
- **个人资料 / 欢迎卡可个性化**：`profile.avatar_shape` 支持 `square` / `circle` 头像遮罩；`welcome.image` 可换上自定义 16:9 封面图替代默认 CSS 山景。
- **macOS 风格代码块**：语言徽标、复制 / 折叠按钮，支持 `dark` / `sand` / `light` 主题。单击行号高亮该行，双击复制该行内容。
- **兼容 Hexo NexT 标签**：`{% note %}`（6 种颜色 × 4 种外观风格 `flat / simple / modern / disabled`，可折叠）和 `{% tabs %}`（支持折叠模式）；同时支持 VitePress 风格的 `::: type [title] ... :::` 容器语法。
- **通过 `type:` 路由页面**：在 front-matter 中设置 `type: link | tags | categories` 即可路由到自定义布局。
- **友链页**：`/links/` 支持分组卡片、头像回退、单链接 RSS 徽标，以及悬停时的信号脉冲动画。
- **页内搜索**：全局 Ctrl+K / Cmd+K 弹窗，基于所有文章的内联 JSON 索引。
- **可选评论系统**：顶层 `comments: twikoo | artalk` 切换 Twikoo 或 Artalk；单页可在 front-matter 写 `comments: false` 关闭。
- **深色模式**：单 class 切换，状态持久化到 `localStorage`；每个组件都有深色变体。

## 自定义标签

### `{% note %}`

```
{% note success %}
  一个 Success 提示
{% endnote %}

{% note warning 注意事项 %}
  提供标题时，note 会渲染为可折叠的 <details>。
{% endnote %}
```

支持类型：`default · primary · success · info · warning · danger`。添加标题会将 note 变成可折叠 disclosure（原生 `<details>`，无需 JS）。

也可以使用 VitePress 风格的容器语法，与上面的标签**完全等价**：

```
::: success
一个 Success 提示
:::

::: warning 注意事项
提供标题时，note 会渲染为可折叠的 <details>。
:::
```

`:::` 改写发生在 `before_post_render`，代码块内的 `:::`（fenced ``` / ~~~ / 4 空格缩进）会被完整保留、不会误触发。两种语法可以在同一篇文章里混用。

### `{% tabs %}`

```
{% tabs 标签, 1 %}
<!-- tab -->
**选项卡 1**
<!-- endtab -->
<!-- tab 自定义名 -->
内容…
<!-- endtab -->
{% endtabs %}
```

- 第一个参数：当单个 tab 没有提供名称时使用的基础名称（`标签 1`、`标签 2`、…）。
- 第二个参数：从 1 开始的默认 tab 索引。使用 **`-1`** 进入折叠模式：所有 tab 初始关闭，点击展开，再次点击折叠。

## 特殊页面

Front-matter `type:` 会将 `source/<dir>/index.md` 路由到自定义布局（原始 `layout:` 仍可作为 fallback 使用）：

```yaml
---
title: 友情链接
type: links            # 或：tags、categories
---
```

识别值：`links` · `tags` · `categories`。其他值 / 缺失值 → 默认页面布局。

### 友链页（`type: links`）

数据位于 `source/_data/links.yml`。支持多个分组：

```yaml
- class_name: DEMO
  class_desc: 常见开发与文档网站链接示例，用于测试友链卡片展示效果。
  flink_style: demo
  link_list:
    - name: GitHub
      link: https://github.com/
      avatar: https://github.githubassets.com/favicons/favicon.svg
      descr: 面向开发者的代码托管与协作平台。
      rss:  # 可选，会在卡片上显示 RSS 徽标
```

卡片包含：头像（缺失时回退到首字母）+ 名称 + 描述。RSS 徽标会始终可见，并在 hover 时播放 "signal-pulse" 动画（图标晃动 + 圆环向外扩散）。Front-matter 下方的 markdown 正文会正常渲染，并用虚线分隔。

## 布局

| 布局           | 文件                           | 用途                                             |
| -------------- | ------------------------------ | ------------------------------------------------ |
| Home           | `layout/index.ejs`             | 精选轮播 + 分页文章网格                          |
| Post           | `layout/post.ejs`              | 两栏文章 + reactions + 上一篇 / 下一篇 + 相关文章卡片 |
| Page           | `layout/page.ejs`              | 默认页面；按 `type:` 路由到自定义布局            |
| Friends        | `layout/link.ejs`              | 友链网格 + 可选 markdown 正文                    |
| Archive        | `layout/archive.ejs`           | 按日期分组的文章列表 + 分页                      |
| Category index | `layout/categories.ejs`        | 类似标签云的紧凑网格                             |
| Category       | `layout/category.ejs`          | 单个分类下的文章 + 分页                          |
| Tag index      | `layout/tags.ejs`              | 标签云                                           |
| Tag            | `layout/tag.ejs`               | 单个标签下的文章 + 分页                          |

`layout/_partial/` 中的共享 partial：

- `head.ejs`：meta + stylesheet
- `header.ejs`：品牌 · 导航 · 搜索 · 主题切换 · 抽屉切换（仅窄屏）
- `footer.ejs`：支持 `{year}` / `{name}` / `{theme}` 模板 token 的可配置页脚；`{theme}` 渲染为指向主题仓库的署名链接
- `sidebar-left.ejs` / `sidebar-right.ejs`：见下面的侧栏布局说明
- `random-posts.ejs`：可复用的随机文章卡片，候选池大小可配置
- `post-card.ejs`：首页 / 网格卡片，带边缘出血缩略图
- `archive-list.ejs`：分页归档 / 分类 / 标签列表
- `thumbnail.ejs`：真实封面图与 CSS 场景回退
- `search.ejs`：弹窗 dialog + 内联 JSON 索引
- `icons.ejs`：Lucide 图标查找

### 侧栏布局说明

在 DOM 中，视觉上的**左**列由 `sidebar-right.ejs` 渲染（profile、文章页 TOC、首页分类 / 标签），视觉上的**右**列来自 `sidebar-left.ejs`（首页欢迎卡片、随机文章）。这个顺序是为了让窄屏下更有用的"左"面板成为汉堡按钮控制的抽屉。

文章页会完全跳过 `sidebar-left`，只保留一个侧栏。

## 开发

```
themes/flatpaper/
├── _config.yml
├── layout/
│   ├── _partial/                    # head、header、footer、sidebars、search、icons 等
│   └── *.ejs                        # 每个顶层布局一个文件
├── scripts/
│   ├── tags.js                      # Hexo extension：{% note %} + {% tabs %}
│   ├── note-container.js            # before_post_render：::: 容器 → {% note %}
│   └── _note-types.js               # note 类型白名单（tags.js / note-container.js 共用）
└── source/
    ├── css/
    │   ├── style.styl               # 主入口：按 @import 顺序组织 partial
    │   └── _partials/
    │       ├── var.styl             # CSS 自定义属性（tokens）
    │       ├── base.styl            # reset、html / body、page-grain
    │       ├── _layout/             # header、shell、tape、footer、responsive
    │       ├── _global/             # section-head、thumbnail、pager
    │       ├── _components/         # welcome、toc、featured、post-card 等
    │       ├── _page/               # article、archive-taxonomy
    │       └── _mode/               # code-dark、code-sand、code-light
    └── js/main.js                   # 单 bundle：主题切换、搜索、锚点、
                                     #   TOC scrollspy（含 bottom-lock）、轮播、
                                     #   侧栏抽屉、代码块 UI、tabs
```

## 许可证

MIT
