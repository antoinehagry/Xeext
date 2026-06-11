/* ============================================================
   Xeext — catalogue de biens
   Filtres (segment, ville, surface, loyer) + tri, grille de cards.
   ============================================================ */
(function () {
  function init() {
    var grid = document.getElementById("cat-grid");
    if (!grid) return;

    var B = window.XEEXT_BIENS;
    var X = window.XEEXT;

    var state = {
      segment: "Tous",
      ville: "Toutes",
      surface: "all",
      loyer: "all",
      tri: "pertinence"
    };

    // --- Remplir le select des villes dynamiquement ---
    var villeSel = document.getElementById("f-ville");
    var villes = Array.from(new Set(B.map(function (b) { return b.ville; }))).sort();
    villes.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v; o.textContent = v;
      villeSel.appendChild(o);
    });

    function inSurface(b) {
      if (state.surface === "all") return true;
      if (state.surface === "s") return b.surface < 500;
      if (state.surface === "m") return b.surface >= 500 && b.surface <= 2000;
      if (state.surface === "l") return b.surface > 2000;
      return true;
    }
    function inLoyer(b) {
      if (state.loyer === "all") return true;
      if (state.loyer === "s") return b.loyer < 100000;
      if (state.loyer === "m") return b.loyer >= 100000 && b.loyer <= 250000;
      if (state.loyer === "l") return b.loyer > 250000;
      return true;
    }

    function card(b) {
      var m2 = X.loyerM2(b);
      var a = document.createElement("a");
      a.className = "bien reveal";
      a.href = "fiche.html?id=" + b.id;
      a.setAttribute("aria-label", b.titre);
      a.innerHTML =
        '<div class="bien__media">' +
          '<span class="badge">' + b.segment + '</span>' +
          (window.XEEXT.fav ? window.XEEXT.fav.favBtnHTML(b.id, "card") : "") +
          '<div class="ph ph--4x3">' + X.imgTag(X.cover(b), b.titre) + '<span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div>' +
        '</div>' +
        '<div class="bien__body">' +
          '<h3 class="bien__title">' + b.titre + '</h3>' +
          '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
          '<dl class="bien__data">' +
            '<div><dt>Surface</dt><dd class="tnum">' + X.nombre(b.surface) + ' m²</dd></div>' +
            '<div><dt>Loyer</dt><dd class="tnum">' + X.nombre(b.loyer) + ' €/an<span class="bien__m2"> · ' + m2 + ' €/m²/an</span></dd></div>' +
            '<div><dt>Disponibilité</dt><dd>' + b.dispo + '</dd></div>' +
          '</dl>' +
        '</div>';
      return a;
    }

    function render() {
      var list = B.filter(function (b) {
        return (state.segment === "Tous" || b.segment === state.segment) &&
               (state.ville === "Toutes" || b.ville === state.ville) &&
               inSurface(b) && inLoyer(b);
      });

      var s = state.tri;
      list.sort(function (a, b) {
        if (s === "loyer-asc") return a.loyer - b.loyer;
        if (s === "loyer-desc") return b.loyer - a.loyer;
        if (s === "surface-asc") return a.surface - b.surface;
        if (s === "surface-desc") return b.surface - a.surface;
        return a.dispoRank - b.dispoRank; // pertinence : dispo d'abord
      });

      grid.innerHTML = "";
      var count = document.getElementById("cat-count");
      if (count) {
        count.textContent = list.length + (list.length > 1 ? " biens disponibles" : " bien disponible");
      }

      if (!list.length) {
        var empty = document.createElement("p");
        empty.className = "cat-empty muted";
        empty.textContent = "Aucun bien ne correspond à ces critères. Élargissez votre recherche.";
        grid.appendChild(empty);
        return;
      }
      list.forEach(function (b, i) {
        var el = card(b);
        el.setAttribute("data-delay", String(i % 3));
        grid.appendChild(el);
      });

      // révéler les cards (animation au scroll si dispo, sinon affichage direct)
      if (typeof window.__xeextReveal === "function") {
        requestAnimationFrame(window.__xeextReveal);
      } else {
        grid.querySelectorAll(".bien.reveal").forEach(function (el) { el.classList.add("in"); });
      }
    }

    // --- Chips segment ---
    document.querySelectorAll("[data-seg]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll("[data-seg]").forEach(function (c) {
          c.classList.remove("is-active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
        state.segment = chip.getAttribute("data-seg");
        render();
      });
    });

    // --- Selects ---
    villeSel.addEventListener("change", function () { state.ville = this.value; render(); });
    document.getElementById("f-surface").addEventListener("change", function () { state.surface = this.value; render(); });
    document.getElementById("f-loyer").addEventListener("change", function () { state.loyer = this.value; render(); });
    document.getElementById("f-tri").addEventListener("change", function () { state.tri = this.value; render(); });

    // pré-sélection éventuelle via #catalogue?seg=
    render();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
