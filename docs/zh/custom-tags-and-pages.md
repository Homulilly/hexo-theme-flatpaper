# 自定义标签与页面

## Note 标签

```markdown
{% note success %}
一个 success 提示。
{% endnote %}

{% note warning 注意事项 %}
提供标题时，note 会渲染为可折叠 disclosure。
{% endnote %}
```

支持类型：

- `default`
- `primary`
- `success`
- `info`
- `warning`
- `danger`

添加标题会让 note 渲染为原生 `<details>` 折叠块。

## VitePress 风格容器

FlatPaper 也支持把 VitePress 风格容器改写为 note：

```markdown
::: success
一个 success 提示。
:::

::: warning 注意事项
提供标题时会折叠。
:::
```

改写发生在 `before_post_render`。代码块和四空格缩进代码里的 `:::` 会被保留。

## Tabs 标签

```markdown
{% tabs 标签, 1 %}
<!-- tab -->
**选项卡 1**
<!-- endtab -->
<!-- tab 自定义名称 -->
内容...
<!-- endtab -->
{% endtabs %}
```

参数：

- 第一个参数：未命名 tab 的基础名称
- 第二个参数：从 1 开始的默认 tab 索引
- 第二个参数为 `-1` 时启用折叠模式

折叠模式下所有 tab 初始关闭，点击当前 tab 可再次折叠。

## 特殊页面

front-matter 中的 `type:` 会把页面路由到自定义布局：

```yaml
---
title: 友情链接
type: links
---
```

识别值：

- `404`
- `links`
- `friends-feed`
- `tags`
- `categories`

其他值会回退到默认页面布局。

要生成静态 404 页面，可在 Hexo 站点中创建 `source/404.md`：

```yaml
---
title: 页面不存在
layout: 404
permalink: /404.html
comments: false
---
```

线上托管时请确保站点根目录保留 `404.html`，必要时在托管平台配置为自定义 404 页面。

## 友链页数据

`type: links` 读取 `source/_data/links.yml`：

```yaml
- class_name: DEMO
  class_desc: 用于测试卡片渲染的链接示例。
  flink_style: demo
  link_list:
    - name: GitHub
      link: https://github.com/
      avatar: https://github.githubassets.com/favicons/favicon.svg
      descr: 代码托管与协作平台。
      rss: https://github.blog/feed/
```

页面 front-matter 下方的 markdown 正文仍会渲染在卡片网格后面。

## Friend-Circle-Lite 数据

FlatPaper 会在构建时读取 `source/_data/links.yml`，并默认输出 Friend-Circle-Lite 可读取的 `/friend.json`。只有配置了非空 `rss` 字段的友链会写入该文件：

```json
{
  "friends": [
    ["GitHub", "https://github.com/", "https://github.githubassets.com/favicons/favicon.svg"]
  ]
}
```

字段映射：

- `name` -> 站点名称
- `link` -> 站点首页
- `avatar` -> 头像
- `rss` -> 是否写入 `/friend.json`；该字段本身不会写入 Friend-Circle-Lite 的数组
- `linkpage` / `link_page` / `linkPage` -> 可选友链页地址；存在时会输出四项数组，供 Friend-Circle-Lite 做反链检测

在 Friend-Circle-Lite 的 `conf.yaml` 中填写：

```yaml
spider_settings:
  json_url: "https://example.com/friend.json"
```

如果某个友链的 RSS 无法自动探测，可在 Friend-Circle-Lite 的 `specific_RSS` 中按友链 `name` 单独指定。

## 友链朋友圈页面

`type: friends-feed` 会读取页面 front-matter 中的 Friend-Circle-Lite `all.json` 地址，并使用 FlatPaper 内置 UI 渲染文章流：

```yaml
---
title: 朋友圈
type: friends-feed
comments: false
fcl_all_json: https://raw.githubusercontent.com/OWNER/REPO/page/all.json
page_size: 20
source_label: 数据源
---
```

`fcl_all_json` 也可写作 `all_json`。`page_size` 和 `source_label` 可省略；不同页面可以填写不同的 `all.json`。

如果使用 GitHub raw 地址，不需要给 FCL 的 `page` 分支绑定 GitHub Pages 或自定义域名。
