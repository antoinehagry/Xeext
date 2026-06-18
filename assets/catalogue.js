/* ============================================================
   Xeext — catalogue de biens
   - Page dédiée (biens.html) : filtres + tri + toute la grille (#cat-grid).
   - Accueil (index.html) : les 3 derniers biens arrivés (#latest-grid).
   ============================================================ */
(function () {
  var X = window.XEEXT;
  var t = function (k) { return X.t ? X.t(k) : k; };

  // carte d'un bien (réutilisée par les deux modes)
  function card(b) {
    var m2 = X.loyerM2(b);
    var a = document.createElement("a");
    a.className = "bien reveal";
    a.href = "fiche.html?id=" + b.id;
    a.setAttribute("aria-label", X.transTitle(b.titre));
    a.innerHTML =
      '<div class="bien__media">' +
        '<span class="badge">' + t("seg." + b.segment) + '</span>' +
        (X.fav ? X.fav.favBtnHTML(b.id, "card") : "") +
        '<div class="ph ph--4x3">' + X.imgTag(X.cover(b), b.titre) + '<span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div>' +
      '</div>' +
      '<div class="bien__body">' +
        '<h3 class="bien__title">' + X.transTitle(b.titre) + '</h3>' +
        '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
        '<dl class="bien__data">' +
          '<div><dt>' + t("cat.surface") + '</dt><dd class="tnum">' + X.surface(b.surface) + '</dd></div>' +
          '<div><dt>' + t("cat.loyer") + '</dt><dd class="tnum">' + X.rent(b) + '<span class="bien__m2"> · ' + X.rentPerArea(b) + '</span></dd></div>' +
          '<div><dt>' + t("cat.dispo") + '</dt><dd>' + b.dispo + '</dd></div>' +
        '</dl>' +
      '</div>';
    return a;
  }

  function reveal(grid) {
    if (typeof window.__xeextReveal === "function") requestAnimationFrame(window.__xeextReveal);
    else grid.querySelectorAll(".bien.reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Accueil : les 3 derniers biens arrivés ---------- */
  function renderLatest(grid) {
    var list = window.XEEXT_BIENS.slice().sort(function (a, b) {
      return String(b.created_at || "").localeCompare(String(a.created_at || "")); // plus récent d'abord
    }).slice(0, 3);
    grid.innerHTML = "";
    list.forEach(function (b, i) {
      var el = card(b);
      el.setAttribute("data-delay", String(i % 3));
      grid.appendChild(el);
    });
    if (X.fav) X.fav.syncAll();
    reveal(grid);
  }

  /* ---------- Page dédiée : catalogue filtrable complet ---------- */
  function initFull(grid) {
    var B = window.XEEXT_BIENS;
    var state = { segment: "Tous", ville: "Toutes", surface: "all", loyer: "all", tri: "pertinence" };

    var villeSel = document.getElementById("f-ville");
    Array.from(new Set(B.map(function (b) { return b.ville; }))).sort().forEach(function (v) {
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
      if (count) count.textContent = list.length + " " + (list.length > 1 ? t("cat.countPlural") : t("cat.countSingular"));

      if (!list.length) {
        var empty = document.createElement("p");
        empty.className = "cat-empty muted";
        empty.textContent = t("cat.empty");
        grid.appendChild(empty);
        return;
      }
      list.forEach(function (b, i) {
        var el = card(b);
        el.setAttribute("data-delay", String(i % 3));
        grid.appendChild(el);
      });
      reveal(grid);
    }

    // --- Filtres partageables via l'URL (?seg=&ville=&surface=&loyer=&tri=) ---
    function setSel(id, v) { var el = document.getElementById(id); if (el) el.value = v; }
    function applyFromUrl() {
      var p = new URLSearchParams(location.search);
      if (p.get("seg")) state.segment = p.get("seg");
      if (p.get("ville")) state.ville = p.get("ville");
      if (p.get("surface")) state.surface = p.get("surface");
      if (p.get("loyer")) state.loyer = p.get("loyer");
      if (p.get("tri")) state.tri = p.get("tri");
    }
    function reflectUI() {
      document.querySelectorAll("[data-seg]").forEach(function (c) {
        var on = c.getAttribute("data-seg") === state.segment;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      setSel("f-ville", state.ville);
      setSel("f-surface", state.surface);
      setSel("f-loyer", state.loyer);
      setSel("f-tri", state.tri);
    }
    function writeUrl() {
      var p = new URLSearchParams();
      if (state.segment !== "Tous") p.set("seg", state.segment);
      if (state.ville !== "Toutes") p.set("ville", state.ville);
      if (state.surface !== "all") p.set("surface", state.surface);
      if (state.loyer !== "all") p.set("loyer", state.loyer);
      if (state.tri !== "pertinence") p.set("tri", state.tri);
      var qs = p.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    }
    function update() { render(); writeUrl(); }

    document.querySelectorAll("[data-seg]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll("[data-seg]").forEach(function (c) {
          c.classList.remove("is-active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
        state.segment = chip.getAttribute("data-seg");
        update();
      });
    });
    villeSel.addEventListener("change", function () { state.ville = this.value; update(); });
    document.getElementById("f-surface").addEventListener("change", function () { state.surface = this.value; update(); });
    document.getElementById("f-loyer").addEventListener("change", function () { state.loyer = this.value; update(); });
    document.getElementById("f-tri").addEventListener("change", function () { state.tri = this.value; update(); });

    // Libellés du filtre « surface » dans l'unité active (la logique reste en m²)
    if (X.unit() === "sqft") {
      var sel = document.getElementById("f-surface");
      var nf = X._nfSurf();
      var lab = {
        s: "< " + X.surface(500),
        m: nf.format(Math.round(500 * X.SQFT_PER_M2)) + " – " + X.surface(2000),
        l: "> " + X.surface(2000)
      };
      if (sel) Array.prototype.forEach.call(sel.options, function (o) {
        if (lab[o.value]) o.textContent = lab[o.value];
      });
    }
    // Libellés du filtre « loyer » dans la devise active (la logique reste en EUR)
    if (X.currency() !== "EUR") {
      var selL = document.getElementById("f-loyer");
      var labL = {
        s: "< " + X.money(100000),
        m: X.money(100000) + " – " + X.money(250000),
        l: "> " + X.money(250000)
      };
      if (selL) Array.prototype.forEach.call(selL.options, function (o) {
        if (labL[o.value]) o.textContent = labL[o.value];
      });
    }

    applyFromUrl();
    reflectUI();
    render();
  }

  function init() {
    var latest = document.getElementById("latest-grid");
    if (latest) renderLatest(latest);
    var grid = document.getElementById("cat-grid");
    if (grid && document.getElementById("f-ville")) initFull(grid);
  }

  // attendre le chargement des biens (Supabase) avant de rendre la grille
  (window.XEEXT.biensReady || Promise.resolve()).then(function () {
    if (document.readyState !== "loading") init();
    else document.addEventListener("DOMContentLoaded", init);
  });
})();
