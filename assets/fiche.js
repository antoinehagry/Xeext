/* ============================================================
   Xeext — fiche bien (template)
   Lit l'id dans l'URL (?id=), rend la fiche depuis la base.
   ============================================================ */
(function () {
  function t(k) { return (window.XEEXT && window.XEEXT.t) ? window.XEEXT.t(k) : k; }
  function init() {
    var X = window.XEEXT;
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var b = (id && X.find(id)) || window.XEEXT_BIENS[0];

    var m2 = X.loyerM2(b);
    var hono = X.honoraires(b);
    var titreT = X.bienTitle(b);   // titre traduit (FR inchangé, EN via glossaire)

    document.title = titreT + " — Xeext";

    // Métadonnées de partage (Open Graph) propres au bien
    var ogDesc = b.resume + " Honoraires Xeext : 5% du loyer annuel.";
    setMeta('meta[name="description"]', ogDesc);
    setMeta('meta[property="og:title"]', titreT + " — Xeext");
    setMeta('meta[property="og:description"]', ogDesc);
    setMeta('meta[property="og:image"]', X.cover(b, 1200) || "");
    setMeta('meta[property="og:url"]', location.href);

    // En-tête
    setText("f-badge", t("seg." + b.segment));
    setText("f-title", titreT);
    setText("f-ville", b.ville + " (" + b.dept + ")");
    setText("f-resume", X.bienResume(b));

    // Galerie : grande photo + miniatures (ou placeholder rayé si aucune photo)
    var gal = document.getElementById("f-gallery");
    var urls = X.galleryUrls(b);
    var photos = urls
      .map(function (u, i) { return { url: u, alt: b.photos[i] || b.titre }; })
      .filter(function (p) { return p.url; });
    buildGallery(gal, photos, b);

    // Panneau loyer
    document.getElementById("f-loyer").innerHTML =
      X.money(b.loyer) + '<small>par an, HT-HC · ' + X.rentPerArea(b) + '</small>';

    // Données rapides
    document.getElementById("f-quick").innerHTML =
      row(t("cat.surface"), X.surface(b.surface)) +
      row(t("fiche.q.segment"), t("seg." + b.segment)) +
      row(t("fiche.q.loc"), b.ville + " (" + b.dept + ")") +
      row(t("cat.dispo"), b.dispo);

    // Honoraires Xeext calculés pour ce bien
    document.getElementById("f-hono").textContent = X.euros(hono);
    var classique = Math.round(b.loyer * 0.20);
    document.getElementById("f-hono-vs").textContent =
      t("fiche.savePre") + " " + X.euros(classique - hono) + " " + t("fiche.saveSuf");

    // Caractéristiques détaillées
    var specs = document.getElementById("f-specs");
    specs.innerHTML = Object.keys(b.specs).map(function (k) {
      return '<div><dt>' + X.specKey(k) + '</dt><dd>' + X.convSurf(X.specVal(b.specs[k])) + '</dd></div>';
    }).join("");

    // Localisation : carte + services centrés sur l'adresse exacte si elle est
    // renseignée (back-office), sinon sur le centre-ville.
    setText("f-map-ville", b.ville);
    if (b.adresse) setText("f-loc-exact", b.adresse);
    renderMap(b);
    renderPOI(b);

    // Rappel honoraires (bandeau bas)
    document.getElementById("f-reminder-num").textContent = X.euros(hono);

    // Favori (cœur dans la fiche)
    var favHolder = document.getElementById("f-fav");
    if (favHolder && window.XEEXT.fav) favHolder.innerHTML = window.XEEXT.fav.favBtnHTML(b.id, "inline");

    // CTA : ouvrir la prise de rendez-vous
    var cta = document.getElementById("f-cta");
    if (cta) cta.addEventListener("click", function () { window.XEEXT.rdv.open(b); });

    // Autres biens (même segment de préférence)
    renderSuggestions(b);

    // révéler le contenu (animation au scroll si dispo)
    if (typeof window.__xeextReveal === "function") {
      requestAnimationFrame(window.__xeextReveal);
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }
  }

  function renderSuggestions(current) {
    var grid = document.getElementById("f-suggest");
    if (!grid) return;
    var X = window.XEEXT;
    var others = window.XEEXT_BIENS.filter(function (x) { return x.id !== current.id; });
    others.sort(function (a) { return a.segment === current.segment ? -1 : 1; });
    others.slice(0, 3).forEach(function (b) {
      var a = document.createElement("a");
      a.className = "bien";
      a.href = "fiche.html?id=" + b.id;
      a.innerHTML =
        '<div class="bien__media"><span class="badge">' + t("seg." + b.segment) + '</span>' +
        '<div class="ph ph--4x3">' + X.imgTag(X.cover(b), b.titre) + '<span class="ph__label">PHOTO — ' + b.photos[0] + '</span></div></div>' +
        '<div class="bien__body"><h3 class="bien__title">' + X.bienTitle(b) + '</h3>' +
        '<p class="bien__ville">' + b.ville + ' (' + b.dept + ')</p>' +
        '<dl class="bien__data"><div><dt>' + t("cat.surface") + '</dt><dd class="tnum">' + X.surface(b.surface) + '</dd></div>' +
        '<div><dt>' + t("cat.loyer") + '</dt><dd class="tnum">' + X.rent(b) + '</dd></div></dl></div>';
      grid.appendChild(a);
    });
  }

  // Galerie « mosaïque » façon Airbnb : 1 grande photo + jusqu'à 4 vignettes,
  // coins arrondis, disposition adaptée au nombre de photos. Un clic sur une
  // photo (ou « Voir toutes les photos ») ouvre la lightbox plein écran.
  // Placeholder rayé si aucune vraie photo.
  function buildGallery(gal, photos, b) {
    if (!photos.length) {
      gal.className = "gallery gallery--empty";
      gal.innerHTML = '<div class="ph ph--16x9"><span class="ph__label">PHOTO — ' + (b.photos[0] || b.titre) + '</span></div>';
      return;
    }
    var shown = Math.min(photos.length, 5);  // au plus 1 grande + 4 vignettes
    gal.className = "gallery gallery--mosaic g-" + shown;

    var cells = "";
    for (var i = 0; i < shown; i++) {
      var alt = (photos[i].alt || b.titre).replace(/"/g, "&quot;");
      cells += '<figure class="g-cell"><img src="' + photos[i].url + '" alt="' + alt + '" ' +
        'data-i="' + i + '" loading="' + (i === 0 ? "eager" : "lazy") + '" ' +
        'onerror="this.style.visibility=\'hidden\'"></figure>';
    }
    // bouton « voir toutes les photos » (coin bas-droit), comme sur Airbnb
    var allBtn = photos.length > 1
      ? '<button type="button" class="gallery__all">' +
          '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="currentColor">' +
            '<rect x="1" y="1" width="6" height="6" rx="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.2"/>' +
            '<rect x="1" y="9" width="6" height="6" rx="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.2"/></svg>' +
          '<span>' + t("fiche.allPhotos").replace("{n}", photos.length) + '</span>' +
        '</button>'
      : "";
    gal.innerHTML = cells + allBtn;

    var lb = makeLightbox(photos);
    gal.querySelectorAll(".g-cell img").forEach(function (img) {
      img.addEventListener("click", function () { lb.open(+img.getAttribute("data-i")); });
    });
    var all = gal.querySelector(".gallery__all");
    if (all) all.addEventListener("click", function () { lb.open(0); });
  }

  // Lightbox plein écran : navigation (‹ ›, flèches, swipe), compteur, fermeture.
  function makeLightbox(photos) {
    var box, imgEl, countEl, idx = 0;
    function build() {
      box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Photo agrandie");
      box.innerHTML =
        '<button class="lightbox__close" aria-label="Fermer">✕</button>' +
        '<button class="lightbox__nav lightbox__prev" aria-label="Photo précédente">‹</button>' +
        '<img class="lightbox__img" alt="">' +
        '<button class="lightbox__nav lightbox__next" aria-label="Photo suivante">›</button>' +
        '<div class="lightbox__count"></div>';
      document.body.appendChild(box);
      imgEl = box.querySelector(".lightbox__img");
      countEl = box.querySelector(".lightbox__count");
      box.querySelector(".lightbox__close").addEventListener("click", close);
      box.querySelector(".lightbox__prev").addEventListener("click", function (e) { e.stopPropagation(); go(-1); });
      box.querySelector(".lightbox__next").addEventListener("click", function (e) { e.stopPropagation(); go(1); });
      box.addEventListener("click", function (e) { if (e.target === box) close(); });
      // navigation au balayage (swipe) sur mobile
      var tx = 0;
      box.addEventListener("touchstart", function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
      box.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 40 && photos.length > 1) go(dx < 0 ? 1 : -1);
      }, { passive: true });
    }
    function show() {
      imgEl.src = photos[idx].url;
      imgEl.alt = photos[idx].alt;
      countEl.textContent = (idx + 1) + " / " + photos.length;
      var multi = photos.length > 1;
      box.querySelector(".lightbox__prev").style.display = multi ? "" : "none";
      box.querySelector(".lightbox__next").style.display = multi ? "" : "none";
      countEl.style.display = multi ? "" : "none";
    }
    function go(d) { idx = (idx + d + photos.length) % photos.length; show(); }
    function open(i) {
      if (!box) build();
      idx = i; show();
      document.body.style.overflow = "hidden";
      box.classList.add("open");
      document.addEventListener("keydown", onKey);
      box.querySelector(".lightbox__close").focus();
    }
    function close() {
      if (!box) return;
      box.classList.remove("open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    }
    return { open: open };
  }

  function row(dt, dd) { return '<div><dt>' + dt + '</dt><dd>' + dd + '</dd></div>'; }
  function setText(id, t) { var el = document.getElementById(id); if (el) el.textContent = t; }
  function setMeta(sel, content) { var el = document.head.querySelector(sel); if (el) el.setAttribute("content", content); }

  // Carte de localisation : Mapbox GL (interactif) si un token est configuré dans
  // assets/config.js, sinon repli OpenStreetMap (sans clé). Centrée sur l'adresse
  // exacte si renseignée (back-office), sinon sur le centre-ville. Pas de
  // coordonnées → pas de carte.
  function renderMap(b) {
    var holder = document.querySelector(".map-ph");
    var c = window.XEEXT.bienCoords ? window.XEEXT.bienCoords(b)
      : (window.XEEXT_VILLES_COORDS && window.XEEXT_VILLES_COORDS[b.ville]);
    if (!holder || !c) return;
    var lat = c[0], lon = c[1];
    var token = (window.XEEXT_CONFIG || {}).MAPBOX_TOKEN;
    if (token) mapbox(holder, lon, lat, b.ville, token);
    else osm(holder, lon, lat, b.ville);
  }

  // Services à proximité (~5 km) via l'API Mapbox Search (Category Search, ton token).
  // Un appel par catégorie, plafonné à 25 résultats (limite Mapbox) → on affiche
  // « 25+ » au plafond, le compte réel sinon. Mis en cache (~30 j), asynchrone et
  // silencieux en cas d'échec (le panneau reste masqué).
  var POI_LIMIT = 25;
  var POI_CATS = [
    { k: "restaurant", id: "restaurant",    ico: "🍽️" },
    { k: "cafe",       id: "cafe",          ico: "☕" },
    { k: "doctors",    id: "doctor",        ico: "🩺" },
    { k: "pharmacy",   id: "pharmacy",      ico: "💊" },
    { k: "hospital",   id: "hospital",      ico: "🏥" },
    { k: "bank",       id: "bank",          ico: "🏦" },
    { k: "parking",    id: "parking",       ico: "🅿️" },
    { k: "transport",  id: "train_station", ico: "🚉" }
  ];
  function renderPOI(b) {
    var host = document.getElementById("f-poi");
    var c = window.XEEXT.bienCoords ? window.XEEXT.bienCoords(b)
      : (window.XEEXT_VILLES_COORDS && window.XEEXT_VILLES_COORDS[b.ville]);
    var token = (window.XEEXT_CONFIG || {}).MAPBOX_TOKEN;
    if (!host || !c || !token) return;
    var lat = c[0], lon = c[1];
    var lang = (window.XEEXT && window.XEEXT.lang) ? window.XEEXT.lang() : "fr";
    var nb = (window.XEEXT && window.XEEXT.nombre) ? window.XEEXT.nombre : function (n) { return n; };
    var dLat = 5 / 111, dLon = 5 / (111 * Math.cos(lat * Math.PI / 180));
    var bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join(",");
    var CKEY = "xeext.poi2." + lat.toFixed(3) + "," + lon.toFixed(3);

    function paint(counts) {
      var items = POI_CATS.map(function (cat) {
        var n = counts[cat.k] || 0;
        var disp = n >= POI_LIMIT ? (POI_LIMIT + "+") : nb(n);
        return '<div class="poi__item"><span class="poi__ico" aria-hidden="true">' + cat.ico + '</span>' +
          '<span class="poi__n">' + disp + '</span>' +
          '<span class="poi__lbl">' + t("poi." + cat.k) + '</span></div>';
      }).join("");
      host.innerHTML = '<h3 class="poi__title">' + t("poi.title") +
        ' <span class="poi__radius">' + t("poi.radius") + '</span></h3>' +
        '<div class="poi__grid">' + items + '</div>';
      host.hidden = false;
      if (typeof window.__xeextReveal === "function") requestAnimationFrame(window.__xeextReveal);
    }

    try {
      var cached = JSON.parse(localStorage.getItem(CKEY) || "null");
      if (cached && cached.counts && (Date.now() - cached.t) < 30 * 864e5) { paint(cached.counts); return; }
    } catch (e) {}

    var base = "https://api.mapbox.com/search/searchbox/v1/category/";
    var reqs = POI_CATS.map(function (cat) {
      var u = base + cat.id + "?access_token=" + encodeURIComponent(token) +
        "&proximity=" + lon + "," + lat + "&bbox=" + bbox + "&limit=" + POI_LIMIT + "&language=" + lang;
      return fetch(u)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { return (d && d.features) ? d.features.length : -1; })
        .catch(function () { return -1; });
    });
    Promise.all(reqs).then(function (arr) {
      if (arr.every(function (n) { return n < 0; })) return; // tout en échec → on n'affiche rien
      var counts = {};
      POI_CATS.forEach(function (cat, i) { counts[cat.k] = arr[i] < 0 ? 0 : arr[i]; });
      try { localStorage.setItem(CKEY, JSON.stringify({ t: Date.now(), counts: counts })); } catch (e) {}
      paint(counts);
    });
  }

  function osm(holder, lon, lat, ville) {
    var dLat = 0.03, dLon = 0.05;
    var bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join("%2C");
    var src = "https://www.openstreetmap.org/export/embed.html?bbox=" + bbox +
      "&layer=mapnik&marker=" + lat + "%2C" + lon;
    holder.innerHTML = '<iframe title="Carte — ' + ville + '" loading="lazy" src="' + src + '"></iframe>';
  }

  // charge la librairie Mapbox GL (CSS + JS) une seule fois, en différé
  var mapboxQueue;
  function loadMapbox(cb) {
    if (window.mapboxgl) { cb(true); return; }
    if (mapboxQueue) { mapboxQueue.push(cb); return; }
    mapboxQueue = [cb];
    var base = "https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl";
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = base + ".css";
    document.head.appendChild(css);
    var js = document.createElement("script");
    js.src = base + ".js";
    js.onload = function () { mapboxQueue.forEach(function (f) { f(true); }); mapboxQueue = null; };
    js.onerror = function () { mapboxQueue.forEach(function (f) { f(false); }); mapboxQueue = null; };
    document.head.appendChild(js);
  }

  function mapbox(holder, lon, lat, ville, token) {
    holder.innerHTML = '<div class="map-gl" id="fiche-map"></div>';
    loadMapbox(function (ok) {
      if (!ok || !window.mapboxgl) { osm(holder, lon, lat, ville); return; } // repli si échec
      try {
        window.mapboxgl.accessToken = token;
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        var map = new window.mapboxgl.Map({
          container: "fiche-map",
          style: "mapbox://styles/mapbox/standard",
          center: [lon, lat], zoom: 13, pitch: 45, cooperativeGestures: true,
          config: { basemap: { lightPreset: dark ? "night" : "day" } } // jour/nuit selon le thème
        });
        map.addControl(new window.mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        var accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#1f3df0";
        new window.mapboxgl.Marker({ color: accent }).setLngLat([lon, lat]).addTo(map);
      } catch (e) { osm(holder, lon, lat, ville); }
    });
  }

  // attendre le chargement des biens (Supabase) avant de rendre la fiche
  (window.XEEXT.biensReady || Promise.resolve()).then(function () {
    if (document.readyState !== "loading") init();
    else document.addEventListener("DOMContentLoaded", init);
  });
})();
