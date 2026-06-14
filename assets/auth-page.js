/* ============================================================
   Xeext — pages d'authentification dédiées (connexion / inscription)
   Lit le mode dans data-auth, appelle l'API via le store (asynchrone),
   gère le retour (?return=) et l'intention favori (?fav=) après succès.
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var mode = document.body.getAttribute("data-auth"); // "login" | "signup"
  var params = new URLSearchParams(location.search);
  var ret = params.get("return") || "index.html";
  var favIntent = params.get("fav");

  // déjà connecté (session confirmée par le serveur) → on file vers la destination
  store.ready.then(function () {
    if (store.currentUser()) location.replace(ret);
  });

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
      function go() { location.href = ret; }
      if (favIntent) {
        // attendre l'enregistrement du favori avant de quitter la page,
        // sinon la navigation annule la requête en cours
        var t = store.toggleFav(favIntent);
        if (t && t.done && typeof t.done.then === "function") t.done.then(go, go);
        else go();
      } else {
        go();
      }
    });
  });

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
        err.textContent = "Saisissez d'abord votre e-mail ci-dessus, puis recliquez sur « Mot de passe oublié ? ».";
        err.classList.add("show");
        var mailEl = document.getElementById("a-mail"); if (mailEl) mailEl.focus();
        return;
      }
      forgot.textContent = "Envoi…";
      store.requestPasswordReset(email).then(function (res) {
        forgot.textContent = "Mot de passe oublié ?";
        if (!res.ok) { err.textContent = res.error; err.classList.add("show"); return; }
        if (info) {
          info.textContent = "Si un compte existe pour " + email + ", un e-mail de réinitialisation vient d'être envoyé. Pensez à vérifier vos spams.";
          info.classList.add("show");
        }
      });
    });
  }
})();
