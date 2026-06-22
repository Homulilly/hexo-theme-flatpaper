# Configuration

All theme options live in `themes/flatpaper/_config.yml`. Copy it to `<site>/_config.flatpaper.yml` before editing.

The site name in the header and the meta description are read from the Hexo site `_config.yml` (`title` and `description`).

## Language

FlatPaper localizes its built-in interface text (navigation labels, search states, pagination, ARIA labels, etc.). The language is chosen from the Hexo site `_config.yml` `language` field:

```yaml
language: zh-CN
# or a priority list
language:
  - zh-CN
  - en
```

- Supported languages: `zh-CN` and `en`.
- A string is matched directly; a list is matched in order, and the first supported language wins.
- When `language` is empty, missing, or not supported, FlatPaper falls back to `zh-CN`.

Only the theme's own interface strings are translated. Post content, site data, and your own configuration values are left as written.

The theme ships two example configs: `_config.yml` (Chinese comments and defaults) and `_config.en.yaml` (the same keys with English comments and defaults). They share an identical key structure — pick whichever matches your site language as the base for `_config.flatpaper.yml`.

## Menu

```yaml
menu:
  Home:
    link: /
    icon: home
  Archives:
    link: /archives/
    icon: archive
  Site:
    icon: folder
    item:
      Categories:
        link: /categories/
        icon: folder
      Tags:
        link: /tags/
        icon: tag
```

`icon` values are resolved through `layout/_partial/icons.ejs`.

## Brand Links

`nav` controls the brandmark link groups. On desktop, these links are opened from the brandmark menu. On mobile, they appear in the sidebar below the author card.

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

## Profile

```yaml
profile:
  role: Daily notes
  bio: Introduce yourself in one or two memorable sentences.
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

- `avatar` accepts a path under the site `source/` directory or an absolute URL. Empty value uses the CSS-drawn default avatar.
- `avatar_shape` accepts `square` or `circle`.
- `site_info`: empty/`false` hides an item, `true` shows plain text, and any other non-empty value renders as a link.
- `social` keys auto-match built-in icons: `github`, `twitter`, `x`, `mail/email`, `rss`, `steam`, `bilibili`, `youtube`, `facebook`, `instagram`, `telegram`, `weibo`.
- Object social entries may override the icon or provide inline SVG:

```yaml
social:
  Mastodon:
    url: https://mastodon.social/@yourname
    icon: send
  Zhihu:
    url: https://www.zhihu.com/people/yourname
    svg: '<path d="M2 2 L22 22"/>'
```

> Note: the `svg` field is injected into the page **as raw markup** (it has to
> be, to draw the icon). Only paste path data you trust.

## Welcome Card

```yaml
welcome:
  label: Today's note
  title: Write the days down slowly
  text: Life is not spectacular every day, but there are always moments worth keeping.
  cta_text: Start reading
  cta_link: archives/
  image: /images/welcome.jpg
```

`welcome.image` switches the welcome illustration to a 16:9 cover image. Leave it empty to use the CSS mountain scene.

## Home Opening Hero

```yaml
home_hero:
  enable: true
  title: My Journal
  subtitle: Today
  bio: A short note for readers landing here.
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
    note_text: Today
    items:
      - image: /images/stickers/memo.png
        alt: Journal sticker
        size: 96
      - image: /images/stickers/github.png
        alt: GitHub
        link: https://github.com/yourname
```

- Default is `enable: false`, so existing home pages are unchanged. It renders only on page 1 of the home pagination.
- When `title`, `subtitle`, `bio`, `avatar`, or social links are omitted, the hero reuses the site title and `profile` config.
- Leave `image` empty to use the built-in scrapbook paper background. Set it to a string for one fixed image, or to an array so the browser randomly picks one on each page load. Images fill the opening screen on wider viewports; narrow screens fall back to the paper background so stickers stay readable.
- `image_overlay` controls the dark overlay on image heroes. Use `[top, bottom]` opacity values from `0` to `1`; the default is `[0.22, 0.58]`.
- Social links in the hero reuse the profile `.socials` styling and follow the `buttons.style` option.
- With `stickers.draggable: true`, the hero stickers get randomized and can be dragged around the page for the current view. Positions are not persisted.
- `stickers.note_text` changes the text on the built-in note sticker.
- `stickers.items` adds image stickers. The hero renders up to 5 custom stickers, plus the built-in note. `image` is required, while `link` is optional. `size` is optional and clamped to 48-180 pixels. Stickers with `link` show a visit confirmation bubble first and use `alt` in the prompt, such as "Visit GitHub?".
- The bouncing bottom arrow scrolls into the home content. `cta_link` can point to another anchor and offsets for the sticky header. The hero does not auto-enter the home content based on scroll distance.

## Posts

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

- `excerpt_length`: fallback excerpt length when `<!-- more -->` is absent.
- `random_posts`: sidebar random post count. `0` disables the card.
- `random_posts_pool`: latest-post candidate pool. `0` or empty means unlimited.
- `latest_posts`: latest-post card below the post TOC in the article sidebar. Disabled by default; `limit` defaults to `5`.
- `related_posts`: related-post card count. `0` disables the block.
- `article.strong_accent`: uses the accent color for bold text inside article content. Set `false` to keep plain bold text.

Related posts are scored by shared taxonomy:

- shared category: `+3`
- shared tag: `+2`
- zero-score posts are excluded
- ties are sorted by newer date

## Reactions

Custom reaction buttons are useful for reward/donation QR codes. Image popovers open on hover or click.

```yaml
reactions:
  custom:
    - type: image
      name: WeChat
      icon: wechat
      align: right
      image: /images/reward-wechat.jpg
      title: WeChat reward
