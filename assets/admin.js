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

  // Caractéristiques guidées par segment. "opts" => menu déroulant ; sinon champ texte
  // (valeurs trop variables pour une liste : dimensions, nombres…). Le stockage reste
  // un objet { "Clé": "Valeur" } ; la zone « Autres caractéristiques » complète librement.
  var DPE = ["A", "B", "C", "D", "E", "F", "G", "Non soumis", "Vierge"];
  var ETAT = ["Neuf", "Rénové", "Bon état", "À rafraîchir", "À rénover", "Brut / à aménager"];
  var CHAUFFAGE = ["Pompe à chaleur réversible", "Gaz", "Électrique", "Réseau de chaleur urbain", "GTB centralisée", "Aucun"];
  var SPEC_SCHEMA = {
    Bureaux: [
      { k: "Configuration", opts: ["Plateau ouvert", "Plateaux divisibles", "Bureaux cloisonnés", "Mixte open space / cloisonné"] },
      { k: "Étage", ph: "ex. 3ᵉ étage / R+5" },
      { k: "Hauteur sous plafond", ph: "ex. 2,70 m" },
      { k: "Stationnement", ph: "ex. 8 places en sous-sol" },
      { k: "DPE", opts: DPE },
      { k: "État", opts: ETAT },
      { k: "Chauffage", opts: CHAUFFAGE },
      { k: "Climatisation", opts: ["Oui", "Réversible", "Plafond rayonnant", "Non"] },
      { k: "Fibre", opts: ["Très haut débit raccordé", "Éligible fibre", "Non"] },
      { k: "Restauration", opts: ["RIE sur place", "RIE à proximité", "Non"] },
      { k: "Sécurité", opts: ["Gardiennage 24/7", "Contrôle d'accès", "Vidéosurveillance", "Aucune"] },
      { k: "Certification", opts: ["BREEAM", "HQE", "LEED", "Aucune"] }
    ],
    Commerces: [
      { k: "Linéaire de vitrine", ph: "ex. 8 m" },
      { k: "Réserve", ph: "ex. Sous-sol 45 m²" },
      { k: "Emplacement", opts: ["N°1", "N°1 bis", "Zone piétonne", "Centre commercial", "Axe passant", "Périphérie"] },
      { k: "DPE", opts: DPE },
      { k: "État", opts: ETAT },
      { k: "Devanture", opts: ["Moderne", "Classée à conserver", "À rénover"] },
      { k: "Activités", ph: "ex. Tous commerces hors nuisances" },
      { k: "Climatisation", opts: ["Oui", "Non"] }
    ],
    Logistique: [
      { k: "Classe", opts: ["Classe A", "Classe B", "Classe C"] },
      { k: "Hauteur libre", ph: "ex. 11,5 m" },
      { k: "Quais", ph: "ex. 12 quais à niveau + 2 plain-pied" },
      { k: "Résistance au sol", ph: "ex. 5 T/m²" },
      { k: "Sprinklage", opts: ["ESFR conforme ICPE", "Sprinklage standard", "Non sprinklé"] },
      { k: "Bureaux / mezzanine", ph: "ex. 350 m² de mezzanine" },
      { k: "Stationnement", ph: "ex. 40 places poids lourds" },
      { k: "DPE", opts: DPE },
      { k: "Chauffage", opts: CHAUFFAGE },
      { k: "Site", opts: ["Clôturé et gardienné", "Clôturé", "Parc d'activité", "Accès libre"] }
    ],
    Terrains: [
      { k: "Zonage PLU", opts: ["UE — zone d'activité", "UI — zone industrielle", "UA — centre", "AU — à urbaniser", "Autre"] },
      { k: "Viabilisation", opts: ["Viabilisé", "Partiellement viabilisé", "Non viabilisé"] },
      { k: "Constructibilité", ph: "ex. Emprise jusqu'à 60 %" },
      { k: "Nature du terrain", opts: ["Plat", "En pente", "Mixte"] },
      { k: "Accès poids lourds", opts: ["Voirie PL existante", "À créer"] },
      { k: "Disposition", opts: ["Location", "Bail à construction", "Vente"] },
      { k: "Pollution", opts: ["Aucune connue", "Étude en cours", "À dépolluer"] }
    ]
  };

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

  /* ---------- caractéristiques guidées (dropdowns par segment) ---------- */
  function specControlsHTML(segment) {
    var fields = SPEC_SCHEMA[segment] || [];
    if (!fields.length) return "";
    return '<div class="spec-grid">' + fields.map(function (f) {
      var ctrl;
      if (f.opts) {
        ctrl = '<span class="select"><select data-k="' + esc(f.k) + '"><option value="">—</option>' +
          f.opts.map(function (o) { return "<option>" + esc(o) + "</option>"; }).join("") + "</select></span>";
      } else {
        ctrl = '<input type="text" data-k="' + esc(f.k) + '" placeholder="' + esc(f.ph || "") + '">';
      }
      return '<div class="field"><label>' + esc(f.k) + "</label>" + ctrl + "</div>";
    }).join("") + "</div>";
  }
  // pré-remplit les champs depuis l'objet specs ; une valeur hors liste est ajoutée à la volée
  function fillSpecControls(host, specs) {
    specs = specs || {};
    host.querySelectorAll("[data-k]").forEach(function (el) {
      var val = specs[el.getAttribute("data-k")];
      if (val == null || val === "") return;
      if (el.tagName === "SELECT" && !Array.prototype.some.call(el.options, function (o) { return o.text === val; })) {
        var o = document.createElement("option"); o.text = val; el.appendChild(o);
      }
      el.value = val;
    });
  }
  // clés non couvertes par le segment courant (ni par le champ Disponibilité) → zone libre
  function specsExtras(segment, specs) {
    specs = specs || {};
    var known = { "Disponibilité": true };
    (SPEC_SCHEMA[segment] || []).forEach(function (f) { known[f.k] = true; });
    var extra = {};
    Object.keys(specs).forEach(function (k) { if (!known[k]) extra[k] = specs[k]; });
    return specsToText(extra);
  }
  // reconstruit l'objet specs : champs guidés (non vides) + zone libre
  function collectSpecs(r) {
    var o = {};
    r.querySelectorAll("#f-specs-fields [data-k]").forEach(function (el) {
      var val = (el.value || "").trim();
      if (val) o[el.getAttribute("data-k")] = val;
    });
    var extra = textToSpecs(v(r, "#f-specs-extra"));
    Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
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

    root.querySelector("#a-add").addEventListener("click", function () { renderForm(null); });
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
          renderForm(list.filter(function (x) { return x.id === btn.getAttribute("data-edit"); })[0]);
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

  // Formulaire en pleine page (remplace la liste) — meilleure visibilité
  function renderForm(b) {
    b = b || {};
    var isNew = !b.id;
    root.innerHTML =
      '<a class="back-link" href="#" id="f-back"><span aria-hidden="true">‹</span> Retour à la liste</a>' +
      '<h1 class="h-section" style="margin:6px 0 26px">' + (isNew ? "Nouveau bien" : "Modifier le bien") + '</h1>' +
      '<form id="bf" class="admin-form" novalidate>' +
        fld("Titre", "f-titre", b.titre) +
        fld("Titre (EN) — optionnel", "f-titre-en", b.titre_en) +
        selSeg(b.segment || "Bureaux") +
        row2(fld("Ville", "f-ville", b.ville), fld("Département", "f-dept", b.dept)) +
        row2(fld("Surface (m²)", "f-surface", b.surface, "number"), fld("Loyer €/an", "f-loyer", b.loyer, "number")) +
        selDispo(b.dispo) +
        area("Description du bien", "f-resume", b.resume) +
        area("Description (EN) — optionnel", "f-resume-en", b.resume_en) +
        '<div class="field"><label>Caractéristiques</label><div id="f-specs-fields"></div></div>' +
        area("Autres caractéristiques (optionnel — une par ligne « Clé : Valeur »)", "f-specs-extra", specsExtras(b.segment || "Bureaux", b.specs)) +
        area("Légendes des photos — une par ligne", "f-photos", (b.photos || []).join("\n")) +
        area("Images — un identifiant Unsplash (photo-…) ou une URL par ligne", "f-images", (b.images || []).join("\n")) +
        fld("Ordre d'affichage", "f-ordre", b.ordre, "number") +
        '<div class="form-error" id="bf-err"></div>' +
        '<div class="admin-form__actions">' +
          '<button type="submit" class="btn btn--primary">Enregistrer</button>' +
          '<button type="button" class="btn btn--ghost" id="f-cancel">Annuler</button>' +
        '</div>' +
      '</form>';

    var r = root;
    window.scrollTo({ top: 0, behavior: "auto" });
    if (X.autocompleteVille) X.autocompleteVille(r.querySelector("#f-ville"), { deptInput: r.querySelector("#f-dept") });
    r.querySelector("#f-back").addEventListener("click", function (e) { e.preventDefault(); renderList(); });
    r.querySelector("#f-cancel").addEventListener("click", function () { renderList(); });
    var err = r.querySelector("#bf-err");

    // Caractéristiques guidées : peinture initiale, puis re-rendu si le segment change
    // (en conservant les valeurs déjà saisies, champs guidés comme zone libre).
    var specsHost = r.querySelector("#f-specs-fields");
    function paintSpecs(segment, specs) {
      specsHost.innerHTML = specControlsHTML(segment);
      fillSpecControls(specsHost, specs);
    }
    paintSpecs(b.segment || "Bureaux", b.specs);
    r.querySelector("#f-seg").addEventListener("change", function () {
      var current = collectSpecs(r);
      paintSpecs(this.value, current);
      r.querySelector("#f-specs-extra").value = specsExtras(this.value, current);
    });

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
        titre_en: v(r, "#f-titre-en") || null,
        ville: ville,
        dept: v(r, "#f-dept") || null,
        surface: int(v(r, "#f-surface")),
        loyer: int(v(r, "#f-loyer")),
        dispo: v(r, "#f-dispo") || null,
        dispo_rank: rankFor(v(r, "#f-dispo"), b.dispo_rank),
        resume: v(r, "#f-resume") || null,
        resume_en: v(r, "#f-resume-en") || null,
        specs: collectSpecs(r),
        photos: linesToArr(v(r, "#f-photos")),
        images: linesToArr(v(r, "#f-images")),
        ordre: int(v(r, "#f-ordre")) || 0
      };
      var btn = r.querySelector('button[type="submit"]');
      btn.disabled = true;
      store.adminSaveBien(row).then(function (res) {
        if (!res.ok) { btn.disabled = false; return fail(err, res.error || "Erreur lors de l'enregistrement."); }
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
