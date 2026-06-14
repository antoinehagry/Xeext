/* ============================================================
   Xeext — thème clair / sombre.
   Le thème initial est posé très tôt par un petit script inline dans le
   <head> (anti-flash). Ici on ajoute le bouton de bascule dans la nav,
   on mémorise le choix et on bascule l'attribut data-theme sur <html>.
   ============================================================ */
(function () {
  var KEY = "xeext.theme";
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 13.2A8 8 0 1 1 10.8 3.5a6.4 6.4 0 0 0 9.7 9.7z"/></svg>';

  function get() { return document.documentElement.getAttribute("data-theme") || "light"; }
  function paint(btn, t) {
    btn.innerHTML = (t === "dark" ? SUN : MOON);
    btn.setAttribute("aria-label", t === "dark" ? "Passer en thème clair" : "Passer en thème sombre");
    btn.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
  }
  function set(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    var btn = document.getElementById("theme-toggle");
    if (btn) paint(btn, t);
  }

  function init() {
    // filet de sécurité si le script inline du <head> n'a pas tourné
    if (!document.documentElement.getAttribute("data-theme")) {
      var saved; try { saved = localStorage.getItem(KEY); } catch (e) {}
      document.documentElement.setAttribute("data-theme", saved || "light");
    }

    var inner = document.querySelector(".nav__inner");
    if (!inner || document.getElementById("theme-toggle")) return;
    var host = inner.querySelector(".nav__menu") || inner;

    var btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.className = "theme-toggle";
    paint(btn, get());
    host.appendChild(btn);
    btn.addEventListener("click", function () { set(get() === "dark" ? "light" : "dark"); });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
