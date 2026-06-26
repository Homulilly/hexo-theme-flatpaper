'use strict';

/* eslint-disable */
/**
 * FlatPaper custom Hexo tags
 *   {% note <type> [title] %} body {% endnote %}
 *   {% tabs <title>, [defaultIndex] %} <!-- tab [name] --> body <!-- endtab --> {% endtabs %}
 */

const NOTE_TYPES = require('./_note-types');

// Monotonic counter for tab group IDs. Avoids the random-collision window
// from Math.random().toString(36).slice(2, 9) when many tabs render per page.
let tabsCounter = 0;

// Inline escape: lighter than depending on hexo-util.escapeHTML, and we
// only need to neutralize the five characters that break HTML structure.
function escapeHTML(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(value, kind) {
  const fallback = kind === 'image' ? '' : '#';
  const url = String(value == null ? '' : value).trim();
  // Reject backslashes anywhere, not just leading: WHATWG URL treats \ as /
  // in special schemes, so e.g. "/\evil.com" resolves cross-origin while
  // still looking like a relative path. Legit URLs never need a raw backslash.
  if (!url || /[\u0000-\u001f\u007f\\]/.test(url)) return fallback;

  if (url.indexOf('//') === 0) return url;

  const scheme = url.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme) {
    const protocol = scheme[1].toLowerCase();
    if (protocol === 'http' || protocol === 'https') return url;
    if (kind !== 'image' && protocol === 'mailto') return url;
    return fallback;
  }

  return url;
}

hexo.extend.helper.register('flatpaper_safe_url', safeUrl);

function resolvePostCover(post) {
  if (!post) return '';
  let cover = post.cover || post.thumbnail || post.image || post.banner || '';
  if (!cover && post.content) {
    const m = String(post.content).match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (m) cover = m[1];
  }
  return cover || '';
}

hexo.extend.helper.register('flatpaper_cover_info', function (post, fallback) {
  const rawCover = resolvePostCover(post);
  let src = rawCover ? safeUrl(this.url_for(rawCover), 'image') : '';
  let isFallback = false;

  if (!src && fallback) {
    src = safeUrl(this.url_for(fallback), 'image');
    isFallback = !!src;
  }

  return {
    src,
    raw: rawCover,
    isFallback
  };
});

hexo.extend.helper.register('flatpaper_post_top_img_info', function (post, mode) {
  if (!post) return { src: '', raw: '', source: '', disabled: false };

  const normalizedMode = String(mode || '').toLowerCase();
  if (normalizedMode !== 'top_img' && normalizedMode !== 'fallback') {
    return { src: '', raw: '', source: '', disabled: false };
  }

  const hasTopImg = Object.prototype.hasOwnProperty.call(post, 'top_img');
  const topImg = post.top_img;
  if (hasTopImg && (topImg === false || String(topImg).toLowerCase() === 'false')) {
    return { src: '', raw: '', source: 'top_img', disabled: true };
  }

  if (typeof topImg === 'string' && topImg.trim()) {
    const src = safeUrl(this.url_for(topImg), 'image');
    // fallback 模式下，若 top_img 被 safeUrl 拒绝（src 为空），继续向下回退到 cover；
    // top_img 模式没有回退，直接返回（src 为空即不渲染）。
    if (src || normalizedMode !== 'fallback') {
      return { src, raw: topImg, source: 'top_img', disabled: false };
    }
  }

  if (normalizedMode !== 'fallback') return { src: '', raw: '', source: '', disabled: false };

  const rawCover = resolvePostCover(post);
  return {
    src: rawCover ? safeUrl(this.url_for(rawCover), 'image') : '',
    raw: rawCover,
    source: rawCover ? 'cover' : '',
    disabled: false
  };
});

// Posts sorted newest-first, cached for the current generate pass.
// Several partials (random-posts, sidebar-right, post.ejs related list,
// index.ejs featured resolver) all call site.posts.sort('date', -1).toArray()
// independently — on big sites that adds up. The cache is dropped at the
// start of every generate pass (below), so watch/server rebuilds pick up ANY
// post change — including edits to existing posts, which a count-based check
// would miss.
let _sortedPostsCache = null;
hexo.extend.helper.register('flatpaper_sorted_posts', function () {
  const posts = this.site.posts;
  if (!posts) return [];
  if (_sortedPostsCache) return _sortedPostsCache;
  _sortedPostsCache = posts.sort('date', -1).toArray();
  return _sortedPostsCache;
});

hexo.extend.filter.register('before_generate', function () {
  _sortedPostsCache = null;
});

