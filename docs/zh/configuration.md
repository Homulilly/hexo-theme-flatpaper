# 配置说明

所有主题选项都位于 `themes/flatpaper/_config.yml`。建议先复制为站点根目录下的 `_config.flatpaper.yml` 再修改。

功能新增与行为调整都会以不影响现有配置为核心原则；可能影响现有布局的选项会在站点配置中默认保持关闭，大部分情况下可以直接更新主题，再按需启用新功能。

Header 中的站点标题与页面 description 读取自 Hexo 站点 `_config.yml` 的 `title` 与 `description`。

## 语言

FlatPaper 会本地化主题内置的界面文案（导航标签、搜索状态、分页、ARIA 文案等）。语言根据 Hexo 站点 `_config.yml` 中的 `language` 字段选择：

```yaml
language: zh-CN
# 或者按优先级排列的列表
language:
  - zh-CN
  - en
```

- 支持的语言：`zh-CN` 与 `en`。
- 字符串直接匹配；列表按顺序匹配，命中的第一个受支持语言生效。
- `language` 为空、缺失或未受支持时，回退到 `zh-CN`。

只有主题自身的界面文案会被翻译，文章内容、站点数据和你自己的配置值保持原样。

主题附带两份示例配置：`_config.yml`（中文注释与默认值）和 `_config.en.yml`（键结构相同，注释与默认值为英文）。两者键结构完全一致，按站点语言选用其中一份作为 `_config.flatpaper.yml` 的基础即可。

## 字体

```yaml
google_fonts:
  enable: true
  cdn: https://fonts.googleapis.com
  # text_font: Noto Sans JP:wght@400;700
  # text: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
  fonts:
    - Noto Sans SC
  mono:
    - JetBrains Mono
```

- `google_fonts.enable` 控制是否注入 Google Fonts 样式表。
- `fonts` 按顺序填写字体名称即可。FlatPaper 会从 Google Fonts 加载这些字体，并按相同顺序优先用于正文。
- `mono` 按顺序填写等宽字体名称，用于代码块。也可以只配置 `mono`，不改变正文字体。
- 有特殊字重需求时，可以使用 Google Fonts 语法，例如 `Noto Sans SC:wght@400;700`。FlatPaper 会用完整值请求 Google Fonts，并在本地 CSS 字体栈中自动只保留 `:` 前的字体名。
- `text_font` 与 `text` 是配套的可选项。FlatPaper 会用 Google Fonts `text=` 请求 `text_font`，再把它排在 `fonts` 前面。
- `fonts` 与 `mono` 会单独请求完整字体，不受 `text` 限制，避免正文和代码字符缺失。
- `cdn` 会替代默认的 `https://fonts.googleapis.com` 样式表域名。可以填写完整 URL 或纯域名，例如 `https://fonts.loli.net` 或 `fonts.example.com`。
- 字体加载固定使用 `display=swap`。

当 `text` 包含引号或其它标点时，推荐使用 YAML literal block：

```yaml
google_fonts:
  text_font: Noto Sans JP:wght@400;700
  text: |-
    ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
```

## 背景特效

```yaml
background:
  style: default
```

- `background.style` 默认为 `default`，保留主题原有的淡纸纹背景。
- 可选值：`default`、`grid`、`line`、`cross`、`dotted`。
- 选择 `grid`、`line`、`cross` 或 `dotted` 时会切换为新的轻量 CSS 纹理；固定背景效果仅在桌面指针设备上启用，移动端会自动使用普通滚动背景。

## 导航菜单

```yaml
menu:
  首页:
    link: /
    icon: home
  归档:
    link: /archives/
    icon: archive
  站点:
    icon: folder
    item:
      分类:
        link: /categories/
        icon: folder
      标签:
        link: /tags/
        icon: tag
```

`icon` 会通过内置图标 registry 解析。未加前缀的名称优先匹配 Lucide，因此 `icon: archive` 这类旧写法继续可用。需要 Font Awesome Free 6 时加前缀：

