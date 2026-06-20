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
