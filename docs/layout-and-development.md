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
- `footer.ejs`: footer copyright, theme credit, and structured links
- `home-hero.ejs`: optional first-screen home hero, profile links, image stickers, and scroll affordance
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
|-- _config.en.yml
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

## Hand-drawn Design Language

The journal look is driven by a shared set of variables in `source/css/_partials/var.styl`. When adding or changing a component, reuse them instead of writing another tape strip, shadow or pen stroke.

| Element | Variable / recipe | Use |
| --- | --- | --- |
| Paper | `--paper`, `--radius-paper`, `filter: url(#paper-edge)` | Card body: a pseudo-element paints the paper colour and the `#paper-edge` filter tears its edge |
| Elevation | `--sheet-shadow` → `--soft-shadow` / `--small-shadow` → `--shadow` | Lying on the desk → picked up → lifted on hover; all three are tinted by `--paper-shadow-rgb` |
| Hand-drawn corners | `--radius-handdrawn`, `--radius-handdrawn-wide`, `--radius-sketch` | The first two are for buttons, chips, inputs and index cards; `--radius-sketch` is for large boxes such as tab sets |
| Tape | `--tape-color`, `--tape-w` | The recipe lives in `_layout/tape.styl`; a component only sets position, tilt and colour |
| Highlighter | `--highlighter` | Yellow highlighter under titles (featured title, welcome card) |
| Link highlighter | `--marker`, `--marker-rest`, `.marker-swipe` | Follows the accent colour: `--marker` is the left-to-right stroke every text link gets on hover, `--marker-rest` the fainter stroke that prose and hero links carry all the time; the recipe lives in `_global/marker-swipe.styl` |
| Pen strokes | `--mask-squiggle`, `--mask-wave`, `--mask-arrow`, `--mask-check` | Used as a `mask` and coloured with `background-color`, so they follow the accent and dark mode |
| Marker | `.dot`, `.green-dot` | A tilted hand-drawn square used as the marker in front of an entry: categories, the welcome card, the search title, the accent swatches and the current TOC entry all use this one shape |
| Labels | `--label-fill`, `--label-text` | Solid labels such as `.label-pill` |
| Motion | `--ease-paper`, `--ease-spring` | `--ease-paper` for paper settling, `--ease-spring` for sticker-like bounce |
| Focus | global `:focus-visible` | One dashed pencil ring, defined in `base.styl`; components need no focus styles of their own |

Conventions:

- Dashed lines (`--dash` / `--line`) mean folds and separators; solid lines are kept for borders that need weight (the rule under a table header, the code frame).
- Text links share one hover: the highlighter swipe. Add `.marker-swipe` to an inline element around the link text, or list the selector in `_global/marker-swipe.styl`. Links in article prose, the home hero's quick links and the `stackalbumnav` titles carry the highlighter permanently and get a second, deeper pass on hover; links elsewhere are plain at rest.
- Forward / back text entries (the welcome card's call to action, read more, the list pager) are not boxed; they use `_global/arrow-link.styl`: text plus a hand-drawn arrow, with the highlighter swipe on the text and the arrow sliding the way it points on hover. The "view all" / "view more" links in card headers (sidebar categories, tags, related posts) are the small size of the same recipe.
- Boxed text buttons use the paper button in `_global/paper-button.styl` (currently the 404 actions); add a new button's selector to that file.
- Keep tilts around ±1° and alternate the direction of neighbours so a row never leans one way.
- Decoration stays on container edges (tape, torn edges, pen underlines); the reading area stays clean.

## JavaScript Responsibilities

`source/js/main.js` handles:

- dark-mode toggle
- accent picker and mobile sidebar swatches
- search dialog
- heading anchors
- TOC scrollspy and bottom lock
- home hero random image, sticker CTA, sticker shuffle, sticker drag, and visit confirmation
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
- Translation keys are grouped by page/component (`common`, `pagination`, `index`, `post`, `search`, `code`, `head`, `navigation`, `colors`, `home_hero`, ...). Keep `zh-CN.yml` and `en.yml` in sync; the helper flattens nested keys to dotted paths (e.g. `search.empty`).

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
