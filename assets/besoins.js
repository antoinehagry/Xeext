/* ============================================================
   Xeext — questionnaire « Trouver mon bien » (adaptatif).
   Part de l'ACTIVITÉ du client (qui ne sait pas forcément ce qu'il
   lui faut) → en déduit le type de bien et pose des questions
   pertinentes selon le profil → propose un conseil + les biens
   les plus compatibles (% de compatibilité). Bilingue via XEEXT.t.
   ============================================================ */
(function () {
  var X = window.XEEXT;
  var t = function (k) { return X.t ? X.t(k) : k; };
  var root = document.getElementById("besoins-root");
  if (!root) return;

  /* ----------------- activités → segment déduit ----------------- */
  var ACTIVITIES = [
    { v: "bureaux",      t: t("b.act.bureaux"),      h: t("b.acth.bureaux"),      seg: "Bureaux" },
    { v: "sante",        t: t("b.act.sante"),        h: t("b.acth.sante"),        seg: "Bureaux" },
    { v: "commerce",     t: t("b.act.commerce"),     h: t("b.acth.commerce"),     seg: "Commerces" },
    { v: "restauration", t: t("b.act.restauration"), h: t("b.acth.restauration"), seg: "Commerces" },
    { v: "ecommerce",    t: t("b.act.ecommerce"),    h: t("b.acth.ecommerce"),    seg: "Logistique" },
    { v: "logistique",   t: t("b.act.logistique"),   h: t("b.acth.logistique"),   seg: "Logistique" },
    { v: "industrie",    t: t("b.act.industrie"),    h: t("b.acth.industrie"),    seg: "Logistique" },
    { v: "construction", t: t("b.act.construction"), h: t("b.acth.construction"), seg: "Terrains" },
    { v: "autre",        t: t("b.act.autre"),        h: t("b.acth.autre"),        seg: null }
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
      q: t("b.q.activity"),
      sub: t("b.sub.activity"),
      opts: ACTIVITIES.map(function (a) { return { t: a.t, v: a.v, h: a.h }; })
    },
    {
      key: "nature",
      when: function (a) { return a.activity === "autre"; },
      q: t("b.q.nature"),
      opts: [
        { t: t("b.opt.nat.bureaux"), v: "Bureaux" },
        { t: t("b.opt.nat.commerces"), v: "Commerces" },
        { t: t("b.opt.nat.logistique"), v: "Logistique" },
        { t: t("b.opt.nat.terrains"), v: "Terrains" }
      ]
    },
    /* ---- Bureaux ---- */
    {
      key: "effectif",
      when: function (a) { return segmentOf(a) === "Bureaux"; },
      q: t("b.q.effectif"),
      sub: t("b.sub.effectif"),
      opts: [
        { t: t("b.opt.eff.1"), v: { max: 150 }, h: t("b.h.eff.1") },
        { t: t("b.opt.eff.2"), v: { min: 80, max: 350 }, h: t("b.h.eff.2") },
        { t: t("b.opt.eff.3"), v: { min: 300, max: 800 }, h: t("b.h.eff.3") },
        { t: t("b.opt.eff.4"), v: { min: 700 }, h: t("b.h.eff.4") }
      ]
    },
    {
      key: "reception",
      when: function (a) { return segmentOf(a) === "Bureaux"; },
      q: t("b.q.reception"),
      opts: [
        { t: t("b.opt.rec.1"), v: "souvent" },
        { t: t("b.opt.rec.2"), v: "parfois" },
        { t: t("b.opt.rec.3"), v: "non" }
      ]
    },
    /* ---- Commerces ---- */
    {
      key: "surfaceCom",
      when: function (a) { return segmentOf(a) === "Commerces"; },
      q: t("b.q.surfaceCom"),
      opts: [
        { t: t("b.opt.sc.1"), v: { max: 80 } },
        { t: t("b.opt.sc.2"), v: { min: 80, max: 200 } },
        { t: t("b.opt.sc.3"), v: { min: 200 } },
        { t: t("b.opt.idk"), v: null }
      ]
    },
    {
      key: "emplacement",
      when: function (a) { return segmentOf(a) === "Commerces"; },
      q: t("b.q.emplacement"),
      opts: [
        { t: t("b.opt.emp.1"), v: "passant" },
        { t: t("b.opt.emp.2"), v: "quartier" },
        { t: t("b.opt.emp.3"), v: "peripherie" }
      ]
    },
    /* ---- Logistique ---- */
    {
      key: "surfaceLog",
      when: function (a) { return segmentOf(a) === "Logistique"; },
      q: t("b.q.surfaceLog"),
      opts: [
        { t: t("b.opt.sl.1"), v: { max: 1000 } },
        { t: t("b.opt.sl.2"), v: { min: 1000, max: 5000 } },
        { t: t("b.opt.sl.3"), v: { min: 5000 } },
        { t: t("b.opt.idk"), v: null }
      ]
    },
    {
      key: "quais",
      when: function (a) { return segmentOf(a) === "Logistique"; },
      q: t("b.q.quais"),
      opts: [
        { t: t("b.opt.q.1"), v: "oui" },
        { t: t("b.opt.q.2"), v: "simple" },
        { t: t("b.opt.q.3"), v: "non" }
      ]
    },
    /* ---- Terrains ---- */
    {
      key: "surfaceTer",
      when: function (a) { return segmentOf(a) === "Terrains"; },
      q: t("b.q.surfaceTer"),
      opts: [
        { t: t("b.opt.st.1"), v: { max: 1500 } },
        { t: t("b.opt.st.2"), v: { min: 1500, max: 5000 } },
        { t: t("b.opt.st.3"), v: { min: 5000 } },
        { t: t("b.opt.idk"), v: null }
      ]
    },
    {
      key: "terrainUsage",
      when: function (a) { return segmentOf(a) === "Terrains"; },
      q: t("b.q.terrainUsage"),
      opts: [
        { t: t("b.opt.tu.1"), v: "bureaux" },
        { t: t("b.opt.tu.2"), v: "commerce" },
        { t: t("b.opt.tu.3"), v: "activite" },
        { t: t("b.opt.idk2"), v: null }
      ]
    },
    /* ---- Commun à tous ---- */
    {
      key: "ville",
      q: t("b.q.ville"),
      opts: function () {
        return villes.map(function (v) { return { t: v, v: v }; }).concat([{ t: t("b.opt.ville.any"), v: null }]);
      }
    },
    {
      key: "budget",
      q: t("b.q.budget"),
      sub: t("b.sub.budget"),
      opts: [
        { t: t("b.opt.bud.1"), v: { max: 100000 } },
        { t: t("b.opt.bud.2"), v: { min: 100000, max: 250000 } },
        { t: t("b.opt.bud.3"), v: { min: 250000, max: 400000 } },
        { t: t("b.opt.bud.4"), v: { min: 400000 } },
        { t: t("b.opt.idk2"), v: null }
      ]
    },
    {
      key: "dispo",
      q: t("b.q.dispo"),
      opts: [
        { t: t("b.opt.dispo.1"), v: "immediate" },
        { t: t("b.opt.dispo.2"), v: "six" },
        { t: t("b.opt.dispo.3"), v: null }
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
          '<span class="wizard__count">' + t("b.step") + ' ' + (cs.idx + 1) + ' / ' + cs.total + '</span>' +
          (answeredOrder.length ? '<button type="button" class="wizard__back">' + t("b.prev") + '</button>' : '<span></span>') +
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
    if (answers.dispo) bits.push(answers.dispo === "immediate" ? t("b.sum.asap") : t("b.sum.six"));
    return bits.join(" · ");
  }

  // bloc de recommandation : type de bien conseillé + pourquoi + un conseil ciblé
  function conseilHTML() {
    var seg = segmentOf(answers);
    if (!seg) return "";
    var tips = [];
    if (answers.reception === "souvent") tips.push(t("b.tip.reception"));
    if (answers.emplacement === "passant") tips.push(t("b.tip.passant"));
    else if (answers.emplacement === "peripherie") tips.push(t("b.tip.peripherie"));
    if (answers.quais === "oui") tips.push(t("b.tip.quais"));
    if (answers.terrainUsage === "activite") tips.push(t("b.tip.activite"));
    var tip = tips.length ? '<p class="conseil__tip"><strong>' + t("b.tipPre") + '</strong> ' + tips[0] + '</p>' : "";
    return '<div class="conseil reveal">' +
      '<p class="eyebrow">' + t("b.reco") + '</p>' +
      '<h2 class="conseil__h">' + t("b.recoPre") + '<strong>' + t("b.label." + seg) + '</strong>' + t("b.recoPost") + '</h2>' +
      '<p class="conseil__p">' + t("b.why." + seg) + '</p>' + tip +
      '</div>';
  }

  function resultCard(b, pct) {
    var m2 = X.loyerM2(b);
    return '<a class="bien reveal" href="fiche.html?id=' + b.id + '" aria-label="' + X.bienTitle(b) + '">' +
      '<div class="bien__media"><span class="badge">' + t("seg." + b.segment) + '</span>' +
        (X.fav ? X.fav.favBtnHTML(b.id, "card") : "") +
        '<div class="ph ph--4x3">' + X.imgTag(X.cover(b), b.titre) +
          '<span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div>' +
      '</div>' +
      '<div class="bien__body">' +
        '<div class="match-row"><span class="match-pct">' + pct + t("b.matchSuffix") + '</span>' +
          '<span class="match-track"><i style="width:' + pct + '%"></i></span></div>' +
        '<h3 class="bien__title">' + X.bienTitle(b) + '</h3>' +
        '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
        '<dl class="bien__data">' +
          '<div><dt>' + t("cat.surface") + '</dt><dd class="tnum">' + X.surface(b.surface) + '</dd></div>' +
          '<div><dt>' + t("cat.loyer") + '</dt><dd class="tnum">' + X.rent(b) + '<span class="bien__m2"> · ' + X.rentPerArea(b) + '</span></dd></div>' +
          '<div><dt>' + t("cat.dispo") + '</dt><dd>' + b.dispo + '</dd></div>' +
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
        '<h2 class="h-section">' + (top.length ? t("b.res.title") : t("b.res.none")) + '</h2>' +
        '<p class="lead mx-auto" style="max-width:46ch;margin-top:12px">' + summary() + '</p>' +
        '<div style="margin-top:22px"><button type="button" class="btn btn--ghost" id="b-restart">' + t("b.restart") + '</button></div>' +
      '</div>' +
      (top.length ? '<div class="cat-grid" style="margin-top:40px">' + cards + '</div>' : '') +
      alerteHtml() +
      '<p class="center muted" style="margin-top:40px">' + t("b.browsePre") +
        '<a class="link-chevron" href="' + catalogueUrl() + '">' + t("b.browseLink") + '</a></p>';

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
    return "biens.html" + (qs ? "?" + qs : "");
  }

  // bloc « être alerté » → enregistre un lead (type alerte) avec tous les critères
  function alerteHtml() {
    return '<div class="reveal alerte-box">' +
      '<form id="alerte-form" novalidate>' +
        '<h3>' + t("b.alert.h") + '</h3>' +
        '<p>' + t("b.alert.p") + '</p>' +
        '<div class="alerte-row">' +
          '<input id="al-mail" type="email" autocomplete="email" placeholder="' + t("b.alert.mail") + '">' +
          '<button class="btn btn--primary" type="submit">' + t("b.alert.btn") + '</button>' +
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
          (X.ui ? X.ui.ICON.check : "✓") + '</div><h3 style="font-size:20px">' + t("b.alert.doneH") + '</h3>' +
          '<p class="muted" style="margin-top:8px">' + t("b.alert.doneP") + '</p></div>';
        if (X.ui) X.ui.toast(t("b.alert.toast"));
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
