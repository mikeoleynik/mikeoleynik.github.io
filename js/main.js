/*
 * Two small progressive enhancements, both skipped gracefully:
 * 1. Scroll reveal for sections (disabled with prefers-reduced-motion).
 * 2. Scrollspy — highlights the current section in the header nav.
 * Without JS (or IntersectionObserver) the page stays fully visible.
 */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Scroll reveal ------------------------------------------------- */
  if (!reduceMotion) {
    var revealTargets = document.querySelectorAll('[data-reveal]');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealTargets.forEach(function (el) {
      // Never hide what is already on screen at load.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  /* --- Scrollspy ------------------------------------------------------ */
  bindScrollspy('.site-header__nav a[href^="#"]');
  bindScrollspy('.article-toc a[href^="#"]');

  function bindScrollspy(selector) {
    var navLinks = document.querySelectorAll(selector);
    var linkById = {};

    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      if (document.getElementById(id)) linkById[id] = link;
    });

    if (!Object.keys(linkById).length) return;

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) { link.removeAttribute('aria-current'); });
        linkById[entry.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });

    Object.keys(linkById).forEach(function (id) {
      spyObserver.observe(document.getElementById(id));
    });
  }
})();
