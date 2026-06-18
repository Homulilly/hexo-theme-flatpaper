# Features

## Responsive Layout

FlatPaper uses:

- three columns on home/list pages
- two columns on post pages
- a mobile drawer sidebar on narrow screens

On mobile, the top navigation is reduced to:

- sidebar menu
- site title
- search
- dark-mode toggle

The brandmark link groups move into the sidebar below the author card, and accent color swatches are shown directly at the top of the drawer next to the close button.

Horizontal overflow from fixed full-screen layers is clipped at the root level to avoid mobile horizontal scrollbars.

## Cover Images

Post card and featured images are resolved in this order:

1. `cover`
2. `thumbnail`
3. `image`
4. `banner`
5. first inline `<img>` in the rendered content

If no image exists, FlatPaper renders a CSS illustration fallback.

Images use `object-fit: cover` and `object-position: 50% 50%`.

## Search

Search is opened by the header magnifier or `Ctrl+K` / `Cmd+K`.

The search index is built at generate time as a standalone `flatpaper-search.json` and fetched lazily the first time the panel opens — it is not inlined into pages. `search.limit` can cap the index to the latest N posts for large sites. Results highlight matched keywords with `<mark>`.

## Dark Mode and Accent Color

Dark mode is stored in `localStorage['flatpaper-mode']` and restored before paint to avoid flash.

Accent color is configured by `color` and can be changed by the user:

- desktop: header palette menu
- mobile: sidebar swatches

The chosen accent is stored in the `flatpaper-accent` cookie.

## Featured Carousel

`featured` pins up to four posts on the first home page.

Behavior:

- one post: static featured card
- two to four posts: carousel
- arrow buttons
- dot indicators
- keyboard left/right support
- autoplay with hover/focus pause

## Article Experience

Post pages include:

- sticky TOC
- cover-aware article header
- previous/next navigation
- related posts card
- comment jump button
- share button
- optional custom reaction buttons

The TOC sticks across the article range and avoids taking over home/list sidebars.

## Code Blocks

Code blocks include:

- language badge auto-detected from highlight classes
- copy button
- collapse button
- line highlight on single-clicking the gutter row
- line copy on double-clicking the gutter row
- `dark`, `sand`, `light`, and `simple` code themes

Plain text aliases (`plain`, `plaintext`, `text`, `txt`, `none`, `raw`) hide the language badge.

## Friends Page

`type: links` reads from `source/_data/links.yml`.

Cards support:

- groups
- avatar images
- first-letter fallback avatars
- descriptions
- optional RSS badges
- hover signal-pulse animation
- markdown body below the links data

## Multi-language UI

FlatPaper's built-in interface text is localized and selected from the Hexo site `language` setting, supporting `zh-CN` and `en` with a `zh-CN` fallback.

- Template strings are resolved through a theme i18n helper backed by `languages/zh-CN.yml` and `languages/en.yml`.
- Runtime strings used by `source/js/main.js` (search states, code controls, anchor labels) are injected into the page as `window.FLATPAPER_I18N` rather than hardcoded in the script.
- Only theme UI strings are translated; post content and site data are untouched.

See [Configuration → Language](configuration.md#language) for selection rules.

## Integrations

FlatPaper includes optional wiring for:

- Twikoo
- Artalk
- Fancybox
- Umami
- Google AdSense
- RSS profile link
- custom HTML injection
