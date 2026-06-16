/* ============================================================
   Xeext — animations de la page « À propos »
   - Titre révélé mot par mot
   - Compteurs animés à l'arrivée dans le viewport
   - Tracé du X (longueur de trait calculée)
   - Déclencheurs au scroll (ajout de .in une seule fois)
   ============================================================ */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Titre mot par mot ---- */
  function splitWords() {
    document.querySelectorAll("[data-words]").forEach(function (el) {
      var text = el.textContent.trim();
      el.textContent = "";
      var words = text.split(/\s+/);
      words.forEach(function (w, i) {
        var mask = document.createElement("span");
        mask.className = "word-mask";
        var inner = document.createElement("span");
        inner.style.setProperty("--i", i);
        inner.textContent = w;
        mask.appendChild(inner);
        el.appendChild(mask);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      });
    });
  }

  /* ---- 2. Préparer le tracé du X (dasharray = longueur réelle) ---- */
  function prepXdraw() {
    document.querySelectorAll(".xdraw .stroke").forEach(function (path) {
      var len = path.getTotalLength ? path.getTotalLength() : 200;
      path.style.setProperty("--len", len);
    });
  }

  /* ---- 3. Compteurs ---- */
  function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }
  function fmt(n) { return new Intl.NumberFormat("fr-FR").format(n); }

  function runCount(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    var dur = parseInt(el.getAttribute("data-duration"), 10) || 1400;
    var numEl = el.querySelector(".n") || el;
    if (reduce) { numEl.textContent = fmt(to); return; }
    var t0 = null;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var v = Math.round(to * easeOutCubic(p));
      numEl.textContent = fmt(v);
      if (p < 1) requestAnimationFrame(frame);
      else numEl.textContent = fmt(to);
    }
    requestAnimationFrame(frame);
  }

  /* ---- 4. Observateur « une fois » au scroll ---- */
  var watchers = [];
  function watch(el, cb, ratio) {
    watchers.push({ el: el, cb: cb, ratio: ratio || 0.82, done: false });
  }
  function check() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    watchers.forEach(function (w) {
      if (w.done) return;
      var r = w.el.getBoundingClientRect();
      if (r.top < vh * w.ratio && r.bottom > 0) {
        w.done = true;
        w.cb(w.el);
      }
    });
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { check(); ticking = false; });
  }

  function init() {
    splitWords();
    prepXdraw();

    // titres mot par mot
    document.querySelectorAll(".words").forEach(function (el) {
      watch(el, function (n) { n.classList.add("in"); }, 0.92);
    });
    // sections à révéler (.in déclenche les transitions CSS internes)
    document.querySelectorAll("[data-inview]").forEach(function (el) {
      watch(el, function (n) { n.classList.add("in"); });
    });
    // compteurs
    document.querySelectorAll("[data-count]").forEach(function (el) {
      watch(el, runCount);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", check);
    check();
    requestAnimationFrame(check);
    setTimeout(check, 200);
    setTimeout(check, 600);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
