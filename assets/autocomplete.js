/* ============================================================
   Xeext — autocomplétion de ville (API officielle geo.api.gouv.fr).
   window.XEEXT.autocompleteVille(input, opts) : suggère les communes
   françaises au fil de la saisie.
   - opts.deptInput : si fourni, la ville sélectionnée remplit ce champ
     avec le code du département, et le champ ville ne garde que le nom.
   - sinon, le champ ville reçoit « Nom (code) ».
   Sans clé ; dégradation propre si l'API est injoignable.
   ============================================================ */
(function () {
  window.XEEXT = window.XEEXT || {};
  var API = "https://geo.api.gouv.fr/communes?fields=nom,departement&boost=population&limit=6&nom=";

  function debounce(fn, ms) {
    var t;
    return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); };
  }

  window.XEEXT.autocompleteVille = function (input, opts) {
    opts = opts || {};
    if (!input || input.dataset.acReady) return;
    input.dataset.acReady = "1";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");

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
    function choose(i) {
      var it = items[i]; if (!it) return;
      if (opts.deptInput) { input.value = it.nom; opts.deptInput.value = it.code; }
      else { input.value = it.label; }
      close();
    }
    function highlight() {
      list.querySelectorAll(".ac-item").forEach(function (el, i) { el.classList.toggle("active", i === active); });
    }
    function renderList(arr) {
      items = arr; active = -1;
      if (!arr.length) { close(); return; }
      list.innerHTML = arr.map(function (it, i) {
        return '<li class="ac-item" role="option" data-i="' + i + '">' + it.label + "</li>";
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
          if (input.value.trim() !== q) return; // réponse périmée
          renderList(data.map(function (c) {
            var code = (c.departement && c.departement.code) || "";
            return { nom: c.nom, code: code, label: c.nom + (code ? " (" + code + ")" : "") };
          }));
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
    list.addEventListener("mousedown", function (e) {
      var li = e.target.closest(".ac-item");
      if (li) { e.preventDefault(); choose(+li.getAttribute("data-i")); }
    });
    input.addEventListener("blur", function () { setTimeout(close, 120); });
  };
})();
