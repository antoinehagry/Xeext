/* ============================================================
   Xeext — fiche bien (template)
   Lit l'id dans l'URL (?id=), rend la fiche depuis la base.
   ============================================================ */
(function () {
  function init() {
    var X = window.XEEXT;
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var b = (id && X.find(id)) || window.XEEXT_BIENS[0];

    var m2 = X.loyerM2(b);
    var hono = X.honoraires(b);

    document.title = b.titre + " — Xeext";

    // En-tête
    setText("f-badge", b.segment);
    setText("f-title", b.titre);
    setText("f-ville", b.ville + " (" + b.dept + ")");
    setText("f-resume", b.resume);

    // Galerie
    var gal = document.getElementById("f-gallery");
    gal.innerHTML = b.photos.map(function (p, i) {
      var ratio = i === 0 ? "ph--16x9" : "ph--4x3";
      return '<div class="ph ' + ratio + '"><span class="ph__label">PHOTO — ' + p + '</span></div>';
    }).join("");

    // Panneau loyer
    document.getElementById("f-loyer").innerHTML =
      X.nombre(b.loyer) + ' €<small>par an, HT-HC · ' + m2 + ' €/m²/an</small>';

    // Données rapides
    document.getElementById("f-quick").innerHTML =
      row("Surface", X.nombre(b.surface) + " m²") +
      row("Segment", b.segment) +
      row("Localisation", b.ville + " (" + b.dept + ")") +
      row("Disponibilité", b.dispo);

    // Honoraires Xeext calculés pour ce bien
    document.getElementById("f-hono").textContent = X.euros(hono);
    var classique = Math.round(b.loyer * 0.20);
    document.getElementById("f-hono-vs").textContent =
      "soit " + X.euros(classique - hono) + " d'économie face à un conseil à 20 %";

    // Caractéristiques détaillées
    var specs = document.getElementById("f-specs");
    specs.innerHTML = Object.keys(b.specs).map(function (k) {
      return '<div><dt>' + k + '</dt><dd>' + b.specs[k] + '</dd></div>';
    }).join("");

    // Localisation (carte placeholder)
    setText("f-map-ville", b.ville);

    // Rappel honoraires (bandeau bas)
    document.getElementById("f-reminder-num").textContent = X.euros(hono);

    // Favori (cœur dans la fiche)
    var favHolder = document.getElementById("f-fav");
    if (favHolder && window.XEEXT.fav) favHolder.innerHTML = window.XEEXT.fav.favBtnHTML(b.id, "inline");

    // CTA : ouvrir la prise de rendez-vous
    var cta = document.getElementById("f-cta");
    if (cta) cta.addEventListener("click", function () { window.XEEXT.rdv.open(b); });

    // Autres biens (même segment de préférence)
    renderSuggestions(b);

    // révéler le contenu (animation au scroll si dispo)
    if (typeof window.__xeextReveal === "function") {
      requestAnimationFrame(window.__xeextReveal);
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }
  }

  function renderSuggestions(current) {
    var grid = document.getElementById("f-suggest");
    if (!grid) return;
    var X = window.XEEXT;
    var others = window.XEEXT_BIENS.filter(function (x) { return x.id !== current.id; });
    others.sort(function (a) { return a.segment === current.segment ? -1 : 1; });
    others.slice(0, 3).forEach(function (b) {
      var a = document.createElement("a");
      a.className = "bien";
      a.href = "fiche.html?id=" + b.id;
      a.innerHTML =
        '<div class="bien__media"><span class="badge">' + b.segment + '</span>' +
        '<div class="ph ph--4x3"><span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div></div>' +
        '<div class="bien__body"><h3 class="bien__title">' + b.titre + '</h3>' +
        '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
        '<dl class="bien__data"><div><dt>Surface</dt><dd class="tnum">' + X.nombre(b.surface) + ' m²</dd></div>' +
        '<div><dt>Loyer</dt><dd class="tnum">' + X.nombre(b.loyer) + ' €/an</dd></div></dl></div>';
      grid.appendChild(a);
    });
  }

  function row(dt, dd) { return '<div><dt>' + dt + '</dt><dd>' + dd + '</dd></div>'; }
  function setText(id, t) { var el = document.getElementById(id); if (el) el.textContent = t; }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
