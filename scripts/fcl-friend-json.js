'use strict';

/* eslint-disable */

const DEFAULT_PATH = 'friend.json';

function normalizeOutputPath(value) {
  const raw = String(value || DEFAULT_PATH).trim().replace(/\\/g, '/').replace(/^\/+/, '');
  if (!raw || raw.indexOf('..') > -1) return DEFAULT_PATH;
  return raw;
}

function linksData(hexo, locals) {
  if (locals && locals.data && locals.data.links) return locals.data.links;
  if (hexo.locals && typeof hexo.locals.get === 'function') {
    const data = hexo.locals.get('data');
    if (data && data.links) return data.links;
  }
  return [];
}

function asGroups(data) {
  return (Array.isArray(data) ? data : [data]).filter(function (group) {
    return group && Array.isArray(group.link_list);
  });
}

function normalizeUrl(value) {
  return String(value || '').trim();
}

function normalizeText(value) {
  return String(value || '').trim();
}

function linkPageFor(item) {
  return normalizeUrl(item.linkpage || item.link_page || item.linkPage || item.flink || item.flink_page);
}

function rssFor(item) {
  return normalizeUrl(item.rss);
}

function friendEntry(item) {
  if (!rssFor(item)) return null;

  const name = normalizeText(item.name || item.title);
  const link = normalizeUrl(item.link || item.url);
  if (!name || !link) return null;

  const avatar = normalizeUrl(item.avatar || item.icon);
  const linkpage = linkPageFor(item);
  return linkpage ? [name, link, linkpage, avatar] : [name, link, avatar];
}

hexo.extend.generator.register('flatpaper_fcl_friend_json', function (locals) {
  const config = ((this.theme.config && this.theme.config.fcl) || {}).friend_json || {};
  if (config.enable === false) return [];

  const seen = {};
  const friends = [];
  asGroups(linksData(this, locals)).forEach(function (group) {
    group.link_list.forEach(function (item) {
      const entry = item && friendEntry(item);
      if (!entry) return;
      const key = entry[1].replace(/\/+$/, '').toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      friends.push(entry);
    });
  });

  return {
    path: normalizeOutputPath(config.path),
    data: JSON.stringify({ friends: friends }, null, 2)
  };
});
