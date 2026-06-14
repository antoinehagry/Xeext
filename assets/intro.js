/* ============================================================
   Xeext — animation d'introduction (accueil).
   L'écran de marque est dans le HTML dès le départ (aucun flash). Un
   script inline dans le <head> ajoute « intro-done » si l'intro a déjà
   été jouée dans la session ou si l'utilisateur réduit les animations.
   Ici, on déclenche simplement la sortie de l'écran, puis on le retire.
   ============================================================ */
(function () {
  var el = document.getElementById("intro");
  if (!el) return;
  if (document.documentElement.classList.contains("intro-done")) { el.remove(); return; }

  try { sessionStorage.setItem("xeext.intro", "1"); } catch (e) {}

  setTimeout(function () {
    el.classList.add("intro--out");
    setTimeout(function () { el.remove(); }, 650);
  }, 750);
})();