```

Fields:

- `type`: currently `image`
- `name`: button label
- `icon`: built-in icon name, such as `gift`, `wechat`, `alipay`, `paypal`, `heart`
- `align`: `left` or `right`
- `image`: site path or absolute URL
- `title`: optional popover title

## Search

```yaml
search:
  limit: 0
```

`0` or empty means all posts. Set a number to limit the search index to the latest N posts.

The index is generated at build time as a standalone `flatpaper-search.json` at the site root and fetched lazily when the search panel first opens — it is not inlined into pages.

Users can open search from the header or with `Ctrl+K` / `Cmd+K`.

## Featured Posts

```yaml
featured:
  - hello-world
  - markdown-elements-showcase
featured_autoplay: 5000
featured_image_zigzag: true
```

- `featured` accepts post slugs, full permalink paths, last path segments, or exact titles. Matching is case-insensitive.
- Renders only on page 1 of the home pagination.
- One featured post renders as a static card.
- Two to four posts render as a carousel.
- `featured_autoplay: 0` disables autoplay.
- `featured_image_zigzag: false` disables the zigzag image edge.

## Visual Options

```yaml
tags:
  style: tape

color: green

tape:
  enable: true
```

- `tags.style`: `tape` or `pill`
- `links.style`: `default` or `tape`
- `buttons.style`: `circle` (default) or `tape` — applies the scrapbook style (ink-blob corners, hand-placed tilt, washi-tape hover) to every icon button: header logo/menu/search/palette/theme toggle, social links, reaction buttons, TOC toggle, search close, and the narrow-screen drawer close
- `color`: `orange`, `purple`, `sakura`, `blue`, `pink`, `green`, or `black`
- On desktop the palette button opens the color menu; on mobile color swatches appear directly in the sidebar drawer.
- The chosen accent is stored in the `flatpaper-accent` cookie.

## Footer

```yaml
footer:
  left: '© {year} By {name}'
  right: 'Powered by Theme {theme}'
```

Placeholders:

- `{year}`: current year
- `{name}`: site `_config.yml` `author`
- `{theme}`: link to the FlatPaper repository

## Note Blocks

```yaml
note:
  style: sticky
  icons: true
```

`style` accepts:

- `flat`: left accent strip and soft tinted background
- `simple`: left accent strip and thin border
- `modern`: filled rounded box without left strip
- `sticky`: sticky-note style with square corners and top tape
- `disabled`: removes decorative chrome but keeps semantic structure

`icons: false` removes the circular icon badge.

## Code Blocks

```yaml
code:
  theme: dark
```

`code.theme` accepts `dark`, `sand`, `light`, or `simple`. The value is written to `<body data-code-theme="...">`.

Code blocks include:

- macOS-style title bar
- language badge
- copy button
- collapse button
- line-number highlight on click
- line copy on double-click

## Umami

```yaml
umami:
  enable: false
  host: analytics.example.com
  website_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  domains: example.com,www.example.com
```

When enabled, FlatPaper injects:

```html
<script defer src="https://<host>/script.js" data-website-id="<website_id>" data-domains="..."></script>
```

`host` accepts plain `domain` or `domain:port`. A leading `https://` is stripped automatically. `domains` is optional and accepts a comma-separated string or YAML list.

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

- `client` is the publisher id.
- `account` defaults to `client`; set `false` to skip the account meta tag.
- Slot values may be strings or objects with `slot`, `format`, `layout`, `layout_key`, and `responsive`.
- You still need to place `ads.txt` in the site source if your AdSense setup requires it.

## Comments

```yaml
comments: twikoo
```

Supported values:

- `twikoo`
- `artalk`
- empty / removed: disabled

Comments render on posts and standalone pages (`layout: page`), not index/archive/category/tag pages. A page can opt out with:

```yaml
---
comments: false
---
```

Twikoo:

```yaml
twikoo:
  envId: https://twikoo.example.com
  cdn:
```

Artalk:

```yaml
artalk:
  server: https://artalk.example.com
  site: My Blog
  cdn_css:
  cdn_js:
```

Both systems require self-hosted backends:

- [Twikoo quick start](https://twikoo.js.org/quick-start.html)
- [Artalk deployment guide](https://artalk.js.org/guide/deploy.html)

## Fancybox

```yaml
fancybox:
  enable: true
  cdn_css:
  cdn_js:
```

When enabled, post/page content images are wrapped for Fancybox unless the image is already inside a link or has `class="no-zoom"`.

## Custom Injection

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/custom.css">
  bottom:
    - <script src="/js/extra.js" defer></script>
```

Entries are emitted verbatim before `</head>` or `</body>`. Only use trusted, self-authored HTML.
