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
  if (!url || /[\u0000-\u001f\u007f]/.test(url) || url.charAt(0) === '\\') return fallback;

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

// Posts sorted newest-first, cached for the current generate pass.
// Several partials (random-posts, sidebar-right, post.ejs related list,
// index.ejs featured resolver) all call site.posts.sort('date', -1).toArray()
// independently — on big sites that adds up. Invalidate when post count
// changes so a `hexo generate --watch` rebuild after adding/removing posts
// still picks up the new set.
let _sortedPostsCache = null;
let _sortedPostsLen = -1;
hexo.extend.helper.register('flatpaper_sorted_posts', function () {
  const posts = this.site.posts;
  if (!posts) return [];
  const len = posts.length;
  if (_sortedPostsCache && _sortedPostsLen === len) return _sortedPostsCache;
  _sortedPostsCache = posts.sort('date', -1).toArray();
  _sortedPostsLen = len;
  return _sortedPostsCache;
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
    const cls = 'flatpaper-note flatpaper-note--' + type + (title ? ' is-collapsible' : '');
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
    // args: "[title]", "[defaultIndex]" (after Nunjucks splits on commas)
    // Hexo passes args as one space-joined string array
    const raw = args.join(' ');
    const parts = raw.split(',').map(function (s) { return s.trim(); });
    const baseTitle = parts[0] || 'Tabs';
    let defaultIndex = parseInt(parts[1], 10);
    if (isNaN(defaultIndex)) defaultIndex = 1;

    // Split body into tabs. Hexo doesn't pre-parse <!-- tab --> markers, so we do.
    const tabPattern = /<!--\s*tab(?:\s+([^>]*?))?\s*-->([\s\S]*?)<!--\s*endtab\s*-->/g;
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
      '<div class="flatpaper-tabs' + (collapsedMode ? ' is-collapsible' : '') + '" data-default="' + defaultIndex + '">' +
      (intro ? '<div class="flatpaper-tabs__intro">' + intro + '</div>' : '') +
      '<div class="flatpaper-tabs__nav" role="tablist">' + navItems + '</div>' +
      '<div class="flatpaper-tabs__panels">' + panels + '</div>' +
      '</div>'
    );
  }, true);
