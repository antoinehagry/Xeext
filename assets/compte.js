/* ============================================================
   Xeext — page « Mon espace » : favoris, rendez-vous, profil
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var ui = window.XEEXT.ui;
  var X = window.XEEXT;
  var root = document.getElementById("compte-root");
  if (!root) return;

  function favCard(b) {
    var m2 = X.loyerM2(b);
    return '<a class="bien" href="fiche.html?id=' + b.id + '">' +
      '<div class="bien__media"><span class="badge">' + b.segment + '</span>' +
      X.fav.favBtnHTML(b.id, "card") +
      '<div class="ph ph--4x3">' + X.imgTag(X.cover(b), b.titre) + '<span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div></div>' +
      '<div class="bien__body"><h3 class="bien__title">' + b.titre + '</h3>' +
      '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
      '<dl class="bien__data">' +
        '<div><dt>Surface</dt><dd class="tnum">' + X.nombre(b.surface) + ' m²</dd></div>' +
        '<div><dt>Loyer</dt><dd class="tnum">' + X.nombre(b.loyer) + ' €/an<span class="bien__m2"> · ' + m2 + ' €/m²/an</span></dd></div>' +
      '</dl></div></a>';
  }

  function rdvRow(r) {
    var d = new Date(r.date + "T00:00:00");
    var day = new Intl.DateTimeFormat("fr-FR", { day: "numeric" }).format(d);
    var mon = new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(d).replace(".", "");
    return '<div class="rdv-row" data-rdv="' + r.id + '">' +
      '<div class="date-box"><div class="d tnum">' + day + '</div><div class="m">' + mon + '</div></div>' +
      '<div><div class="t">' + r.bienTitre + '</div>' +
        '<div class="meta">' + cap(r.dateLabel) + ' · ' + r.time + ' · ' + r.bienVille + '</div></div>' +
      '<button class="cancel" data-cancel="' + r.id + '">Annuler</button></div>';
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function loggedOut() {
    root.innerHTML =
      '<div class="empty-state" style="padding:96px 0">' +
        '<div class="ico">' + heartIco() + '</div>' +
        '<h3>Connectez-vous à votre espace</h3>' +
        '<p>Retrouvez vos biens favoris et vos rendez-vous.</p>' +
        '<button class="btn btn--primary" id="ce-login">Se connecter</button>' +
      '</div>';
    root.querySelector("#ce-login").addEventListener("click", function () { ui.gotoAuth(); });
  }

  function heartIco() {
    return '<svg width="26" height="26" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20.5l-1.6-1.45C5.4 14.5 2.5 11.9 2.5 8.6 2.5 6 4.5 4 7.1 4c1.5 0 2.9.7 3.9 1.8C12 4.7 13.4 4 14.9 4 17.5 4 19.5 6 19.5 8.6c0 3.3-2.9 5.9-7.9 10.45L12 20.5z"/></svg>';
  }
  function calIco() {
    return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  }

  function loggedIn() {
    var u = store.currentUser();
    var favs = store.favs().map(function (id) { return X.find(id); }).filter(Boolean);
    var rdvs = store.rdvs();

    root.innerHTML =
      '<h1 class="h-section">Mon espace</h1>' +
      '<p class="lead" style="margin-top:10px">Bonjour ' + u.name.split(" ")[0] + '.</p>' +
      '<div class="tabs" role="tablist">' +
        '<button class="tab" data-tab="favoris" role="tab">Favoris<span class="badge-n">' + favs.length + '</span></button>' +
        '<button class="tab" data-tab="rdv" role="tab">Rendez-vous<span class="badge-n">' + rdvs.length + '</span></button>' +
        '<button class="tab" data-tab="profil" role="tab">Profil</button>' +
      '</div>' +
      '<section class="tabpane" id="tab-favoris" role="tabpanel">' + favPane(favs) + '</section>' +
      '<section class="tabpane" id="tab-rdv" role="tabpanel">' + rdvPane(rdvs) + '</section>' +
      '<section class="tabpane" id="tab-profil" role="tabpanel">' + profilPane(u, favs.length, rdvs.length) + '</section>';

    // onglets
    var tabs = root.querySelectorAll(".tab");
    function activate(name) {
      tabs.forEach(function (t) { t.classList.toggle("active", t.getAttribute("data-tab") === name); });
      root.querySelectorAll(".tabpane").forEach(function (p) { p.classList.toggle("active", p.id === "tab-" + name); });
      if (history.replaceState) history.replaceState(null, "", "#" + name);
    }
    tabs.forEach(function (t) { t.addEventListener("click", function () { activate(t.getAttribute("data-tab")); }); });
    var hash = (location.hash || "#favoris").slice(1);
    activate(["favoris", "rdv", "profil"].indexOf(hash) !== -1 ? hash : "favoris");

    // annulation de rendez-vous
    root.querySelectorAll("[data-cancel]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        store.cancelRdv(btn.getAttribute("data-cancel"));
        ui.toast("Rendez-vous annulé.");
      });
    });

    // déconnexion depuis le profil
    var lo = root.querySelector("#ce-logout");
    if (lo) lo.addEventListener("click", function () { store.logout(); });

    if (X.fav) X.fav.syncAll();
  }

  function favPane(favs) {
    if (!favs.length) {
      return '<div class="empty-state"><div class="ico">' + heartIco() + '</div>' +
        '<h3>Aucun favori pour l\'instant</h3>' +
        '<p>Parcourez les biens et enregistrez ceux qui vous intéressent.</p>' +
        '<a class="btn btn--primary" href="index.html#catalogue">Voir les biens</a></div>';
    }
    return '<div class="cat-grid">' + favs.map(favCard).join("") + '</div>';
  }
  function rdvPane(rdvs) {
    if (!rdvs.length) {
      return '<div class="empty-state"><div class="ico">' + calIco() + '</div>' +
        '<h3>Aucun rendez-vous</h3>' +
        '<p>Choisissez un bien et réservez une visite en quelques secondes.</p>' +
        '<a class="btn btn--primary" href="index.html#catalogue">Trouver un bien</a></div>';
    }
    return '<div class="rdv-list">' + rdvs.map(rdvRow).join("") + '</div>';
  }
  function profilPane(u, nFav, nRdv) {
    return '<div class="profil-card">' +
      '<div class="row"><span class="k">Nom</span><span class="v">' + u.name + '</span></div>' +
      '<div class="row"><span class="k">E-mail</span><span class="v">' + u.email + '</span></div>' +
      '<div class="row"><span class="k">Favoris</span><span class="v tnum">' + nFav + '</span></div>' +
      '<div class="row"><span class="k">Rendez-vous</span><span class="v tnum">' + nRdv + '</span></div>' +
      '<button class="btn btn--ghost" id="ce-logout" style="margin-top:24px">Se déconnecter</button>' +
      '</div>';
  }

  function render() { if (store.currentUser()) loggedIn(); else loggedOut(); }

  (window.XEEXT.biensReady || Promise.resolve()).then(render);
  window.addEventListener("xeext:change", render);
})();
