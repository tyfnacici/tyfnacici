(function () {
  var d = document, root = d.documentElement;
  try {
    var nav = d.querySelector('.site-nav');
    if (nav) {
      var scrolled = false;
      var onScroll = function () {
        var v = window.scrollY > 8;
        if (v !== scrolled) { scrolled = v; nav.classList.toggle('is-scrolled', v); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      root.classList.remove('js');
      return;
    }

    // Scroll reveal. Keep SEL in sync with the reveal block in liquid.css.
    var SEL = '.section-head,.featured-strip>*,.blog-item,.post-entry,.page-header,' +
      '.post-single .post-header,.toc,.paginav,.hero-panel,.timeline-item,.giscus-wrap';
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    var counts = new Map();
    d.querySelectorAll(SEL).forEach(function (el) {
      var n = counts.get(el.parentNode) || 0;
      counts.set(el.parentNode, n + 1);
      el.style.setProperty('--i', Math.min(n, 5));
      io.observe(el);
    });

    // Cursor spotlight on cards (fine pointers only, one rAF-throttled listener).
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var CARD = '.card,.post-entry,.paginav a', raf = 0, last;
      d.addEventListener('pointermove', function (e) {
        last = e;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var c = last.target.closest && last.target.closest(CARD);
          if (!c) return;
          var b = c.getBoundingClientRect();
          c.style.setProperty('--mx', (last.clientX - b.left) + 'px');
          c.style.setProperty('--my', (last.clientY - b.top) + 'px');
        });
      }, { passive: true });
    }

    // Material-style ripple on buttons.
    d.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.btn');
      if (!b) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
      var el = d.createElement('span');
      el.className = 'lg-ripple';
      el.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) +
        'px;top:' + (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(el);
      setTimeout(function () { el.remove(); }, 700);
    }, { passive: true });
  } catch (err) {
    root.classList.remove('js');
  }
})();
