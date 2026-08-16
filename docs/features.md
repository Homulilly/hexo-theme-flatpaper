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

## Home Opening Hero

`home_hero` adds an optional first-screen introduction on the first home page.

It can show:

- site title or a custom hero title
- profile role, bio, avatar, social links, and RSS link
- a built-in scrapbook paper background
- one fixed image, or a random image from an array
- a configurable image overlay
- a bouncing arrow that scrolls into the home content
- draggable scrapbook stickers
- up to five custom image stickers, with optional visit confirmation links

The hero is disabled by default, so existing sites keep the normal home layout until `home_hero.enable` is set to `true`.

See [Configuration → Home Opening Hero](configuration.md#home-opening-hero) for the available options.

## Cover Images

Post card and featured images are resolved in this order:

1. `cover`
2. `thumbnail`
3. `image`
4. `banner`
5. first inline `<img>` in the rendered content

If no image exists, FlatPaper renders a CSS illustration fallback.

Images use `object-fit: cover` and `object-position: 50% 50%`.

When `post_top_img.mode` is `top_img` or `fallback`, the resolved top image appears at the top of article pages. The title overlays the image, and the image fades back into the paper below. `top_img` front-matter has priority, and `top_img: false` disables it for that post.

Standalone pages and special `type:` pages also support a page-local `top_img`. Page top images do not use `post_top_img` or any fallback fields; an image appears only when that page front matter sets `top_img`.

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

## Reward List

Drop the structured HTML below into the body of an about page (or any standalone page) to get a scrapbook-style donation roll. Each donor becomes a paper slip with washi tape, a slight tilt, and an optional circular avatar in the top-right corner.

```html
<div class="reward-list">
  <div class="reward-list__item reward-list__item--p1">
    <img class="reward-list__avatar no-zoom" src="/images/donor.jpg" alt="Nickname" loading="lazy" referrerpolicy="no-referrer">
    <span class="reward-list__name">Nickname</span>
    <div class="reward-list__bottom">
      <span class="reward-list__amount">¥100</span>
      <time class="reward-list__date">2026-01-01</time>
    </div>
  </div>
</div>
<p class="reward-list__total">Total <strong>1</strong> · Latest update: <time datetime="2026-01-01">2026-01-01</time></p>
```

Features:

- **Amount tier colors**: JS parses the amount text and colors the badge automatically — no style classes needed. ≥100 red, ≥50 green, ≥20 amber, ≥10 blue, ≥5 violet, ≥1 olive (RMB banknote colors). An explicit `reward-list__amount--100`-style class in the markup wins.
- **Rotating paper colors**: `--p1` through `--p5` (red/blue/green/orange/violet), with the tape color following the slip.
- **Avatar**: a `no-zoom` circular avatar is pasted in the top-right corner; omit the `img` and use `.reward-list__avatar--text` for a first-letter fallback.
- **Responsive**: multi-column auto layout on desktop, single column on narrow screens; supports dark mode and `prefers-reduced-motion`.

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
- Google Analytics 4
- Google AdSense
- RSS profile link
- custom HTML injection
