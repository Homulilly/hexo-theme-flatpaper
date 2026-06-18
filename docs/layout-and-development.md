# Layout and Development

## Layout Files

| Layout | File | Purpose |
| --- | --- | --- |
| Home | `layout/index.ejs` | Featured carousel and paginated post grid |
| Post | `layout/post.ejs` | Article, reactions, previous/next, related posts |
| Page | `layout/page.ejs` | Default page and `type:` router |
| Friends | `layout/link.ejs` | Friend links grid |
| Archive | `layout/archive.ejs` | Date-grouped post list |
| Category index | `layout/categories.ejs` | Category cloud/grid |
| Category | `layout/category.ejs` | Posts under one category |
| Tag index | `layout/tags.ejs` | Tag cloud |
| Tag | `layout/tag.ejs` | Posts under one tag |

## Shared Partials

- `head.ejs`: meta and stylesheet
- `header.ejs`: brand, desktop navigation, search, accent picker, theme toggle, mobile drawer toggle
- `footer.ejs`: footer template tokens
- `sidebar-right.ejs`: visual-left sidebar and mobile drawer
- `sidebar-left.ejs`: visual-right sidebar on home/list pages
- `random-posts.ejs`: random posts card
- `post-card.ejs`: home/grid card
- `archive-list.ejs`: paginated archive/category/tag list
- `thumbnail.ejs`: cover image and CSS fallback
- `search.ejs`: popup search dialog and JSON index
- `icons.ejs`: icon lookup

## Sidebar Layout Note

In the DOM, the visual left column is rendered by `sidebar-right.ejs`. This sidebar contains the profile card, post TOC, categories, tags, brand links, and mobile drawer tools.

The visual right column is rendered by `sidebar-left.ejs`, which contains the welcome card and random posts on home/list pages.

This order lets the more useful sidebar become the hamburger-controlled drawer on narrow screens.

Post pages skip `sidebar-left` and keep one sidebar.

## Source Structure

```text
themes/flatpaper/
|-- _config.yml
|-- _config.en.yaml
|-- docs/
|-- languages/
|   |-- zh-CN.yml
|   `-- en.yml
|-- layout/
|   |-- _partial/
|   `-- *.ejs
|-- scripts/
|   |-- i18n.js
|   |-- menu-helpers.js
|   |-- search-index.js
|   |-- tags.js
|   |-- note-container.js
|   `-- _note-types.js
`-- source/
    |-- css/
    |   |-- style.styl
    |   `-- _partials/
    |       |-- var.styl
    |       |-- base.styl
    |       |-- _layout/
    |       |-- _global/
    |       |-- _components/
    |       |-- _page/
    |       `-- _mode/
    `-- js/
        `-- main.js
```

## JavaScript Responsibilities

`source/js/main.js` handles:

- dark-mode toggle
- accent picker and mobile sidebar swatches
- search dialog
- heading anchors
- TOC scrollspy and bottom lock
- featured carousel
- mobile sidebar drawer
- desktop and drawer submenus
- code block copy/collapse/line interactions
- tabs interaction
- reaction popovers
- comment jump/share button
- Fancybox content wrapping
- localized runtime strings read from `window.FLATPAPER_I18N`

## Internationalization

Built-in interface text is localized through `scripts/i18n.js`, which registers EJS helpers and reads translation tables from `languages/zh-CN.yml` and `languages/en.yml`.

- `flatpaper_i18n('key.path', ...args)` returns a translated string, with `%s` / `%d` substitution. Falls back to `zh-CN`, then to the key itself.
- `flatpaper_i18n_language()` returns the resolved language (`zh-CN` or `en`).
- `flatpaper_i18n_json()` serializes the flattened table for the page; `layout/layout.ejs` injects it as `window.FLATPAPER_I18N` so `main.js` can resolve the same keys at runtime via its `t()` helper.
- Translation keys are grouped by page/component (`common`, `pagination`, `index`, `post`, `search`, `code`, `head`, `navigation`, `colors`, ...). Keep `zh-CN.yml` and `en.yml` in sync; the helper flattens nested keys to dotted paths (e.g. `search.empty`).

Code comments, the slug-cleaning regex, and Chinese documentation/config samples are intentionally not extracted.

## Build Check

From a Hexo site using the theme:

```bash
hexo generate --config _config.yml,_config.flatpaper.yml
```

In this demo workspace:

```bash
pnpm build -- --config _config.yml,_config.flatpaper.yml
```
