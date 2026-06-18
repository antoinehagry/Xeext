/* ============================================================
   Xeext — fil d'Ariane du pied de page (façon Apple).
   Logo Xeext › section › page courante, avec chevrons. Construit selon
   la page ; sur la fiche bien, le dernier maillon est le titre (traduit).
   ============================================================ */
(function () {
  function init() {
    var wrap = document.querySelector(".footer .wrap");
    if (!wrap || wrap.querySelector(".footer-breadcrumb")) return;
    var X = window.XEEXT;
    function t(k, fb) { var v = (X && X.t) ? X.t(k) : null; return (v && v !== k) ? v : fb; }
    function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!page) page = "index.html";

    // maillons : { label, href? } — le dernier est la page courante (sans lien)
    function staticCrumbs() {
      switch (page) {
        case "index.html": return [];
        case "biens.html": return [{ label: t("nav.biens", "Biens") }];
        case "besoins.html": return [{ label: t("nav.besoins", "Trouver mon bien") }];
        case "apropos.html": return [{ label: t("nav.apropos", "À propos") }];
        case "compte.html": return [{ label: t("bc.account", "Mon espace") }];
        case "mentions-legales.html": return [{ label: t("footer.legalLink", "Mentions légales") }];
        case "confidentialite.html": return [{ label: t("footer.privacy", "Politique de confidentialité") }];
        case "connexion.html": return [{ label: t("acct.signin", "Se connecter") }];
        case "inscription.html": return [{ label: t("bc.signup", "Créer un compte") }];
        case "reinitialisation.html": return [{ label: t("bc.reset", "Réinitialiser le mot de passe") }];
        case "admin.html": return [{ label: t("bc.admin", "Administration") }];
        default: return [];
      }
    }

    function render(crumbs) {
      var sep = '<span class="fb-sep" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M6.23 20.23L8 22l10-10L8 2L6.23 3.77L14.46 12z"/></svg></span>';
      var html = '<a class="fb-home" href="index.html" aria-label="' + esc(t("bc.home", "Accueil")) + '">' +
        '<span class="brand-logo" aria-hidden="true"></span><span class="sr-only">Xeext</span></a>';
      crumbs.forEach(function (c, i) {
        var last = i === crumbs.length - 1;
        html += sep;
        html += (c.href && !last)
          ? '<a href="' + c.href + '">' + esc(c.label) + '</a>'
          : '<span' + (last ? ' aria-current="page"' : '') + '>' + esc(c.label) + '</span>';
      });
      var nav = document.createElement("nav");
      nav.className = "footer-breadcrumb";
      nav.setAttribute("aria-label", t("bc.aria", "Fil d'Ariane"));
      nav.innerHTML = html;
      wrap.insertBefore(nav, wrap.firstChild);
    }

    // Fiche bien : Biens › titre du bien (résolu après chargement des biens)
    if (page === "fiche.html" && X && X.find) {
      (X.biensReady || Promise.resolve()).then(function () {
        var id = new URLSearchParams(location.search).get("id");
        var b = (id && X.find(id)) || window.XEEXT_BIENS[0];
        var title = b ? (X.bienTitle ? X.bienTitle(b) : b.titre) : "";
        render([{ label: t("nav.biens", "Biens"), href: "biens.html" }, { label: title }]);
      });
      return;
    }
    render(staticCrumbs());
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
