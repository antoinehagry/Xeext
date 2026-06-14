/* ============================================================
   Xeext — réinitialisation du mot de passe.
   L'utilisateur arrive ici depuis le lien reçu par e-mail ; Supabase
   établit une session de récupération (détectée automatiquement dans
   l'URL). On met à jour le mot de passe puis on redirige.
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  var form = document.getElementById("reinit-form");
  if (!store || !form) return;

  var err = document.getElementById("reinit-err");
  var info = document.getElementById("reinit-info");
  var btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.classList.remove("show");
    var p1 = document.getElementById("r-pass").value;
    var p2 = document.getElementById("r-pass2").value;
    if (p1 !== p2) { err.textContent = "Les deux mots de passe ne correspondent pas."; err.classList.add("show"); return; }

    btn.disabled = true;
    store.updatePassword(p1).then(function (res) {
      if (!res.ok) {
        btn.disabled = false;
        err.textContent = res.error + " Le lien a peut-être expiré — redemandez un e-mail depuis la connexion.";
        err.classList.add("show");
        return;
      }
      form.style.display = "none";
      info.textContent = "Mot de passe mis à jour. Redirection vers votre espace…";
      info.classList.add("show");
      setTimeout(function () { location.href = "compte.html"; }, 1500);
    });
  });
})();
