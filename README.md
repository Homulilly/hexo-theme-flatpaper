# FlatPaper

FlatPaper 是一个受扁平插画与纸质卡片启发的 Hexo 主题，包含虚线描边、便签、胶带条以及柔和低对比度的阅读界面。主题基于模块化 Stylus partial、小量 EJS 模板层构建，没有运行时依赖。

**[Demo 站点](https://flatpaper.nep.me/)** · **[预览：Aroes's blog](https://homulilly.com/)**

![preview](preview/home.webp)

## 亮点

- **自适应布局**：首页 / 列表页为三栏，文章页为两栏，窄屏下切换为单栏抽屉模式。
- **粘性侧栏**：首页 / 列表页侧栏会吸附在视口内；文章页 TOC 会在整篇文章范围内保持粘性。
- **精选轮播**：可在 `_config.yml` 中置顶最多四篇文章，自动轮播并支持悬停暂停。
- **封面图**：读取 `post.cover` / `thumbnail` / `image` / `banner` / 第一张正文内联 `<img>`；没有图片时回退到 CSS 场景。
- **macOS 风格代码块**：语言徽标（自动检测，纯文本隐藏）、复制和折叠按钮；支持 `dark` / `sand` / `light` 代码主题。
- **兼容 Hexo NexT 标签**：`{% note %}`（6 种样式，可折叠）和 `{% tabs %}`（支持折叠模式）；note 同时支持 VitePress 风格的 `::: type [title] ... :::` 容器语法。
- **通过 `type:` 路由页面**：在 front-matter 中设置 `type: link | tags | categories` 即可路由到自定义布局（更常见的 `layout:` 字段仍然可用）。
- **友链页**：`/links/` 支持分组卡片、头像回退、单链接 RSS 徽标，以及悬停时的信号脉冲动画。
- **页内搜索**：全局 Ctrl+K / Cmd+K 弹窗，基于所有文章的内联 JSON 索引（大型站点可通过 `_config.yml` 中的 `search.limit` 限制数量）。
- **可选 Twikoo 评论**：在 `_config.yml` 启用并填入你自行部署的后端 URL；任意页面可用 front-matter `comments: false` 关闭。
- **可选图片灯箱**：开启后，文章页与独立页面 `.article-content` 内的图片自动接入 Fancybox 灯箱，支持点击放大、左右键 / 滑动切换、ESC 关闭；同页所有图共属一个 gallery。
- **深色模式**：单 class 切换，状态持久化到 `localStorage`；每个组件都有深色变体。
- **可配置页脚**：可用 `{year}` / `{name}`（取站点 `author`）/ `{theme}`（渲染为指向主题仓库的署名链接）占位符编写自定义文案；署名可自由保留或删除。
- **通过 Lucide 提供图标**：图标以内联 SVG 嵌入（无网络、无字体），主题内所有图标都由同一个 EJS partial 驱动。

## 快速开始

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

如果希望启用 RSS feed:
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

## 主题配置

所有选项都位于 `themes/flatpaper/_config.yml`。
正确做法是在编辑前将它复制为 `<site>/_config.flatpaper.yml`。

> 站点名称（header 中的品牌文字）与 `<meta name="description">` 直接取自 Hexo 站点 `_config.yml` 的 `title` 与 `description`，主题不再重复配置。

```yaml
menu:                                 # 主导航；仍支持字符串路径写法
  首页:
    path: /
    icon: home
  归档:
    path: /archives/
    icon: archive
  友链:
    path: /links/
    icon: link
  分类:
    path: /categories/
    icon: folder
  标签:
    path: /tags/
    icon: tag
  关于:
    path: /about/
    icon: user

profile:                              # 渲染在左侧栏；作者名直接取站点 _config.yml 的 author
  role: 日常记录
  bio: 喜欢散步、煮咖啡、看一点书...

social:                               # label -> URL；图标按 label 解析
  GitHub: https://github.com/me
  Twitter: https://twitter.com/me
  Email: mailto:hi@example.com

rss:                                  # 追加到社交链接行的 RSS 图标
  enable: true
  path: atom.xml

welcome:                              # 欢迎卡片（首页左侧栏）
  label: 今日份记录
  title: 把日子，慢慢写下来
  text: 在这里随手收集那些不值得发朋友圈的小事。
  cta_text: 开始阅读                  # 卡片底部按钮文字
  cta_link: archives/                 # 卡片底部按钮链接（经 url_for 处理）

excerpt_length: 96
recent_posts: 5                       # 也用作文章页相关文章数量上限
related_posts: 4                      # 如果需要，可只覆盖“相关文章”数量；0 表示禁用整块

tags:
  style: tape                         # "tape" 或 "pill"

featured:                             # 首页最多 4 篇置顶文章
  - hello-world                       # slug / 完整路径 / 最后一段路径 / 标题
  - flatpaper-design-notes
featured_autoplay: 5000               # 毫秒；0 表示禁用

tape:
  enable: true                        # false 会隐藏所有胶带装饰

footer:                               # 允许 HTML；占位符：{year} / {name} / {theme}
  left: '© {year} {name}'             # {name} 取站点 _config.yml 的 author
  right: 'Powered by Theme {theme}'   # {theme} 渲染为指向主题仓库的署名链接

code:
  theme: sand                         # "dark"、"sand" 或 "light"

umami:                                # Umami 网站统计；关闭时不注入任何脚本
  enable: false
  host: analytics.example.com         # Umami 服务的域名（不含协议、不含路径）
  website_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  domains: example.com,www.example.com # 可选；仅在这些域名下上报

twikoo:                               # 可选评论系统；关闭时文章页不渲染评论区
  enable: false
  envId: https://twikoo.example.com   # Twikoo 后端 URL
  # cdn: https://cdn.example.com/twikoo.all.min.js  # 可选；覆盖默认 jsDelivr CDN

fancybox:                             # 图片灯箱；仅文章页与 layout: page 的页面加载
  enable: false
  # cdn_css: https://cdn.example.com/fancybox.css  # 可选；覆盖默认 jsDelivr CSS
  # cdn_js:  https://cdn.example.com/fancybox.umd.js # 可选；覆盖默认 jsDelivr JS
```

启用 Umami 后，会在每个页面 `</head>` 之前注入：

```html
<script defer src="https://<host>/script.js" data-website-id="<website_id>" data-domains="..."></script>
```

- `host` 仅接受形如 `analytics.example.com` 或 `localhost:3000` 的纯域名 / 域名+端口；带协议的写法（`https://...`）会被自动清洗，其他特殊字符会被拒绝，脚本不会注入。
- `domains` 是 Umami 自带的**博客域名白名单**：只有当访客打开的页面 `hostname` 在列表里时 tracker 才会上报，用来排除 `localhost`、临时预览域名、或别人 clone 部署到自己域名的情况。字段可省略；可写成逗号分隔的字符串或 YAML 列表。

启用 Twikoo 后，评论区会在**文章页**和**独立页面**（about / 友链等 `layout: page`）的正文之后渲染（文章页位于"相关文章"卡片下方）；首页、归档、分类、标签等索引页不渲染评论。需要自行部署 Twikoo 后端，参考 [Twikoo 快速开始](https://twikoo.js.org/quick-start.html)。任意页面都可以在 front-matter 写 `comments: false` 单独关闭。文章页 reactions 行的"评论"图标按钮会平滑滚动到 `#tcomment`，分享按钮调用 `navigator.share`（不支持时复制 URL 到剪贴板）。

> 站点访问统计请使用上面已介绍的 Umami 后台 —— Twikoo 没有提供官方的 pageview API，不在主题里维护文章访问计数。

启用 Fancybox 后，`.article-content` 内所有 `<img>` 会在浏览器里自动用 `<a data-fancybox="gallery">` 包裹，因此**同页全部图片自动归入同一个 gallery**，灯箱内可用左右键 / 滑动手势翻图、ESC 关闭、双击 / 滚轮缩放。已经被作者主动包成 `<a>` 链接（如 `[![](img)](url)`）的图片不会被二次包裹；某张图想完全跳过灯箱可以加 `class="no-zoom"`。CDN 加载仅在文章页与 `layout: page` 的页面发生，列表页（首页 / 归档 / 标签 / 分类）不引入。

### UI 选项与当前默认值

- `menu` 格式，图标通过 `layout/_partial/icons.ejs` 解析。
```yml
# 写法一
# 这里 首页 是显示文字，/ 是链接路径。  
  menu:
    首页: /
    归档: /archives/
    关于: /about/
 
# 写法二
  menu:
    - path: /
      label: 首页
      icon: home

    - path: /archives/
      name: 归档
      icon: archive
```

- 滚动时可能移动的内部分隔线尽量使用原生 `1px dashed` 边框；外层纸张 / 卡片描边保持 `2px dashed`。
- `tags.style` 全局控制标签 chip：`tape` 使用轻微旋转的小胶带条，`pill` 使用圆角胶囊外观。
- 首页和文章交互元素统一使用 Lucide 图标：最新文章、相关文章、顶部导航链接以及“查看更多”箭头都通过共享图标 partial 渲染。
- `code.theme` 支持 `dark`、`sand` 和 `light`。`sand` 是暖色奶油代码主题；`light` 是白色代码主题。

### 精选轮播

- `featured` 接受文章 slug、完整 permalink 路径、最后一段路径或精确标题。匹配不区分大小写。
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

文章页会在正文下方自动追加一个**独立的“相关文章”卡片**。评分函数：

- 每个相同分类 +3
- 每个相同标签 +2
- 0 分文章会被完全排除；没有相关文章时，该卡片不会渲染
- 分数相同时，较新的文章优先

设置 `related_posts`（或回退到 `recent_posts`）可控制展示卡片数量。将 `related_posts` 显式设为 `0` 可完全禁用该模块（整块卡片不渲染）。

### 搜索

点击 header 中的放大镜按钮，或在任意位置按 **Ctrl + K / Cmd + K**。按 **Esc** 关闭。结果会基于最近 120 篇文章的内联 JSON 索引（标题 + 200 字符摘要）进行过滤。关键词会用 `<mark>` 高亮。

### 深色模式

Header 中的圆形切换按钮会将状态存储到 `localStorage['flatpaper-mode']`。切换按钮会在绘制前读取已存储状态，以避免 FOUC 闪烁。

### 代码块主题

`code.theme` 接受 `dark`、`sand` 或 `light`。`sand` 是奶油 / 浅色代码主题；`light` 是白色代码主题。该值会写入 `<body data-code-theme="...">`，一个 CSS scope 会覆盖所有代码块。

单个代码块 UI：

- macOS 风格标题栏，包含三个彩色圆点
- 左侧语言徽标，会从 highlight.js class 自动检测（例如 `figure.highlight.js → JavaScript`）。`plain / plaintext / text / txt / none / raw` 会解析为空并隐藏徽标。
- 支持复制
- 支持折叠（chevron，旋转 180°）

## 自定义标签（兼容 Hexo NexT）

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

卡片包含：头像（缺失时回退到首字母）+ 名称 + 描述。RSS 徽标会始终可见，并在 hover 时播放 “signal-pulse” 动画（图标晃动 + 圆环向外扩散）。Front-matter 下方的 markdown 正文会正常渲染，并用虚线分隔。

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
- `recent-posts.ejs`：可复用的“最近文章”卡片
- `post-card.ejs`：首页 / 网格卡片，带边缘出血缩略图
- `archive-list.ejs`：分页归档 / 分类 / 标签列表
- `thumbnail.ejs`：真实封面图与 CSS 场景回退
- `search.ejs`：弹窗 dialog + 内联 JSON 索引
- `icons.ejs`：Lucide 图标查找

### 侧栏布局说明

在 DOM 中，视觉上的**左**列由 `sidebar-right.ejs` 渲染（profile、文章页 TOC、首页分类 / 标签），视觉上的**右**列来自 `sidebar-left.ejs`（首页欢迎卡片、最近文章）。这个顺序是为了让窄屏下更有用的“左”面板成为汉堡按钮控制的抽屉。

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
