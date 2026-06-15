/* ============================================================
   Xeext — pages d'authentification dédiées (connexion / inscription)
   Lit le mode dans data-auth, appelle l'API via le store (asynchrone),
   gère le retour (?return=) et l'intention favori (?fav=) après succès.
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  function t(k) { return (window.XEEXT && window.XEEXT.t) ? window.XEEXT.t(k) : k; }
  var mode = document.body.getAttribute("data-auth"); // "login" | "signup"
  var params = new URLSearchParams(location.search);
  var ret = params.get("return") || "index.html";
  var favIntent = params.get("fav");

  // déjà connecté, ou retour d'une connexion Google (session détectée dans l'URL)
  // → on applique l'éventuel favori en attente puis on file vers la destination
  store.ready.then(function () {
    if (store.currentUser()) completeAuth(true);
  });

  // applique l'intention favori (?fav=) si présente, puis redirige vers ?return=
  function completeAuth(useReplace) {
    var nav = useReplace
      ? function () { location.replace(ret); }
      : function () { location.href = ret; };
    if (favIntent) {
      // attendre l'enregistrement du favori avant de quitter la page,
      // sinon la navigation annule la requête en cours
      var t = store.toggleFav(favIntent);
      if (t && t.done && typeof t.done.then === "function") t.done.then(nav, nav);
      else nav();
    } else {
      nav();
    }
  }

  function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }

  // propager return + fav sur le lien vers l'autre page
  var alt = document.getElementById("auth-alt");
  if (alt) {
    var p = new URLSearchParams();
    if (params.get("return")) p.set("return", params.get("return"));
    if (favIntent) p.set("fav", favIntent);
    var qs = p.toString();
    alt.setAttribute("href", alt.getAttribute("data-page") + (qs ? "?" + qs : ""));
  }

  var form = document.getElementById("auth-form");
  var err = document.getElementById("auth-err");
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.classList.remove("show");
    submitBtn.disabled = true;

    var req = mode === "signup"
      ? store.signup(val("a-name"), val("a-mail"), val("a-pass"))
      : store.login(val("a-mail"), val("a-pass"));

    req.then(function (res) {
      if (!res.ok) {
        submitBtn.disabled = false;
        err.textContent = res.error;
        err.classList.add("show");
        return;
      }
      completeAuth(false);
    });
  });

  // Connexion Google (option supplémentaire). On revient sur cette même page
  // (return/fav préservés dans l'URL) ; au retour, store.ready détecte la
  // session et completeAuth() prend le relais.
  var gBtn = document.getElementById("g-signin");
  if (gBtn) {
    gBtn.addEventListener("click", function () {
      err.classList.remove("show");
      gBtn.disabled = true;
      store.loginWithGoogle(location.href).then(function (res) {
        if (res && !res.ok) {
          gBtn.disabled = false;
          err.textContent = res.error;
          err.classList.add("show");
        }
        // succès : le navigateur est redirigé vers Google, rien à faire ici.
      });
    });
  }

  // Mot de passe oublié (présent uniquement sur la page connexion)
  var forgot = document.getElementById("forgot-link");
  var info = document.getElementById("auth-info");
  if (forgot) {
    forgot.addEventListener("click", function (e) {
      e.preventDefault();
      err.classList.remove("show");
      if (info) info.classList.remove("show");
      var email = val("a-mail");
      if (!email) {
        err.textContent = t("auth.js.needEmail");
        err.classList.add("show");
        var mailEl = document.getElementById("a-mail"); if (mailEl) mailEl.focus();
        return;
      }
      forgot.textContent = t("auth.js.sending");
      store.requestPasswordReset(email).then(function (res) {
        forgot.textContent = t("auth.forgot");
        if (!res.ok) { err.textContent = res.error; err.classList.add("show"); return; }
        if (info) {
          info.textContent = t("auth.js.resetPre") + email + t("auth.js.resetPost");
          info.classList.add("show");
        }
      });
    });
  }
})();