```yaml
menu:
  GitHub:
    link: https://github.com/
    icon: fa-brands:github
  删除:
    link: /trash/
    icon: fa-solid:trash-can
```

FlatPaper 会在主题内置 Lucide 与 Font Awesome Free 6 图标定义，生成时只输出模板与配置实际用到的 symbol，不加载外部图标 CDN。

Font Awesome Free 6 图标来自 Fonticons, Inc.，SVG 图标使用 CC BY 4.0；Lucide 图标使用 ISC License。版权说明见 `source/_data/icons/NOTICE.md`。

## Brand Links

`nav` 控制 brandmark 链接组。桌面端从 brandmark 菜单打开；移动端显示在侧栏作者卡片下方。

```yaml
nav:
  enable: true
  menu:
    - title: Live DEMO
      item:
        - name: FlatPaperDemo
          link: https://flatpaper.nep.me/
          icon: leaf
        - name: Homulilly
          link: https://homulilly.com/
          icon: https://homulilly.com/images/avatar.jpg
```

## 作者卡片

```yaml
profile:
  role: 日常记录
  bio: 介绍一下自己。
  avatar:
  avatar_shape: square
  site_info:
    posts: /archives/
    categories: /categories/
    tags: /tags/
  social:
    GitHub: https://github.com/yourname
    Email: mailto:you@example.com
  rss:
    enable: true
    path: /atom.xml
```

- `avatar` 可填站点 `source/` 下的路径或绝对 URL，留空使用 CSS 默认头像。
- `avatar_shape` 支持 `square` 或 `circle`。
- `site_info` 中空值 / `false` 隐藏，`true` 显示纯文本，其他非空值渲染为链接。
- `social` 键名会自动匹配内置图标：`github`、`twitter`、`x`、`mail/email`、`rss`、`steam`、`bilibili`、`youtube`、`facebook`、`instagram`、`telegram`、`weibo`。
- 对象写法可以使用任意 registry 名称，例如 `icon: send`、`icon: fa-brands:mastodon` 或 `icon: fa-solid:globe`。

对象写法可覆盖图标或提供内联 SVG：

```yaml
social:
  Mastodon:
    url: https://mastodon.social/@yourname
    icon: send
  知乎:
    url: https://www.zhihu.com/people/yourname
    svg: '<path d="M2 2 L22 22"/>'
```

> 注意：`svg` 字段会以**原始标记**注入页面（绘制图标必须如此），请只粘贴你信任的路径数据。

## 欢迎卡片

```yaml
welcome:
  label: 今日份记录
  title: 把日子，慢慢写下来
  text: 生活不是每天都精彩，但总有值得收藏的片段。
  cta_text: 开始阅读
  cta_link: archives/
  image: /images/welcome.jpg
```

`welcome.image` 会把欢迎插画替换为 16:9 封面图；留空则使用 CSS 山景。

## 首页开屏

```yaml
home_hero:
  enable: true
  title: 我的手账
  subtitle: 今日份记录
  bio: 写给路过此处的你。
  avatar: /images/avatar.jpg
  avatar_shape: circle
  image:
    - /images/hero-1.jpg
    - /images/hero-2.jpg
  image_overlay: [0.2, 0.2]
  cta_text: 开始阅读
  cta_link: "#flatpaper-home-content"
  cta_background: 01
  hero_links:
    - name: 归档
      link: /archives/
    - name: 分类
      link: /categories/
    - name: Folio
      link: https://folio.example.com/
      alt: 查看 Folio
  stickers:
    enable: true
    draggable: true
    note_text: 今日份
    items:
      - image: /images/stickers/memo.png
        alt: 手账贴纸
        size: 96
      - image: /images/stickers/github.png
        alt: GitHub
        link: https://github.com/yourname
```

