/* ============================================================
   Xeext — UI compte : modales, toast, authentification, menu nav
   ============================================================ */
(function () {
  var store = window.XEEXT.store;

  var ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="M12 20.5l-1.6-1.45C5.4 14.5 2.5 11.9 2.5 8.6 2.5 6 4.5 4 7.1 4c1.5 0 2.9.7 3.9 1.8C12 4.7 13.4 4 14.9 4 17.5 4 19.5 6 19.5 8.6c0 3.3-2.9 5.9-7.9 10.45L12 20.5z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  /* ---------- Toast ---------- */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  /* ---------- Modale générique ---------- */
  var activeOverlay = null;
  function openModal(innerHTML, opts) {
    opts = opts || {};
    closeModal();
    var overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML =
      '<div class="modal ' + (opts.wide ? "modal--wide" : "") + '" role="dialog" aria-modal="true">' +
      '<button class="modal__close" aria-label="Fermer">' + ICON.close + "</button>" +
      innerHTML + "</div>";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    activeOverlay = overlay;

    requestAnimationFrame(function () { overlay.classList.add("open"); });

    overlay.querySelector(".modal__close").addEventListener("click", closeModal);
    overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", escClose);

    var first = overlay.querySelector("input, button.modal__close");
    if (first) setTimeout(function () { first.focus(); }, 60);

    return { root: overlay, close: closeModal };
  }
  function escClose(e) { if (e.key === "Escape") closeModal(); }
  function closeModal() {
    if (!activeOverlay) return;
    var ov = activeOverlay; activeOverlay = null;
    document.removeEventListener("keydown", escClose);
    document.body.style.overflow = "";
    ov.classList.remove("open");
    setTimeout(function () { ov.remove(); }, 250);
  }

  /* ---------- Authentification : redirection vers les pages dédiées ---------- */
  function currentUrl() {
    return location.pathname.split("/").pop() + location.search + location.hash;
  }
  function gotoAuth(extra) {
    var params = new URLSearchParams();
    params.set("return", currentUrl());
    if (extra) Object.keys(extra).forEach(function (k) { params.set(k, extra[k]); });
    location.href = "connexion.html?" + params.toString();
  }
  function authHref(page, extra) {
    var params = new URLSearchParams();
    params.set("return", currentUrl());
    if (extra) Object.keys(extra).forEach(function (k) { params.set(k, extra[k]); });
    return page + "?" + params.toString();
  }
  function requireAuth(cb) {
    if (store.currentUser()) { cb(); return true; }
    gotoAuth();
    return false;
  }

  /* ---------- Menu compte (nav) ---------- */
  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  function renderNav() {
    var holder = document.getElementById("nav-account");
    if (!holder) {
      var inner = document.querySelector(".nav__inner");
      if (!inner) return;
      holder = document.createElement("div");
      holder.className = "nav__account";
      holder.id = "nav-account";
      var burger = inner.querySelector(".nav__burger");
      inner.insertBefore(holder, burger || null);
    }
    var u = store.currentUser();
    if (!u) {
      holder.innerHTML = '<a class="btn-signin" href="' + authHref("connexion.html") + '">Se connecter</a>';
      return;
    }
    var nFav = store.favs().length, nRdv = store.rdvs().length;
    holder.innerHTML =
      '<button class="avatar" id="acct-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Mon compte">' + initials(u.name) + '</button>' +
      '<div class="acct-menu" id="acct-menu" role="menu">' +
        '<div class="acct-menu__head"><div class="acct-menu__name">' + u.name + '</div><div class="acct-menu__mail">' + u.email + '</div></div>' +
        '<a href="compte.html#favoris" role="menuitem">Mes favoris <span class="count">' + nFav + '</span></a>' +
        '<a href="compte.html#rdv" role="menuitem">Mes rendez-vous <span class="count">' + nRdv + '</span></a>' +
        '<a href="compte.html#profil" role="menuitem">Mon profil</a>' +
        '<div class="sep"></div>' +
        '<button class="danger" id="acct-logout" role="menuitem">Se déconnecter</button>' +
      '</div>';
    var menu = holder.querySelector("#acct-menu");
    var toggle = holder.querySelector("#acct-toggle");
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!holder.contains(e.target)) { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
    holder.querySelector("#acct-logout").addEventListener("click", function () {
      store.logout(); toast("Vous êtes déconnecté.");
    });
  }

  window.XEEXT.ui = {
    ICON: ICON, toast: toast, openModal: openModal, closeModal: closeModal,
    gotoAuth: gotoAuth, authHref: authHref, requireAuth: requireAuth, renderNav: renderNav
  };

  function init() { renderNav(); }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  // resynchronise la nav à chaque changement (login, logout, favoris…)
  window.addEventListener("xeext:change", renderNav);
})();
