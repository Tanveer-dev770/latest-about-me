/* ==========================================================================
   [YOUR NAME] — Personal Portfolio
   Scroll-reveal animations using IntersectionObserver.
   Respects prefers-reduced-motion (CSS also disables transitions).
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = el.getAttribute("data-delay");
        if (delay) el.style.transitionDelay = delay;
        requestAnimationFrame(function () {
          el.classList.add("is-visible");
        });
        obs.unobserve(el); // animate once
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px"
    });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // No animation support / reduced motion: show everything immediately.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();