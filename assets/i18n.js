/* ============================================================
   Xeext — bilingue FR / EN.
   Le français est la source (texte dans le HTML). L'anglais vient du
   dictionnaire ci-dessous. Détection : ?lang= → choix mémorisé →
   langue du navigateur (en → anglais, sinon français).
   - HTML statique : attributs data-i18n / data-i18n-html / data-i18n-attr.
   - Texte généré en JS : window.XEEXT.t("clé").
   Le bouton de langue recharge la page (tout se reconstruit dans la langue).
   ============================================================ */
window.XEEXT_I18N = {
  // ---- Anglais : toutes les clés (le FR du HTML sert de repli) ----
  en: {
    // Navigation
    "nav.biens": "Properties",
    "nav.besoins": "Find my space",
    "nav.honoraires": "Fees",
    "nav.contact": "Contact",
    "nav.estimer": "Value my property",
    "nav.voirbiens": "View properties",
    // Hero
    "hero.h1": "Corporate real estate advisory.<br><span class=\"grad-loop\">Reinvented at&nbsp;5%.</span>",
    "hero.lead": "Offices, retail, logistics, land. The same support as a major network — for fees divided by three.",
    "hero.cta2": "Estimate my fees <span class=\"chev\">›</span>",
    "hero.imgalt": "Business partners in suits looking at an office building — corporate real estate",
    // Le chiffre
    "chiffre.eyebrow": "The Xeext rate",
    "chiffre.sub": "instead of 15 to 30% at traditional advisors.",
    "chiffre.note": "A single rate, stated before the mandate. Calculated on the annual rent.",
    // Simulateur
    "sim.h2": "What you save.",
    "sim.lead": "Set the annual rent. Compare in real time.",
    "sim.loyerlabel": "Annual rent of the property",
    "sim.taux": "Fees of a traditional advisor:",
    "sim.classiqueLabel": "Traditional advisor",
    "sim.eco": "Your saving",
    // Catalogue (statique)
    "cat.eyebrow": "Available properties",
    "cat.h2": "Find your next space.",
    "cat.intro": "No time to browse everything? <a class=\"link-chevron\" href=\"besoins.html\">Answer 5 questions and we'll suggest the properties made for you <span class=\"chev\">›</span></a>",
    "cat.seg.tous": "All",
    "cat.seg.bureaux": "Offices",
    "cat.seg.commerces": "Retail",
    "cat.seg.logistique": "Logistics",
    "cat.seg.terrains": "Land",
    "cat.opt.villeAll": "All cities",
    "cat.opt.surfAll": "All areas",
    "cat.opt.surfS": "Under 500 m²",
    "cat.opt.surfM": "500 to 2,000 m²",
    "cat.opt.surfL": "Over 2,000 m²",
    "cat.opt.loyerAll": "All rents",
    "cat.opt.loyerS": "Under €100,000",
    "cat.opt.loyerM": "€100,000 to €250,000",
    "cat.opt.loyerL": "Over €250,000",
    "cat.opt.triPert": "Sort: relevance",
    "cat.opt.triLoyerAsc": "Rent, low to high",
    "cat.opt.triLoyerDesc": "Rent, high to low",
    "cat.opt.triSurfAsc": "Area, low to high",
    "cat.opt.triSurfDesc": "Area, high to low",
    // Pourquoi 5%
    "why.h2": "Why 5% is enough.",
    "why.1.t": "Lean structure",
    "why.1.p": "No prestige branch network to amortise. You pay for advice, not for storefronts.",
    "why.2.t": "Digital process",
    "why.2.p": "From valuation to signing, everything is tooled. Less friction, lower costs.",
    "why.3.t": "Single rate",
    "why.3.p": "5% of the annual rent, stated before the mandate. No negotiation, no surprises.",
    // Méthode
    "method.eyebrow": "The method",
    "method.h2": "Four steps. Nothing more.",
    "method.1.t": "Valuation",
    "method.1.p": "Market analysis and a substantiated rental value, within 48 hours.",
    "method.2.t": "Strategy",
    "method.2.p": "Positioning, target tenants and a tailored marketing plan.",
    "method.3.t": "Marketing",
    "method.3.p": "Distribution, qualified viewings and transparent reporting at every step.",
    "method.4.t": "Signing",
    "method.4.p": "Negotiation, drafting and support all the way to the signed lease.",
    // Barème
    "bareme.eyebrow": "Rate comparison",
    "bareme.h2": "The same service. A third of the price.",
    "bareme.th.prestation": "Service",
    "bareme.th.classique": "Traditional advisor",
    "bareme.r1.t": "Letting fees",
    "bareme.r1.c": "15 to 30% of annual rent",
    "bareme.r1.x": "5%",
    "bareme.r2.t": "Valuation and opinion of value",
    "bareme.r2.c": "Variable",
    "bareme.r2.x": "Included",
    "bareme.r3.t": "Multichannel marketing",
    "bareme.r3.c": "Included",
    "bareme.r3.x": "Included",
    "bareme.r4.t": "Mandate reporting",
    "bareme.r4.c": "On request",
    "bareme.r4.x": "Continuous",
    "bareme.r5.t": "Rate known before mandate",
    "bareme.r5.c": "Rarely",
    "bareme.r5.x": "Always",
    // Propriétaires
    "owners.eyebrow": "Are you an owner?",
    "owners.h2": "Entrust us with your property.",
    "owners.lead": "Opinion of value within 48 hours, multichannel marketing — and fees of 5% instead of 15 to 30%.",
    "owners.cta": "Value my property for free",
    "owners.bareme": "See the rate <span class=\"chev\">›</span>",
    // Contact
    "contact.h2": "Let's talk about your asset.",
    "contact.lead": "A quick reply from an advisor, no commitment.",
    "contact.nom": "Name",
    "contact.mail": "Email",
    "contact.msg": "Message",
    "contact.ph.nom": "Your name",
    "contact.ph.mail": "you@company.com",
    "contact.ph.msg": "Your project, the property you're interested in…",
    "contact.send": "Send",
    "contact.note": "By sending, you agree to be contacted by Xeext.",
    "contact.or": "Or by email:",
    // Footer
    "footer.tagline": "Corporate real estate advisory. Offices, retail, logistics, land.",
    "footer.methode": "Method",
    "footer.bareme": "Rate",
    "footer.legal1": "<strong>Xeext</strong> — Corporate real estate advisory. A company carrying out transactions on real estate and business assets under French law no. 70-9 of 2 January 1970 (loi Hoguet).",
    "footer.legal2": "Holder of a professional licence “Transactions on real estate and business assets (T)” issued by the relevant CCI — financial guarantee and professional liability insurance taken out with an approved body. Full legal notice provided before any mandate. Information shown for illustration only.",
    "footer.legalLink": "Legal notice",
    "footer.privacy": "Privacy policy",
    "footer.rights": "© 2026 Xeext. All rights reserved.",
    "skip": "Skip to content",
    // Méta
    "meta.title": "Xeext — Corporate real estate advisory, reinvented at 5%",
    "meta.desc": "Corporate real estate advisory: offices, retail, logistics, land. A single fee of 5% of the annual rent.",
    // Compte (généré en JS)
    "acct.signin": "Sign in",
    "acct.favoris": "My favourites",
    "acct.rdv": "My appointments",
    "acct.profil": "My profile",
    "acct.admin": "Administration",
    "acct.logout": "Sign out",
    "acct.loggedout": "You are signed out.",
    // Catalogue (généré en JS)
    "cat.surface": "Area",
    "cat.loyer": "Rent",
    "cat.dispo": "Availability",
    "cat.peran": "€/yr",
    "cat.perm2an": "€/m²/yr",
    "cat.countSingular": "property available",
    "cat.countPlural": "properties available",
    "cat.empty": "No property matches these criteria. Broaden your search."
  },
  // ---- Français : seulement les clés utilisées par le JS (le reste vient du HTML) ----
  fr: {
    "acct.signin": "Se connecter",
    "acct.favoris": "Mes favoris",
    "acct.rdv": "Mes rendez-vous",
    "acct.profil": "Mon profil",
    "acct.admin": "Administration",
    "acct.logout": "Se déconnecter",
    "acct.loggedout": "Vous êtes déconnecté.",
    "cat.surface": "Surface",
    "cat.loyer": "Loyer",
    "cat.dispo": "Disponibilité",
    "cat.peran": "€/an",
    "cat.perm2an": "€/m²/an",
    "cat.countSingular": "bien disponible",
    "cat.countPlural": "biens disponibles",
    "cat.empty": "Aucun bien ne correspond à ces critères. Élargissez votre recherche."
  }
};

