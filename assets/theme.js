/* ============================================================
   Xeext — thème clair / sombre / auto (façon Apple).
   Le thème initial est posé très tôt par un petit script inline dans le
   <head> (anti-flash). Ici on ajoute le sélecteur segmenté Clair/Sombre/Auto
   dans le pied de page, on mémorise la préférence et — en mode « auto » — on
   suit le réglage système, y compris s'il change en direct.
   data-theme sur <html> ne vaut jamais que "light" ou "dark" (auto résolu).
   ============================================================ */
(function () {
  var KEY = "xeext.theme";
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function pref() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === "light" || v === "dark" || v === "auto") return v;
    } catch (e) {}
    return "auto"; // défaut : suit le système, comme Apple
  }
  function resolved(p) { return p === "auto" ? (mq.matches ? "dark" : "light") : p; }
  function apply(p) { document.documentElement.setAttribute("data-theme", resolved(p)); }

  // libellé traduit si i18n présent, sinon repli FR
  function t(key, fb) {
    var v = (window.XEEXT && window.XEEXT.t) ? window.XEEXT.t(key) : null;
    return (v && v !== key) ? v : fb;
  }

  function build() {
    var host = document.querySelector(".footer .wrap");
    if (!host || document.getElementById("theme-seg")) return;
    var p = pref();
    var opts = [
      ["light", t("theme.light", "Clair")],
      ["dark", t("theme.dark", "Sombre")],
      ["auto", t("theme.auto", "Auto")]
    ];
    var seg = document.createElement("div");
    seg.className = "theme-seg";
    seg.id = "theme-seg";
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", t("theme.label", "Thème"));
    seg.innerHTML = opts.map(function (o) {
      var on = p === o[0];
      return '<button type="button" data-theme-opt="' + o[0] + '"' +
        (on ? ' class="is-active"' : '') + ' aria-pressed="' + (on ? "true" : "false") + '">' + o[1] + '</button>';
    }).join("");
    host.appendChild(seg);

    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-theme-opt]");
      if (!b) return;
      var val = b.getAttribute("data-theme-opt");
      try { localStorage.setItem(KEY, val); } catch (e2) {}
      apply(val);
      seg.querySelectorAll("button").forEach(function (x) {
        var on = x.getAttribute("data-theme-opt") === val;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
  }

  function init() {
    apply(pref()); // resynchronise (le script inline du <head> a déjà posé l'état)
    build();
    // suit le système en direct quand la préférence est « auto »
    var onSys = function () { if (pref() === "auto") apply("auto"); };
    if (mq.addEventListener) mq.addEventListener("change", onSys);
    else if (mq.addListener) mq.addListener(onSys);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
