/* ============================================================
   Xeext — questionnaire besoins.
   5 questions → score chaque bien selon les réponses → propose les
   meilleures correspondances (avec un % de compatibilité).
   ============================================================ */
(function () {
  var X = window.XEEXT;
  var root = document.getElementById("besoins-root");
  if (!root) return;

  var villes = Array.from(new Set(window.XEEXT_BIENS.map(function (b) { return b.ville; }))).sort();

  var STEPS = [
    {
      key: "segment",
      q: "Quel type de bien recherchez-vous ?",
      opts: [
        { t: "Bureaux", v: "Bureaux" },
        { t: "Commerces", v: "Commerces" },
        { t: "Logistique", v: "Logistique" },
        { t: "Terrains", v: "Terrains" },
        { t: "Peu importe", v: null, h: "Tous les types" }
      ]
    },
    {
      key: "ville",
      q: "Une localisation en particulier ?",
      opts: villes.map(function (v) { return { t: v, v: v }; }).concat([{ t: "Indifférent", v: null }])
    },
    {
      key: "surface",
      q: "Quelle surface vous faut-il ?",
      opts: [
        { t: "Moins de 300 m²", v: { max: 300 } },
        { t: "300 à 1 000 m²", v: { min: 300, max: 1000 } },
        { t: "1 000 à 3 000 m²", v: { min: 1000, max: 3000 } },
        { t: "Plus de 3 000 m²", v: { min: 3000 } },
        { t: "Peu importe", v: null }
      ]
    },
    {
      key: "budget",
      q: "Votre budget de loyer annuel ?",
      opts: [
        { t: "Moins de 100 000 €", v: { max: 100000 } },
        { t: "100 000 à 250 000 €", v: { min: 100000, max: 250000 } },
        { t: "250 000 à 400 000 €", v: { min: 250000, max: 400000 } },
        { t: "Plus de 400 000 €", v: { min: 400000 } },
        { t: "Peu importe", v: null }
      ]
    },
    {
      key: "dispo",
      q: "Pour quand ?",
      opts: [
        { t: "Disponibilité immédiate", v: "immediate" },
        { t: "Dans les 6 mois", v: "six" },
        { t: "Peu importe", v: null }
      ]
    }
  ];

  var answers = {};
  var step = 0;

  function setStep(i) { step = i; render(); }

  function choose(key, val) {
    answers[key] = val;
    if (step < STEPS.length - 1) setStep(step + 1);
    else showResults();
  }

  /* ----------------- questionnaire ----------------- */
  function render() {
    var s = STEPS[step];
    var pct = Math.round(step / STEPS.length * 100);
    var opts = s.opts.map(function (o, idx) {
      var sel = (s.key in answers) && JSON.stringify(answers[s.key]) === JSON.stringify(o.v);
      return '<button type="button" class="opt' + (sel ? " sel" : "") + '" data-i="' + idx + '">' +
        '<span class="opt__t">' + o.t + '</span>' +
        (o.h ? '<span class="opt__h">' + o.h + '</span>' : '') +
        '</button>';
    }).join("");

    root.innerHTML =
      '<div class="wizard reveal">' +
        '<div class="wizard__top">' +
          '<span class="wizard__count">Étape ' + (step + 1) + ' / ' + STEPS.length + '</span>' +
          (step > 0 ? '<button type="button" class="wizard__back">‹ Précédent</button>' : '<span></span>') +
        '</div>' +
        '<div class="wizard__bar"><i style="width:' + pct + '%"></i></div>' +
        '<h1 class="wizard__q">' + s.q + '</h1>' +
        '<div class="opt-grid">' + opts + '</div>' +
      '</div>';

    root.querySelectorAll(".opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        choose(s.key, s.opts[+btn.getAttribute("data-i")].v);
      });
    });
    var back = root.querySelector(".wizard__back");
    if (back) back.addEventListener("click", function () { setStep(step - 1); });

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
    var floor = r.min != null ? r.min : r.max;
    if (r.max != null && loyer < floor) return 22;        // sous le budget = acceptable
    if (r.max != null && loyer <= r.max * 1.25) return 12; // légèrement au-dessus
    if (r.min != null && r.max == null) return loyer >= r.min * 0.8 ? 16 : 0;
    return 0;
  }
  function dispoScore(rank, want) {
    if (want === "immediate") return rank === 0 ? 15 : rank <= 2 ? 8 : 3;
    return rank <= 3 ? 15 : 7; // dans les 6 mois
  }

  function score(b) {
    var earned = 0, total = 0;
    if (answers.ville)   { total += 25; if (b.ville === answers.ville) earned += 25; }
    if (answers.surface) { total += 30; earned += surfaceScore(b.surface, answers.surface); }
    if (answers.budget)  { total += 30; earned += budgetScore(b.loyer, answers.budget); }
    if (answers.dispo)   { total += 15; earned += dispoScore(b.dispoRank, answers.dispo); }
    return total ? Math.round(earned / total * 100) : 100;
  }

  /* ----------------- résultats ----------------- */
  function nb(n) { return X.nombre(n); }
  function surfaceLabel(r) { return r.min && r.max ? nb(r.min) + "–" + nb(r.max) + " m²" : r.max ? "< " + nb(r.max) + " m²" : "> " + nb(r.min) + " m²"; }
  function budgetLabel(r) { return r.min && r.max ? nb(r.min) + "–" + nb(r.max) + " €" : r.max ? "< " + nb(r.max) + " €" : "> " + nb(r.min) + " €"; }
  function summary() {
    var bits = [answers.segment || "Tous types"];
    if (answers.ville) bits.push(answers.ville);
    if (answers.surface) bits.push(surfaceLabel(answers.surface));
    if (answers.budget) bits.push(budgetLabel(answers.budget));
    if (answers.dispo) bits.push(answers.dispo === "immediate" ? "dispo immédiate" : "sous 6 mois");
    return bits.join(" · ");
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
    var list = window.XEEXT_BIENS
      .filter(function (b) { return !answers.segment || b.segment === answers.segment; })
      .map(function (b) { return { b: b, pct: score(b) }; });
    list.sort(function (a, c) { return c.pct - a.pct || a.b.dispoRank - c.b.dispoRank; });
    var top = list.slice(0, 6);
    var cards = top.map(function (x) { return resultCard(x.b, x.pct); }).join("");

    root.innerHTML =
      '<div class="reveal center" style="margin-bottom:8px">' +
        '<p class="eyebrow">Vos recommandations</p>' +
        '<h1 class="h-section">' + (top.length ? "Vos meilleures correspondances." : "Aucun bien ne correspond.") + '</h1>' +
        '<p class="lead mx-auto" style="max-width:44ch;margin-top:14px">' + summary() + '</p>' +
        '<div style="margin-top:24px"><button type="button" class="btn btn--primary" id="b-restart">Recommencer</button></div>' +
      '</div>' +
      (top.length ? '<div class="cat-grid" style="margin-top:48px">' + cards + '</div>' : '') +
      '<p class="center muted" style="margin-top:40px">Vous préférez chercher vous-même ? ' +
        '<a class="link-chevron" href="index.html#catalogue">Voir tous les biens <span class="chev">›</span></a></p>';

    root.querySelector("#b-restart").addEventListener("click", function () { answers = {}; setStep(0); });
    if (X.fav) X.fav.syncAll();
    reveal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reveal() {
    if (typeof window.__xeextReveal === "function") requestAnimationFrame(window.__xeextReveal);
    else root.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  render();
})();
