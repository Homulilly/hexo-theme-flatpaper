# FlatPaper

FlatPaper 是一个面向个人写作的 Hexo 主题：柔和纸面、扁平插画、虚线描边、便签、胶带条，以及在桌面和移动端都尽量安静的阅读界面。

- [Demo 站点](https://flatpaper.nep.me/)
- [作者博客](https://homulilly.com/)
- English: [README.md](README.md)

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

创建 `source/404.md` 以启用自定义 404 页面：

```yaml
---
title: 页面不存在
layout: 404
permalink: /404.html
comments: false
---
```

切换界面语言（在站点 `_config.yml` 中）：

```yaml
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
- **内置页面**：归档、分类、标签，以及读取 `source/_data/links.yml` 的分组友链页。
- **多语言界面**：内置简体中文与英文界面文案，根据 Hexo `language` 配置选择并回退到 `zh-CN`；附带 `_config.yml` 与 `_config.en.yaml` 两份配置。
- **可选集成**：Twikoo、Artalk、Fancybox、Umami、AdSense、自定义 HTML 注入与 RSS 资料链接。

## 文档

详细配置与实现说明位于 `docs/zh/`：

- [配置说明](docs/zh/configuration.md)
- [功能说明](docs/zh/features.md)
- [自定义标签与页面](docs/zh/custom-tags-and-pages.md)
- [布局与开发](docs/zh/layout-and-development.md)

## 许可证

MIT