- 默认 `enable: false`，不会影响已有首页；只在首页分页第 1 页渲染。
- 未配置 `title`、`subtitle`、`bio`、`avatar` 或社交链接时，会复用站点标题与 `profile` 配置。
- `image` 留空时使用内置手账纸张背景；设置为字符串时固定使用该图片，设置为数组时浏览器每次载入会随机使用一张，图片会在宽屏铺满开屏；窄屏会回退到纸张背景，让贴纸保持清晰。
- `image_overlay` 控制图片开屏的可配置暗色遮罩，使用 `[顶部, 底部]` 两个 `0` 到 `1` 的透明度数值；默认是 `[0.2, 0.2]`。
- `hero_links` 可在开屏简介和社交链接之间添加快速导航链接；配置后会替代默认的波浪线分隔符。每一项需要 `name` 和 `link`，`alt` 可选，用于标签和外链访问确认文案。外链会先弹出访问确认，再在新标签页打开。
- 开屏中的社交链接复用 profile 的 `.socials` 样式，也会跟随 `buttons.style` 的配置变化。
- `stickers.draggable` 为 `true` 时，开屏里的贴纸可以在当前页面内随机摆放并拖动，位置不会写入本地存储。
- `stickers.note_text` 可修改内置便签贴纸的文字。
- `stickers.items` 可添加图片贴纸；自定义贴纸最多渲染 5 张，加上内置便签后开屏最多 6 个 sticker。`image` 必填，`link` 可选，`size` 可选并限制在 48 到 180 像素。带 `link` 的贴纸会先弹出访问确认气泡，文案使用 `alt`，例如“要访问 GitHub 吗？”。
- 底部贴纸按钮会滚入首页内容；`cta_text` 可修改可见文字，`cta_link` 可改成其它锚点，并会避开顶部导航遮挡。`cta_background` 默认使用中性的内置 `01`，也可设置为 `01`-`09`、`random`，或 `/images/my-cta.webp` 这样的自定义图片路径。

## 文章相关

```yaml
excerpt_length: 96
random_posts: 5
random_posts_pool: 100
latest_posts:
  enable: false
  limit: 5
related_posts: 4
post_top_img:
  mode:
article:
  strong_accent: true
```

- `excerpt_length`：没有 `<!-- more -->` 时的摘要截断长度。
- `random_posts`：侧栏随机文章数量，`0` 禁用。
- `random_posts_pool`：从最新 N 篇文章中抽取候选，`0` 或留空表示不限。
- `latest_posts`：文章页侧栏 TOC 下方的最新文章组件，默认关闭；`limit` 默认 `5`。
- `related_posts`：相关文章数量，`0` 禁用整块。
- `post_top_img.mode`：控制文章顶部图；留空禁用。
- `mode: top_img`：只在文章 front-matter 提供 `top_img` 时渲染。
- `mode: fallback`：优先使用文章 front-matter 的 `top_img`，缺省时回退到 `cover`、`thumbnail`、`image`、`banner` 或正文第一张图。
- 当 mode 为 `top_img` 或 `fallback` 时，单篇文章可用 `top_img: false` 关闭顶部图。
- `article.strong_accent`：文章正文中的加粗文本使用主题色；设为 `false` 时只保留默认加粗。

相关文章评分：

- 相同分类 `+3`
- 相同标签 `+2`
- 0 分文章排除
- 分数相同时较新文章优先

## 页面顶部图

独立页面和特殊 `type:` 页面只通过页面 front-matter 主动开启：

```yaml
---
title: 友情链接
type: links
top_img: /images/pages/links.jpg
---
```

没有主题级页面顶部图配置。页面未填写 `top_img` 时不会渲染顶部图，且页面顶部图不会回退到 `cover`、`thumbnail`、`image`、`banner` 或正文图片。

## Reaction 按钮

常用于赞赏 / 打赏二维码，鼠标 hover 或点击按钮时展示图片弹层。

