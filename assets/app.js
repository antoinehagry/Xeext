/* ============================================================
   Xeext — comportements globaux
   Révélation au scroll (fade + translate-up), respect reduced-motion.
   - getBoundingClientRect : robuste en iframe / preview.
   - Filet de sécurité : état final forcé après l'animation, afin que
     le contenu reste visible même si l'animation ne se peint pas.
   ============================================================ */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(el) {
    el.classList.add("in");
    if (!reduce) {
      // après l'animation, fige l'état final (visible) sans dépendre du rendu
      setTimeout(function () { el.classList.add("shown"); }, 950);
    }
  }

  function check() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var els = document.querySelectorAll(".reveal:not(.in)");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > -40) show(el);
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { check(); ticking = false; });
  }

  function init() {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", check);
    check();
    requestAnimationFrame(check);
    setTimeout(check, 120);
    setTimeout(check, 400);
    // exposé pour les modules qui injectent du contenu (catalogue, fiche)
    window.__xeextReveal = check;
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
