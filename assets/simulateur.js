/* ============================================================
   Xeext — simulateur d'honoraires
   Slider de loyer annuel (20 000 € → 2 000 000 €), taux classique
   ajustable (15 / 20 / 30 %), comparaison live, économie en grand.
   ============================================================ */
(function () {
  function init() {
    var slider = document.getElementById("sim-slider");
    if (!slider) return;

    var euros = window.XEEXT.euros;
    var loyerOut = document.getElementById("sim-loyer");
    var classiqueOut = document.getElementById("sim-classique");
    var xeextOut = document.getElementById("sim-xeext");
    var economieOut = document.getElementById("sim-economie");
    var tauxLabel = document.getElementById("sim-taux-label");
    var rateBtns = document.querySelectorAll("[data-rate]");

    var taux = 0.20; // taux classique par défaut
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Colonne de chiffres 0→9 (empilés verticalement) pour l'effet compteur
    var COL = "";
    for (var n = 0; n <= 9; n++) COL += "<span>" + n + "</span>";

    // Affiche une valeur façon « compteur » : chaque position est une colonne
    // verticale de chiffres clippée ; seul le chiffre courant est visible, et
    // la colonne glisse jusqu'au bon chiffre (les autres restent cachés).
    function roll(el, key, value, text) {
      if (reduce) { el.textContent = text; return; }

      var chars = Array.prototype.slice.call(text);
      // signature de structure : 'd' pour un digit, sinon le séparateur lui-même
      var sig = chars.map(function (c) { return /[0-9]/.test(c) ? "d" : c; }).join("");

      if (el.getAttribute("data-sig") !== sig) {
        // (re)construction : longueur ou motif différent (ex. 5 → 6 chiffres).
        // Le transform est posé en inline dès la création : pas de transition
        // au montage (aucune valeur antérieure), donc aucun roll parasite.
        var html = "";
        for (var i = 0; i < chars.length; i++) {
          if (/[0-9]/.test(chars[i])) {
            html += '<span class="dgt"><span class="dgt__col" style="transform:translateY(-' + chars[i] + 'em)">' + COL + "</span></span>";
          } else {
            html += '<span class="sep">' + chars[i] + "</span>";
          }
        }
        el.innerHTML = html;
        el.setAttribute("data-sig", sig);
        return;
      }

      // même structure : on repositionne chaque colonne → la transition CSS roule
      var columns = el.querySelectorAll(".dgt__col");
      var ci = 0;
      for (var j = 0; j < chars.length; j++) {
        if (/[0-9]/.test(chars[j])) {
          columns[ci++].style.transform = "translateY(-" + chars[j] + "em)";
        }
      }
    }

    // mapping logarithmique pour un slider plus naturel
    var MIN = 20000, MAX = 2000000;
    function fromSlider(v) {
      var t = v / 1000;
      var val = MIN * Math.pow(MAX / MIN, t);
      // arrondi propre par paliers
      var step = val < 100000 ? 1000 : val < 500000 ? 5000 : 10000;
      return Math.round(val / step) * step;
    }

    function update() {
      var loyer = fromSlider(+slider.value);
      var classique = Math.round(loyer * taux);
      var xeext = Math.round(loyer * 0.05);
      var economie = classique - xeext;

      roll(loyerOut, "loyer", loyer, euros(loyer));
      roll(classiqueOut, "classique", classique, euros(classique));
      roll(xeextOut, "xeext", xeext, euros(xeext));
      roll(economieOut, "economie", economie, euros(economie));

      // remplissage visuel de la piste
      var pct = (+slider.value) / 10;
      slider.style.background =
        "linear-gradient(90deg, var(--accent) 0%, var(--accent) " + pct + "%, rgba(0,0,0,0.10) " + pct + "%, rgba(0,0,0,0.10) 100%)";
      slider.setAttribute("aria-valuetext", euros(loyer) + " de loyer annuel");
    }

    slider.addEventListener("input", update);

    rateBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        rateBtns.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        taux = parseInt(btn.getAttribute("data-rate"), 10) / 100;
        if (tauxLabel) tauxLabel.textContent = btn.getAttribute("data-rate") + " %";
        update();
      });
    });

    update();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