```yaml
reactions:
  custom:
    - type: image
      name: 微信
      icon: wechat
      align: right
      image: /images/reward-wechat.jpg
      title: 微信赞赏
```

字段：

- `type`：目前支持 `image`
- `name`：按钮文字
- `icon`：内置图标名，如 `gift`、`wechat`、`alipay`、`paypal`、`heart`
- `align`：`left` 或 `right`
- `image`：站内路径或绝对 URL
- `title`：可选弹层标题

## 搜索

```yaml
search:
  limit: 0
```

`0` 或留空表示索引全部文章；填数字表示只索引最新 N 篇。用户可点击 Header 搜索按钮，或按 `Ctrl+K` / `Cmd+K` 打开搜索。

索引在构建时生成为站点根目录下的独立文件 `flatpaper-search.json`，首次打开搜索面板时才按需加载，不再内联进每个页面。

## Friend-Circle-Lite

```yaml
fcl:
  friend_json:
    enable: true
    path: friend.json
```

- `enable`：是否生成 Friend-Circle-Lite 兼容的友链 JSON，默认开启。
- `path`：输出路径，默认生成在站点根目录 `/friend.json`。

生成器会读取 `source/_data/links.yml` 中每个 `link_list` 的 `rss`、`name`、`link`、`avatar`。只有 `rss` 非空的友链会被去重输出为 Friend-Circle-Lite 的 `friends` 数组；`rss` 字段本身不会写入数组。可选的 `linkpage` / `link_page` / `linkPage` 会作为友链页地址输出。

内置朋友圈页面的数据源在页面 front-matter 中设置，创建页面文件 `fcircle/index.md` 填入下面的内容设置 `fcl_all_json` 链接：
```yaml
---
title: 朋友圈
type: friends-feed
comments: false
# 你的友链朋友圈 all.json 地址
fcl_all_json: https://raw.githubusercontent.com/<YourName>/<Repo>/refs/heads/page/all.json
page_size: 20       # 每页加载的动态数量
source_label:       # 可选来源标签
# 顶部图片（可选）
top_img: https://img.nep.me/p/flatpaper/fcircle-top.webp
---
```

## 精选文章

```yaml
featured:
  - hello-world
  - markdown-elements-showcase
featured_autoplay: 5000
featured_image_zigzag: true
```

- `featured` 可填文章 slug、完整 permalink 路径、最后一段路径或精确标题，不区分大小写。
- 只在首页分页第 1 页渲染。
- 1 篇文章为静态卡片，2 到 4 篇为轮播。
- `featured_autoplay: 0` 关闭自动播放。
- `featured_image_zigzag: false` 关闭图片折线边。

## 视觉选项

```yaml
tags:
  style: tape

color: green

tape:
  enable: true
```

- `tags.style`：`tape` 或 `pill`
- `links.style`：`default` 或 `tape`
- `buttons.style`：`circle`（默认圆形）或 `tape` — 将手帐贴纸样式（墨团圆角、手贴歪斜、悬停胶带斜纹）应用到所有图标按钮：顶栏 logo/汉堡/搜索/调色盘/明暗切换、社交链接、文章反应按钮、TOC 折叠、搜索关闭、窄屏抽屉关闭
- `color`：`orange`、`purple`、`sakura`、`blue`、`pink`、`green`、`black`
- 桌面端通过 Header 调色盘选择主题色；移动端在侧栏顶部直接显示色点。
- 用户选择会写入 `flatpaper-accent` cookie。

## 页脚

```yaml
footer:
  left: '© {year} By {name}'
  powered:
    enable: true
    prefix: Powered by Theme
    name: FlatPaper
    link: https://github.com/Homulilly/hexo-theme-flatpaper
  links:
    -
      - name: 服务条款
        link: /terms
      - name: 隐私政策
        link: /privacy
    -
      - name: Flatpaper Tools
        link: https://hexotag.nep.me/
```

