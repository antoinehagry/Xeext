/* ============================================================
   Xeext — autocomplétion de ville (API officielle geo.api.gouv.fr).
   window.XEEXT.autocompleteVille(input) : suggère les communes
   françaises au fil de la saisie. Sans clé, dégradation propre si
   l'API est injoignable (le champ reste un texte libre normal).
   ============================================================ */
(function () {
  window.XEEXT = window.XEEXT || {};
  var API = "https://geo.api.gouv.fr/communes?fields=nom,departement&boost=population&limit=6&nom=";

  function debounce(fn, ms) {
    var t;
    return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); };
  }

  window.XEEXT.autocompleteVille = function (input) {
    if (!input || input.dataset.acReady) return;
    input.dataset.acReady = "1";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");

    // conteneur positionné autour de l'input (la liste se place dessous)
    var wrap = document.createElement("div");
    wrap.className = "ac";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    var list = document.createElement("ul");
    list.className = "ac-list";
    list.setAttribute("role", "listbox");
    wrap.appendChild(list);

    var items = [], active = -1;

    function close() {
      list.classList.remove("open"); list.innerHTML = "";
      items = []; active = -1; input.setAttribute("aria-expanded", "false");
    }
    function choose(i) { if (items[i]) { input.value = items[i]; close(); } }
    function highlight() {
      list.querySelectorAll(".ac-item").forEach(function (el, i) { el.classList.toggle("active", i === active); });
    }
    function renderList(names) {
      items = names; active = -1;
      if (!names.length) { close(); return; }
      list.innerHTML = names.map(function (n, i) {
        return '<li class="ac-item" role="option" data-i="' + i + '">' + n + '</li>';
      }).join("");
      list.classList.add("open");
      input.setAttribute("aria-expanded", "true");
    }

    var search = debounce(function () {
      var q = input.value.trim();
      if (q.length < 1) { close(); return; }
      fetch(API + encodeURIComponent(q))
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (input.value.trim() !== q) return; // réponse périmée (saisie continue)
          renderList(data.map(function (c) { return c.nom + " (" + c.departement.code + ")"; }));
        })
        .catch(function () { close(); });
    }, 200);

    input.addEventListener("input", search);
    input.addEventListener("keydown", function (e) {
      if (!list.classList.contains("open")) return;
      if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, items.length - 1); highlight(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
      else if (e.key === "Enter") { if (active >= 0) { e.preventDefault(); choose(active); } }
      else if (e.key === "Escape") { close(); }
    });
    // mousedown (et non click) pour devancer le blur du champ
    list.addEventListener("mousedown", function (e) {
      var li = e.target.closest(".ac-item");
      if (li) { e.preventDefault(); choose(+li.getAttribute("data-i")); }
    });
    input.addEventListener("blur", function () { setTimeout(close, 120); });
  };
})();
