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
- a paper sticker button that scrolls into the home content, with nine color + sticker presets that follow dark mode
- draggable scrapbook stickers
- up to five custom image stickers, with optional visit confirmation links

The hero is disabled by default, so existing sites keep the normal home layout until `home_hero.enable` is set to `true`.

See [Configuration → Home Opening Hero](configuration.md#home-opening-hero) for the available options.

### Progressive Hero Image

`home_hero.image_progressive` turns on Medium-style progressive loading and a scroll exit for the hero backdrop:

```yaml
home_hero:
  enable: true
  image: /images/hero.jpg
  image_progressive: true
  image_placeholder: /images/hero-lqip.jpg   # optional
```

- A blurred small image (`image_placeholder`) paints first and the photo layer fades in on top of it, so the backdrop never shows through mid-handoff; without a placeholder no blur layer is rendered and the photo fades in over the paper colour
- Entry: once the photo has loaded, the photo layer eases from `scale(1.5)` back to `1` while fading up from transparent, over 2.2s. The load is the trigger rather than time since parse, so a cached photo starts straight away and a slow one does not play its entry before it arrives
- The random pick for multi-image rotation and the loading sequence above both run in a small inline script inside the hero, before first paint and independent of `main.js`: the first image is never requested only to be swapped out, and a slow bundle cannot break the handoff
- Scroll exit: the photo is pinned to the viewport instead of scrolling away, zooms in place by `+0.3` and goes progressively out of focus with a Gaussian blur (up to `12px`), while the hero's bottom edge wipes up over it. The photo stays opaque throughout, so the paper colour never shows through. Only that layer is affected — it sits below the stickers and the profile card, so the content is untouched
- **Progressive loading is how `image` loads, not a second image source**: the photo layer is server-rendered, always present, and consumes the same `--hero-bg-image`, so `image_overlay`, `mobile_image` and multi-image rotation all keep working
- It fails open: with no JS the hero simply shows `image` itself (the blur layer ships `hidden` and only the inline script unhides it); a 404 drops the blur layer and leaves the paper colour; a request still pending after 8s releases the photo layer, and the photo paints over the blur whenever it does arrive
- Scrolling drives only the photo layer's `transform` and `filter`. That layer is fixed and composited on its own, so a changing blur radius is a GPU pass rather than a repaint
- Under `prefers-reduced-motion` no scroll listener is registered and the photo is not pinned; it scrolls away with the hero
- Do not point `image_placeholder` at a random-image API, or the blur will preview a different photo

### Reveal on Scroll

Home modules — the featured carousel, the section heading, post cards, and the sidebar profile / categories / tag cards — fade up one by one as they enter the viewport:

- Elements carry the `reveal` class; `main.js` adds `is-revealed` through an IntersectionObserver, once per element
- Post cards stagger by index (60ms steps, capped at 300ms) via the `--reveal-delay` custom property, so the delay never leaks into the card's own transitions
- The entry animation leaves no `transform` declaration behind, so the card `:hover` lift keeps working
- Hiding is gated on `<html class="reveal-ready">`, added by the head inline script before first paint. Nothing is hidden without JS, without IntersectionObserver support, or when `main.js` fails to run (a 2s fallback removes the class in that case)
- Under `prefers-reduced-motion` content appears immediately with no animation
- Reuse it on custom pages by adding the `reveal` class, plus an inline `--reveal-delay` when you want a stagger

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

List your supporters with the `rewardlist` tag in the body of an about page (or any standalone page) to get a scrapbook-style donation roll. Each donor becomes a paper slip with washi tape, a slight tilt, and a circular avatar in the top-right corner.

One donor per line, fields separated by `|` in the order `name | amount | date | avatar`. Only the name is required, and a field in the middle can be left empty (`Name || 2026-01-01`):

```markdown
{% rewardlist %}
Homura | ¥100 | 2026-08-14
Madoka | ¥50 | 2026-08-09 | /images/madoka.jpg
Mami
{% endrewardlist %}
```

A longer list can live in a site data file and be read with `rewardlistfrom`. The argument is a data path: the first segment is the file name under `source/_data/`, the rest are keys inside it.

```yaml
# source/_data/rewards.yml
list:
  - name: Homura
    amount: ¥100
    date: 2026-08-14
  - name: Madoka
    amount: ¥50
    date: 2026-08-09
    avatar: /images/madoka.jpg
```

```markdown
{% rewardlistfrom rewards.list %}
```

Both tags print a summary line under the list (the head count and the most recent date). Add `nototal` after the tag name or the data path to drop it, e.g. `{% rewardlist nototal %}` or `{% rewardlistfrom rewards.list nototal %}`.

The tags output exactly the structure below, so hand-written HTML keeps working:

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
- **Avatar**: a circular avatar is pasted in the top-right corner; when a tag entry has no avatar, the first character of the name is shown instead. In hand-written HTML use an `img` with `no-zoom`, or `.reward-list__avatar--text`.
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
