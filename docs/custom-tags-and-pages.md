# Custom Tags and Pages

## Note Tag

```markdown
{% note success %}
A success note.
{% endnote %}

{% note warning Notice %}
When a title is provided, the note renders as a foldable disclosure.
{% endnote %}
```

Supported note types:

- `default`
- `primary`
- `success`
- `info`
- `warning`
- `danger`

Adding a title turns the note into a native `<details>` disclosure.

## VitePress-Style Containers

FlatPaper also rewrites VitePress-style containers to notes:

```markdown
::: success
A success note.
:::

::: warning Notice
When a title is provided, this is foldable.
:::
```

The rewrite happens during `before_post_render`. Containers inside fenced code blocks or four-space-indented code are preserved.

## Tabs Tag

```markdown
{% tabs Tab, 1 %}
<!-- tab -->
**Tab 1**
<!-- endtab -->
<!-- tab Custom name -->
Content...
<!-- endtab -->
{% endtabs %}
```

Arguments:

- first argument: base name for unnamed tabs
- second argument: 1-based default tab index
- `-1` as the second argument enables collapsed mode

In collapsed mode, all tabs start closed and the active tab can be clicked again to collapse.

## Special Pages

`type:` in front matter routes a page to a custom layout:

```yaml
---
title: Links
type: links
---
```

Recognized values:

- `404`
- `links`
- `friends-feed`
- `tags`
- `categories`

Anything else falls back to the default page layout.

For a static 404 page, create `source/404.md` in the Hexo site:

```yaml
---
title: Page not found
layout: 404
permalink: /404.html
comments: false
---
```

On production hosts, keep `404.html` at the site root and configure the host to use it as the not-found page when required.

## Friends Page Data

`type: links` reads `source/_data/links.yml`:

```yaml
- class_name: DEMO
  class_desc: Example links for testing card rendering.
  flink_style: demo
  link_list:
    - name: GitHub
      link: https://github.com/
      avatar: https://github.githubassets.com/favicons/favicon.svg
      descr: Code hosting and collaboration platform.
      rss: https://github.blog/feed/
```

The markdown body of the page still renders below the card grid.

## Friend-Circle-Lite Data

During generation, FlatPaper reads `source/_data/links.yml` and emits `/friend.json` for Friend-Circle-Lite. Only friend links with a non-empty `rss` field are written:

```json
{
  "friends": [
    ["GitHub", "https://github.com/", "https://github.githubassets.com/favicons/favicon.svg"]
  ]
}
```

Field mapping:

- `name` -> site name
- `link` -> site homepage
- `avatar` -> avatar
- `rss` -> controls whether the entry is written to `/friend.json`; the field itself is not written to the Friend-Circle-Lite array
- `linkpage` / `link_page` / `linkPage` -> optional friend-links page; when present, FlatPaper emits a four-item array for Friend-Circle-Lite backlink checks

In Friend-Circle-Lite `conf.yaml`, point the crawler to the generated file:

```yaml
spider_settings:
  json_url: "https://example.com/friend.json"
```

If a friend's RSS feed cannot be auto-discovered, add it to Friend-Circle-Lite `specific_RSS` with the same `name`.

## Friend Circle Page

`type: friends-feed` reads the Friend-Circle-Lite `all.json` URL from page front matter and renders the article stream with FlatPaper's built-in UI:

```yaml
---
title: Friend Circle
type: friends-feed
comments: false
fcl_all_json: https://raw.githubusercontent.com/OWNER/REPO/page/all.json
page_size: 20
source_label: Source
---
```

`fcl_all_json` can also be written as `all_json`. `page_size` and `source_label` are optional; different pages can point to different `all.json` files.

With a GitHub raw URL, you do not need to bind GitHub Pages or a custom domain to Friend-Circle-Lite's `page` branch.
