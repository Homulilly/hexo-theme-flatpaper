'use strict';

const fs = require('fs');
const path = require('path');

const ICON_DIR = path.join(hexo.theme_dir, 'source', '_data', 'icons');
const ICON_PREFIXES = {
  lucide: 'lucide',
  fa: 'fa-solid',
  fas: 'fa-solid',
  solid: 'fa-solid',
  'fa-solid': 'fa-solid',
  far: 'fa-regular',
  regular: 'fa-regular',
  'fa-regular': 'fa-regular',
  fab: 'fa-brands',
  brands: 'fa-brands',
  'fa-brands': 'fa-brands'
};

const BUILTIN_ICONS = [
  'layout-grid', 'home', 'archive', 'link', 'user', 'search', 'x', 'close',
  'sun', 'moon', 'palette', 'github', 'twitter', 'mail', 'email', 'rss',
  'atom', 'heart', 'message-circle', 'message-square', 'share-2', 'calendar',
  'clock', 'shuffle', 'flame', 'history', 'table-of-contents', 'list-tree',
  'folder', 'tag', 'eye', 'arrow-right', 'arrow-left', 'arrow-up',
  'chevron-right', 'chevron-left', 'chevron-down', 'chevron-up', 'send',
  'menu', 'panel-left', 'leaf', 'aperture', 'compass', 'users', 'radio',
  'hash', 'gift', 'alipay', 'wechat', 'paypal', 'x-twitter', 'steam',
  'bilibili', 'youtube', 'facebook', 'instagram', 'telegram', 'weibo'
];

const SOCIAL_ICON_ALIASES = {
  x: 'x-twitter',
  email: 'mail',
  mastodon: 'mastodon',
  github: 'github',
  twitter: 'twitter',
  youtube: 'youtube',
  facebook: 'facebook',
  instagram: 'instagram',
  telegram: 'telegram',
  steam: 'steam',
  bilibili: 'bilibili',
  weibo: 'weibo',
  alipay: 'alipay',
  wechat: 'wechat',
  paypal: 'paypal'
};

const ICON_NAME_ALIASES = {
  close: 'x',
  email: 'mail',
  home: 'house'
};

const FA_CLASS_STYLES = {
  fa: 'fa-solid',
  fas: 'fa-solid',
  'fa-solid': 'fa-solid',
  far: 'fa-regular',
  'fa-regular': 'fa-regular',
  fab: 'fa-brands',
  'fa-brands': 'fa-brands'
};

const usedIcons = new Map();
let registries;

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ICON_DIR, file), 'utf8'));
}

function loadRegistries() {
  if (!registries) {
    registries = {
      lucide: loadJson('lucide.json'),
      'fa-solid': loadJson('fa-solid.json'),
      'fa-regular': loadJson('fa-regular.json'),
      'fa-brands': loadJson('fa-brands.json')
    };
  }
  return registries;
}

function normalizeIconName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9: -]/g, '');
}

function parseFaClasses(value) {
  const parts = String(value).trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!parts.length || parts.indexOf('fa') === -1) return null;

  let library = 'fa-solid';
  let name = '';
  parts.forEach((part) => {
    if (FA_CLASS_STYLES[part]) {
      library = FA_CLASS_STYLES[part];
      return;
    }
    if (part.indexOf('fa-') === 0 && !FA_CLASS_STYLES[part]) {
      name = part.slice(3);
    }
  });

  return name ? { library, name } : null;
}

function iconKey(library, name) {
  return library + ':' + name;
}

function symbolId(library, name) {
  return 'flatpaper-icon-' + library + '-' + name;
}

