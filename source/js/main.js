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

  // Global, idempotent bindings (theme toggle, global keydown, viewport
  // breakpoint listener) go through bindGlobalOnce() and are guarded against
  // double-binding via a dataset flag. Everything else binds inline on
  // initial DOM nodes — fine for a multi-page Hexo build.
  var root = document.documentElement;
  var stored = safeStorage.get('flatpaper-mode');
  if (stored === 'dark') root.classList.add('dark-mode');

  function bindGlobalOnce() {
    var toggle = document.querySelector('.theme-toggle');
    if (toggle && !toggle.dataset.flatpaperBound) {
      toggle.dataset.flatpaperBound = '1';
      toggle.addEventListener('click', function () {
        root.classList.toggle('dark-mode');
        safeStorage.set('flatpaper-mode', root.classList.contains('dark-mode') ? 'dark' : 'light');
      });
    }
  }

  // ---- Search popover ----
  var panel = document.querySelector('.search-panel');
  var input = document.getElementById('flatpaper-search');
  var results = document.querySelector('.search-results');
  var indexEl = document.getElementById('flatpaper-post-index');
  var posts = [];

  if (indexEl) {
    try { posts = JSON.parse(indexEl.textContent.trim() || '[]'); } catch (e) { posts = []; }
  }

  function openPanel() {
    if (!panel) return;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(function () { if (input) input.focus(); }, 60);
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  // Append text into `parent`, wrapping every case-insensitive match of `keyword`
  // in a <mark>. Uses textContent only — no HTML parsing, so post titles or
  // excerpts containing < > & or full tags can never inject DOM.
  function appendHighlighted(parent, text, keyword) {
    if (!text) return;
    if (!keyword) { parent.appendChild(document.createTextNode(text)); return; }
    var lower = text.toLowerCase();
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
      empty.textContent = '输入关键词后显示匹配的文章';
      results.appendChild(empty);
      return;
    }
    var hits = posts.filter(function (p) {
      return (p.title && p.title.toLowerCase().indexOf(keyword) > -1) ||
             (p.text && p.text.toLowerCase().indexOf(keyword) > -1);
    }).slice(0, 12);

    if (!hits.length) {
      var none = document.createElement('p');
      none.className = 'search-empty';
      none.textContent = '没有找到与 "' + query + '" 相关的文章';
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
    input.addEventListener('input', function () { render(input.value); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePanel(); closeSidebar(); }
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

    var bar = document.createElement('div');
    bar.className = 'code-bar';

    var lang = detectLang(block);
    if (lang) {
      var label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = lang;
      bar.appendChild(label);
    }

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'code-action code-copy';
    copyBtn.setAttribute('aria-label', '复制代码');
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

    var foldBtn = document.createElement('button');
    foldBtn.type = 'button';
    foldBtn.className = 'code-action code-fold';
    foldBtn.setAttribute('aria-label', '折叠代码');
    foldBtn.setAttribute('aria-expanded', 'true');
    foldBtn.innerHTML = ICON_CHEVRON;
    foldBtn.addEventListener('click', function () {
      var folded = block.classList.toggle('is-folded');
      foldBtn.setAttribute('aria-expanded', folded ? 'false' : 'true');
      foldBtn.setAttribute('aria-label', folded ? '展开代码' : '折叠代码');
    });
    bar.appendChild(foldBtn);

    block.appendChild(bar);
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
      link.setAttribute('aria-label', '链接到此节: ' + h.textContent);
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
    if (!tocEl || !('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(tocEl.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    var byId = {};
    var headings = [];
    links.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      var h = document.getElementById(id);
      if (h) {
        byId[id] = a;
        headings.push(h);
      }
    });
    if (!headings.length) return;

    var visible = new Set();
    function activate(id) {
      links.forEach(function (a) { a.classList.remove('is-active'); });
      var target = byId[id];
      if (!target) return;
      target.classList.add('is-active');
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
      var wasNearBottom = nearBottom;
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

  // ---- Reactions footer: comment / share buttons ----
  // Comment button jumps to #tcomment when Twikoo is mounted on the page;
  // share button uses the Web Share API, falling back to clipboard copy.
  // Heart button has no behavior — kept as a decorative placeholder.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    if (action === 'scroll-to-comments') {
      var anchor = document.getElementById('tcomment');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'share') {
      var data = { title: document.title, url: location.href };
      if (navigator.share) {
        navigator.share(data).catch(function () { /* user cancelled */ });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href);
      }
    }
  });

  bindGlobalOnce();
})();
