/* ============================================================
   Xeext — décompte du chiffre signature : 30% → 5%
   Se déclenche une fois, à l'arrivée de la section dans le viewport.
   ============================================================ */
(function () {
  function init() {
    var el = document.getElementById("chiffre-num");
    if (!el) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var started = false;

    function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }

    function run() {
      if (started) return;
      started = true;

      if (reduce) { el.textContent = "5%"; return; }

      var from = 30, to = 5, dur = 1500, t0 = null;
      el.textContent = from + "%";

      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var v = Math.round(from + (to - from) * easeOutCubic(p));
        el.textContent = v + "%";
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = "5%";
      }
      requestAnimationFrame(frame);
      // filet de sécurité : valeur finale garantie
      setTimeout(function () { el.textContent = "5%"; }, dur + 500);
    }

    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.82 && r.bottom > 0) {
        run();
        window.removeEventListener("scroll", onScroll);
      }
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { check(); ticking = false; });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", check);
    check();
    setTimeout(check, 300);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