`footer.right` 已不再解析。页脚右侧由 `powered` 与 `links` 生成。

`left` 支持 HTML 与占位符：

- `{year}`：当前年份
- `{name}`：站点 `_config.yml` 中的 `author`

`powered` 负责主题署名：

- `enable`：设为 `false` 可隐藏主题署名
- `prefix`：署名前缀，默认 `Powered by Theme`
- `name`：主题名称，默认 `FlatPaper`
- `link`：主题链接，默认 FlatPaper 仓库
- 也可以直接写 `powered: false` 关闭整段主题署名

`links` 负责额外链接。一维列表会渲染为一行；二维列表会按行渲染，同一行内默认用 ` · ` 分隔。外部 `http(s)` 链接会自动在新标签页打开。

关闭主题署名时：

```yaml
footer:
  powered: false
```

## Note 提示块

```yaml
note:
  style: sticky
  icons: true
```

`style` 支持：

- `flat`：左侧色条 + 淡背景
- `simple`：左侧色条 + 细边框
- `modern`：填充式圆角盒，无左侧色条
- `sticky`：便签贴纸，直角、右下微阴影加顶部胶带
- `disabled`：去掉装饰，仅保留语义结构

`icons: false` 会隐藏圆形图标徽章。

## 代码块

```yaml
code:
  theme: dark
```

`code.theme` 支持 `dark`、`sand`、`light`、`simple`。值会写入 `<body data-code-theme="...">`。

代码块包含：

- macOS 风格标题栏
- 语言徽标
- 复制按钮
- 折叠按钮
- 单击行号高亮
- 双击行号复制该行

## Umami

```yaml
umami:
  enable: false
  host: analytics.example.com
  website_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  domains: example.com,www.example.com
```

启用后注入：

```html
<script defer src="https://<host>/script.js" data-website-id="<website_id>" data-domains="..."></script>
```

`host` 只接受纯域名或 `domain:port`。`domains` 可省略，支持逗号字符串或 YAML 列表。

## Google Analytics 4

```yaml
google_analytics:
  enable: true
  measurement_id: G-12345678
```

启用后会在每个页面的 `<head>` 开头注入 Google tag：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-12345678"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-12345678');
</script>
```

`measurement_id` 只接受 `G-...` 形式的 GA4 衡量 ID。每个站点只配置一次，避免重复加载 Google tag。

## AdSense

```yaml
adsense:
  enable: false
  client: ca-pub-1234567890123456
  account: false
  slots:
    post_top:
    post_bottom:
    sidebar:
```

- `client` 是发布商 ID。
- `account` 默认等于 `client`，设为 `false` 可跳过 account meta。
- 广告位可写字符串或对象。
- 如 AdSense 需要 `ads.txt`，仍需放在站点 `source/` 下。

## 评论

```yaml
comments: twikoo
```

支持：

- `twikoo`
- `artalk`
- 留空 / 删除：关闭

评论只在文章页和独立页面（`layout: page`）渲染。单页可用 front-matter 关闭：

```yaml
---
comments: false
---
```

Twikoo：

```yaml
twikoo:
  envId: https://twikoo.example.com
  cdn:
```

Artalk：

```yaml
artalk:
  server: https://artalk.example.com
  site: My Blog
  cdn_css:
  cdn_js:
```

两者都需要自行部署后端：

- [Twikoo 快速开始](https://twikoo.js.org/quick-start.html)
- [Artalk 部署文档](https://artalk.js.org/guide/deploy.html)

## Fancybox

```yaml
fancybox:
  enable: true
  cdn_css:
  cdn_js:
```

启用后，文章页和独立页面正文图片会自动接入 Fancybox。已被链接包裹或带 `class="no-zoom"` 的图片会跳过。

## 自定义注入

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/custom.css">
  bottom:
    - <script src="/js/extra.js" defer></script>
```

条目会原样输出到 `</head>` 或 `</body>` 前。只放可信 HTML。
