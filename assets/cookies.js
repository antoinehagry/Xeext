/* ============================================================
   Xeext — bandeau d'information cookies.
   Le site n'utilise QUE du stockage strictement nécessaire
   (session de connexion, thème, langue) — exempté de consentement
   (RGPD/CNIL). Ce bandeau informe simplement, avec un lien vers la
   politique de confidentialité ; il n'y a aucun traceur à refuser.
   Autonome : ne dépend ni d'i18n.js ni d'une feuille de style
   particulière (styles injectés, variables du thème avec repli).
   ============================================================ */
(function () {
  var KEY = "xeext.cookies";
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  function lang() {
    try {
      var l = document.documentElement.lang || localStorage.getItem("xeext.lang") ||
              (navigator.language || navigator.userLanguage || "fr");
      return String(l).slice(0, 2).toLowerCase() === "en" ? "en" : "fr";
    } catch (e) { return "fr"; }
  }

  var T = {
    fr: {
      text: "Ce site utilise uniquement des cookies et du stockage nécessaires à son fonctionnement (connexion, thème, langue). Aucun cookie de suivi ni publicitaire.",
      more: "En savoir plus",
      ok: "J'ai compris",
      aria: "Information sur les cookies"
    },
    en: {
      text: "This site only uses cookies and storage strictly necessary for it to work (sign-in, theme, language). No tracking or advertising cookies.",
      more: "Learn more",
      ok: "Got it",
      aria: "Cookie notice"
    }
  };

  var CSS =
    ".ck-bar{position:fixed;left:50%;bottom:18px;z-index:1000;" +
    "transform:translateX(-50%) translateY(160%);" +
    "display:flex;align-items:center;gap:18px;" +
    "width:calc(100% - 36px);max-width:760px;" +
    "background:var(--white,#fff);color:var(--text,#1d1d1f);" +
    "border:1px solid var(--hairline,rgba(0,0,0,.1));border-radius:16px;" +
    "box-shadow:0 18px 60px rgba(0,0,0,.18);padding:16px 20px;" +
    "transition:transform .45s cubic-bezier(.16,.84,.44,1);}" +
    ".ck-bar.ck-in{transform:translateX(-50%) translateY(0);}" +
    ".ck-text{margin:0;font-size:14px;line-height:1.45;color:var(--text-2,#6e6e73);}" +
    ".ck-more{color:var(--accent,#1f3df0);font-weight:600;text-decoration:none;white-space:nowrap;}" +
    ".ck-more:hover{text-decoration:underline;}" +
    ".ck-ok{flex:0 0 auto;background:var(--accent,#1f3df0);color:#fff;border:0;" +
    "border-radius:999px;padding:10px 22px;font-size:14px;font-weight:600;" +
    "cursor:pointer;font-family:inherit;transition:opacity .2s ease;}" +
    ".ck-ok:hover{opacity:.9;}" +
    "@media (prefers-reduced-motion:reduce){.ck-bar{transition:none;}}" +
    "@media (max-width:560px){.ck-bar{flex-direction:column;align-items:stretch;" +
    "gap:12px;bottom:12px;}.ck-ok{width:100%;}}";

  function build() {
    if (document.getElementById("ck-bar")) return;
    var t = T[lang()];

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "ck-bar";
    bar.className = "ck-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", t.aria);
    bar.innerHTML =
      '<p class="ck-text">' + t.text +
        ' <a class="ck-more" href="confidentialite.html">' + t.more + ' ›</a></p>' +
      '<button type="button" class="ck-ok"></button>';
    bar.querySelector(".ck-ok").textContent = t.ok;
    document.body.appendChild(bar);

    requestAnimationFrame(function () { bar.classList.add("ck-in"); });

    bar.querySelector(".ck-ok").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      bar.classList.remove("ck-in");
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 400);
    });
  }

  // L'accueil affiche une animation d'intro : on attend qu'elle soit terminée
  // (évènement « xeext:intro-done » émis par intro.js). Sur les pages sans
  // intro — ou si elle est déjà passée (classe intro-done) — affichage direct.
  function introPending() {
    return !!document.getElementById("intro") &&
           !document.documentElement.classList.contains("intro-done");
  }
  function init() {
    if (!introPending()) { build(); return; }
    var done = false;
    function go() { if (done) return; done = true; build(); }
    window.addEventListener("xeext:intro-done", go);
    setTimeout(go, 7000); // filet de sécurité si l'évènement n'arrive jamais
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
