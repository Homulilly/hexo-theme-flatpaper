'use strict';

/* eslint-disable */

const SUPPORTED_LANGUAGES = ['zh-CN', 'en'];
const DEFAULT_LANGUAGE = 'zh-CN';

function normalizeLanguage(value) {
  const lang = String(value || '').trim();
  if (!lang) return '';
  if (lang === 'zh-CN' || lang.toLowerCase() === 'zh-cn') return 'zh-CN';
  if (lang === 'en') return 'en';
  return '';
}

function selectLanguage(raw) {
  const list = Array.isArray(raw) ? raw : [raw];
  for (let i = 0; i < list.length; i++) {
    const lang = normalizeLanguage(list[i]);
    if (SUPPORTED_LANGUAGES.indexOf(lang) > -1) return lang;
  }
  return DEFAULT_LANGUAGE;
}

function languageOrder(raw) {
  const lang = selectLanguage(raw);
  return lang === DEFAULT_LANGUAGE ? [DEFAULT_LANGUAGE] : [lang, DEFAULT_LANGUAGE];
}

function themeI18n() {
  return hexo.theme && hexo.theme.i18n;
}

function i18nData(rawLanguage) {
  const i18n = themeI18n();
  const lang = selectLanguage(rawLanguage);
  const data = i18n && typeof i18n.get === 'function' ? i18n.get(languageOrder(rawLanguage)) : {};
  return Object.assign({ language: lang }, data);
}

hexo.extend.helper.register('flatpaper_i18n_language', function () {
  return selectLanguage(this.config && this.config.language);
});

hexo.extend.helper.register('flatpaper_i18n', function (key) {
  const i18n = themeI18n();
  if (!i18n || typeof i18n.__ !== 'function') return key || '';
  const args = Array.prototype.slice.call(arguments, 1);
  const translate = i18n.__(languageOrder(this.config && this.config.language));
  return translate.apply(null, [key].concat(args));
});

hexo.extend.helper.register('flatpaper_i18n_data', function () {
  return i18nData(this.config && this.config.language);
});

hexo.extend.helper.register('flatpaper_i18n_json', function () {
  return JSON.stringify(i18nData(this.config && this.config.language)).replace(/<\//g, '<\\/');
});
