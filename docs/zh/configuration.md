# 配置说明

所有主题选项都位于 `themes/flatpaper/_config.yml`。建议先复制为站点根目录下的 `_config.flatpaper.yml` 再修改。

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

主题附带两份示例配置：`_config.yml`（中文注释与默认值）和 `_config.en.yaml`（键结构相同，注释与默认值为英文）。两者键结构完全一致，按站点语言选用其中一份作为 `_config.flatpaper.yml` 的基础即可。

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

`icon` 会通过 `layout/_partial/icons.ejs` 解析。

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
  image_overlay: [0.22, 0.58]
  cta_link: "#flatpaper-home-content"
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
- `image_overlay` 控制图片开屏的暗色遮罩，使用 `[顶部, 底部]` 两个 `0` 到 `1` 的透明度数值；默认是 `[0.22, 0.58]`。
- 开屏中的社交链接复用 profile 的 `.socials` 样式，也会跟随 `buttons.style` 的配置变化。
- `stickers.draggable` 为 `true` 时，开屏里的贴纸可以在当前页面内随机摆放并拖动，位置不会写入本地存储。
- `stickers.note_text` 可修改内置便签贴纸的文字。
- `stickers.items` 可添加图片贴纸；自定义贴纸最多渲染 5 张，加上内置便签后开屏最多 6 个 sticker。`image` 必填，`link` 可选，`size` 可选并限制在 48 到 180 像素。带 `link` 的贴纸会先弹出访问确认气泡，文案使用 `alt`，例如“要访问 GitHub 吗？”。
- 底部跳动箭头会滚入首页内容；`cta_link` 可改成其它锚点，并会避开顶部导航遮挡。开屏不会根据滚动距离自动进入首页。

## 文章相关

```yaml
excerpt_length: 96
random_posts: 5
random_posts_pool: 100
latest_posts:
  enable: false
  limit: 5
related_posts: 4
article:
  strong_accent: true
```

- `excerpt_length`：没有 `<!-- more -->` 时的摘要截断长度。
- `random_posts`：侧栏随机文章数量，`0` 禁用。
- `random_posts_pool`：从最新 N 篇文章中抽取候选，`0` 或留空表示不限。
- `latest_posts`：文章页侧栏 TOC 下方的最新文章组件，默认关闭；`limit` 默认 `5`。
- `related_posts`：相关文章数量，`0` 禁用整块。
- `article.strong_accent`：文章正文中的加粗文本使用主题色；设为 `false` 时只保留默认加粗。

相关文章评分：

- 相同分类 `+3`
- 相同标签 `+2`
- 0 分文章排除
- 分数相同时较新文章优先

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
  right: 'Powered by Theme {theme}'
```

占位符：

- `{year}`：当前年份
- `{name}`：站点 `_config.yml` 中的 `author`
- `{theme}`：FlatPaper 仓库链接

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
