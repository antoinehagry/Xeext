/* ============================================================
   Xeext — favoris : bouton cœur sur les cards et la fiche
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var ui = window.XEEXT.ui;

  // HTML d'un bouton cœur (variant : "card" flottant, ou "inline" dans la fiche)
  function favBtnHTML(id, variant) {
    var fav = store.isFav(id);
    if (variant === "inline") {
      return '<button type="button" class="fav-inline ' + (fav ? "is-fav" : "") + '" data-fav-id="' + id + '" aria-pressed="' + fav + '">' +
        ui.ICON.heart + '<span class="fav-label">' + (fav ? "Enregistré" : "Enregistrer") + '</span></button>';
    }
    return '<button type="button" class="fav-btn ' + (fav ? "is-fav" : "") + '" data-fav-id="' + id + '" aria-pressed="' + fav + '" aria-label="Ajouter aux favoris">' + ui.ICON.heart + '</button>';
  }

  function syncAll() {
    document.querySelectorAll("[data-fav-id]").forEach(function (btn) {
      var fav = store.isFav(btn.getAttribute("data-fav-id"));
      btn.classList.toggle("is-fav", fav);
      btn.setAttribute("aria-pressed", fav);
      var label = btn.querySelector(".fav-label");
      if (label) label.textContent = fav ? "Enregistré" : "Enregistrer";
    });
  }

  // délégation : un seul écouteur pour tous les cœurs (cards re-rendues incluses)
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-fav-id]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var id = btn.getAttribute("data-fav-id");
    if (!store.currentUser()) {
      ui.gotoAuth({ fav: id });
      return;
    }
    var res = store.toggleFav(id);
    btn.classList.add("pulse");
    setTimeout(function () { btn.classList.remove("pulse"); }, 400);
    ui.toast(res.active ? "Ajouté à vos favoris." : "Retiré de vos favoris.");
    // syncAll est déclenché par l'évènement xeext:change
  });

  window.addEventListener("xeext:change", syncAll);

  window.XEEXT.fav = { favBtnHTML: favBtnHTML, syncAll: syncAll };
})();
