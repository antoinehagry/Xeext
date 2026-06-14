/* ============================================================
   Xeext — back-office des biens (réservé à l'administrateur).
   Liste / ajoute / modifie / supprime les biens dans Supabase.
   L'accès UI est filtré par e-mail (store.isAdmin) ; la sécurité réelle
   est assurée par la policy RLS « biens : admin écrit ».
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var ui = window.XEEXT.ui;
  var X = window.XEEXT;
  var root = document.getElementById("admin-root");
  if (!root || !store) return;

  var SEGMENTS = ["Bureaux", "Commerces", "Logistique", "Terrains"];
  // Disponibilités proposées + rang de tri associé (calculé automatiquement)
  var DISPOS = [
    { t: "Immédiate", r: 0 },
    { t: "Sous 3 mois", r: 1 },
    { t: "Sous 6 mois", r: 2 },
    { t: "3ᵉ trimestre 2026", r: 3 },
    { t: "4ᵉ trimestre 2026", r: 4 },
    { t: "1ᵉʳ trimestre 2027", r: 5 },
    { t: "2ᵉ trimestre 2027", r: 6 },
    { t: "À définir", r: 9 }
  ];
  function rankFor(dispo, fallback) {
    for (var i = 0; i < DISPOS.length; i++) if (DISPOS[i].t === dispo) return DISPOS[i].r;
    return (typeof fallback === "number" ? fallback : 0);
  }

  function esc(s) { return (s == null ? "" : String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function v(r, sel) { var el = r.querySelector(sel); return el ? el.value.trim() : ""; }
  function int(s) { var n = parseInt(s, 10); return isNaN(n) ? null : n; }
  function fail(err, msg) { err.textContent = msg; err.classList.add("show"); }
  function linesToArr(t) { return (t || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean); }
  function specsToText(specs) { return Object.keys(specs || {}).map(function (k) { return k + " : " + specs[k]; }).join("\n"); }
  function textToSpecs(t) {
    var o = {};
    (t || "").split("\n").forEach(function (line) {
      var i = line.indexOf(":");
      if (i > 0) { var k = line.slice(0, i).trim(); var val = line.slice(i + 1).trim(); if (k) o[k] = val; }
    });
    return o;
  }
  function slugify(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /* ---------- accès ---------- */
  function gate() {
    if (!store.currentUser()) {
      root.innerHTML = state("Connexion requise", "Connectez-vous avec le compte administrateur pour gérer le catalogue.",
        '<a class="btn btn--primary" href="' + ui.authHref("connexion.html") + '">Se connecter</a>');
      return;
    }
    if (!store.isAdmin()) {
      root.innerHTML = state("Accès réservé", "Ce compte n'est pas autorisé à gérer le catalogue.",
        '<a class="btn btn--ghost" href="index.html">Retour à l\'accueil</a>');
      return;
    }
    renderList();
  }
  function state(title, msg, action) {
    return '<div class="empty-state" style="padding:90px 0"><h3>' + title + '</h3><p>' + msg + '</p>' + (action || "") + '</div>';
  }

  /* ---------- liste ---------- */
  function renderList() {
    root.innerHTML =
      '<div style="margin-bottom:22px"><h1 class="h-section">Gestion des biens</h1>' +
      '<p class="lead" style="margin-top:8px">Ajoutez, modifiez ou retirez les biens du catalogue.</p></div>' +
      '<div class="admin-bar">' +
        '<button class="btn btn--primary" id="a-add">+ Ajouter un bien</button>' +
        '<button class="btn btn--ghost" id="a-import">Importer les biens de démonstration</button>' +
      '</div>' +
      '<div id="a-list"><p class="muted">Chargement…</p></div>';

    root.querySelector("#a-add").addEventListener("click", function () { openForm(null); });
    root.querySelector("#a-import").addEventListener("click", importDefaults);

    store.adminListBiens().then(function (list) {
      var host = root.querySelector("#a-list");
      if (!list.length) {
        host.innerHTML = '<p class="muted">Aucun bien dans la base. Cliquez « Importer les biens de démonstration » pour partir des 9 biens d\'exemple, ou ajoutez-en un.</p>';
        return;
      }
      host.innerHTML = '<div class="admin-list">' + list.map(rowItem).join("") + '</div>';
      host.querySelectorAll("[data-edit]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          openForm(list.filter(function (x) { return x.id === btn.getAttribute("data-edit"); })[0]);
        });
      });
      host.querySelectorAll("[data-del]").forEach(function (btn) {
        btn.addEventListener("click", function () { del(btn.getAttribute("data-del"), btn.getAttribute("data-titre")); });
      });
    });
  }

  function rowItem(b) {
    return '<div class="admin-row">' +
      '<div class="admin-row__info"><div class="admin-row__t">' + esc(b.titre) + '</div>' +
        '<div class="admin-row__m">' + esc(b.segment) + ' · ' + esc(b.ville) +
        (b.loyer ? ' · ' + X.nombre(b.loyer) + ' €/an' : '') + '</div></div>' +
      '<div class="admin-row__a">' +
        '<button class="btn-link" data-edit="' + esc(b.id) + '">Modifier</button>' +
        '<button class="btn-link danger" data-del="' + esc(b.id) + '" data-titre="' + esc(b.titre) + '">Supprimer</button>' +
      '</div></div>';
  }

  /* ---------- formulaire ---------- */
  function fld(label, id, val, type) {
    return '<div class="field"><label for="' + id + '">' + label + '</label>' +
      '<input id="' + id + '" type="' + (type || "text") + '" value="' + esc(val) + '"></div>';
  }
  function area(label, id, val) {
    return '<div class="field"><label for="' + id + '">' + label + '</label>' +
      '<textarea id="' + id + '">' + esc(val) + '</textarea></div>';
  }
  function selSeg(val) {
    return '<div class="field"><label for="f-seg">Segment</label><span class="select"><select id="f-seg">' +
      SEGMENTS.map(function (s) { return '<option' + (s === val ? ' selected' : '') + '>' + s + '</option>'; }).join("") +
      '</select></span></div>';
  }
  function row2(a, b) { return '<div class="form-row2">' + a + b + '</div>'; }
  function selDispo(val) {
    var opts = DISPOS.slice();
    // conserve une valeur existante hors liste (biens importés / personnalisés)
    if (val && !DISPOS.some(function (d) { return d.t === val; })) opts = [{ t: val }].concat(opts);
    return '<div class="field"><label for="f-dispo">Disponibilité</label><span class="select"><select id="f-dispo">' +
      opts.map(function (d) { return '<option' + (d.t === val ? ' selected' : '') + '>' + esc(d.t) + '</option>'; }).join("") +
      '</select></span></div>';
  }

  function openForm(b) {
    b = b || {};
    var isNew = !b.id;
    var html =
      '<h2 class="modal__title">' + (isNew ? "Nouveau bien" : "Modifier le bien") + '</h2>' +
      '<form id="bf" novalidate>' +
        fld("Titre", "f-titre", b.titre) +
        selSeg(b.segment || "Bureaux") +
        row2(fld("Ville", "f-ville", b.ville), fld("Département", "f-dept", b.dept)) +
        row2(fld("Surface (m²)", "f-surface", b.surface, "number"), fld("Loyer €/an", "f-loyer", b.loyer, "number")) +
        selDispo(b.dispo) +
        area("Résumé", "f-resume", b.resume) +
        area("Caractéristiques — une par ligne au format « Clé : Valeur »", "f-specs", specsToText(b.specs)) +
        area("Légendes des photos — une par ligne", "f-photos", (b.photos || []).join("\n")) +
        area("Images — un identifiant Unsplash (photo-…) ou une URL par ligne", "f-images", (b.images || []).join("\n")) +
        fld("Ordre d'affichage", "f-ordre", b.ordre, "number") +
        '<div class="form-error" id="bf-err"></div>' +
        '<button type="submit" class="btn btn--primary btn-block">Enregistrer</button>' +
      '</form>';

    var m = ui.openModal(html, { wide: true });
    var r = m.root;
    if (X.autocompleteVille) X.autocompleteVille(r.querySelector("#f-ville"), { deptInput: r.querySelector("#f-dept") });
    var err = r.querySelector("#bf-err");

    r.querySelector("#bf").addEventListener("submit", function (e) {
      e.preventDefault();
      err.classList.remove("show");
      var titre = v(r, "#f-titre");
      if (!titre) return fail(err, "Le titre est requis.");
      var ville = v(r, "#f-ville");
      if (!ville) return fail(err, "La ville est requise.");

      var row = {
        id: b.id || slugify(titre) || ("bien-" + Date.now()),
        segment: v(r, "#f-seg") || "Bureaux",
        titre: titre,
        ville: ville,
        dept: v(r, "#f-dept") || null,
        surface: int(v(r, "#f-surface")),
        loyer: int(v(r, "#f-loyer")),
        dispo: v(r, "#f-dispo") || null,
        dispo_rank: rankFor(v(r, "#f-dispo"), b.dispo_rank),
        resume: v(r, "#f-resume") || null,
        specs: textToSpecs(v(r, "#f-specs")),
        photos: linesToArr(v(r, "#f-photos")),
        images: linesToArr(v(r, "#f-images")),
        ordre: int(v(r, "#f-ordre")) || 0
      };
      var btn = r.querySelector('button[type="submit"]');
      btn.disabled = true;
      store.adminSaveBien(row).then(function (res) {
        if (!res.ok) { btn.disabled = false; return fail(err, res.error || "Erreur lors de l'enregistrement."); }
        ui.closeModal();
        ui.toast("Bien enregistré.");
        renderList();
      });
    });
  }

  function del(id, titre) {
    if (!window.confirm("Supprimer « " + (titre || id) + " » ? Cette action est définitive.")) return;
    store.adminDeleteBien(id).then(function (res) {
      if (res.ok) { ui.toast("Bien supprimé."); renderList(); }
      else { ui.toast(res.error || "Suppression impossible."); }
    });
  }

  function importDefaults() {
    if (!window.confirm("Importer les 9 biens de démonstration dans la base ?")) return;
    var rows = window.XEEXT_BIENS.map(function (b, i) {
      return {
        id: b.id, segment: b.segment, titre: b.titre, ville: b.ville, dept: b.dept,
        surface: b.surface, loyer: b.loyer, dispo: b.dispo, dispo_rank: b.dispoRank || 0,
        resume: b.resume || null, specs: b.specs || {}, photos: b.photos || [],
        images: (b.images && b.images.length) ? b.images : (window.XEEXT_IMAGES[b.id] || []),
        ordre: i
      };
    });
    store.adminSaveBien(rows).then(function (res) {
      if (res.ok) { ui.toast("Biens importés."); renderList(); }
      else { window.alert("Échec de l'import : " + (res.error || "")); }
    });
  }

  (store.ready || Promise.resolve()).then(gate);
  window.addEventListener("xeext:change", gate);
})();