(function () {
  var KEY = "xeext.lang";
  var SUP = ["fr", "en"];
  var DICT = window.XEEXT_I18N;

  function detect() {
    try {
      var p = new URLSearchParams(location.search).get("lang");
      if (p && SUP.indexOf(p) !== -1) return p;
      var s = localStorage.getItem(KEY);
      if (s && SUP.indexOf(s) !== -1) return s;
      var n = (navigator.language || navigator.userLanguage || "fr").slice(0, 2).toLowerCase();
      return n === "en" ? "en" : "fr";
    } catch (e) { return "fr"; }
  }

  var lang = detect();
  try { document.documentElement.lang = lang; } catch (e) {}

  function t(key) {
    var d = DICT[lang] || {};
    if (d[key] != null) return d[key];
    return (DICT.fr && DICT.fr[key] != null) ? DICT.fr[key] : key;
  }

  // Traduit le HTML statique (uniquement en anglais ; le FR est déjà la source).
  function apply(root) {
    if (lang !== "en") return;
    root = root || document;
    var en = DICT.en;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = en[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = en[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var i = pair.indexOf(":");
        if (i < 0) return;
        var attr = pair.slice(0, i).trim(), k = pair.slice(i + 1).trim();
        if (en[k] != null) el.setAttribute(attr, en[k]);
      });
    });
  }

  function setLang(l) {
    if (SUP.indexOf(l) === -1) return;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    // recharge : tout se reconstruit dans la nouvelle langue
    if (new URLSearchParams(location.search).get("lang")) {
      var u = new URL(location.href); u.searchParams.delete("lang");
      location.replace(u.toString());
    } else {
      location.reload();
    }
  }

  function injectToggle() {
    var inner = document.querySelector(".nav__inner");
    if (!inner || document.getElementById("lang-toggle")) return;
    var host = inner.querySelector(".nav__menu") || inner;
    var btn = document.createElement("button");
    btn.id = "lang-toggle";
    btn.type = "button";
    btn.className = "lang-toggle";
    btn.setAttribute("aria-label", lang === "fr" ? "Switch to English" : "Passer en français");
    btn.innerHTML =
      '<span' + (lang === "fr" ? ' class="is-active"' : "") + '>FR</span>' +
      '<span' + (lang === "en" ? ' class="is-active"' : "") + '>EN</span>';
    btn.addEventListener("click", function () { setLang(lang === "fr" ? "en" : "fr"); });
    host.appendChild(btn);
  }

  function init() {
    apply(document);
    // différé pour passer après nav.js (création de .nav__menu) et theme.js
    setTimeout(injectToggle, 0);
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  window.XEEXT = window.XEEXT || {};
  window.XEEXT.t = t;
  window.XEEXT.lang = function () { return lang; };
  window.XEEXT.setLang = setLang;
})();
