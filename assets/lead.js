/* ============================================================
   Xeext — captation de leads.
   - Modale « Estimer mon bien » (côté propriétaire)
   - Formulaire de contact inline (section Contact)
   Tout passe par store.submitLead() (table Supabase `leads`),
   sans nécessiter de compte. Réutilise la modale/toast de account.js.
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var ui = window.XEEXT.ui;
  if (!store || !ui) return;

  function esc(s) { return (s || "").replace(/"/g, "&quot;"); }
  function val(root, id) { var el = root.querySelector(id); return el ? el.value.trim() : ""; }

  function done(root, titre, sousTitre) {
    var modal = root.querySelector(".modal");
    modal.innerHTML =
      '<button class="modal__close" aria-label="Fermer">' + ui.ICON.close + '</button>' +
      '<div class="rdv-done">' +
        '<div class="check">' + ui.ICON.check + '</div>' +
        '<h2 class="modal__title">' + titre + '</h2>' +
        '<p class="modal__sub" style="margin-top:12px">' + sousTitre + '</p>' +
        '<button type="button" class="btn btn--primary btn-block" data-close>OK</button>' +
      '</div>';
    modal.querySelector(".modal__close").addEventListener("click", ui.closeModal);
    modal.querySelector("[data-close]").addEventListener("click", ui.closeModal);
  }

  /* ---------- Modale « Estimer mon bien » (propriétaire) ---------- */
  function openEstimation() {
    var u = store.currentUser();
    var segOpts = ["Bureaux", "Commerces", "Logistique", "Terrains", "Autre"]
      .map(function (s) { return '<option>' + s + '</option>'; }).join("");

    var html =
      '<h2 class="modal__title">Estimer mon bien</h2>' +
      '<p class="modal__sub">Un avis de valeur argumenté sous 48 heures, sans engagement.</p>' +
      '<form id="est-form" novalidate>' +
        '<div class="field"><label for="e-seg">Type de bien</label>' +
          '<span class="select"><select id="e-seg">' + segOpts + '</select></span></div>' +
        '<div class="field"><label for="e-ville">Localisation</label><input id="e-ville" type="text" placeholder="Ville ou secteur"></div>' +
        '<div class="field"><label for="e-surface">Surface (m²)</label><input id="e-surface" type="number" min="0" placeholder="Ex. 450"></div>' +
        '<div class="field"><label for="e-loyer">Loyer annuel souhaité ou valeur (€)</label><input id="e-loyer" type="number" min="0" placeholder="Ex. 90000"></div>' +
        '<div class="field"><label for="e-nom">Nom</label><input id="e-nom" type="text" value="' + esc(u && u.name) + '"></div>' +
        '<div class="field"><label for="e-mail">E-mail</label><input id="e-mail" type="email" value="' + esc(u && u.email) + '" placeholder="vous@entreprise.fr"></div>' +
        '<div class="field"><label for="e-tel">Téléphone</label><input id="e-tel" type="tel" placeholder="06 12 34 56 78"></div>' +
        '<div class="field"><label for="e-msg">Message (facultatif)</label><textarea id="e-msg" placeholder="Précisez votre projet, vos délais…"></textarea></div>' +
        '<div class="form-error" id="est-err"></div>' +
        '<button type="submit" class="btn btn--primary btn-block">Recevoir mon estimation</button>' +
        '<p class="modal__note">En envoyant, vous acceptez d\'être recontacté par Xeext à propos de votre bien.</p>' +
      '</form>';

    var m = ui.openModal(html, { wide: true });
    var root = m.root;
    var err = root.querySelector("#est-err");
    var btn = root.querySelector('button[type="submit"]');

    // autocomplétion de ville sur le champ Localisation
    if (window.XEEXT.autocompleteVille) window.XEEXT.autocompleteVille(root.querySelector("#e-ville"));

    root.querySelector("#est-form").addEventListener("submit", function (e) {
      e.preventDefault();
      err.classList.remove("show");
      btn.disabled = true;
      var surface = parseInt(val(root, "#e-surface"), 10);
      var loyer = parseInt(val(root, "#e-loyer"), 10);
      store.submitLead({
        type: "estimation",
        segment: val(root, "#e-seg"),
        ville: val(root, "#e-ville") || null,
        surface: isNaN(surface) ? null : surface,
        loyer: isNaN(loyer) ? null : loyer,
        nom: val(root, "#e-nom"),
        email: val(root, "#e-mail"),
        telephone: val(root, "#e-tel"),
        message: val(root, "#e-msg")
      }).then(function (res) {
        if (!res.ok) { btn.disabled = false; err.textContent = res.error; err.classList.add("show"); return; }
        done(root, "Demande envoyée", "Un conseiller Xeext vous recontacte sous 48 heures avec un premier avis de valeur.");
        ui.toast("Demande d'estimation envoyée.");
      });
    });
  }

  /* ---------- Formulaire de contact inline ---------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var err = document.getElementById("contact-err");
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.classList.remove("show");
      btn.disabled = true;
      store.submitLead({
        type: "contact",
        nom: val(form, "#c-nom"),
        email: val(form, "#c-mail"),
        message: val(form, "#c-msg")
      }).then(function (res) {
        if (!res.ok) { btn.disabled = false; err.textContent = res.error; err.classList.add("show"); return; }
        form.innerHTML =
          '<div class="rdv-done"><div class="check">' + ui.ICON.check + '</div>' +
          '<h3 class="modal__title" style="font-size:24px">Message envoyé</h3>' +
          '<p class="modal__sub" style="margin-top:10px">Merci, un conseiller Xeext vous répond rapidement.</p></div>';
        ui.toast("Message envoyé.");
      });
    });
  }

  /* ---------- Câblage ---------- */
  function init() {
    document.querySelectorAll("[data-estimation]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); openEstimation(); });
    });
    initContactForm();
  }

  window.XEEXT.lead = { openEstimation: openEstimation };

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
