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
- `guestbook`
- `tags`
- `categories`

Anything else falls back to the default page layout.

Standalone pages and special `type:` pages can render a page-local top image by setting `top_img` in that page's front matter:

```yaml
---
title: Links
type: links
top_img: /images/pages/links.jpg
---
```

Page top images only use the current page's `top_img`. There is no theme-level fallback or configuration for pages; leaving `top_img` empty renders no image.

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

## Guestbook Page

`type: guestbook` re-renders the page's own comments as a "message wall": each message becomes a colored sticky note taped to the wall. Paper tint, tape color and tilt are derived deterministically from the comment id, while the wall opens in random order by default and can be switched to latest-first order. The regular comment section stays at the bottom of the page — visitors write there, and the message lands on the wall after a refresh:

```yaml
---
title: Guestbook
type: guestbook
page_size: 12
---
```

Prerequisite: the theme must have Twikoo (`comments: twikoo` + `twikoo.envId`) or Artalk (`comments: artalk` + `artalk.server`) enabled. Without either, the wall shows a hint and the bottom comment section is unaffected.

Behavior notes:

- The wall shows top-level messages only (up to the latest 100). Threaded replies live in the comment section below; every card has a "view original comment" link that jumps there.
- The sort control toggles between the default random order and latest-first order. Latest-first mode uses a grid layout so cards read left to right.
- Wall cards render plain text plus image and emote thumbnails extracted from Twikoo HTML or Artalk markdown/HTML. Rich formatting is not re-rendered on cards, and unsafe image URLs are ignored; the original comment section still shows the full comment UI.
- Twikoo avatars show on the cards; Artalk's public API returns no avatar URL, so its cards use initial-letter avatars.
- `page_size` controls how many cards render per batch (default 12, max 50); the rest load via the "show more" button.
- The page's markdown body renders above the wall and works as an intro.