function resolveIcon(value) {
  const icons = loadRegistries();
  const raw = normalizeIconName(value);
  if (!raw || /^https?:\/\//.test(raw) || raw.indexOf('data:') === 0) return null;

  const faClassIcon = parseFaClasses(raw);
  if (faClassIcon) {
    const set = icons[faClassIcon.library];
    return set && set[faClassIcon.name] ? faClassIcon : null;
  }

  const prefixed = raw.match(/^([a-z-]+):([a-z0-9-]+)$/);
  if (prefixed) {
    const library = ICON_PREFIXES[prefixed[1]];
    const name = prefixed[2];
    const set = library && icons[library];
    return set && set[name] ? { library, name } : null;
  }

  const alias = ICON_NAME_ALIASES[raw] || raw;
  if (icons.lucide[alias]) return { library: 'lucide', name: alias };
  if (icons['fa-brands'][alias]) return { library: 'fa-brands', name: alias };
  if (icons['fa-solid'][alias]) return { library: 'fa-solid', name: alias };
  if (icons['fa-regular'][alias]) return { library: 'fa-regular', name: alias };

  return null;
}

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeSize(value) {
  return String(value || '1em').replace(/[^0-9a-z.%]/gi, '') || '1em';
}

function sanitizeClass(value) {
  return String(value || '').replace(/[^a-z0-9_ -]/gi, '').trim();
}

function rememberIcon(icon) {
  if (!icon) return;
  usedIcons.set(iconKey(icon.library, icon.name), icon);
}

function addIconName(value, target) {
  const icon = resolveIcon(value);
  if (!icon) return;
  target.set(iconKey(icon.library, icon.name), icon);
}

function collectIconFields(value, target) {
  if (!value || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    value.forEach((item) => collectIconFields(item, target));
    return;
  }

  Object.keys(value).forEach((key) => {
    const item = value[key];
    if (key.toLowerCase() === 'icon') addIconName(item, target);
    collectIconFields(item, target);
  });
}

function collectSocialKeys(socials, target) {
  if (!socials || typeof socials !== 'object' || Array.isArray(socials)) return;

  Object.keys(socials).forEach((name) => {
    const raw = socials[name];
    const entry = raw && typeof raw === 'object' ? raw : null;
    addIconName(entry && entry.icon ? entry.icon : (SOCIAL_ICON_ALIASES[name.toLowerCase()] || name), target);
  });
}

function collectConfiguredIcons() {
  const target = new Map();
  const theme = hexo.theme.config || {};

  BUILTIN_ICONS.forEach((name) => addIconName(name, target));
  collectIconFields(theme, target);
  collectSocialKeys(theme.profile && theme.profile.social, target);
  collectSocialKeys(theme.home_hero && theme.home_hero.social, target);

  usedIcons.forEach((icon, key) => target.set(key, icon));
  return Array.from(target.values());
}

function renderFallbackIcon(name, size, cls) {
  const safeName = normalizeIconName(name).replace(/:/g, '-').replace(/ /g, '-');
  const className = ['lucide', safeName ? 'lucide-' + safeName : '', 'flatpaper-icon', cls].filter(Boolean).join(' ');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="' + escapeAttr(className) + '" aria-hidden="true"><circle cx="12" cy="12" r="3"/></svg>';
}

function renderIcon(value, options) {
  const opts = options || {};
  const size = sanitizeSize(opts.size);
  const cls = sanitizeClass(opts.cls);
  const icon = resolveIcon(value);

  if (!icon) return renderFallbackIcon(value, size, cls);
  rememberIcon(icon);

  const isLucide = icon.library === 'lucide';
  const id = symbolId(icon.library, icon.name);
  const className = [
    'lucide',
    'lucide-' + icon.name,
    'flatpaper-icon',
    'flatpaper-icon--' + icon.library,
    cls
  ].filter(Boolean).join(' ');
  const attrs = isLucide
    ? 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'
    : 'fill="currentColor"';

  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" ' + attrs + ' class="' + escapeAttr(className) + '" aria-hidden="true"><use href="#' + escapeAttr(id) + '"></use></svg>';
}

function renderSymbol(icon) {
  const icons = loadRegistries();
  const data = icons[icon.library][icon.name];
  const id = symbolId(icon.library, icon.name);
  const viewBox = icon.library === 'lucide' ? '0 0 24 24' : data.viewBox;
  const body = icon.library === 'lucide' ? data : data.body;

  return '<symbol id="' + escapeAttr(id) + '" viewBox="' + escapeAttr(viewBox) + '">' + body + '</symbol>';
}

function renderSprite() {
  const symbols = collectConfiguredIcons().map(renderSymbol).join('');
  if (!symbols) return '';

  return '<svg class="flatpaper-icon-sprite" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden;" aria-hidden="true" focusable="false"><defs>' + symbols + '</defs></svg>';
}

hexo.extend.helper.register('flatpaper_icon', renderIcon);
hexo.extend.helper.register('flatpaper_icon_sprite', renderSprite);
