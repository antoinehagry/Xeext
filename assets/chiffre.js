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

    // Couleur du chiffre : rouge à 30% → bleu (accent) à 5%, interpolée.
    function hexToRgb(h) {
      h = (h || "").trim().replace("#", "");
      if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    var RED = [226, 59, 48]; // #e23b30
    var BLUE = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#1f3df0");
    if (isNaN(BLUE[0])) BLUE = [31, 61, 240];
    function mix(a, b, t) {
      return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," +
        Math.round(a[1] + (b[1] - a[1]) * t) + "," +
        Math.round(a[2] + (b[2] - a[2]) * t) + ")";
    }

    // Avant déclenchement : afficher déjà 30% en rouge (on ne doit pas voir 5%
    // tant que le décompte n'a pas démarré). Le HTML garde "5%" comme repli (sans
    // JS) et reduced-motion affichera 5% directement au déclenchement.
    if (!reduce) { el.textContent = "30%"; el.style.color = mix(RED, BLUE, 0); }

    function run() {
      if (started) return;
      started = true;

      if (reduce) { el.textContent = "5%"; el.style.color = mix(RED, BLUE, 1); return; }

      var from = 30, to = 5, dur = 2200, t0 = null;
      el.textContent = from + "%";
      el.style.color = mix(RED, BLUE, 0);

      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = easeOutCubic(p);
        el.textContent = Math.round(from + (to - from) * e) + "%";
        el.style.color = mix(RED, BLUE, e);
        if (p < 1) requestAnimationFrame(frame);
        else { el.textContent = "5%"; el.style.color = mix(RED, BLUE, 1); }
      }
      requestAnimationFrame(frame);
      // filet de sécurité : valeur + couleur finales garanties
      setTimeout(function () { el.textContent = "5%"; el.style.color = mix(RED, BLUE, 1); }, dur + 500);
    }

    var section = el.closest("section") || el.parentElement;
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var r = section.getBoundingClientRect();
      // déclenche quand la section est entièrement visible ; si elle est plus
      // haute que l'écran, quand elle remplit tout le viewport
      var fullyVisible = r.top >= 0 && r.bottom <= vh;
      var fillsViewport = r.top <= 0 && r.bottom >= vh;
      if (fullyVisible || fillsViewport) {
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
