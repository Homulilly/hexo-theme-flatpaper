'use strict';

/* eslint-disable */
/**
 * FlatPaper reward list tags — the donor wall without hand-written HTML.
 *
 *   {% rewardlist %}
 *   Name | ¥100 | 2026-08-14
 *   Name | ¥50  | 2026-08-09 | /images/avatar.jpg
 *   {% endrewardlist %}
 *
 *   {% rewardlistfrom <data.path.to.list> %}
 *
 * One donor per line: name | amount | date | avatar. Only the name is
 * required; a field can be left empty to skip it (`Name || 2026-08-14`).
 * `rewardlistfrom` reads the same four fields from a list in source/_data.
 * Add `nototal` after the tag name / data path to drop the summary line.
 *
 * Markup only, and the same markup the stylesheet has always styled
 * (source/css/_partials/_components/reward-list.styl), so lists written by
 * hand keep working. The amount badge is coloured by main.js.
 */

const safeUrl = require('./_safe-url');
const resolveDataList = require('./_data-list');

const PAPERS = 5; // .reward-list__item--p1 … --p5

function escapeHTML(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Reuses the i18n helper (language order, zh-CN fallback), like stackalbum.js.
function t(key, fallback) {
  const helper = hexo.extend.helper.get('flatpaper_i18n');
  if (typeof helper !== 'function') return fallback;
  const args = Array.prototype.slice.call(arguments, 2);
  const value = helper.apply({ config: hexo.config }, [key].concat(args));
  return value && value !== key ? value : fallback;
}

function field(item, keys) {
  for (let i = 0; i < keys.length; i++) {
    const value = item && item[keys[i]];
    if (value != null && String(value).trim() !== '') return String(value).trim();
  }
  return '';
}

// YAML reads an unquoted 2026-08-14 as a Date; print it back as written.
function dateText(value) {
  if (value instanceof Date && !isNaN(value)) return value.toISOString().slice(0, 10);
  return String(value == null ? '' : value).trim();
}

function isoDate(text) {
  const m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(text);
  if (!m) return '';
  return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
}

function time(cls, text) {
  const iso = isoDate(text);
  return '<time' + (cls ? ' class="' + cls + '"' : '') + (iso ? ' datetime="' + iso + '"' : '') + '>' +
    escapeHTML(text) + '</time>';
}

function render(entries, showTotal) {
  const donors = entries.filter(function (entry) { return entry.name; });
  if (!donors.length) return '';

  let latest = '';
  let latestText = '';
  const items = donors.map(function (entry, index) {
    const iso = isoDate(entry.date);
    if (iso && iso > latest) { latest = iso; latestText = entry.date; }

    const src = entry.avatar ? safeUrl(entry.avatar, 'image') : '';
    const avatar = src
      ? '<img class="reward-list__avatar no-zoom" src="' + escapeHTML(src) + '" alt="' + escapeHTML(entry.name) + '"' +
        ' loading="lazy" referrerpolicy="no-referrer">'
      : '<span class="reward-list__avatar reward-list__avatar--text" aria-hidden="true">' +
        escapeHTML(Array.from(entry.name)[0]) + '</span>';

    const bottom = (entry.amount ? '<span class="reward-list__amount">' + escapeHTML(entry.amount) + '</span>' : '') +
      (entry.date ? time('reward-list__date', entry.date) : '');

    return '<div class="reward-list__item reward-list__item--p' + (index % PAPERS + 1) + '">' +
      avatar +
      '<span class="reward-list__name">' + escapeHTML(entry.name) + '</span>' +
      (bottom ? '<div class="reward-list__bottom">' + bottom + '</div>' : '') +
      '</div>';
  }).join('');

  let total = '';
  if (showTotal) {
    const count = '<strong>' + donors.length + '</strong>';
    total = '<p class="reward-list__total">' +
      t('reward_list.total', '共 ' + count + ' 人', count) +
      (latest ? ' · ' + t('reward_list.updated', '最新更新时间：') + time('', latestText) : '') +
      '</p>';
  }

  return '<div class="reward-list">' + items + '</div>' + total;
}

function wantsTotal(args) {
  return !args.some(function (arg) { return /^nototal$/i.test(arg); });
}

hexo.extend.tag.register('rewardlist', function (args, content) {
  const entries = String(content || '').split(/\r?\n/)
    .map(function (line) { return line.trim(); })
    .filter(Boolean)
    .map(function (line) {
      const parts = line.split('|').map(function (part) { return part.trim(); });
      return { name: parts[0] || '', amount: parts[1] || '', date: parts[2] || '', avatar: parts[3] || '' };
    });
  return render(entries, wantsTotal(args));
}, { ends: true });

hexo.extend.tag.register('rewardlistfrom', function (args) {
  const path = args.filter(function (arg) { return !/^nototal$/i.test(arg); }).join(' ');
  const list = resolveDataList(hexo, path);
  if (!list || !list.length) return '';
  const entries = list.map(function (item) {
    // A bare string is a name on its own.
    if (item == null || typeof item !== 'object') return { name: String(item == null ? '' : item).trim(), amount: '', date: '', avatar: '' };
    return {
      name: field(item, ['name', 'title']),
      amount: field(item, ['amount', 'money']),
      date: dateText(item.date != null ? item.date : item.time),
      avatar: field(item, ['avatar', 'image', 'src'])
    };
  });
  return render(entries, wantsTotal(args));
});
