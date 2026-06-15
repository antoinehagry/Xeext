/* ============================================================
   Xeext — questionnaire « Trouver mon bien » (adaptatif).
   Part de l'ACTIVITÉ du client (qui ne sait pas forcément ce qu'il
   lui faut) → en déduit le type de bien et pose des questions
   pertinentes selon le profil → propose un conseil + les biens
   les plus compatibles (% de compatibilité).
   ============================================================ */
(function () {
  var X = window.XEEXT;
  var root = document.getElementById("besoins-root");
  if (!root) return;

  /* ----------------- activités → segment déduit ----------------- */
  var ACTIVITIES = [
    { v: "bureaux",      t: "Bureaux & services",           h: "Conseil, agence, tech, finance…",     seg: "Bureaux" },
    { v: "sante",        t: "Santé & professions libérales", h: "Cabinet médical, juridique, expertise", seg: "Bureaux" },
    { v: "commerce",     t: "Commerce & boutique",           h: "Vente au détail, showroom",            seg: "Commerces" },
    { v: "restauration", t: "Restauration & café",           h: "Restaurant, bar, café",                seg: "Commerces" },
    { v: "ecommerce",    t: "E-commerce & distribution",     h: "Stockage et expédition",               seg: "Logistique" },
    { v: "logistique",   t: "Logistique & transport",        h: "Entreposage, messagerie",              seg: "Logistique" },
    { v: "industrie",    t: "Industrie & artisanat",         h: "Atelier, production, fabrication",     seg: "Logistique" },
    { v: "construction", t: "Projet de construction",        h: "Bâtir sur-mesure sur un terrain",      seg: "Terrains" },
    { v: "autre",        t: "Je ne sais pas encore",         h: "Aidez-moi à définir mon besoin",       seg: null }
  ];
  var ACT = {};
  ACTIVITIES.forEach(function (a) { ACT[a.v] = a; });

  // segment déduit de l'activité (ou de la question « nature » pour le profil « autre »)
  function segmentOf(a) {
    if (!a.activity) return null;
    if (a.activity === "autre") return a.nature || null;
    return ACT[a.activity] ? ACT[a.activity].seg : null;
  }
  // fourchette de surface déduite (une seule des clés est renseignée selon le segment)
  function surfaceOf(a) {
    return a.effectif || a.surfaceCom || a.surfaceLog || a.surfaceTer || null;
  }

  /* ----------------- définition des étapes (adaptatives) ----------------- */
  var villes = [];
  var STEPS = [
    {
      key: "activity",
      q: "Quelle est votre activité ?",
      sub: "On en déduit le type de bien qui vous convient.",
      opts: ACTIVITIES.map(function (a) { return { t: a.t, v: a.v, h: a.h }; })
    },
    {
      key: "nature",
      when: function (a) { return a.activity === "autre"; },
      q: "Concrètement, ce lieu servira surtout à…",
      opts: [
        { t: "Héberger des bureaux / une équipe", v: "Bureaux" },
        { t: "Recevoir des clients en boutique", v: "Commerces" },
        { t: "Stocker ou expédier des marchandises", v: "Logistique" },
        { t: "Construire un bâtiment sur-mesure", v: "Terrains" }
      ]
    },
    /* ---- Bureaux ---- */
    {
      key: "effectif",
      when: function (a) { return segmentOf(a) === "Bureaux"; },
      q: "Combien de personnes travailleront sur place ?",
      sub: "On estime la surface idéale à votre place.",
      opts: [
        { t: "1 à 5", v: { max: 150 }, h: "≈ jusqu'à 150 m²" },
        { t: "6 à 15", v: { min: 80, max: 350 }, h: "≈ 80 – 350 m²" },
        { t: "16 à 40", v: { min: 300, max: 800 }, h: "≈ 300 – 800 m²" },
        { t: "Plus de 40", v: { min: 700 }, h: "≈ 700 m² et +" }
      ]
    },
    {
      key: "reception",
      when: function (a) { return segmentOf(a) === "Bureaux"; },
      q: "Recevez-vous des clients dans vos locaux ?",
      opts: [
        { t: "Oui, régulièrement", v: "souvent" },
        { t: "Occasionnellement", v: "parfois" },
        { t: "Non", v: "non" }
      ]
    },
    /* ---- Commerces ---- */
    {
      key: "surfaceCom",
      when: function (a) { return segmentOf(a) === "Commerces"; },
      q: "Quelle surface de vente vous faut-il ?",
      opts: [
        { t: "Petite (< 80 m²)", v: { max: 80 } },
        { t: "Moyenne (80 – 200 m²)", v: { min: 80, max: 200 } },
        { t: "Grande (> 200 m²)", v: { min: 200 } },
        { t: "Je ne sais pas", v: null }
      ]
    },
    {
      key: "emplacement",
      when: function (a) { return segmentOf(a) === "Commerces"; },
      q: "Quel emplacement vise votre clientèle ?",
      opts: [
        { t: "Hyper-centre / rue passante", v: "passant" },
        { t: "Quartier de proximité", v: "quartier" },
        { t: "Périphérie / retail park", v: "peripherie" }
      ]
    },
    /* ---- Logistique ---- */
    {
      key: "surfaceLog",
      when: function (a) { return segmentOf(a) === "Logistique"; },
      q: "Quelle surface de stockage / d'activité ?",
      opts: [
        { t: "Moins de 1 000 m²", v: { max: 1000 } },
        { t: "1 000 à 5 000 m²", v: { min: 1000, max: 5000 } },
        { t: "Plus de 5 000 m²", v: { min: 5000 } },
        { t: "Je ne sais pas", v: null }
      ]
    },
    {
      key: "quais",
      when: function (a) { return segmentOf(a) === "Logistique"; },
      q: "Besoin d'un accès poids lourds / de quais ?",
      opts: [
        { t: "Oui, indispensable", v: "oui" },
        { t: "Un accès simple suffit", v: "simple" },
        { t: "Pas nécessaire", v: "non" }
      ]
    },
    /* ---- Terrains ---- */
    {
      key: "surfaceTer",
      when: function (a) { return segmentOf(a) === "Terrains"; },
      q: "Quelle surface de terrain envisagez-vous ?",
      opts: [
        { t: "Moins de 1 500 m²", v: { max: 1500 } },
        { t: "1 500 à 5 000 m²", v: { min: 1500, max: 5000 } },
        { t: "Plus de 5 000 m²", v: { min: 5000 } },
        { t: "Je ne sais pas", v: null }
      ]
    },
    {
      key: "terrainUsage",
      when: function (a) { return segmentOf(a) === "Terrains"; },
      q: "Pour y implanter quoi ?",
      opts: [
        { t: "Des bureaux", v: "bureaux" },
        { t: "Un local commercial", v: "commerce" },
        { t: "Un entrepôt / une activité", v: "activite" },
        { t: "Je ne sais pas encore", v: null }
      ]
    },
    /* ---- Commun à tous ---- */
    {
      key: "ville",
      q: "Une localisation en particulier ?",
      opts: function () {
        return villes.map(function (v) { return { t: v, v: v }; }).concat([{ t: "Indifférent", v: null }]);
      }
    },
    {
      key: "budget",
      q: "Votre budget de loyer annuel ?",
      sub: "Une fourchette suffit — sinon, on s'adapte.",
      opts: [
        { t: "Moins de 100 000 €", v: { max: 100000 } },
        { t: "100 000 à 250 000 €", v: { min: 100000, max: 250000 } },
        { t: "250 000 à 400 000 €", v: { min: 250000, max: 400000 } },
        { t: "Plus de 400 000 €", v: { min: 400000 } },
        { t: "Je ne sais pas encore", v: null }
      ]
    },
    {
      key: "dispo",
      q: "Pour quand ?",
      opts: [
        { t: "Le plus tôt possible", v: "immediate" },
        { t: "Dans les 6 mois", v: "six" },
        { t: "Pas de date précise", v: null }
      ]
    }
  ];

  var answers = {};
  var answeredOrder = []; // pile des clés répondues, pour le bouton « Précédent »

  function applicable(s) { return !s.when || s.when(answers); }
  // étape courante = 1re question applicable encore sans réponse (null = terminé)
  function currentStep() {
    var vis = STEPS.filter(applicable);
    for (var i = 0; i < vis.length; i++) {
      if (answers[vis[i].key] === undefined) return { q: vis[i], idx: i, total: vis.length };
    }
    return null;
  }

  function choose(key, val) {
    answers[key] = val;
    answeredOrder.push(key);
    render();
  }
  function back() {
    var k = answeredOrder.pop();
    if (k) delete answers[k];
    render();
  }

  /* ----------------- rendu du questionnaire ----------------- */
  function render() {
    var cs = currentStep();
    if (!cs) { showResults(); return; }
    var s = cs.q;
    var pct = Math.round(cs.idx / cs.total * 100);
    var opts = (typeof s.opts === "function") ? s.opts() : s.opts;
    var optsHTML = opts.map(function (o, idx) {
      return '<button type="button" class="opt" data-i="' + idx + '">' +
        '<span class="opt__t">' + o.t + '</span>' +
        (o.h ? '<span class="opt__h">' + o.h + '</span>' : '') +
        '</button>';
    }).join("");

    root.innerHTML =
      '<div class="wizard reveal">' +
        '<div class="wizard__top">' +
          '<span class="wizard__count">Étape ' + (cs.idx + 1) + ' / ' + cs.total + '</span>' +
          (answeredOrder.length ? '<button type="button" class="wizard__back">‹ Précédent</button>' : '<span></span>') +
        '</div>' +
        '<div class="wizard__bar"><i style="width:' + pct + '%"></i></div>' +
        '<h1 class="wizard__q">' + s.q + '</h1>' +
        (s.sub ? '<p class="wizard__sub">' + s.sub + '</p>' : '') +
        '<div class="opt-grid">' + optsHTML + '</div>' +
      '</div>';

    root.querySelectorAll(".opt").forEach(function (btn) {
      btn.addEventListener("click", function () { choose(s.key, opts[+btn.getAttribute("data-i")].v); });
    });
    var b = root.querySelector(".wizard__back");
    if (b) b.addEventListener("click", back);
    reveal();
  }

  /* ----------------- scoring ----------------- */
  function inRange(v, r) { return (r.min == null || v >= r.min) && (r.max == null || v <= r.max); }
  function surfaceScore(s, r) {
    if (inRange(s, r)) return 30;
    var lo = r.min != null ? r.min * 0.6 : 0;
    var hi = r.max != null ? r.max * 1.4 : Infinity;
    return (s >= lo && s <= hi) ? 16 : 0;
  }
  function budgetScore(loyer, r) {
    if (inRange(loyer, r)) return 30;
    if (r.max != null && loyer < r.max) return 22;          // sous le budget = acceptable
    if (r.max != null && loyer <= r.max * 1.25) return 12;  // légèrement au-dessus
    if (r.min != null && r.max == null) return loyer >= r.min * 0.8 ? 16 : 0;
    return 0;
  }
  function dispoScore(rank, want) {
    if (want === "immediate") return rank === 0 ? 15 : rank <= 2 ? 8 : 3;
    return rank <= 3 ? 15 : 7; // dans les 6 mois
  }
  function score(b) {
    var earned = 0, total = 0;
    var surf = surfaceOf(answers);
    if (answers.ville)  { total += 25; if (b.ville === answers.ville) earned += 25; }
    if (surf)           { total += 30; earned += surfaceScore(b.surface, surf); }
    if (answers.budget) { total += 30; earned += budgetScore(b.loyer, answers.budget); }
    if (answers.dispo)  { total += 15; earned += dispoScore(b.dispoRank, answers.dispo); }
    return total ? Math.round(earned / total * 100) : 100;
  }

  /* ----------------- résultats : conseil + biens ----------------- */
  function nb(n) { return X.nombre(n); }
  function surfaceLabel(r) { return r.min && r.max ? nb(r.min) + "–" + nb(r.max) + " m²" : r.max ? "< " + nb(r.max) + " m²" : "> " + nb(r.min) + " m²"; }
  function budgetLabel(r) { return r.min && r.max ? nb(r.min) + "–" + nb(r.max) + " €" : r.max ? "< " + nb(r.max) + " €" : "> " + nb(r.min) + " €"; }

  function summary() {
    var bits = [];
    if (answers.activity && answers.activity !== "autre") bits.push(ACT[answers.activity].t);
    if (answers.ville) bits.push(answers.ville);
    var surf = surfaceOf(answers);
    if (surf) bits.push(surfaceLabel(surf));
    if (answers.budget) bits.push(budgetLabel(answers.budget));
    if (answers.dispo) bits.push(answers.dispo === "immediate" ? "dès que possible" : "sous 6 mois");
    return bits.join(" · ");
  }

  // bloc de recommandation : type de bien conseillé + pourquoi + un conseil ciblé
  function conseilHTML() {
    var seg = segmentOf(answers);
    if (!seg) return "";
    var label = {
      Bureaux: "des bureaux",
      Commerces: "un local commercial",
      Logistique: "un local logistique ou d'activité",
      Terrains: "un terrain à bâtir"
    }[seg];
    var why = {
      Bureaux: "Le format adapté pour héberger vos équipes et recevoir vos interlocuteurs dans de bonnes conditions.",
      Commerces: "Ici, la visibilité prime : vitrine, accessibilité et qualité de l'emplacement font la différence.",
      Logistique: "Pensé pour le stockage et les flux de marchandises : hauteur libre, quais et accès poids lourds.",
      Terrains: "Pour construire un bâtiment parfaitement dimensionné pour votre projet."
    }[seg];
    var tips = [];
    if (answers.reception === "souvent") tips.push("vous recevez des clients régulièrement : privilégiez un bon standing d'accueil et une desserte facile.");
    if (answers.emplacement === "passant") tips.push("un emplacement en rue passante maximisera votre visibilité et votre flux.");
    else if (answers.emplacement === "peripherie") tips.push("la périphérie vous offrira plus de surface et de stationnement client.");
    if (answers.quais === "oui") tips.push("ciblez en priorité des biens avec quais et accès poids lourds.");
    if (answers.terrainUsage === "activite") tips.push("orientez-vous vers une parcelle viabilisée avec accès poids lourds.");
    var tip = tips.length ? '<p class="conseil__tip"><strong>Notre conseil :</strong> ' + tips[0] + '</p>' : "";
    return '<div class="conseil reveal">' +
      '<p class="eyebrow">Notre recommandation</p>' +
      '<h2 class="conseil__h">Pour votre activité, nous vous orientons vers <strong>' + label + '</strong>.</h2>' +
      '<p class="conseil__p">' + why + '</p>' + tip +
      '</div>';
  }

  function resultCard(b, pct) {
    var m2 = X.loyerM2(b);
    return '<a class="bien reveal" href="fiche.html?id=' + b.id + '" aria-label="' + b.titre + '">' +
      '<div class="bien__media"><span class="badge">' + b.segment + '</span>' +
        (X.fav ? X.fav.favBtnHTML(b.id, "card") : "") +
        '<div class="ph ph--4x3">' + X.imgTag(X.cover(b), b.titre) +
          '<span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div>' +
      '</div>' +
      '<div class="bien__body">' +
        '<div class="match-row"><span class="match-pct">' + pct + '% compatible</span>' +
          '<span class="match-track"><i style="width:' + pct + '%"></i></span></div>' +
        '<h3 class="bien__title">' + b.titre + '</h3>' +
        '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
        '<dl class="bien__data">' +
          '<div><dt>Surface</dt><dd class="tnum">' + nb(b.surface) + ' m²</dd></div>' +
          '<div><dt>Loyer</dt><dd class="tnum">' + nb(b.loyer) + ' €/an<span class="bien__m2"> · ' + m2 + ' €/m²/an</span></dd></div>' +
          '<div><dt>Disponibilité</dt><dd>' + b.dispo + '</dd></div>' +
        '</dl>' +
      '</div></a>';
  }

  function showResults() {
    var seg = segmentOf(answers);
    var list = window.XEEXT_BIENS
      .filter(function (b) { return !seg || b.segment === seg; })
      .map(function (b) { return { b: b, pct: score(b) }; });
    list.sort(function (a, c) { return c.pct - a.pct || a.b.dispoRank - c.b.dispoRank; });
    var top = list.slice(0, 6);
    var cards = top.map(function (x) { return resultCard(x.b, x.pct); }).join("");

    root.innerHTML =
      conseilHTML() +
      '<div class="reveal center" style="margin:8px 0 0">' +
        '<h2 class="h-section">' + (top.length ? "Les biens faits pour vous." : "Aucun bien ne correspond pour l'instant.") + '</h2>' +
        '<p class="lead mx-auto" style="max-width:46ch;margin-top:12px">' + summary() + '</p>' +
        '<div style="margin-top:22px"><button type="button" class="btn btn--ghost" id="b-restart">Recommencer</button></div>' +
      '</div>' +
      (top.length ? '<div class="cat-grid" style="margin-top:40px">' + cards + '</div>' : '') +
      alerteHtml() +
      '<p class="center muted" style="margin-top:40px">Vous préférez parcourir vous-même ? ' +
        '<a class="link-chevron" href="' + catalogueUrl() + '">Voir tous les biens correspondants <span class="chev">›</span></a></p>';

    root.querySelector("#b-restart").addEventListener("click", function () {
      answers = {}; answeredOrder = []; render();
    });
    wireAlerte();
    if (X.fav) X.fav.syncAll();
    reveal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // lien vers le catalogue pré-filtré (segment, ville, fourchette de loyer)
  function catalogueUrl() {
    var seg = segmentOf(answers);
    var p = new URLSearchParams();
    if (seg) p.set("seg", seg);
    if (answers.ville) p.set("ville", answers.ville);
    if (answers.budget) {
      var r = answers.budget;
      p.set("loyer", r.max === 100000 ? "s" : (r.min === 100000 ? "m" : "l"));
    }
    var qs = p.toString();
    return "index.html" + (qs ? "?" + qs : "") + "#catalogue";
  }

  // bloc « être alerté » → enregistre un lead (type alerte) avec tous les critères
  function alerteHtml() {
    return '<div class="reveal alerte-box">' +
      '<form id="alerte-form" novalidate>' +
        '<h3>Être alerté des nouveaux biens</h3>' +
        '<p>Recevez un e-mail dès qu\'un bien correspond à votre profil.</p>' +
        '<div class="alerte-row">' +
          '<input id="al-mail" type="email" autocomplete="email" placeholder="vous@entreprise.fr">' +
          '<button class="btn btn--primary" type="submit">M\'alerter</button>' +
        '</div>' +
        '<div class="form-error" id="al-err"></div>' +
      '</form></div>';
  }
  function wireAlerte() {
    var form = root.querySelector("#alerte-form");
    if (!form || !X.store) return;
    var err = root.querySelector("#al-err");
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.classList.remove("show");
      btn.disabled = true;
      X.store.submitLead({
        type: "alerte",
        email: root.querySelector("#al-mail").value.trim(),
        segment: segmentOf(answers) || null,
        ville: answers.ville || null,
        criteres: answers
      }).then(function (res) {
        if (!res.ok) { btn.disabled = false; err.textContent = res.error; err.classList.add("show"); return; }
        form.innerHTML = '<div class="rdv-done"><div class="check">' +
          (X.ui ? X.ui.ICON.check : "✓") + '</div><h3 style="font-size:20px">Alerte créée</h3>' +
          '<p class="muted" style="margin-top:8px">Vous serez prévenu par e-mail dès qu\'un bien correspond.</p></div>';
        if (X.ui) X.ui.toast("Alerte enregistrée.");
      });
    });
  }

  function reveal() {
    if (typeof window.__xeextReveal === "function") requestAnimationFrame(window.__xeextReveal);
    else root.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // démarrage : on attend les biens (Supabase) puis on calcule les villes et on lance
  (window.XEEXT.biensReady || Promise.resolve()).then(function () {
    villes = Array.from(new Set(window.XEEXT_BIENS.map(function (b) { return b.ville; }))).sort();
    render();
  });
})();
