'use strict';

/* eslint-disable */
/**
 * URL validation shared by the theme's Hexo scripts.
 *
 * Registered as the `flatpaper_safe_url` helper by tags.js, and required
 * directly by tag scripts that build anchors outside a template. It lives in
 * its own module so there is exactly one implementation: a second copy of a
 * security check is a second thing to forget to update.
 */

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

module.exports = safeUrl;
