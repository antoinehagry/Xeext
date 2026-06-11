/* ============================================================
   Xeext — menu mobile.
   Regroupe les liens de section, le CTA et le compte dans un panneau
   unique (.nav__menu), neutre sur desktop et déroulant sur mobile,
   puis câble le bouton burger pour l'ouvrir / le fermer.
   ============================================================ */
(function () {
  function init() {
    var nav = document.querySelector(".nav");
    var inner = nav && nav.querySelector(".nav__inner");
    var burger = inner && inner.querySelector(".nav__burger");
    if (!inner || !burger) return;

    // Regroupe les éléments de droite dans un conteneur unique.
    var menu = inner.querySelector(".nav__menu");
    if (!menu) {
      menu = document.createElement("div");
      menu.className = "nav__menu";
      menu.id = "nav-menu";
      var links = inner.querySelector(".nav__links");
      inner.insertBefore(menu, links || burger);
      ["nav__links", "nav__cta", "nav__account"].forEach(function (cls) {
        var el = inner.querySelector("." + cls);
        if (el) menu.appendChild(el);
      });
    }

    function close() {
      nav.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
    }
    function toggle(e) {
      e.stopPropagation();
      var open = nav.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-controls", "nav-menu");
    burger.addEventListener("click", toggle);

    // fermeture : clic sur un lien/CTA, clic hors de la nav, retour en desktop
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("menu-open") && !inner.contains(e.target)) close();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) close();
    });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
