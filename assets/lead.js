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
  function t(k) { return (window.XEEXT && window.XEEXT.t) ? window.XEEXT.t(k) : k; }

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
        '<button type="button" class="btn btn--primary btn-block" data-close>' + t("lead.ok") + '</button>' +
      '</div>';
    modal.querySelector(".modal__close").addEventListener("click", ui.closeModal);
    modal.querySelector("[data-close]").addEventListener("click", ui.closeModal);
  }

  /* ---------- Modale « Estimer mon bien » (propriétaire) ---------- */
  function openEstimation() {
    var u = store.currentUser();
    // valeur stockée en français (pour l'admin), libellé affiché traduit
    var segOpts = ["Bureaux", "Commerces", "Logistique", "Terrains", "Autre"]
      .map(function (s) { return '<option value="' + s + '">' + (s === "Autre" ? t("lead.other") : t("seg." + s)) + '</option>'; }).join("");

    var html =
      '<h2 class="modal__title">' + t("lead.estTitle") + '</h2>' +
      '<p class="modal__sub">' + t("lead.estSub") + '</p>' +
      '<form id="est-form" novalidate>' +
        '<div class="field"><label for="e-seg">' + t("lead.type") + '</label>' +
          '<span class="select"><select id="e-seg">' + segOpts + '</select></span></div>' +
        '<div class="field"><label for="e-ville">' + t("lead.loc") + '</label><input id="e-ville" type="text" placeholder="' + t("lead.locPh") + '"></div>' +
        '<div class="field"><label for="e-surface">' + t("lead.surface") + '</label><input id="e-surface" type="number" min="0" placeholder="' + t("lead.surfacePh") + '"></div>' +
        '<div class="field"><label for="e-loyer">' + t("lead.value") + '</label><input id="e-loyer" type="number" min="0" placeholder="' + t("lead.valuePh") + '"></div>' +
        '<div class="field"><label for="e-nom">' + t("lead.nom") + '</label><input id="e-nom" type="text" value="' + esc(u && u.name) + '"></div>' +
        '<div class="field"><label for="e-mail">' + t("auth.mail") + '</label><input id="e-mail" type="email" value="' + esc(u && u.email) + '" placeholder="' + t("contact.ph.mail") + '"></div>' +
        '<div class="field"><label for="e-tel">' + t("rdv.tel") + '</label><input id="e-tel" type="tel" placeholder="06 12 34 56 78"></div>' +
        '<div class="field"><label for="e-msg">' + t("lead.msg") + '</label><textarea id="e-msg" placeholder="' + t("lead.msgPh") + '"></textarea></div>' +
        '<div class="form-error" id="est-err"></div>' +
        '<button type="submit" class="btn btn--primary btn-block">' + t("lead.estBtn") + '</button>' +
        '<p class="modal__note">' + t("lead.estNote") + '</p>' +
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
        done(root, t("lead.estDoneH"), t("lead.estDoneP"));
        ui.toast(t("lead.estToast"));
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
          '<h3 class="modal__title" style="font-size:24px">' + t("lead.contactDoneH") + '</h3>' +
          '<p class="modal__sub" style="margin-top:10px">' + t("lead.contactDoneP") + '</p></div>';
        ui.toast(t("lead.contactToast"));
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
