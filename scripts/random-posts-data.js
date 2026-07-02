'use strict';

/* eslint-disable */
/**
 * Build-time random posts data generator.
 *
 * Emits a single /flatpaper-random-posts.json with the sidebar random-posts
 * candidate pool. The sidebar keeps a small server-rendered fallback list and
 * main.js fetches this shared file once instead of inlining the full pool into
 * every list page.
 */

const RANDOM_POSTS_PATH = 'flatpaper-random-posts.json';

hexo.extend.generator.register('flatpaper_random_posts_data', function (locals) {
  const theme = this.theme.config || {};
  const randomLimit = parseInt(theme.random_posts, 10);
  const enabled = isNaN(randomLimit) ? true : randomLimit > 0;
  const poolLimit = parseInt(theme.random_posts_pool, 10);
  const urlFor = this.extend.helper.get('url_for').bind(this);

  let posts = enabled ? locals.posts.sort('date', -1).toArray() : [];
  if (!isNaN(poolLimit) && poolLimit > 0) posts = posts.slice(0, poolLimit);

  const data = posts.map(function (post) {
    return {
      title: post.title || 'Untitled',
      url: urlFor(post.path),
      date: post.date && post.date.format ? post.date.format('YYYY-MM-DD') : ''
    };
  });

  return {
    path: RANDOM_POSTS_PATH,
    data: JSON.stringify(data)
  };
});
