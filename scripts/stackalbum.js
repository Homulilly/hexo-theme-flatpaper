'use strict';

/* eslint-disable */
/**
 * FlatPaper stacked-album tags
 *   {% stackalbum [width,height] %} ![alt](url ["h"|"v"]) … {% endstackalbum %}
 *   {% stackalbumnav <data.path.to.list> %}
 *
 * A deck of photos stacked like playing cards: clicking the top one lifts it
 * and slides it to the bottom of the pile. `stackalbumnav` is the small
 * variant for an about page — a deck plus a title list, where hovering a title
 * flips its cover to the top.
 *
 * Markup only. The stylesheet lives in
 * source/css/_partials/_components/stack-album.styl and the behaviour in
 * source/js/main.js, the same as every other tag component in this theme
 * (note, tabs, reward list). Nothing is injected per page, so a site that
 * never uses these tags pays nothing beyond the bytes already in the cached
 * style.css / js/main.js.
 *
 * Without JS the cards stay in the document flow and every photo is visible.
 */

const safeUrl = require('./_safe-url');

const DEFAULT_SIZE = 480;
const NAV_SIZE = 160;

function escapeHTML(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// The i18n helper is reused rather than reimplemented: it already resolves the
// language order and falls back to zh-CN. Tags run with their own `this`, so it
// is called with the context the helper expects.
function t(key, fallback) {
  const helper = hexo.extend.helper.get('flatpaper_i18n');
  if (typeof helper !== 'function') return fallback;
  const value = helper.call({ config: hexo.config }, key);
  return value && value !== key ? value : fallback;
}

function positiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return isFinite(n) && n > 0 ? n : fallback;
}

// dir: h = landscape card, v = portrait card, '' = decided client-side from the
// image's own aspect ratio.
// `no-zoom` keeps main.js's Fancybox pass from wrapping the image in an anchor:
// a click here flips the deck, it does not open a lightbox. Opting out up front
// is sturdier than stripping the anchor's attributes again afterwards.
// referrerpolicy=no-referrer: hotlink-protected hosts (Bilibili's i0.hdslb.com
// among them) reject requests that carry a Referer.
function card(base, url, alt, dir) {
  const src = safeUrl(url, 'image');
  if (!src) return '';
  return '<div class="' + base + (dir ? ' ' + base + '--' + dir : '') + '" data-orient="' + dir + '">' +
    '<img class="fp-stack__img no-zoom" src="' + escapeHTML(src) + '" alt="' + escapeHTML(alt) + '"' +
    ' loading="lazy" decoding="async" draggable="false" referrerpolicy="no-referrer"></div>';
}

hexo.extend.tag.register('stackalbum', function (args, content) {
  const raw = args.join(' ').replace(/\s+/g, '');
  const parts = raw ? raw.split(',') : [];
  const width = positiveInt(parts[0], DEFAULT_SIZE);
  const height = positiveInt(parts[1], DEFAULT_SIZE);

  // ![alt](url "h") — the markdown title carries the optional orientation.
  const images = [];
  const pattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
  let m;
  while ((m = pattern.exec(content)) !== null) {
    const dir = /^[hv]$/i.test(m[3] || '') ? m[3].toLowerCase() : '';
    images.push({ alt: m[1] || '', url: m[2], dir });
  }

  const cards = images
    .map(function (img) { return card('fp-stack__card', img.url, img.alt, img.dir); })
    .filter(Boolean)
    .join('');
  if (!cards) return '';

  return '<div class="fp-stack" style="--fp-stack-w: ' + width + 'px; --fp-stack-h: ' + height + 'px"' +
    ' role="group" aria-label="' + escapeHTML(t('stack_album.label', '堆叠相册')) + '">' + cards + '</div>';
}, { ends: true });

// Resolve a dotted path into the site's _data: the first segment names the
// file (source/_data/<name>.yml), the rest walks into it. The theme deliberately
// does not know or assume any particular file or key name — it owns no page type
// that would define such a schema, unlike links.yml, which layout/link.ejs reads
// because the theme owns the `links` page type.
// Hexo 6+ keeps _data/*.yml in the Data model rather than on hexo.site.data.
function resolveDataList(path) {
  const parts = String(path == null ? '' : path).split('.')
    .map(function (part) { return part.trim(); })
    .filter(Boolean);
  if (!parts.length) return null;
  const doc = hexo.model && hexo.model('Data') ? hexo.model('Data').findById(parts[0]) : null;
  let node = doc && doc.data;
  // A YAML file whose top level is a single-entry list reads back wrapped.
  if (Array.isArray(node) && node.length === 1 && parts.length > 1) node = node[0];
  for (let i = 1; i < parts.length; i++) {
    if (!node || typeof node !== 'object') return null;
    node = node[parts[i]];
  }
  return Array.isArray(node) ? node : null;
}

// Field aliases follow the rest of the theme: footer links accept
// name/text/title, hero images accept image/src/url/path.
function entryField(item, keys) {
  for (let i = 0; i < keys.length; i++) {
    const value = item && item[keys[i]];
    if (value != null && String(value).trim() !== '') return value;
  }
  return '';
}

hexo.extend.tag.register('stackalbumnav', function (args) {
  // The data path is required: there is no sensible default the theme could
  // pick without inventing a schema it does not own.
  const list = resolveDataList(args.join(' '));
  if (!list || !list.length) return '';

  // Cards and list items are built from the same filtered set so a rejected
  // cover can never shift the index a title points at.
  const entries = list
    .map(function (item) {
      const name = String(entryField(item, ['name', 'title'])).trim();
      const html = card('fp-stack__card', entryField(item, ['cover', 'image', 'src']), name, '');
      return html ? { name: name, href: entryField(item, ['href', 'link', 'url']), html: html } : null;
    })
    .filter(Boolean);
  if (!entries.length) return '';

  const cards = entries.map(function (entry) { return entry.html; }).join('');
  const items = entries
    .map(function (entry, index) {
      // The href comes from a site data file, so it goes through the same
      // validation as every other link the theme renders.
      const href = safeUrl(entry.href, 'href');
      return '<li><a href="' + escapeHTML(href) + '" target="_blank" rel="noopener"' +
        ' data-fp-stack-index="' + index + '">' + escapeHTML(entry.name) + '</a></li>';
    })
    .join('');

  return '<div class="fp-stacknav">' +
    '<div class="fp-stack fp-stack--nav" style="--fp-stack-w: ' + NAV_SIZE + 'px; --fp-stack-h: ' + NAV_SIZE + 'px"' +
    ' role="group" aria-label="' + escapeHTML(t('stack_album.label', '堆叠相册')) + '">' + cards + '</div>' +
    '<ul class="fp-stacknav__list">' + items + '</ul>' +
    '</div>';
});
