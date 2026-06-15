/* ============================================================
   Xeext — réinitialisation du mot de passe.
   L'utilisateur arrive ici depuis le lien reçu par e-mail ; Supabase
   établit une session de récupération (détectée automatiquement dans
   l'URL). On met à jour le mot de passe puis on redirige.
   ============================================================ */
(function () {
  var store = window.XEEXT.store;
  function t(k) { return (window.XEEXT && window.XEEXT.t) ? window.XEEXT.t(k) : k; }
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
    if (p1 !== p2) { err.textContent = t("reinit.mismatch"); err.classList.add("show"); return; }

    btn.disabled = true;
    store.updatePassword(p1).then(function (res) {
      if (!res.ok) {
        btn.disabled = false;
        err.textContent = res.error + t("reinit.expired");
        err.classList.add("show");
        return;
      }
      form.style.display = "none";
      info.textContent = t("reinit.done");
      info.classList.add("show");
      setTimeout(function () { location.href = "compte.html"; }, 1500);
    });
  });
})();
