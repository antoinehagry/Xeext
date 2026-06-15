/* ============================================================
   Xeext — page « Mon espace » : favoris, rendez-vous, profil
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var ui = window.XEEXT.ui;
  var X = window.XEEXT;
  var t = function (k) { return X.t ? X.t(k) : k; };
  var loc = (X.lang && X.lang() === "en") ? "en-GB" : "fr-FR";
  var root = document.getElementById("compte-root");
  if (!root) return;

  function favCard(b) {
    var m2 = X.loyerM2(b);
    return '<a class="bien" href="fiche.html?id=' + b.id + '">' +
      '<div class="bien__media"><span class="badge">' + t("seg." + b.segment) + '</span>' +
      X.fav.favBtnHTML(b.id, "card") +
      '<div class="ph ph--4x3">' + X.imgTag(X.cover(b), b.titre) + '<span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div></div>' +
      '<div class="bien__body"><h3 class="bien__title">' + b.titre + '</h3>' +
      '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
      '<dl class="bien__data">' +
        '<div><dt>' + t("cat.surface") + '</dt><dd class="tnum">' + X.nombre(b.surface) + ' m²</dd></div>' +
        '<div><dt>' + t("cat.loyer") + '</dt><dd class="tnum">' + X.nombre(b.loyer) + ' ' + t("cat.peran") + '<span class="bien__m2"> · ' + m2 + ' ' + t("cat.perm2an") + '</span></dd></div>' +
      '</dl></div></a>';
  }

  function rdvRow(r) {
    var d = new Date(r.date + "T00:00:00");
    var day = new Intl.DateTimeFormat(loc, { day: "numeric" }).format(d);
    var mon = new Intl.DateTimeFormat(loc, { month: "short" }).format(d).replace(".", "");
    return '<div class="rdv-row" data-rdv="' + r.id + '">' +
      '<div class="date-box"><div class="d tnum">' + day + '</div><div class="m">' + mon + '</div></div>' +
      '<div><div class="t">' + r.bienTitre + '</div>' +
        '<div class="meta">' + cap(r.dateLabel) + ' · ' + r.time + ' · ' + r.bienVille + '</div></div>' +
      '<button class="cancel" data-cancel="' + r.id + '">' + t("compte.cancel") + '</button></div>';
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function loggedOut() {
    root.innerHTML =
      '<div class="empty-state" style="padding:96px 0">' +
        '<div class="ico">' + heartIco() + '</div>' +
        '<h3>' + t("compte.loginH") + '</h3>' +
        '<p>' + t("compte.loginP") + '</p>' +
        '<button class="btn btn--primary" id="ce-login">' + t("acct.signin") + '</button>' +
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
      '<h1 class="h-section">' + t("compte.title") + '</h1>' +
      '<p class="lead" style="margin-top:10px">' + t("compte.hello") + ' ' + u.name.split(" ")[0] + '.</p>' +
      '<div class="tabs" role="tablist">' +
        '<button class="tab" data-tab="favoris" role="tab">' + t("compte.tab.favoris") + '<span class="badge-n">' + favs.length + '</span></button>' +
        '<button class="tab" data-tab="rdv" role="tab">' + t("compte.tab.rdv") + '<span class="badge-n">' + rdvs.length + '</span></button>' +
        '<button class="tab" data-tab="profil" role="tab">' + t("compte.tab.profil") + '</button>' +
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
    tabs.forEach(function (tb) { tb.addEventListener("click", function () { activate(tb.getAttribute("data-tab")); }); });
    var hash = (location.hash || "#favoris").slice(1);
    activate(["favoris", "rdv", "profil"].indexOf(hash) !== -1 ? hash : "favoris");

    // annulation de rendez-vous
    root.querySelectorAll("[data-cancel]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        store.cancelRdv(btn.getAttribute("data-cancel"));
        ui.toast(t("compte.rdvCancelled"));
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
        '<h3>' + t("compte.favEmptyH") + '</h3>' +
        '<p>' + t("compte.favEmptyP") + '</p>' +
        '<a class="btn btn--primary" href="index.html#catalogue">' + t("nav.voirbiens") + '</a></div>';
    }
    return '<div class="cat-grid">' + favs.map(favCard).join("") + '</div>';
  }
  function rdvPane(rdvs) {
    if (!rdvs.length) {
      return '<div class="empty-state"><div class="ico">' + calIco() + '</div>' +
        '<h3>' + t("compte.rdvEmptyH") + '</h3>' +
        '<p>' + t("compte.rdvEmptyP") + '</p>' +
        '<a class="btn btn--primary" href="index.html#catalogue">' + t("compte.findBien") + '</a></div>';
    }
    return '<div class="rdv-list">' + rdvs.map(rdvRow).join("") + '</div>';
  }
  function profilPane(u, nFav, nRdv) {
    return '<div class="profil-card">' +
      '<div class="row"><span class="k">' + t("compte.profil.nom") + '</span><span class="v">' + u.name + '</span></div>' +
      '<div class="row"><span class="k">' + t("auth.mail") + '</span><span class="v">' + u.email + '</span></div>' +
      '<div class="row"><span class="k">' + t("compte.tab.favoris") + '</span><span class="v tnum">' + nFav + '</span></div>' +
      '<div class="row"><span class="k">' + t("compte.tab.rdv") + '</span><span class="v tnum">' + nRdv + '</span></div>' +
      '<button class="btn btn--ghost" id="ce-logout" style="margin-top:24px">' + t("acct.logout") + '</button>' +
      '</div>';
  }

  function render() { if (store.currentUser()) loggedIn(); else loggedOut(); }

  (window.XEEXT.biensReady || Promise.resolve()).then(render);
  window.addEventListener("xeext:change", render);
})();
