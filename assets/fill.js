/* ============================================================
   Xeext — remplissage des boutons depuis le point d'entrée du curseur
   Au survol, on positionne le cercle de remplissage là où le curseur
   arrive, et on le dimensionne pour couvrir tout le bouton.
   ============================================================ */
(function () {
  function setup() {
    var btns = document.querySelectorAll(".btn--primary, .nav__cta");
    btns.forEach(function (btn) {
      function place(e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        // diamètre : deux fois la distance jusqu'au coin le plus éloigné du point d'entrée
        var d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
        btn.style.setProperty("--fx", x + "px");
        btn.style.setProperty("--fy", y + "px");
        btn.style.setProperty("--fd", d + "px");
      }
      // pointerenter : le cercle part du point d'entrée
      btn.addEventListener("pointerenter", place);
      // pointerleave : le cercle se résorbe vers le point de sortie
      btn.addEventListener("pointerleave", function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty("--fx", (e.clientX - r.left) + "px");
        btn.style.setProperty("--fy", (e.clientY - r.top) + "px");
      });
    });
  }

  if (document.readyState !== "loading") setup();
  else document.addEventListener("DOMContentLoaded", setup);
})();
