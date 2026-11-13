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
      window.__cardsAlive = { tier: 'off', tilts: 0 }; // prefers-reduced-motion
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

    // Lively cards (home): tilt + light reflection + idle float (CSS).
    // off: saveData. lite: coarse pointer / low-power, tilt only while pressed. full: pointer tilt.
    var FEAT = '.featured-strip .card';
    const TILT = 6;
    var alive = window.__cardsAlive = { tier: 'off', tilts: 0 };
    var conn = navigator.connection;
    if (d.querySelector(FEAT) && !(conn && conn.saveData)) {
      var lowPower = window.matchMedia('(pointer: coarse)').matches ||
        (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
      var full = !lowPower && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      alive.tier = full ? 'full' : 'lite';
      root.classList.add(full ? 'cards-alive--full' : 'cards-alive--lite');
      var tiltCard = function (c, x, y) {
        var b = c.getBoundingClientRect();
        var px = (x - b.left) / b.width, py = (y - b.top) / b.height;
        c.style.setProperty('--ry', ((px - 0.5) * 2 * TILT).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((0.5 - py) * 2 * TILT).toFixed(2) + 'deg');
        c.style.setProperty('--mx', (x - b.left) + 'px');
        c.style.setProperty('--my', (y - b.top) + 'px');
        c.classList.add('is-lit', 'is-tilting');
        alive.tilts++;
      };
      var flatten = function (c) {
        c.style.removeProperty('--rx');
        c.style.removeProperty('--ry');
        c.classList.remove('is-lit', 'is-tilting');
      };
      var araf = 0, alast, active = null;
      var onMove = function (e) {
        var c = e.target.closest && e.target.closest(FEAT);
        if (active && active !== c) flatten(active);
        active = c;
        if (!c) return;
        alast = e;
        if (araf) return;
        araf = requestAnimationFrame(function () { araf = 0; if (active) tiltCard(active, alast.clientX, alast.clientY); });
      };
      var release = function () { if (active) { flatten(active); active = null; } };
      if (full) {
        d.addEventListener('pointermove', onMove, { passive: true });
        d.addEventListener('pointerleave', release);
        d.documentElement.addEventListener('mouseleave', release);
      } else {
        d.addEventListener('pointerdown', function (e) {
          var c = e.target.closest && e.target.closest(FEAT);
          if (c) { active = c; tiltCard(c, e.clientX, e.clientY); }
        }, { passive: true });
      }
      d.addEventListener('pointerup', release, { passive: true });
      d.addEventListener('pointercancel', release, { passive: true });
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
