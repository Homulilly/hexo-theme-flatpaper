(function () {
  // Safe storage wrapper: Safari private mode, sandboxed iframes, or strict
  // enterprise policies make raw localStorage access throw SecurityError,
  // which would otherwise abort this entire IIFE.
  var safeStorage = {
    get: function (key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* noop */ }
    }
  };
  var safeCookie = {
    get: function (key) {
      var escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + escaped + '=([^;]+)'));
      if (!match) return null;
      // A malformed percent sequence (e.g. written by another script on the
      // same origin) makes decodeURIComponent throw, which would abort the IIFE.
      try { return decodeURIComponent(match[1]); } catch (e) { return null; }
    },
    set: function (key, value) {
      try {
        var maxAge = 60 * 60 * 24 * 365;
        var secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = key + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAge + '; SameSite=Lax' + secure;
      } catch (e) { /* noop */ }
    }
  };

  var flatpaperI18n = window.FLATPAPER_I18N || {};
  function t(key) {
    var str = flatpaperI18n[key] || key || '';
    var args = Array.prototype.slice.call(arguments, 1);
    var index = 0;
    return String(str).replace(/%(\d+\$)?[sd]/g, function (_, position) {
      var argIndex = position ? parseInt(position, 10) - 1 : index++;
      return args[argIndex] == null ? '' : String(args[argIndex]);
    });
  }

  // Global, idempotent bindings (theme toggle, global keydown, viewport
  // breakpoint listener) go through bindGlobalOnce() and are guarded against
  // double-binding via a dataset flag. Everything else binds inline on
  // initial DOM nodes — fine for a multi-page Hexo build.
  var root = document.documentElement;
  var accents = ['orange', 'purple', 'sakura', 'blue', 'pink', 'green', 'black'];
  var defaultAccent = document.body && document.body.dataset.defaultAccent ? document.body.dataset.defaultAccent : 'green';
  if (accents.indexOf(defaultAccent) === -1) defaultAccent = 'green';
  var storedAccent = safeCookie.get('flatpaper-accent');
  var activeAccent = accents.indexOf(storedAccent) > -1 ? storedAccent : defaultAccent;
  root.setAttribute('data-accent', activeAccent);
  var stored = safeStorage.get('flatpaper-mode');
  if (stored === 'dark') root.classList.add('dark-mode');

  function setAccent(value) {
    if (accents.indexOf(value) === -1) value = defaultAccent;
    root.setAttribute('data-accent', value);
    document.querySelectorAll('[data-accent-option]').forEach(function (option) {
      option.setAttribute('aria-checked', option.dataset.accentOption === value ? 'true' : 'false');
      option.setAttribute('aria-pressed', option.dataset.accentOption === value ? 'true' : 'false');
    });
  }

  setAccent(activeAccent);

  function bindGlobalOnce() {
    var brandNavWrapper = document.querySelector('.brand-mark-wrapper');
    var brandNavToggle = brandNavWrapper ? brandNavWrapper.querySelector('.brand-mark') : null;
    var brandNavMenu = brandNavWrapper ? brandNavWrapper.querySelector('.brand-nav-menu') : null;
    function closeBrandNav() {
      if (!brandNavWrapper || !brandNavToggle) return;
      // Wired to scroll/resize below — skip the DOM writes when already closed.
      if (!brandNavWrapper.classList.contains('is-open')) return;
      brandNavWrapper.classList.remove('is-open');
      brandNavToggle.setAttribute('aria-expanded', 'false');
    }
    function openBrandNav() {
      if (!brandNavWrapper || !brandNavToggle) return;
      brandNavWrapper.classList.add('is-open');
      brandNavToggle.setAttribute('aria-expanded', 'true');
    }
    function closeAccentMenu(accentPicker) {
      var accentToggle = accentPicker ? accentPicker.querySelector('.accent-toggle') : null;
      if (!accentPicker || !accentToggle) return;
      accentPicker.classList.remove('is-open');
      accentToggle.setAttribute('aria-expanded', 'false');
    }
    function closeOtherAccentMenus(currentPicker) {
      document.querySelectorAll('.accent-picker.is-open').forEach(function (picker) {
        if (picker !== currentPicker) closeAccentMenu(picker);
      });
    }
    function openAccentMenu(accentPicker) {
      var accentToggle = accentPicker ? accentPicker.querySelector('.accent-toggle') : null;
      if (!accentPicker || !accentToggle) return;
      closeOtherAccentMenus(accentPicker);
      accentPicker.classList.add('is-open');
      accentToggle.setAttribute('aria-expanded', 'true');
    }
    function bindAccentOption(option, onSelect) {
      if (!option || option.dataset.flatpaperAccentBound) return;
      option.dataset.flatpaperAccentBound = '1';
      option.addEventListener('click', function () {
        var next = option.dataset.accentOption;
        setAccent(next);
        safeCookie.set('flatpaper-accent', next);
        if (typeof onSelect === 'function') onSelect();
      });
    }

    var pickers = document.querySelectorAll('.accent-picker');
    pickers.forEach(function (accentPicker) {
      var accentToggle = accentPicker.querySelector('.accent-toggle');
      var accentMenu = accentPicker.querySelector('.accent-menu');
      if (!accentToggle || !accentMenu || accentToggle.dataset.flatpaperBound) return;
      accentToggle.dataset.flatpaperBound = '1';
      accentToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        if (accentPicker.classList.contains('is-open')) closeAccentMenu(accentPicker);
        else openAccentMenu(accentPicker);
      });
      accentMenu.querySelectorAll('[data-accent-option]').forEach(function (option) {
        bindAccentOption(option, function () {
          closeAccentMenu(accentPicker);
        });
      });
    });
    // One document-level dismiss pair for all pickers — registering these
    // inside the loop would stack a global listener per picker instance.
    if (pickers.length) {
      document.addEventListener('click', function (event) {
        pickers.forEach(function (picker) {
          if (!picker.contains(event.target)) closeAccentMenu(picker);
        });
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') pickers.forEach(closeAccentMenu);
      });
    }
    document.querySelectorAll('[data-accent-option]').forEach(function (option) {
      bindAccentOption(option);
    });

    if (brandNavWrapper && brandNavToggle && brandNavMenu && !brandNavToggle.dataset.flatpaperBound) {
      brandNavToggle.dataset.flatpaperBound = '1';
      brandNavToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        if (brandNavWrapper.classList.contains('is-open')) closeBrandNav();
        else openBrandNav();
      });
      brandNavMenu.addEventListener('click', function (event) {
        event.stopPropagation();
      });
      brandNavMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeBrandNav);
      });
      document.addEventListener('click', function (event) {
        if (!brandNavWrapper.contains(event.target)) closeBrandNav();
      });
      document.addEventListener('pointerdown', function (event) {
        if (!brandNavWrapper.contains(event.target)) closeBrandNav();
      });
      window.addEventListener('resize', closeBrandNav);
      window.addEventListener('scroll', closeBrandNav, { passive: true });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeBrandNav();
      });
    }

    document.querySelectorAll('.theme-toggle').forEach(function (toggle) {
      if (!toggle || toggle.dataset.flatpaperBound) return;
      toggle.dataset.flatpaperBound = '1';
      toggle.addEventListener('click', function () {
        root.classList.toggle('dark-mode');
        safeStorage.set('flatpaper-mode', root.classList.contains('dark-mode') ? 'dark' : 'light');
      });
    });

    document.querySelectorAll('.site-nav-item.has-children').forEach(function (item) {
      var btn = item.querySelector('.site-nav-parent');
      if (!btn || btn.dataset.flatpaperBound) return;
      btn.dataset.flatpaperBound = '1';
      btn.addEventListener('click', function (event) {
        event.stopPropagation();
        var willOpen = !item.classList.contains('is-open');
        document.querySelectorAll('.site-nav-item.has-children.is-open').forEach(function (openItem) {
          openItem.classList.remove('is-open');
          var openBtn = openItem.querySelector('.site-nav-parent');
          if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    document.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.site-nav-item.has-children')) return;
      document.querySelectorAll('.site-nav-item.has-children.is-open').forEach(function (item) {
        item.classList.remove('is-open');
        var btn = item.querySelector('.site-nav-parent');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    });

    document.querySelectorAll('.drawer-nav-parent').forEach(function (btn) {
      if (btn.dataset.flatpaperBound) return;
      btn.dataset.flatpaperBound = '1';
      btn.addEventListener('click', function () {
        var group = btn.closest('.drawer-nav-group');
        if (!group) return;
        var willOpen = !group.classList.contains('is-open');
        group.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  // ---- Random sidebar posts ----
  function shufflePosts(posts) {
    var copy = posts.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function renderRandomPosts() {
    document.querySelectorAll('.recent-card[data-random-posts-limit]').forEach(function (card) {
      var list = card.querySelector('.js-random-posts');
      var data = card.querySelector('.js-random-posts-data');
      if (!list || !data) return;

      var pool = [];
      try { pool = JSON.parse(data.textContent.trim() || '[]'); } catch (e) { pool = []; }
      if (!pool.length) return;

      var limit = parseInt(card.dataset.randomPostsLimit, 10);
      if (!limit || limit < 1) limit = 5;
      var selected = shufflePosts(pool).slice(0, limit);
      if (!selected.length) return;

      list.innerHTML = '';
      selected.forEach(function (post) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.className = 'recent-item';
        link.href = post.url || '#';

        var title = document.createElement('strong');
        title.textContent = post.title || 'Untitled';
        link.appendChild(title);

        var date = document.createElement('em');
        date.textContent = post.date || '';
        link.appendChild(date);

        item.appendChild(link);
        list.appendChild(item);
      });
    });
  }

  renderRandomPosts();

  // ---- Friend-Circle-Lite all.json renderer ----
  function safeRemoteUrl(value, kind) {
    var raw = String(value || '').trim();
    if (!raw || /[\u0000-\u001f\u007f\\]/.test(raw)) return '';
    try {
      var parsed = new URL(raw, window.location.href);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.href;
      if (kind !== 'image' && parsed.protocol === 'mailto:') return parsed.href;
    } catch (e) {
      return '';
    }
    return '';
  }

  function parseFclDate(value) {
    var text = String(value || '').trim();
    if (!text) return { label: t('friends_feed.date_unknown'), time: 0 };
    var normalized = text.replace(/\//g, '-').replace(' ', 'T');
    var timestamp = Date.parse(normalized);
    return { label: text, time: isNaN(timestamp) ? 0 : timestamp };
  }

  function normalizeFclArticles(payload) {
    var raw = payload && Array.isArray(payload.article_data) ? payload.article_data : [];
    var seen = {};
    return raw.map(function (item) {
      var link = safeRemoteUrl(item && item.link);
      var title = String((item && item.title) || '').trim();
      if (!link || !title) return null;
      var key = link.replace(/\/+$/, '').toLowerCase();
      if (seen[key]) return null;
      seen[key] = true;
      var date = parseFclDate(item.created || item.published || item.updated);
      return {
        title: title,
        link: link,
        author: String(item.author || '').trim(),
        avatar: safeRemoteUrl(item.avatar, 'image'),
        dateLabel: date.label,
        dateTime: date.time
      };
    }).filter(Boolean).sort(function (a, b) {
      return b.dateTime - a.dateTime;
    });
  }

  function renderFriendsFeed() {
    document.querySelectorAll('.friends-feed[data-fcl-all-json]').forEach(function (feed) {
      var endpoint = safeRemoteUrl(feed.dataset.fclAllJson);
      var state = feed.querySelector('[data-feed-state]');
      var list = feed.querySelector('[data-feed-list]');
      var more = feed.querySelector('[data-feed-more]');
      var summary = feed.querySelector('.friends-feed__summary');
      if (!state || !list || !more) return;
      if (!endpoint) {
        state.textContent = t('friends_feed.missing_url');
        return;
      }
      var avatarFallback = safeRemoteUrl(feed.dataset.avatarFallback, 'image');

      var pageSize = parseInt(feed.dataset.pageSize, 10);
      if (!pageSize || pageSize < 1) pageSize = 20;
      var shown = 0;
      var articles = [];

      function setState(message, isError) {
        state.textContent = message || '';
        state.hidden = !message;
        state.classList.toggle('is-error', !!isError);
      }

      function renderStats(payload) {
        var stats = (payload && payload.statistical_data) || {};
        var friends = feed.querySelector('[data-feed-stat="friends"]');
        var active = feed.querySelector('[data-feed-stat="active"]');
        var articleCount = feed.querySelector('[data-feed-stat="articles"]');
        var updated = feed.querySelector('[data-feed-updated]');
        if (friends && typeof stats.friends_num === 'number') friends.textContent = t('friends_feed.friend_count', stats.friends_num);
        if (active && typeof stats.active_num === 'number') active.textContent = t('friends_feed.active_count', stats.active_num);
        if (articleCount) articleCount.textContent = t('friends_feed.article_count', articles.length || stats.article_num || 0);
        if (updated && stats.last_updated_time) updated.textContent = t('friends_feed.updated_at', stats.last_updated_time);
        if (summary) summary.hidden = false;
      }

      function fallbackAvatar(author) {
        var span = document.createElement('span');
        span.className = 'friends-feed-card__avatar friends-feed-card__avatar--text';
        span.textContent = (author || '?').charAt(0);
        return span;
      }

      function createArticleCard(article) {
        var item = document.createElement('li');
        item.className = 'friends-feed-card';

        var avatarWrap = document.createElement('a');
        avatarWrap.className = 'friends-feed-card__avatar-link';
        avatarWrap.href = article.link;
        avatarWrap.target = '_blank';
        avatarWrap.rel = 'noopener noreferrer';
        avatarWrap.setAttribute('aria-label', article.author || article.title);

        if (article.avatar) {
          var img = document.createElement('img');
          img.className = 'friends-feed-card__avatar';
          img.src = article.avatar;
          img.alt = article.author || '';
          img.loading = 'lazy';
          img.referrerPolicy = 'no-referrer';
          img.addEventListener('error', function () {
            if (avatarFallback && img.dataset.flatpaperAvatarFallback !== '1' && img.src !== avatarFallback) {
              img.dataset.flatpaperAvatarFallback = '1';
              img.src = avatarFallback;
              return;
            }
            while (avatarWrap.firstChild) avatarWrap.removeChild(avatarWrap.firstChild);
            avatarWrap.appendChild(fallbackAvatar(article.author));
          });
          avatarWrap.appendChild(img);
        } else {
          avatarWrap.appendChild(fallbackAvatar(article.author));
        }

        var body = document.createElement('div');
        body.className = 'friends-feed-card__body';

        var meta = document.createElement('div');
        meta.className = 'friends-feed-card__meta';
        var author = document.createElement('span');
        author.className = 'friends-feed-card__author';
        author.textContent = article.author || t('friends_feed.unknown_author');
        meta.appendChild(author);
        var time = document.createElement('time');
        time.className = 'friends-feed-card__date';
        time.textContent = article.dateLabel;
        if (article.dateTime) time.dateTime = new Date(article.dateTime).toISOString();
        meta.appendChild(time);

        var title = document.createElement('a');
        title.className = 'friends-feed-card__title';
        title.href = article.link;
        title.target = '_blank';
        title.rel = 'noopener noreferrer';
        title.textContent = article.title;

        body.appendChild(meta);
        body.appendChild(title);
        item.appendChild(avatarWrap);
        item.appendChild(body);
        return item;
      }

      function renderNext() {
        var next = articles.slice(shown, shown + pageSize);
        next.forEach(function (article) {
          list.appendChild(createArticleCard(article));
        });
        shown += next.length;
        more.hidden = shown >= articles.length;
      }

      more.addEventListener('click', renderNext);
      setState(t('friends_feed.loading'));

      fetch(endpoint, { headers: { Accept: 'application/json,text/plain,*/*' } })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.json();
        })
        .then(function (payload) {
          articles = normalizeFclArticles(payload);
          list.innerHTML = '';
          shown = 0;
          renderStats(payload);
          if (!articles.length) {
            setState(t('friends_feed.empty'));
            return;
          }
          setState('');
          renderNext();
        })
        .catch(function () {
          setState(t('friends_feed.load_failed'), true);
        });
    });
  }

  renderFriendsFeed();

  // ---- Home hero: scroll affordance and draggable scrapbook stickers ----
  (function () {
    var hero = document.querySelector('.home-hero');
    if (!hero) return;
    var homeTarget = document.getElementById('flatpaper-home-content');
    var header = document.querySelector('.site-header');
    var confirmBubble = null;

    // Sticker placement tuning, shared by the initial layout and shuffle.
    var ROTATE_MIN = -18;
    var ROTATE_SPREAD = 36;
    var DRAG_THRESHOLD = 3;
    var STICKER_ZONES = [
      { leftMin: 4, leftMax: 19, topMin: 8, topMax: 78 },
      { leftMin: 78, leftMax: 90, topMin: 8, topMax: 78 },
      { leftMin: 20, leftMax: 72, topMin: 6, topMax: 20 },
      { leftMin: 20, leftMax: 72, topMin: 76, topMax: 88 }
    ];

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function randomRotate() {
      return ROTATE_MIN + Math.random() * ROTATE_SPREAD;
    }

    function applyRandomHeroImage() {
      var rawImages = hero.getAttribute('data-hero-images');
      if (!rawImages) return;
      var images = [];
      try { images = JSON.parse(rawImages); } catch (e) { images = []; }
      images = images.filter(function (image) {
        return typeof image === 'string' && image;
      });
      if (images.length < 2) return;
      var selected = images[Math.floor(Math.random() * images.length)];
      var next = 'url("' + selected.replace(/"/g, '\\"') + '")';
      // The server already renders the first image inline; skip the write when
      // the random pick matches it so we don't trigger a redundant style recalc
      // (and, when it differs, this is the only extra fetch — by design).
      if (hero.style.getPropertyValue('--hero-bg-image').trim() === next) return;
      hero.style.setProperty('--hero-bg-image', next);
    }

    function applyRandomHeroCtaBackground() {
      var trigger = hero.querySelector('[data-hero-cta-backgrounds]');
      if (!trigger) return;
      var rawImages = trigger.getAttribute('data-hero-cta-backgrounds');
      if (!rawImages) return;
      var images = [];
      try { images = JSON.parse(rawImages); } catch (e) { images = []; }
      images = images.filter(function (image) {
        return typeof image === 'string' && image;
      });
      if (images.length < 2) return;
      var selected = images[Math.floor(Math.random() * images.length)];
      var next = 'url("' + selected.replace(/"/g, '\\"') + '")';
      if (trigger.style.getPropertyValue('--hero-cta-bg').trim() === next) return;
      trigger.style.setProperty('--hero-cta-bg', next);
    }

    function homeTop() {
      if (!homeTarget) return hero.offsetTop + hero.offsetHeight;
      var headerHeight = header ? header.getBoundingClientRect().height : 0;
      var offset = headerHeight ? headerHeight + 56 : 56;
      return Math.max(0, homeTarget.getBoundingClientRect().top + window.pageYOffset - offset);
    }

    function setHeroActive() {
      var active = window.pageYOffset < (hero.offsetTop + hero.offsetHeight - 80);
      document.body.classList.toggle('is-hero-active', active);
    }

    function scrollToHome() {
      if (!homeTarget) return;
      closeVisitConfirm();
      window.scrollTo({ top: homeTop(), behavior: 'smooth' });
      window.setTimeout(function () {
        setHeroActive();
      }, 520);
    }

    function closeVisitConfirm() {
      if (!confirmBubble) return;
      confirmBubble.remove();
      confirmBubble = null;
    }

    function openVisitConfirm(trigger) {
      var href = trigger.getAttribute('href');
      if (!href) return;
      var label = trigger.getAttribute('aria-label') || trigger.getAttribute('title') || trigger.textContent || t('home_hero.link');
      closeVisitConfirm();

      confirmBubble = document.createElement('div');
      confirmBubble.className = 'hero-visit-confirm';
      confirmBubble.setAttribute('role', 'group');
      confirmBubble.setAttribute('aria-label', t('home_hero.visit_confirm', label));

      var message = document.createElement('p');
      message.textContent = t('home_hero.visit_confirm', label);
      confirmBubble.appendChild(message);

      var actions = document.createElement('div');
      actions.className = 'hero-visit-confirm__actions';

      var visit = document.createElement('button');
      visit.type = 'button';
      visit.className = 'hero-visit-confirm__visit';
      visit.textContent = t('home_hero.visit');
      visit.addEventListener('click', function () {
        var target = trigger.getAttribute('target');
        closeVisitConfirm();
        if (target === '_blank') window.open(href, '_blank', 'noopener');
        else window.location.href = href;
      });

      var cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'hero-visit-confirm__cancel';
      cancel.textContent = t('home_hero.cancel');
      cancel.addEventListener('click', closeVisitConfirm);

      actions.appendChild(visit);
      actions.appendChild(cancel);
      confirmBubble.appendChild(actions);
      hero.appendChild(confirmBubble);

      var heroRect = hero.getBoundingClientRect();
      var triggerRect = trigger.getBoundingClientRect();
      var bubbleRect = confirmBubble.getBoundingClientRect();
      var left = triggerRect.left - heroRect.left + (triggerRect.width / 2) - (bubbleRect.width / 2);
      var top = triggerRect.top - heroRect.top - bubbleRect.height - 12;
      left = clamp(left, 12, hero.clientWidth - bubbleRect.width - 12);
      if (top < 12) top = triggerRect.bottom - heroRect.top + 12;
      top = clamp(top, 12, hero.clientHeight - bubbleRect.height - 12);
      confirmBubble.style.left = left + 'px';
      confirmBubble.style.top = top + 'px';
      visit.focus({ preventScroll: true });
    }

    var scrollLinks = hero.querySelectorAll('[data-hero-scroll]');
    applyRandomHeroImage();
    applyRandomHeroCtaBackground();
    var heroSocialLinks = hero.querySelector('.home-hero__links');
    function syncClippedHeroLinks() {
      if (!heroSocialLinks) return;
      heroSocialLinks.style.setProperty('--hero-links-offset', '0px');
      Array.prototype.forEach.call(heroSocialLinks.querySelectorAll('a'), function (link) {
        link.style.visibility = '';
        link.style.pointerEvents = '';
        link.removeAttribute('aria-hidden');
        link.removeAttribute('tabindex');
      });
      var containerWidth = heroSocialLinks.clientWidth;
      var visibleRight = 0;
      Array.prototype.forEach.call(heroSocialLinks.querySelectorAll('a'), function (link) {
        var clipped = link.offsetLeft + link.offsetWidth > containerWidth + 1;
        if (clipped) {
          link.style.visibility = 'hidden';
          link.style.pointerEvents = 'none';
          link.setAttribute('aria-hidden', 'true');
          link.setAttribute('tabindex', '-1');
        } else {
          visibleRight = Math.max(visibleRight, link.offsetLeft + link.offsetWidth);
        }
      });
      var offset = Math.max(0, Math.floor((containerWidth - visibleRight) / 2));
      heroSocialLinks.style.setProperty('--hero-links-offset', offset + 'px');
    }
    window.requestAnimationFrame(syncClippedHeroLinks);
    window.addEventListener('resize', function () {
      window.requestAnimationFrame(syncClippedHeroLinks);
    }, { passive: true });
    if (window.ResizeObserver && heroSocialLinks) {
      new ResizeObserver(function () {
        window.requestAnimationFrame(syncClippedHeroLinks);
      }).observe(heroSocialLinks);
    }
    scrollLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href') || '';
        if (href.charAt(0) !== '#') return;
        var target = document.getElementById(href.slice(1));
        if (!target) return;
        event.preventDefault();
        scrollToHome();
      });
    });

    var externalNavLinks = hero.querySelectorAll('.home-hero__nav-link[target="_blank"]');
    externalNavLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        openVisitConfirm(link);
      });
    });

    var stickers = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-sticker]'));
    // setHeroActive() reads offsetTop/offsetHeight (forced layout). rAF-throttle
    // so we touch layout at most once per frame instead of once per scroll event.
    var heroScrollTicking = false;
    window.addEventListener('scroll', function () {
      if (heroScrollTicking) return;
      heroScrollTicking = true;
      window.requestAnimationFrame(function () {
        setHeroActive();
        heroScrollTicking = false;
      });
    }, { passive: true });
    setHeroActive();

    if (!stickers.length || !hero.classList.contains('has-draggable-stickers')) return;

    function randomizeSticker(sticker) {
      var zone = STICKER_ZONES[Math.floor(Math.random() * STICKER_ZONES.length)];
      var left = zone.leftMin + Math.random() * (zone.leftMax - zone.leftMin);
      var top = zone.topMin + Math.random() * (zone.topMax - zone.topMin);
      sticker.style.left = left + '%';
      sticker.style.top = top + '%';
      sticker.style.right = 'auto';
      sticker.style.bottom = 'auto';
      sticker.style.transform = 'rotate(' + randomRotate().toFixed(1) + 'deg)';
    }

    stickers.forEach(function (sticker) {
      randomizeSticker(sticker);

      var state = null;
      sticker.addEventListener('click', function (event) {
        if (sticker.dataset.heroDragged === '1') {
          event.preventDefault();
          event.stopPropagation();
          delete sticker.dataset.heroDragged;
          return;
        }
        if (sticker.matches && sticker.matches('a.hero-sticker--custom[href]')) {
          event.preventDefault();
          event.stopPropagation();
          openVisitConfirm(sticker);
        }
      });

      sticker.addEventListener('pointerdown', function (event) {
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        // Cache the hero box and drag bounds once: they don't change mid-drag
        // (pointer capture + touch-action:none block scroll/resize), so pointermove
        // can stay read-free instead of forcing layout on every move.
        var heroRect = hero.getBoundingClientRect();
        var rect = sticker.getBoundingClientRect();
        state = {
          offsetX: event.clientX - rect.left,
          offsetY: event.clientY - rect.top,
          startX: event.clientX,
          startY: event.clientY,
          heroLeft: heroRect.left,
          heroTop: heroRect.top,
          maxX: hero.clientWidth - sticker.offsetWidth,
          maxY: hero.clientHeight - sticker.offsetHeight,
          moved: false
        };
        sticker.style.transform = 'rotate(' + randomRotate().toFixed(1) + 'deg)';
        sticker.style.left = (rect.left - heroRect.left) + 'px';
        sticker.style.top = (rect.top - heroRect.top) + 'px';
        sticker.style.right = 'auto';
        sticker.style.bottom = 'auto';
        sticker.style.zIndex = '6';
        sticker.classList.add('is-dragging');
        if (sticker.setPointerCapture) sticker.setPointerCapture(event.pointerId);
      });

      sticker.addEventListener('pointermove', function (event) {
        if (!state) return;
        if (Math.abs(event.clientX - state.startX) > DRAG_THRESHOLD || Math.abs(event.clientY - state.startY) > DRAG_THRESHOLD) {
          state.moved = true;
        }
        var x = clamp(event.clientX - state.heroLeft - state.offsetX, 0, state.maxX);
        var y = clamp(event.clientY - state.heroTop - state.offsetY, 0, state.maxY);
        sticker.style.left = x + 'px';
        sticker.style.top = y + 'px';
        if (state.moved) event.preventDefault();
      });

      function endDrag(event, cancelled) {
        if (!state) return;
        var moved = state.moved;
        state = null;
        sticker.style.zIndex = '';
        sticker.classList.remove('is-dragging');
        // Flag a completed drag so the synthetic click that follows pointerup is
        // swallowed (not treated as a tap). A pointercancel fires no click, so
        // flagging it would wrongly suppress the *next* genuine tap.
        if (moved && !cancelled) {
          sticker.dataset.heroDragged = '1';
          // Safety net: if the expected click never arrives, don't leave the
          // sticker permanently unclickable.
          window.setTimeout(function () { delete sticker.dataset.heroDragged; }, 400);
        }
        if (sticker.releasePointerCapture && event && event.pointerId != null) {
          try { sticker.releasePointerCapture(event.pointerId); } catch (e) {}
        }
      }

      sticker.addEventListener('pointerup', function (event) { endDrag(event, false); });
      sticker.addEventListener('pointercancel', function (event) { endDrag(event, true); });
    });

    var shuffleButton = hero.querySelector('.js-hero-shuffle');
    if (shuffleButton) {
      shuffleButton.addEventListener('click', function () {
        closeVisitConfirm();
        stickers.forEach(function (sticker, index) {
          delete sticker.dataset.heroDragged;
          sticker.style.zIndex = '';
          sticker.classList.remove('is-dragging');
          randomizeSticker(sticker);
        });
      });
    }

    document.addEventListener('click', function (event) {
      if (!confirmBubble) return;
      if (confirmBubble.contains(event.target)) return;
      if (event.target.closest && event.target.closest('a.hero-sticker--custom[href], .home-hero__nav-link[target="_blank"]')) return;
      closeVisitConfirm();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeVisitConfirm();
    });
  })();

  // ---- Search popover ----
  var panel = document.querySelector('.search-panel');
  var input = document.getElementById('flatpaper-search');
  var results = document.querySelector('.search-results');
  var indexEl = document.getElementById('flatpaper-post-index');
  var posts = [];
  // The index lives in a standalone JSON file (scripts/search-index.js) and is
  // fetched on first open instead of being inlined into every page.
  var indexState = 'idle'; // idle | loading | ready | error

  if (indexEl) {
    // Fallback for pages rendered by older theme versions that still inline
    // the index (e.g. stale CDN-cached HTML served with this newer script).
    try { posts = JSON.parse(indexEl.textContent.trim() || '[]'); indexState = 'ready'; } catch (e) { posts = []; }
  }

  function loadIndex() {
    if (indexState === 'ready' || indexState === 'loading' || !panel) return;
    var url = panel.getAttribute('data-index-url');
    if (!url || typeof fetch !== 'function') { indexState = 'error'; return; }
    indexState = 'loading';
    fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      posts = Array.isArray(data) ? data : [];
      indexState = 'ready';
      if (input) render(input.value);
    }).catch(function () {
      // Leave state on 'error' so render() can say so; the next openPanel()
      // retries (loadIndex only short-circuits on ready/loading).
      indexState = 'error';
      if (input) render(input.value);
    });
  }

  function openPanel() {
    if (!panel) return;
    loadIndex();
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(function () { if (input) input.focus(); }, 60);
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    // Keep the body locked while the sidebar drawer is still open underneath
    // (mirrors the check in closeSidebar()).
    var openDrawer = document.getElementById('paper-sidebar-drawer');
    if (!openDrawer || !openDrawer.classList.contains('is-open')) {
      document.body.classList.remove('no-scroll');
    }
  }

  // Append text into `parent`, wrapping every case-insensitive match of `keyword`
  // in a <mark>. Uses textContent only — no HTML parsing, so post titles or
  // excerpts containing < > & or full tags can never inject DOM.
  function appendHighlighted(parent, text, keyword) {
    if (!text) return;
    if (!keyword) { parent.appendChild(document.createTextNode(text)); return; }
    var lower = text.toLowerCase();
    // toLowerCase() is not length-preserving for a few characters (e.g. 'İ'),
    // which would shift every index found in `lower`. Skip highlighting then —
    // the result list itself is unaffected.
    if (lower.length !== text.length) { parent.appendChild(document.createTextNode(text)); return; }
    var i = 0;
    var idx;
    while ((idx = lower.indexOf(keyword, i)) !== -1) {
      if (idx > i) parent.appendChild(document.createTextNode(text.slice(i, idx)));
      var mark = document.createElement('mark');
      mark.textContent = text.slice(idx, idx + keyword.length);
      parent.appendChild(mark);
      i = idx + keyword.length;
    }
    if (i < text.length) parent.appendChild(document.createTextNode(text.slice(i)));
  }

  function render(query) {
    if (!results) return;
    var keyword = query.trim().toLowerCase();
    results.innerHTML = '';
    if (!keyword) {
      var empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = t('search.empty');
      results.appendChild(empty);
      return;
    }
    if (indexState !== 'ready') {
      var pending = document.createElement('p');
      pending.className = 'search-empty';
      pending.textContent = indexState === 'error'
        ? t('search.load_failed')
        : t('search.loading');
      results.appendChild(pending);
      return;
    }
    var hits = posts.filter(function (p) {
      return (p.title && p.title.toLowerCase().indexOf(keyword) > -1) ||
             (p.text && p.text.toLowerCase().indexOf(keyword) > -1);
    }).slice(0, 12);

    if (!hits.length) {
      var none = document.createElement('p');
      none.className = 'search-empty';
      none.textContent = t('search.no_result', query);
      results.appendChild(none);
      return;
    }

    hits.forEach(function (post) {
      var a = document.createElement('a');
      a.className = 'search-result';
      a.href = post.url;

      var strong = document.createElement('strong');
      appendHighlighted(strong, post.title || '', keyword);
      a.appendChild(strong);

      var span = document.createElement('span');
      span.textContent = post.date || '';
      a.appendChild(span);

      var p = document.createElement('p');
      appendHighlighted(p, post.text || '', keyword);
      a.appendChild(p);

      results.appendChild(a);
    });
  }

  document.querySelectorAll('.js-search-open').forEach(function (btn) {
    btn.addEventListener('click', openPanel);
  });

  document.querySelectorAll('.js-search-close').forEach(function (btn) {
    btn.addEventListener('click', closePanel);
  });

  if (input) {
    // Debounced: render() linearly scans the whole index and rebuilds the
    // result DOM, which janks on large sites if run per keystroke.
    var searchDebounce = null;
    input.addEventListener('input', function () {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(function () { render(input.value); }, 120);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePanel();
      closeSidebar();
      document.querySelectorAll('.site-nav-item.has-children.is-open').forEach(function (item) {
        item.classList.remove('is-open');
        var btn = item.querySelector('.site-nav-parent');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      openPanel();
    }
  });

  // ---- Sidebar drawer (narrow screen) ----
  var drawer = document.getElementById('paper-sidebar-drawer');
  var sidebarBackdrop = document.querySelector('.sidebar-backdrop');
  var sidebarToggleBtns = document.querySelectorAll('.js-sidebar-toggle');
  var sidebarCloseBtns = document.querySelectorAll('.js-sidebar-close');

  function openSidebar() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('is-open');
    sidebarToggleBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    document.body.classList.add('no-scroll');
  }

  function closeSidebar() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('is-open');
    sidebarToggleBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (!panel || !panel.classList.contains('is-open')) {
      document.body.classList.remove('no-scroll');
    }
  }

  sidebarToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (drawer && drawer.classList.contains('is-open')) closeSidebar();
      else openSidebar();
    });
  });

  sidebarCloseBtns.forEach(function (btn) {
    btn.addEventListener('click', closeSidebar);
  });

  // Tapping a nav link inside the drawer should dismiss the drawer; otherwise
  // it stays floating during the page transition and reappears briefly on the
  // next page before the matchMedia handler can close it.
  if (drawer) {
    drawer.querySelectorAll('.site-nav-drawer a').forEach(function (a) {
      a.addEventListener('click', closeSidebar);
    });
  }

  // Close drawer when window grows past breakpoint
  var mq = window.matchMedia('(min-width: 961px)');
  function handleBpChange(e) { if (e.matches) closeSidebar(); }
  if (mq.addEventListener) mq.addEventListener('change', handleBpChange);
  else if (mq.addListener) mq.addListener(handleBpChange);

  // ---- Code block: language label + copy + collapse ----
  var ICON_COPY =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'class="lucide lucide-copy" aria-hidden="true">' +
    '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>' +
    '<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  var ICON_CHECK =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ' +
    'class="lucide lucide-check" aria-hidden="true">' +
    '<path d="M20 6 9 17l-5-5"/></svg>';
  var ICON_CHEVRON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'class="lucide lucide-chevron-up" aria-hidden="true">' +
    '<path d="m18 15-6-6-6 6"/></svg>';

  var LANG_LABELS = {
    js: 'JavaScript', javascript: 'JavaScript', jsx: 'JSX',
    ts: 'TypeScript', typescript: 'TypeScript', tsx: 'TSX',
    html: 'HTML', xml: 'XML', css: 'CSS', scss: 'SCSS', sass: 'Sass', less: 'Less',
    json: 'JSON', yaml: 'YAML', yml: 'YAML', toml: 'TOML', md: 'Markdown', markdown: 'Markdown',
    sh: 'Shell', bash: 'Bash', zsh: 'Zsh', shell: 'Shell', powershell: 'PowerShell', ps1: 'PowerShell',
    py: 'Python', python: 'Python', rb: 'Ruby', ruby: 'Ruby',
    go: 'Go', rs: 'Rust', rust: 'Rust', java: 'Java', kt: 'Kotlin', swift: 'Swift',
    c: 'C', cpp: 'C++', 'c++': 'C++', cs: 'C#', csharp: 'C#',
    php: 'PHP', sql: 'SQL', graphql: 'GraphQL', gql: 'GraphQL',
    vue: 'Vue', svelte: 'Svelte', ejs: 'EJS', diff: 'Diff', dockerfile: 'Dockerfile',
    plain: '', plaintext: '', text: '', txt: '', none: '', raw: ''
  };

  function detectLang(block) {
    var cls = block.className.split(/\s+/);
    for (var i = 0; i < cls.length; i++) {
      var c = cls[i].toLowerCase();
      if (!c || c === 'highlight' || c === 'hljs') continue;
      if (LANG_LABELS.hasOwnProperty(c)) return LANG_LABELS[c];
      if (c.length <= 12 && /^[a-z0-9+#-]+$/.test(c)) {
        return c.charAt(0).toUpperCase() + c.slice(1);
      }
    }
    return '';
  }

  function getCodeText(block) {
    var codeCell = block.querySelector('td.code');
    var source = codeCell || block.querySelector('pre') || block;
    return source.innerText.replace(/\s+$/, '');
  }

  function isSingleLineCodeBlock(block) {
    var codeLines = block.querySelectorAll('td.code pre .line');
    if (codeLines.length) return codeLines.length === 1;

    var text = getCodeText(block);
    return text ? text.split(/\r\n|\r|\n/).length === 1 : false;
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-2000px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function enhanceCodeBlock(block) {
    if (block.dataset.flatpaperEnhanced) return;
    block.dataset.flatpaperEnhanced = '1';

    var isSingleLine = isSingleLineCodeBlock(block);
    var useCompactSingleLine = isSingleLine && document.body.dataset.codeTheme === 'simple';
    if (useCompactSingleLine) block.classList.add('is-single-line');

    var bar = document.createElement('div');
    bar.className = 'code-bar';

    var lang = detectLang(block);
    if (lang && !useCompactSingleLine) {
      var label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = lang;
      bar.appendChild(label);
    }

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'code-action code-copy';
    copyBtn.setAttribute('aria-label', t('code.copy'));
    copyBtn.innerHTML = ICON_COPY;
    copyBtn.addEventListener('click', function () {
      var text = getCodeText(block);
      var done = function () {
        copyBtn.classList.add('is-copied');
        copyBtn.innerHTML = ICON_CHECK;
        setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          copyBtn.innerHTML = ICON_COPY;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text); done();
      }
    });
    bar.appendChild(copyBtn);

    if (!useCompactSingleLine) {
      var foldBtn = document.createElement('button');
      foldBtn.type = 'button';
      foldBtn.className = 'code-action code-fold';
      foldBtn.setAttribute('aria-label', t('code.collapse'));
      foldBtn.setAttribute('aria-expanded', 'true');
      foldBtn.innerHTML = ICON_CHEVRON;
      foldBtn.addEventListener('click', function () {
        var folded = block.classList.toggle('is-folded');
        foldBtn.setAttribute('aria-expanded', folded ? 'false' : 'true');
        foldBtn.setAttribute('aria-label', folded ? t('code.expand') : t('code.collapse'));
      });
      bar.appendChild(foldBtn);
    }

    block.appendChild(bar);

    if (!useCompactSingleLine) setupGutterInteractions(block);
  }

  function copyText(text, onDone) {
    var done = function () { if (typeof onDone === 'function') onDone(); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text); done();
    }
  }

  function setupGutterInteractions(block) {
    var gutterPre = block.querySelector('td.gutter pre');
    var codePre = block.querySelector('td.code pre');
    if (!gutterPre || !codePre) return;
    var gutterLines = gutterPre.querySelectorAll('.line');
    var codeLines = codePre.querySelectorAll('.line');
    if (!gutterLines.length || gutterLines.length !== codeLines.length) return;

    Array.prototype.forEach.call(gutterLines, function (gLine, idx) {
      var cLine = codeLines[idx];
      var clickTimer = null;

      gLine.addEventListener('click', function () {
        if (clickTimer) return;
        clickTimer = setTimeout(function () {
          clickTimer = null;
          gLine.classList.toggle('is-highlight');
          cLine.classList.toggle('is-highlight');
        }, 220);
      });

      gLine.addEventListener('dblclick', function () {
        if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
        copyText(cLine.innerText, function () {
          gLine.classList.add('is-copied');
          setTimeout(function () { gLine.classList.remove('is-copied'); }, 500);
        });
      });
    });
  }

  document.querySelectorAll('.article-content .highlight').forEach(enhanceCodeBlock);

  // ---- Heading anchors ----
  function slugify(text) {
    return String(text).trim().toLowerCase()
      .replace(/[\s　]+/g, '-')
      .replace(/[^\w一-龥\-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  (function () {
    var headings = document.querySelectorAll('.article-content h2, .article-content h3');
    if (!headings.length) return;
    var used = {};

    headings.forEach(function (h) {
      var id = h.id;
      if (!id) {
        var base = slugify(h.textContent) || 'section';
        id = base;
        var n = 1;
        while (used[id] || document.getElementById(id)) {
          id = base + '-' + (++n);
        }
        h.id = id;
      }
      used[id] = true;

      if (h.querySelector('.heading-anchor')) return;
      var link = document.createElement('a');
      link.className = 'heading-anchor';
      link.href = '#' + id;
      link.setAttribute('aria-label', t('heading.anchor', h.textContent));
      h.insertBefore(link, h.firstChild);
    });

    // Smooth scroll + update URL hash without jumping past sticky header
    document.querySelectorAll('.article-content .heading-anchor').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var hash = a.getAttribute('href');
        if (!hash || hash.charAt(0) !== '#') return;
        // Use getElementById to avoid SyntaxError when the id starts with a digit
        // or contains characters that aren't valid CSS selectors (eg. CJK without escaping).
        var id;
        try { id = decodeURIComponent(hash.slice(1)); } catch (err) { id = hash.slice(1); }
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.replaceState(null, '', hash);
      });
    });
  })();

  // ---- TOC scrollspy ----
  (function () {
    var tocEl = document.querySelector('.toc-content');
    if (!tocEl) return;
    var tocCard = tocEl.closest ? tocEl.closest('.toc-card') : document.querySelector('.toc-card');
    var toggleAll = tocCard ? tocCard.querySelector('[data-action="toggle-toc"]') : null;
    var links = Array.prototype.slice.call(tocEl.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;
    var tocExpanded = false;

    function setTocToggleLabel() {
      if (!toggleAll) return;
      var label = tocExpanded ? t('toc.collapse_all') : t('toc.expand_all');
      toggleAll.setAttribute('aria-label', label);
      toggleAll.setAttribute('title', label);
      toggleAll.setAttribute('aria-pressed', tocExpanded ? 'true' : 'false');
    }

    function setExpanded(next) {
      tocExpanded = !!next;
      if (tocCard) tocCard.classList.toggle('is-expanded', tocExpanded);
      setTocToggleLabel();
    }

    function revealActiveBranch(target) {
      if (!tocCard || tocExpanded) return;
      tocEl.querySelectorAll('li.is-open').forEach(function (li) {
        li.classList.remove('is-open');
      });
      var li = target && target.closest ? target.closest('li') : null;
      while (li && tocEl.contains(li)) {
        li.classList.add('is-open');
        li = li.parentElement ? li.parentElement.closest('li') : null;
      }
    }

    if (toggleAll) {
      toggleAll.addEventListener('click', function () {
        setExpanded(!tocExpanded);
        if (!tocExpanded) {
          var active = tocEl.querySelector('a.is-active');
          if (active) revealActiveBranch(active);
        }
      });
    }
    setExpanded(false);

    var byId = {};
    var headings = [];
    links.forEach(function (a) {
      var rawId = a.getAttribute('href').slice(1);
      var id;
      try { id = decodeURIComponent(rawId); } catch (err) { id = rawId; }
      var h = document.getElementById(id);
      if (h) {
        byId[id] = a;
        headings.push(h);
      }
    });
    if (!headings.length) return;

    var visible = new Set();
    var activeId = null;
    function activate(id) {
      // Scroll/observer handlers re-derive the active heading constantly;
      // bail before the class churn and layout reads when nothing changed.
      if (id === activeId) return;
      activeId = id;
      links.forEach(function (a) { a.classList.remove('is-active'); });
      var target = byId[id];
      if (!target) return;
      target.classList.add('is-active');
      revealActiveBranch(target);
      // Keep the active link inside the visible scroll area of the TOC
      var linkTop = target.offsetTop;
      var linkBottom = linkTop + target.offsetHeight;
      var viewTop = tocEl.scrollTop;
      var viewBottom = viewTop + tocEl.clientHeight;
      if (linkTop < viewTop) {
        tocEl.scrollTo({ top: linkTop - 20, behavior: 'smooth' });
      } else if (linkBottom > viewBottom) {
        tocEl.scrollTo({ top: linkBottom - tocEl.clientHeight + 20, behavior: 'smooth' });
      }
    }

    function pickActive() {
      if (!visible.size) return;
      // pick the topmost visible heading
      var top = null;
      visible.forEach(function (h) {
        if (!top || h.getBoundingClientRect().top < top.getBoundingClientRect().top) top = h;
      });
      if (top) activate(top.id);
    }

    if (location.hash) {
      var hashId;
      try { hashId = decodeURIComponent(location.hash.slice(1)); } catch (err) { hashId = location.hash.slice(1); }
      if (byId[hashId]) activate(hashId);
    } else {
      activate(headings[0].id);
    }

    if (!('IntersectionObserver' in window)) return;

    var nearBottom = false;
    function atPageEnd() {
      // Treat the last 80px (or any single-line slack) as "page end"
      return (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 80);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      });
      if (nearBottom) {
        // Once the page is at its end, lock the active item to the last heading
        // — the bottom slack means later sections can never reach the spy region.
        activate(headings[headings.length - 1].id);
        return;
      }
      pickActive();
    }, {
      rootMargin: '-90px 0px -65% 0px',
      threshold: 0
    });

    headings.forEach(function (h) { observer.observe(h); });

    window.addEventListener('scroll', function () {
      nearBottom = atPageEnd();

      if (nearBottom) {
        activate(headings[headings.length - 1].id);
        return;
      }

      // Fallback for very long sections: activate on scroll when nothing is in the spy band
      if (visible.size) return;
      var pos = window.scrollY + 100;
      var current = null;
      headings.forEach(function (h) {
        if (h.offsetTop <= pos) current = h;
      });
      if (current) activate(current.id);
    }, { passive: true });
  })();

  // ---- Featured carousel ----
  document.querySelectorAll('.featured-carousel').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.featured-paper'));
    if (slides.length < 2) return;

    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-dot'));
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var current = 0;
    var autoplay = parseInt(carousel.getAttribute('data-autoplay'), 10) || 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }

    function next() { show(current + 1); }
    function prev() { show(current - 1); }

    function startAuto() {
      if (!autoplay) return;
      stopAuto();
      timer = setInterval(next, autoplay);
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); startAuto(); });
    });

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);

    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); startAuto(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next(); startAuto(); }
    });

    startAuto();
  });

  // ---- Tabs block ----
  document.querySelectorAll('.flatpaper-tabs').forEach(function (group) {
    var navItems = group.querySelectorAll('.flatpaper-tabs__nav-item');
    var panels = group.querySelectorAll('.flatpaper-tabs__panel');
    var collapsible = group.classList.contains('is-collapsible');

    function activate(index) {
      navItems.forEach(function (b, i) {
        var on = i === index;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(function (p, i) {
        var on = i === index;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
    }

    navItems.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        if (collapsible && btn.classList.contains('is-active')) {
          // collapse mode: re-click hides
          btn.classList.remove('is-active');
          btn.setAttribute('aria-selected', 'false');
          panels[i].classList.remove('is-active');
          panels[i].setAttribute('hidden', '');
          return;
        }
        activate(i);
      });
    });
  });

  // ---- Reactions footer: comment / share / reward buttons ----
  // Comment button scrolls to whichever comment system is mounted (Twikoo /
  // Artalk), falling back to the wrapping .comments-section. Share button
  // uses the Web Share API and falls back to clipboard copy. Reward buttons
  // (toggle-pop) show a popover bubble holding a custom image (QR code).
  function setPopOpen(btn, isOpen) {
    if (!btn) return;
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (!isOpen) btn.removeAttribute('data-pop-pinned');
    var bubble = btn.parentNode && btn.parentNode.querySelector('.reaction-bubble');
    if (bubble) bubble.hidden = !isOpen;
  }

  function closeAllPops(except) {
    var open = document.querySelectorAll('.reaction--reward[aria-expanded="true"]');
    for (var i = 0; i < open.length; i++) {
      if (open[i] === except) continue;
      setPopOpen(open[i], false);
    }
  }

  function openPop(btn, pin) {
    closeAllPops(btn);
    setPopOpen(btn, true);
    if (pin) btn.setAttribute('data-pop-pinned', 'true');
  }

  var rewardPops = document.querySelectorAll('.reaction-pop');
  for (var rp = 0; rp < rewardPops.length; rp++) {
    (function (pop) {
      var btn = pop.querySelector('.reaction--reward[data-action="toggle-pop"]');
      if (!btn) return;
      var closeTimer = null;

      function clearCloseTimer() {
        if (!closeTimer) return;
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      function closeIfUnpinned() {
        clearCloseTimer();
        closeTimer = window.setTimeout(function () {
          closeTimer = null;
          if (btn.getAttribute('data-pop-pinned') === 'true') return;
          if (pop.contains(document.activeElement)) return;
          setPopOpen(btn, false);
        }, 120);
      }

      pop.addEventListener('mouseenter', function () {
        clearCloseTimer();
        openPop(btn, false);
      });

      pop.addEventListener('mouseleave', closeIfUnpinned);

      pop.addEventListener('focusin', function () {
        clearCloseTimer();
        openPop(btn, false);
      });

      pop.addEventListener('focusout', closeIfUnpinned);
    })(rewardPops[rp]);
  }

  document.addEventListener('click', function (e) {
    // Clicks inside an open bubble (e.g. the QR image) keep it open.
    if (e.target.closest && e.target.closest('.reaction-bubble')) return;
    var btn = e.target.closest && e.target.closest('[data-action]');
    if (!btn) { closeAllPops(null); return; }
    var action = btn.getAttribute('data-action');
    // Any action other than toggling a popover dismisses open popovers.
    if (action !== 'toggle-pop') closeAllPops(null);
    if (action === 'scroll-to-comments') {
      var anchor = document.getElementById('tcomment')
                || document.getElementById('artalk-comments')
                || document.querySelector('.comments-section');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'scroll-to-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'share') {
      var data = { title: document.title, url: location.href };
      if (navigator.share) {
        navigator.share(data).catch(function () { /* user cancelled */ });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href).catch(function () { fallbackCopy(location.href); });
      } else {
        fallbackCopy(location.href);
      }
    } else if (action === 'toggle-pop') {
      var willOpen = btn.getAttribute('aria-expanded') !== 'true'
                  || btn.getAttribute('data-pop-pinned') !== 'true';
      if (willOpen) openPop(btn, true);
      else setPopOpen(btn, false);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllPops(null);
  });

  // ---- Fancybox: wrap article images, then bind the lightbox ----
  // Runs ONLY when the layout has marked <html data-fancybox-enabled="1">,
  // which the layout emits when theme.fancybox.enable is true AND the current
  // page is a post or layout: page. Without that flag we don't touch the DOM
  // at all — images stay plain <img>, no surprise click-to-raw behavior.
  // Anchors are added on script run (DOM is already parsed since js/main is
  // injected at body end), Fancybox.bind runs on window 'load' once the
  // deferred SDK is available.
  // Skipped: <img> already inside an <a>; <img class="no-zoom">; <img> inside
  // a <picture> (wrapping the <img> alone breaks picture > source* + img
  // responsive selection — picture support could re-parent the whole
  // <picture> in a future iteration).
  if (document.documentElement.getAttribute('data-fancybox-enabled') === '1') {
    var imgs = document.querySelectorAll('.article-content img');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (!img.src) continue;
      if (img.closest('a')) continue;
      if (img.closest('picture')) continue;
      if (img.classList.contains('no-zoom')) continue;
      var a = document.createElement('a');
      a.href = img.currentSrc || img.src;
      a.setAttribute('data-fancybox', 'gallery');
      if (img.alt) a.setAttribute('data-caption', img.alt);
      img.parentNode.insertBefore(a, img);
      a.appendChild(img);
    }
    window.addEventListener('load', function () {
      if (typeof window.Fancybox !== 'undefined') {
        window.Fancybox.bind('[data-fancybox="gallery"]');
      }
    });
  }

  // ---- Back-to-top button: reveal once the reader has scrolled down ----
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    // Drop the no-JS fallback attribute; visibility is now class-driven so it
    // can fade rather than snap via display:none.
    backToTop.hidden = false;
    var bttThreshold = 600;
    var bttTicking = false;
    var syncBackToTop = function () {
      bttTicking = false;
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;
      backToTop.classList.toggle('is-visible', scrolled >= bttThreshold);
    };
    window.addEventListener('scroll', function () {
      if (bttTicking) return;
      bttTicking = true;
      window.requestAnimationFrame(syncBackToTop);
    }, { passive: true });
    syncBackToTop();
  }

  bindGlobalOnce();
})();
