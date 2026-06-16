/* ============================================================
   Xeext — animation d'introduction (accueil).
   Écran de marque animé via Lottie (« reconstitution » du mot Xeext).
   Le lecteur Lottie est chargé en différé, uniquement quand l'intro doit
   jouer (1re fois par session ; sautée si « réduire les animations »).
   Replis garantis : si le lecteur ou le JSON échoue, on ferme l'intro —
   on n'enferme jamais l'utilisateur derrière l'écran.
   ============================================================ */
(function () {
  var el = document.getElementById("intro");
  if (!el) return;
  if (document.documentElement.classList.contains("intro-done")) { el.remove(); return; }

  try { sessionStorage.setItem("xeext.intro", "1"); } catch (e) {}

  var dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    el.classList.add("intro--out");
    setTimeout(function () {
      el.remove();
      // signale aux autres modules (ex. bandeau cookies) que l'intro est finie
      try { window.dispatchEvent(new CustomEvent("xeext:intro-done")); } catch (e) {}
    }, 650);
  }

  var box = document.getElementById("intro-lottie");
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie_light.min.js";
  s.onload = function () {
    if (!window.lottie || !box) { dismiss(); return; }
    try {
      var anim = window.lottie.loadAnimation({
        container: box, renderer: "svg", loop: false, autoplay: false,
        path: "assets/xeext-reconstitution.json"
      });
      // 1ʳᵉ image affichée, on marque une pause d'1 s, puis on lance la reconstitution
      anim.addEventListener("DOMLoaded", function () { setTimeout(function () { anim.play(); }, 1000); });
      anim.addEventListener("complete", dismiss);
      anim.addEventListener("data_failed", dismiss);
    } catch (e) { dismiss(); }
  };
  s.onerror = dismiss; // CDN bloqué / hors-ligne → on ferme proprement
  document.head.appendChild(s);

  // filet de sécurité : quoi qu'il arrive, l'intro ne reste pas affichée
  setTimeout(dismiss, 6000);
})();
