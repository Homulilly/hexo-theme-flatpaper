# FlatPaper

FlatPaper is a Hexo theme inspired by flat illustrations and paper cards, featuring dashed outlines, sticky notes, tape strips, and a soft low-contrast reading interface. The theme is built with modular Stylus partials and a small EJS template layer, with no runtime dependencies.

**[Live demo](https://flatpaper.nep.me/)** · **[Preview: Author's blog](https://homulilly.com/)**

![preview](preview/home.webp)

## Highlights

- **Adaptive layout**: three columns on the home / list pages, two columns on post pages, and a single-column drawer mode on narrow screens.
- **Sticky TOC**: the post page TOC card stays sticky across the full article range; home / list page sidebars scroll normally with the page.
- **Featured carousel**: pin up to four posts in `_config.yml`, with automatic rotation and hover-to-pause support.
- **Cover images**: reads `post.cover` / `thumbnail` / `image` / `banner` / the first inline `<img>` in the rendered post body; falls back to a CSS scene when no image exists.
- **Personalize profile / welcome card**: `profile.avatar_shape` toggles between `square` and `circle` masks; `welcome.image` swaps the CSS mountain scene for a custom 16:9 cover image.
- **macOS-style code blocks**: language badge (auto-detected, hidden for plaintext), copy and collapse buttons; supports `dark` / `sand` / `light` code themes. **Line-number interactions**: single-click toggles a highlight on that line, double-click copies the line's text.
- **Hexo NexT-compatible tags**: `{% note %}` (6 colors x 4 visual styles `flat / simple / modern / disabled`, foldable) and `{% tabs %}` (with collapsible mode); note also accepts the VitePress-style `::: type [title] ... :::` container syntax.
- **Pages routed by `type:`**: set `type: link | tags | categories` in front-matter to route to a custom layout (the more common `layout:` field still works).
- **Friends page**: `/links/` supports grouped cards, avatar fallback, per-link RSS badges, and a hover signal-pulse animation.
- **In-page search**: global Ctrl+K / Cmd+K popup backed by an inline JSON index of all posts (large sites can cap the count with `search.limit` in `_config.yml`).
- **Optional comment system**: top-level `comments: twikoo | artalk` selects between Twikoo and Artalk; leave it empty / remove the field to disable comments entirely. Each system keeps its own config block, and any page can opt out via front-matter `comments: false`.
- **Optional image lightbox**: enable Fancybox in `_config.yml` and every `<img>` inside `.article-content` on post / standalone pages becomes a Fancybox gallery — click to zoom, arrow keys / swipes to navigate, ESC to close.
- **Custom HTML injection**: `inject.head` / `inject.bottom` accept arrays of raw HTML strings that are emitted verbatim before `</head>` / `</body>` — drop in extra CSS / JS without touching templates.
- **Dark mode**: single-class toggle, persisted to `localStorage`; every component has a dark variant.
- **Configurable footer**: write custom copy with `{year}` / `{name}` (the site's `author`) / `{theme}` (a link back to the theme repo) placeholders; the attribution can be kept or dropped.
- **Icon set**: Lucide outline icons plus Simple Icons brand glyphs (GitHub / X / YouTube / Bilibili / Steam / Facebook / Instagram / Telegram / Weibo, and more), all embedded as inline SVG and driven by the same EJS partial.

## Quick Start

```bash
# inside your Hexo site
git clone https://github.com/Homulilly/hexo-theme-flatpaper.git themes/flatpaper
# or copy this folder directly

# enable it in <site>/_config.yml
theme: flatpaper

# copy and edit the theme config
cp themes/flatpaper/_config.yml _config.flatpaper.yml

hexo g && hexo s
```

Open <http://localhost:4000>.

Recommended pagination settings in the **site** `_config.yml`:

```yaml
index_generator:
  per_page: 10
  order_by: -date

per_page: 10
```

To enable an RSS feed:

```bash
pnpm add hexo-generator-feed
```

```yaml
# site _config.yml
feed:
  enable: true
  type: atom
  path: atom.xml
  limit: 20
  content: true
```

## Theme Configuration

All options live in `themes/flatpaper/_config.yml`.
The correct approach is to copy it to `<site>/_config.flatpaper.yml` before editing.

> The site name (brand text in the header) and `<meta name="description">` are read directly from the Hexo site `_config.yml` (`title` and `description`); the theme no longer duplicates them.

```yaml
menu:                                 # primary nav; string paths are still supported
  Home:
    path: /
    icon: home
  Archives:
    path: /archives/
    icon: archive
  Links:
    path: /links/
    icon: link
  Categories:
    path: /categories/
    icon: folder
  Tags:
    path: /tags/
    icon: tag
  About:
    path: /about/
    icon: user

profile:                              # rendered in the left sidebar; author name is read from the site _config.yml's `author`
  role: Daily notes
  bio: Likes walking, brewing coffee, and reading a little...
  # avatar: /images/avatar.png        # avatar image path; leave empty to use the CSS-drawn default
  avatar_shape: square                # `square` (default) or `circle` (circular mask)

social:                               # key -> URL; icons auto-match by key (case-insensitive)
  # Built-in: github, twitter, x, mail/email, rss, steam, bilibili,
  #           youtube, facebook, instagram, telegram, weibo
  GitHub: https://github.com/me
  X: https://x.com/me                 # new Twitter (X) logo
  Email: mailto:hi@example.com
  # Object form — custom icon / inline SVG
  # Mastodon:
  #   url: https://mastodon.social/@me
  #   icon: send                       # reuse any registered icon name
  # Zhihu:
  #   url: https://www.zhihu.com/people/me
  #   svg: '<path d="..."/>'           # raw SVG children; viewBox 24x24, currentColor

rss:                                  # RSS icon appended to the social links row
  enable: true
  path: atom.xml

welcome:                              # welcome card (home page left sidebar)
  label: Today's note
  title: Write the days down slowly
  text: A place to collect small moments that are too quiet for social feeds.
  cta_text: Start reading             # CTA button label at the bottom of the card
  cta_link: archives/                 # CTA button link (passed through url_for)
  # image: /images/welcome.jpg        # 16:9 custom cover image; leave empty to keep the CSS mountain scene

excerpt_length: 96
recent_posts: 5                       # also used as the related-post limit on post pages
related_posts: 4                      # override only the related-post count if needed; 0 disables the block

tags:
  style: tape                         # "tape" or "pill"

featured:                             # up to 4 pinned posts on the home page
  - hello-world                       # slug / full path / last path segment / title
  - flatpaper-design-notes
featured_autoplay: 5000               # milliseconds; 0 disables it

tape:
  enable: true                        # false hides all tape decorations

footer:                               # HTML allowed; placeholders: {year} / {name} / {theme}
  left: '&copy; {year} {name}'        # {name} is the site _config.yml's `author`
  right: 'Powered by Theme {theme}'   # {theme} renders as a link to the theme repo

note:                                 # {% note %} appearance
  style: flat                         # flat | simple | modern | disabled
  icons: true                         # whether to show the circular icon badge

code:
  theme: sand                         # "dark", "sand", or "light"

umami:                                # Umami analytics; no script is injected when disabled
  enable: false
  host: analytics.example.com         # Umami service domain (no scheme, no path)
  website_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  domains: example.com,www.example.com # optional; only report on these hostnames

comments:                             # Comment system selector: twikoo | artalk (empty / removed = no comments)

twikoo:                               # Twikoo (self-hosted backend)
  envId: https://twikoo.example.com   # Twikoo backend URL
  # cdn: https://cdn.example.com/twikoo.all.min.js  # optional; overrides the default jsDelivr CDN

artalk:                               # Artalk (self-hosted backend)
  server: https://artalk.example.com  # Artalk backend URL
  site: 'My Site'                     # site name; must match what's registered on the Artalk backend
  # cdn_css: https://cdn.example.com/Artalk.css     # optional
  # cdn_js:  https://cdn.example.com/Artalk.js      # optional

fancybox:                             # image lightbox; assets load only on post / page layouts
  enable: false
  # cdn_css: https://cdn.example.com/fancybox.css     # optional; overrides default jsDelivr CSS
  # cdn_js:  https://cdn.example.com/fancybox.umd.js  # optional; overrides default jsDelivr JS

inject:                               # raw HTML injection (arrays; each entry is emitted verbatim)
  head:                               # injected before </head>
    # - <link rel="stylesheet" href="/css/custom.css">
    # - <script src="/js/extra.js"></script>
  bottom:                             # injected before </body>
    # - <script src="/js/late.js" defer></script>
```

When Umami is enabled, the following snippet is injected right before `</head>`:

```html
<script defer src="https://<host>/script.js" data-website-id="<website_id>" data-domains="..."></script>
```

- `host` only accepts plain `domain` or `domain:port` values (e.g. `analytics.example.com`, `localhost:3000`). A leading `https://` is stripped automatically; anything containing other characters is rejected and no script is injected.
- `domains` is Umami's built-in **blog-domain allowlist**: the tracker only reports when the visiting page's `hostname` matches an entry, which is the cleanest way to keep `localhost`, ephemeral preview URLs, or sites cloned and redeployed by others out of your stats. The field is optional; both a comma-separated string and a YAML list are accepted.

**Comments** are gated by the top-level `comments:` selector: set it to `twikoo` or `artalk` and the corresponding system activates (as long as its required field is filled — `envId` for Twikoo, `server` for Artalk). Leave it empty / remove the field and no comment UI renders. Comments appear **after the main content of post pages and standalone pages** (about / friends / etc. with `layout: page`); index pages (home, archives, categories, tags) never show them. Both systems require a self-hosted backend:

- Twikoo: see the [Twikoo quick start](https://twikoo.js.org/quick-start.html). Container id is `#tcomment`.
- Artalk: see the [Artalk deployment guide](https://artalk.js.org/guide/deploy.html). Container id is `#artalk-comments`, initialization goes through `Artalk.init({...})`. `pageKey` defaults to `page.permalink`, `pageTitle` to `page.title`, and `site` must match the site name registered in the Artalk admin.

Any page can still opt out by adding `comments: false` to its front-matter; the comment SDK is also only loaded on content pages, never on index pages. The reactions footer's "comment" button locates whichever container is mounted (Twikoo or Artalk) and smooth-scrolls to it; the share button calls `navigator.share` (with a clipboard-copy fallback when the API is unavailable).

> For site-wide visitor analytics, use the Umami integration documented above. Neither comment system exposes an official pageview API, so the theme does not maintain a per-post visitor counter.

With Fancybox enabled, every `<img>` inside `.article-content` is wrapped client-side in `<a data-fancybox="gallery">`, so **all images on the page automatically share one gallery** — arrow keys / swipes navigate, double-click / wheel zooms, ESC closes. Images already wrapped in `<a>` (e.g. `[![](img)](url)`) are left alone; mark an individual image with `class="no-zoom"` to skip the lightbox. CDN assets are only loaded on post pages and `layout: page` pages — index pages (home / archives / tags / categories) stay lean.

### UI Options and Current Defaults

- `menu` format, with icons resolved by `layout/_partial/icons.ejs`.

```yml
# Form 1
# Here Home is the display text, and / is the link path.
menu:
  Home: /
  Archives: /archives/
  About: /about/

# Form 2
menu:
  - path: /
    label: Home
    icon: home

  - path: /archives/
    name: Archives
    icon: archive
```

- Internal separators that may move while scrolling use native `1px dashed` borders where possible; outer paper / card outlines stay `2px dashed`.
- `tags.style` controls tag chips globally: `tape` uses lightly rotated small tape strips, while `pill` uses rounded capsules.
- Home and post interaction elements consistently use Lucide icons: latest posts, related posts, top navigation links, and "view more" arrows all render through the shared icon partial.
- `code.theme` supports `dark`, `sand`, and `light`. `sand` is the warm cream code theme; `light` is the white code theme.

### Featured Carousel

- `featured` accepts post slugs, full permalink paths, the last path segment, or exact titles. Matching is case-insensitive.
- It renders only on **page 1** of the home pagination.
- 1 post renders as a single static card. 2-4 posts render as a carousel with arrows, dot indicators, keyboard arrow support, and autoplay that pauses on hover / focus.

### Cover Images

```yaml
---
title: Weekend Walk
date: 2026-05-16
cover: /images/walk.jpg               # or an absolute URL
---
```

Resolution order: `cover` -> `thumbnail` -> `image` -> `banner` -> the first inline `<img>` in the rendered body. The first match wins. If none exist, the theme falls back to a CSS scene (sun + clouds + mountains / computer / camera).

Images use `object-fit: cover; object-position: 50% 50%`, so wide images keep the visible vertical centerline.

### Related Posts

Post pages automatically append a **standalone "Related Posts" card** below the article. Scoring:

- Each shared category +3
- Each shared tag +2
- Posts with a 0 score are excluded entirely; when no related posts exist, the card does not render
- When scores tie, newer posts win

Set `related_posts` (or fall back to `recent_posts`) to control how many cards are shown. Set `related_posts: 0` explicitly to disable the entire block (the card stops rendering).

### Search

Click the magnifier button in the header, or press **Ctrl + K / Cmd + K** anywhere. Press **Esc** to close. Results are filtered from an inline JSON index of the most recent 120 posts (title + 200-character excerpt). Keywords are highlighted with `<mark>`.

### Dark Mode

The circular toggle button in the header stores state in `localStorage['flatpaper-mode']`. The toggle reads the stored state before paint to avoid FOUC.

### Code Block Theme

`code.theme` accepts `dark`, `sand`, or `light`. `sand` is the cream / light code theme; `light` is the white code theme. The value is written to `<body data-code-theme="...">`, and a CSS scope covers all code blocks.

Per-block UI:

- macOS-style title bar with three colored dots
- Language badge on the left, auto-detected from the highlight.js class (for example `figure.highlight.js -> JavaScript`). `plain / plaintext / text / txt / none / raw` resolve to empty and hide the badge.
- Copy support
- Collapse support (chevron, rotates 180 degrees)

**Line-number interactions**:

- **Single-click a line number**: toggles a soft yellow highlight on that gutter row and the matching code row. Multiple rows can be highlighted independently; click the same row again to clear it.
- **Double-click a line number**: copies the matching code line's text to the clipboard and briefly flashes the gutter row green (~500ms).
- The full row width is the hit target — you don't have to click the digits precisely.

### Avatar and Welcome Card

- `profile.avatar`: an image path under the site `source/` (e.g. `/images/avatar.png`) or an absolute URL; leave it empty to use the CSS-drawn default avatar.
- `profile.avatar_shape`: `square` (default) renders the avatar with a 10px subtle rounding; `circle` applies a circular mask.
- `welcome.image`: cover image for the welcome card; setting it switches the container to a 16:9 aspect ratio, flush with the card edge (`overflow: hidden` + 12px top corner radius). Leave empty to keep the default CSS mountain scene.

### Note Block Appearance

`note.style` ships four looks that mirror the equivalent NexT presets:

- **`flat`** (default): left accent strip + soft tinted background, rounded card.
- **`simple`**: left accent strip + 1px thin border, no background fill.
- **`modern`**: fully filled rounded box without the left accent strip, paired with a 1px inset border.
- **`disabled`**: strips all chrome but keeps the `<details>` foldable semantics; the body uses the site's regular prose styling.

`note.icons: true | false` controls whether the circular icon badge appears next to the body / title. With icons off, the body reclaims the icon column and aligns flush with the card padding.

### Custom Injection

`inject.head` / `inject.bottom` are arrays of HTML strings; each entry is emitted verbatim before `</head>` or `</body>`. You can inject:

- Custom CSS: `- <link rel="stylesheet" href="/css/custom.css">`
- Custom JS: `- <script src="/js/extra.js" defer></script>`
- Inline `<style>` / `<script>` blocks, third-party SDKs, or any other HTML fragment.

The contents are **not escaped** — they're spliced directly into the page, so only put trusted, self-authored values in there.

## Custom Tags (Hexo NexT Compatible)

### `{% note %}`

```
{% note success %}
  A success note
{% endnote %}

{% note warning Notice %}
  When a title is provided, the note renders as a foldable <details>.
{% endnote %}
```

Supported types: `default`, `primary`, `success`, `info`, `warning`, `danger`. Adding a title turns the note into a foldable disclosure (native `<details>`, no JS needed).

You can also use the VitePress-style container syntax, which is **fully equivalent** to the tag above:

```
::: success
A success note
:::

::: warning Notice
When a title is provided, the note renders as a foldable <details>.
:::
```

The `:::` rewrite happens at `before_post_render`, and any `:::` inside fenced (``` / ~~~) or 4-space-indented code is preserved verbatim. Both syntaxes can be mixed freely within a single post.

### `{% tabs %}`

```
{% tabs Tab, 1 %}
<!-- tab -->
**Tab 1**
<!-- endtab -->
<!-- tab Custom name -->
Content...
<!-- endtab -->
{% endtabs %}
```

- First argument: base name used when an individual tab does not provide one (`Tab 1`, `Tab 2`, ...).
- Second argument: 1-based default tab index. Use **`-1`** for collapsed mode: all tabs start closed, click to expand, and click again to collapse.

## Special Pages

Front-matter `type:` routes `source/<dir>/index.md` to a custom layout (the original `layout:` still works as a fallback):

```yaml
---
title: Links
type: links            # or: tags, categories
---
```

Recognized values: `links`, `tags`, `categories`. Anything else / missing value -> default page layout.

### Friends Page (`type: links`)

Data lives in `source/_data/links.yml`. Multiple groups are supported:

```yaml
- class_name: DEMO
  class_desc: Example links to common development and documentation sites, used to test friend-link card rendering.
  flink_style: demo
  link_list:
    - name: GitHub
      link: https://github.com/
      avatar: https://github.githubassets.com/favicons/favicon.svg
      descr: Code hosting and collaboration platform for developers.
      rss:  # optional, shows an RSS badge on the card
```

Cards include: avatar (first-letter fallback when missing) + name + description. RSS badges are always visible, and play a "signal-pulse" animation on hover (icon wiggle + outward ring). The markdown body below the front-matter renders normally and is separated with a dashed rule.

## Layout

| Layout         | File                           | Purpose                                          |
| -------------- | ------------------------------ | ------------------------------------------------ |
| Home           | `layout/index.ejs`             | Featured carousel + paginated post grid          |
| Post           | `layout/post.ejs`              | Two-column article + reactions + previous / next + related posts card |
| Page           | `layout/page.ejs`              | Default page; routes to a custom layout by `type:` |
| Friends        | `layout/link.ejs`              | Friends grid + optional markdown body            |
| Archive        | `layout/archive.ejs`           | Date-grouped post list + pagination              |
| Category index | `layout/categories.ejs`        | Tag-cloud-like compact grid                      |
| Category       | `layout/category.ejs`          | Posts under one category + pagination            |
| Tag index      | `layout/tags.ejs`              | Tag cloud                                        |
| Tag            | `layout/tag.ejs`               | Posts under one tag + pagination                 |

Shared partials in `layout/_partial/`:

- `head.ejs`: meta + stylesheet
- `header.ejs`: brand, navigation, search, theme toggle, drawer toggle (narrow screens only)
- `footer.ejs`: configurable footer with `{year}` / `{name}` / `{theme}` template tokens; `{theme}` renders as a link to the theme repo
- `sidebar-left.ejs` / `sidebar-right.ejs`: see the sidebar layout note below
- `recent-posts.ejs`: reusable "Recent Posts" card
- `post-card.ejs`: home / grid card with edge-bleed thumbnail
- `archive-list.ejs`: paginated archive / category / tag list
- `thumbnail.ejs`: real cover image and CSS-scene fallback
- `search.ejs`: popup dialog + inline JSON index
- `icons.ejs`: Lucide icon lookup

### Sidebar Layout Note

In the DOM, the visual **left** column is rendered by `sidebar-right.ejs` (profile, post page TOC, home categories / tags), while the visual **right** column comes from `sidebar-left.ejs` (home welcome card, recent posts). This order makes the more useful "left" panel become the hamburger-controlled drawer on narrow screens.

Post pages skip `sidebar-left` entirely and keep only one sidebar.

## Development

```
themes/flatpaper/
|-- _config.yml
|-- layout/
|   |-- _partial/                    # head, header, footer, sidebars, search, icons, etc.
|   `-- *.ejs                        # one file per top-level layout
|-- scripts/
|   |-- tags.js                      # Hexo extension: {% note %} + {% tabs %}
|   |-- note-container.js            # before_post_render: ::: container -> {% note %}
|   `-- _note-types.js               # shared note-type whitelist (tags.js / note-container.js)
`-- source/
    |-- css/
    |   |-- style.styl               # main entry: organizes partials by @import order
    |   `-- _partials/
    |       |-- var.styl             # CSS custom properties (tokens)
    |       |-- base.styl            # reset, html / body, page-grain
    |       |-- _layout/             # header, shell, tape, footer, responsive
    |       |-- _global/             # section-head, thumbnail, pager
    |       |-- _components/         # welcome, toc, featured, post-card, etc.
    |       |-- _page/               # article, archive-taxonomy
    |       `-- _mode/               # code-dark, code-sand, code-light
    `-- js/main.js                   # single bundle: theme toggle, search, anchors,
                                     #   TOC scrollspy (with bottom-lock), carousel,
                                     #   sidebar drawer, code block UI, tabs
```

## License

MIT