// ---------------- NOTE ----------------
hexo.extend.tag.register('note', function (args, content) {
    let type = 'default';
    let title = '';
    if (args.length) {
      const first = String(args[0] || '').toLowerCase();
      if (NOTE_TYPES.indexOf(first) > -1) {
        type = first;
        args.shift();
      }
      title = args.join(' ').trim();
    }
    const body = hexo.render.renderSync({ text: content, engine: 'markdown' }).trim();
    const cls = 'flatpaper-note flatpaper-note--' + type;
    if (title) {
      return (
        '<details class="' + cls + '">' +
        '<summary class="flatpaper-note__title">' +
        '<span class="flatpaper-note__icon" aria-hidden="true"></span>' +
        '<span class="flatpaper-note__label">' + escapeHTML(title) + '</span>' +
        '<span class="flatpaper-note__chevron" aria-hidden="true"></span>' +
        '</summary>' +
        '<div class="flatpaper-note__body">' + body + '</div>' +
        '</details>'
      );
    }
    return (
      '<div class="' + cls + '">' +
      '<span class="flatpaper-note__icon" aria-hidden="true"></span>' +
      '<div class="flatpaper-note__body">' + body + '</div>' +
      '</div>'
    );
  }, true);

// ---------------- TABS ----------------
hexo.extend.tag.register('tabs', function (args, content) {
    // Hexo splits tag args on whitespace; we re-join and apply our own
    // convention: "<title>[, <defaultIndex>]". Only a numeric segment after
    // the LAST comma is treated as the index, so titles may contain commas.
    const raw = args.join(' ');
    let baseTitle = raw;
    let defaultIndex = NaN;
    const lastComma = raw.lastIndexOf(',');
    if (lastComma > -1) {
      const tail = raw.slice(lastComma + 1).trim();
      if (/^-?\d+$/.test(tail)) {
        defaultIndex = parseInt(tail, 10);
        baseTitle = raw.slice(0, lastComma);
      }
    }
    baseTitle = baseTitle.trim() || 'Tabs';
    if (isNaN(defaultIndex)) defaultIndex = 1;

    // Split body into tabs. Hexo doesn't pre-parse <!-- tab --> markers, so we
    // do. The name is non-greedy up-to "-->" (not [^>]*) so names containing
    // ">" — e.g. "C++ > Rust" — don't silently fail to match.
    const tabPattern = /<!--\s*tab(?:[ \t]+(.*?))?\s*-->([\s\S]*?)<!--\s*endtab\s*-->/g;
    const tabs = [];
    let m;
    while ((m = tabPattern.exec(content))) {
      tabs.push({
        name: (m[1] || '').trim(),
        body: m[2]
      });
    }

    // Strip out the parsed tab blocks; anything left is the "intro" rendered above panels.
    const introRaw = content.replace(tabPattern, '').trim();
    const intro = introRaw
      ? hexo.render.renderSync({ text: introRaw, engine: 'markdown' }).trim()
      : '';

    const collapsedMode = defaultIndex === -1; // every tab starts hidden, click to open
    const activeIdx = collapsedMode ? -1 : Math.max(0, Math.min(tabs.length - 1, defaultIndex - 1));

    const uid = 'tabs-' + (++tabsCounter);
    const navItems = tabs
      .map(function (t, i) {
        const label = t.name || (baseTitle + ' ' + (i + 1));
        const active = i === activeIdx ? ' is-active' : '';
        return (
          '<button type="button" role="tab" id="' + uid + '-tab-' + i + '" ' +
          'aria-controls="' + uid + '-panel-' + i + '" ' +
          'aria-selected="' + (i === activeIdx ? 'true' : 'false') + '" ' +
          'class="flatpaper-tabs__nav-item' + active + '" data-index="' + i + '">' + escapeHTML(label) + '</button>'
        );
      })
      .join('');

    const panels = tabs
      .map(function (t, i) {
        const active = i === activeIdx ? ' is-active' : '';
        const body = hexo.render.renderSync({ text: t.body.trim(), engine: 'markdown' }).trim();
        return (
          '<section role="tabpanel" id="' + uid + '-panel-' + i + '" ' +
          'aria-labelledby="' + uid + '-tab-' + i + '" ' +
          'class="flatpaper-tabs__panel' + active + '" data-index="' + i + '"' +
          (i === activeIdx ? '' : ' hidden') + '>' + body + '</section>'
        );
      })
      .join('');

    return (
      '<div class="flatpaper-tabs' + (collapsedMode ? ' is-collapsible' : '') + '">' +
      (intro ? '<div class="flatpaper-tabs__intro">' + intro + '</div>' : '') +
      '<div class="flatpaper-tabs__nav" role="tablist">' + navItems + '</div>' +
      '<div class="flatpaper-tabs__panels">' + panels + '</div>' +
      '</div>'
    );
  }, true);
