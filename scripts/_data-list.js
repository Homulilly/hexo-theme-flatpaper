'use strict';

/* eslint-disable */
/**
 * Site data lookup shared by the tags that read a list from source/_data
 * (stackalbumnav, rewardlistfrom). Required as a module, so `hexo` is passed
 * in rather than taken from the script scope.
 */

// Resolve a dotted path into the site's _data: the first segment names the
// file (source/_data/<name>.yml), the rest walks into it. The theme deliberately
// does not know or assume any particular file or key name — it owns no page type
// that would define such a schema, unlike links.yml, which layout/link.ejs reads
// because the theme owns the `links` page type.
// Hexo 6+ keeps _data/*.yml in the Data model rather than on hexo.site.data.
function resolveDataList(hexo, path) {
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

module.exports = resolveDataList;
