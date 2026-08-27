<p align="center">🇨🇳 中文简体  |  <a title="English" href="README_en.md">🇬🇧 English</a></p>

<p align="center"><img src="source/images/favicon.png" width="64" height="64" alt="FlatPaper logo"></p>

# FlatPaper

FlatPaper 是一个面向个人写作的 Hexo 主题：柔和纸面、扁平插画、便签、胶带条，以及在桌面和移动端都尽量安静的阅读界面。

- [Demo 站点](https://flatpaper.nep.me/)
- [作者博客](https://homulilly.com/)
- 文档: [Flatpaper Docs](https://flatpaper-docs.nep.me/)

## 截图

| 浅色模式 | 深色模式 |
| --- | --- |
| ![home light](preview/home.webp) | ![home dark](preview/home-dark.webp) |

## 安装

```bash
# 在你的 Hexo 站点内
git clone https://github.com/Homulilly/hexo-theme-flatpaper.git themes/flatpaper

# 复制并编辑主题配置
cp themes/flatpaper/_config.yml _config.flatpaper.yml
```

在站点 `_config.yml` 中启用主题：

```yaml
theme: flatpaper
```

运行 Hexo：

```bash
hexo cl
hexo g
hexo s
```

打开 <http://localhost:4000>。

如需启用 RSS，安装 `hexo-generator-feed` 并在站点 `_config.yml` 中配置：

```bash
pnpm add hexo-generator-feed
```

```yaml
feed:
  enable: true
  type: atom
  path: atom.xml
  limit: 20
  content: true
```

如需生成站点地图，安装 `hexo-generator-sitemap` 并在站点 `_config.yml` 中补充 sitemap 配置：

```bash
pnpm add hexo-generator-sitemap
```

```yaml
sitemap:
  path: sitemap.xml
```

## 快速示例

给文章添加封面：

```yaml
---
title: 周末散步
date: 2026-05-16
cover: /images/walk.jpg
---
```

在首页置顶精选文章：

```yaml
featured:
  - hello-world
  - markdown-elements-showcase
featured_autoplay: 5000
```

添加可折叠提示块：

```markdown
{% note warning 注意事项 %}
提供标题时，note 会渲染为可折叠 disclosure。
{% endnote %}
```

创建友链页：

```yaml
---
title: 友情链接
type: links
---
```

构建时会同时根据 `source/_data/links.yml` 中配置了 `rss` 的友链生成 Friend-Circle-Lite 可读取的 `/friend.json`，可在 Friend-Circle-Lite 的 `spider_settings.json_url` 中填写该地址。

创建内置朋友圈页，直接在页面 front-matter 中引用 Friend-Circle-Lite 生成的 `all.json`：

```yaml
---
title: 朋友圈
type: friends-feed
comments: false
fcl_all_json: https://raw.githubusercontent.com/OWNER/REPO/page/all.json
---
```

创建 `source/404.md` 以启用自定义 404 页面：

```yaml
---
title: 页面不存在
layout: 404
permalink: /404.html
comments: false
---
```

切换界面语言（在站点 `_config.yml` 中，二选一）：

```yaml
# 中文
language: zh-CN
```

```yaml
# English
language: en
```

## 亮点

- **纸面视觉系统**：柔和卡片、虚线边框、胶带装饰、CSS 插画回退，以及低对比度阅读界面。
- **响应式骨架**：首页 / 列表页三栏，文章页两栏，移动端切换为侧栏抽屉。
- **近期移动端优化**：移动端顶部只保留菜单、站点标题、搜索、明暗切换；brand links 移到侧栏作者卡片下方；主题色可在移动端侧栏顶部直接选择。
- **主题色与深色模式**：七种主题色、cookie 持久化主题色、`localStorage` 持久化深色模式，并在绘制前恢复状态。
- **精选轮播**：最多置顶四篇文章，支持箭头、圆点、键盘操作、自动播放与悬停 / 聚焦暂停。
- **封面解析**：按 `cover` -> `thumbnail` -> `image` -> `banner` -> 正文第一张图片解析，缺失时使用 CSS 场景回退。
- **文章体验**：粘性 TOC、上一篇 / 下一篇、相关文章、评论跳转 / 分享按钮、自定义 reaction 按钮。
- **代码块 UI**：语言徽标、复制 / 折叠、多套代码主题、行号单击高亮与双击复制。
- **写作标签**：兼容 NexT 的 `{% note %}` 与 `{% tabs %}`，并支持 VitePress 风格 `:::` note 容器。
- **堆叠相册**：`{% stackalbum %}` 把一组照片堆成扑克牌，点最上层抽起滑到牌底；`{% stackalbumnav <数据路径> %}` 是小号版，读 `source/_data/` 下任意列表，悬停名字把对应封面翻到最上层。无 JS 时退回普通图片列表。
- **内置页面**：归档、分类、标签，以及读取 `source/_data/links.yml` 的分组友链页。
- **赞赏名单**：关于页可放结构化 HTML 渲染手账便签风赞赏卡片——胶带纸条、循环纸色、右上角圆形头像；金额徽章按人民币面额自动配色（≥100 红 / ≥50 绿 / ≥20 棕黄 / ≥10 蓝 / ≥5 紫 / ≥1 橄榄绿）。
- **页脚链接与署名**：`footer.links` 条目支持纯图标链接（`icons` 数组，如 Font Awesome CC 标记）与 `title` / `aria-label`；`powered.row` 可把主题署名并入第一组 / 最后一组链接行末尾，或独占一行。
- **打字机效果**：页脚版权行右侧与首页开屏 bio 支持 anzhiyu 风格打字机（Typed.js），句子源兼容一言 / 一句网 / 今日诗词，也可自定义 `sub` 列表循环；CDN 不可达时退回纯文本。
- **滚动渐入**：首页轮播、章节标题、文章卡与侧栏卡进入视口时上浮渐显，文章卡交错出场；无 JS 或浏览器不支持 IntersectionObserver 时内容直接可见。
- **渐进式开屏大图**：`image_progressive` 让开屏背景先模糊小图、大图解码后淡出交接，滚动时轻微放大并整体渐隐；图源仍是 `image`，加载失败或无 JS 时直接显示原图。
- **多语言界面**：内置简体中文与英文界面文案，根据 Hexo `language` 配置选择并回退到 `zh-CN`；附带 `_config.yml` 与 `_config.en.yml` 两份配置。
- **可选集成**：Twikoo、Artalk、Fancybox、Umami、Google Analytics 4、AdSense、自定义 HTML 注入与 RSS 资料链接。

## 文档

详细配置与实现说明位于 `docs/zh/`：

- [配置说明](docs/zh/configuration.md)
- [功能说明](docs/zh/features.md)
- [自定义标签与页面](docs/zh/custom-tags-and-pages.md)
- [布局与开发](docs/zh/layout-and-development.md)

## 许可证

MIT
