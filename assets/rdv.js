/* ============================================================
   Xeext — prise de rendez-vous (modale depuis la fiche)
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var ui = window.XEEXT.ui;
  var X = window.XEEXT;

  var SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  function nextDates(n) {
    var out = [], d = new Date(); d.setHours(0, 0, 0, 0);
    while (out.length < n) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue; // pas le dimanche
      out.push(new Date(d));
    }
    return out;
  }
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function fmt(d, opt) { return new Intl.DateTimeFormat("fr-FR", opt).format(d); }

  function open(b) {
    ui.requireAuth(function () {
      var u = store.currentUser();
      var dates = nextDates(10);
      var dateChips = dates.map(function (d, i) {
        return '<button type="button" class="rdv-chip" data-date="' + iso(d) +
          '" data-label="' + fmt(d, { weekday: "long", day: "numeric", month: "long" }) + '">' +
          fmt(d, { weekday: "short" }).replace(".", "") + '<small>' + fmt(d, { day: "numeric", month: "short" }).replace(".", "") + '</small></button>';
      }).join("");
      var slotChips = SLOTS.map(function (s) {
        return '<button type="button" class="rdv-chip" data-slot="' + s + '">' + s + '</button>';
      }).join("");

      var thumbStripe = 'background:repeating-linear-gradient(-45deg,#e6e6ea 0 8px,#f0f0f3 8px 16px)';

      var html =
        '<h2 class="modal__title">Prendre rendez-vous</h2>' +
        '<p class="modal__sub">Choisissez un créneau pour visiter ce bien.</p>' +
        '<div class="rdv-bien"><div class="thumb" style="' + thumbStripe + '"></div>' +
          '<div><div class="t">' + b.titre + '</div><div class="v">' + b.ville + ' (' + b.dept + ') · ' + X.nombre(b.surface) + ' m²</div></div></div>' +
        '<form id="rdv-form" novalidate>' +
          '<div class="field"><label>Date</label><div class="rdv-dates" id="rdv-dates">' + dateChips + '</div></div>' +
          '<div class="field"><label>Créneau</label><div class="rdv-slots" id="rdv-slots">' + slotChips + '</div></div>' +
          '<div class="field"><label for="r-name">Nom</label><input id="r-name" type="text" value="' + esc(u.name) + '"></div>' +
          '<div class="field"><label for="r-mail">E-mail</label><input id="r-mail" type="email" value="' + esc(u.email) + '"></div>' +
          '<div class="field"><label for="r-tel">Téléphone</label><input id="r-tel" type="tel" placeholder="06 12 34 56 78"></div>' +
          '<div class="field"><label for="r-msg">Message (facultatif)</label><textarea id="r-msg" placeholder="Précisez vos disponibilités, vos questions…"></textarea></div>' +
          '<div class="form-error" id="rdv-err"></div>' +
          '<button type="submit" class="btn btn--primary btn-block">Confirmer le rendez-vous</button>' +
        '</form>';

      var m = ui.openModal(html, { wide: true });
      var root = m.root;
      var sel = { date: null, dateLabel: null, slot: null };

      function chipGroup(containerId, attr, key, labelKey) {
        var cont = root.querySelector(containerId);
        cont.addEventListener("click", function (e) {
          var c = e.target.closest(".rdv-chip"); if (!c) return;
          cont.querySelectorAll(".rdv-chip").forEach(function (x) { x.classList.remove("sel"); });
          c.classList.add("sel");
          sel[key] = c.getAttribute(attr);
          if (labelKey) sel[labelKey] = c.getAttribute("data-label");
        });
      }
      chipGroup("#rdv-dates", "data-date", "date", "dateLabel");
      chipGroup("#rdv-slots", "data-slot", "slot");

      var err = root.querySelector("#rdv-err");
      root.querySelector("#rdv-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var name = root.querySelector("#r-name").value.trim();
        var mail = root.querySelector("#r-mail").value.trim();
        if (!sel.date) return fail("Choisissez une date.");
        if (!sel.slot) return fail("Choisissez un créneau horaire.");
        if (!name || !mail) return fail("Indiquez votre nom et votre e-mail.");

        store.addRdv({
          bienId: b.id, bienTitre: b.titre, bienVille: b.ville + " (" + b.dept + ")",
          date: sel.date, dateLabel: sel.dateLabel, time: sel.slot,
          name: name, email: mail, phone: root.querySelector("#r-tel").value.trim(),
          message: root.querySelector("#r-msg").value.trim()
        });
        confirm(root, sel, b);
      });
      function fail(msg) { err.textContent = msg; err.classList.add("show"); }
    });
  }

  function confirm(root, sel, b) {
    var modal = root.querySelector(".modal");
    modal.innerHTML =
      '<button class="modal__close" aria-label="Fermer">' + ui.ICON.close + '</button>' +
      '<div class="rdv-done">' +
        '<div class="check">' + ui.ICON.check + '</div>' +
        '<h2 class="modal__title">Rendez-vous confirmé</h2>' +
        '<p class="modal__sub" style="margin-top:12px">Visite de <strong>' + b.titre + '</strong><br>' +
          cap(sel.dateLabel) + ' à ' + sel.slot + '.</p>' +
        '<p class="modal__note" style="margin-top:18px">Un conseiller Xeext vous confirmera par e-mail. Retrouvez ce rendez-vous dans « Mon espace ».</p>' +
        '<a href="compte.html#rdv" class="btn btn--primary btn-block">Voir mes rendez-vous</a>' +
      '</div>';
    modal.querySelector(".modal__close").addEventListener("click", ui.closeModal);
    ui.toast("Rendez-vous enregistré.");
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function esc(s) { return (s || "").replace(/"/g, "&quot;"); }

  window.XEEXT.rdv = { open: open };
})();
