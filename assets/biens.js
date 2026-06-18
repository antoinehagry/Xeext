/* ============================================================
   Xeext — base de biens fictifs (prototype)
   Données plausibles : loyers cohérents par segment et par ville.
   Aucun numéro de carte professionnelle réel.
   ============================================================ */
window.XEEXT_BIENS = [
  {
    id: "bureaux-nancy",
    segment: "Bureaux",
    titre: "Plateau de bureaux — Nancy centre",
    ville: "Nancy",
    dept: "54",
    surface: 420,
    loyer: 75600,          // €/an HT-HC
    dispo: "Immédiate",
    dispoRank: 0,
    resume: "Plateau traversant et lumineux à deux pas de la place Stanislas, livré rénové et prêt à l'emploi.",
    specs: {
      "Surface utile": "420 m²",
      "Étage": "3ᵉ étage / R+5",
      "Stationnement": "8 places en sous-sol",
      "DPE": "C",
      "État": "Rénové en 2022",
      "Chauffage": "Pompe à chaleur réversible",
      "Fibre": "Très haut débit raccordé",
      "Disponibilité": "Immédiate"
    },
    photos: [
      "Façade haussmannienne ravalée, ciel clair",
      "Plateau ouvert, parquet clair, grandes fenêtres",
      "Salle de réunion vitrée, lumière naturelle",
      "Hall d'immeuble en pierre, ascenseur"
    ]
  },
  {
    id: "bureaux-lyon",
    segment: "Bureaux",
    titre: "Immeuble indépendant — Lyon Part-Dieu",
    ville: "Lyon",
    dept: "69",
    surface: 1250,
    loyer: 400000,
    dispo: "2ᵉ trim. 2026",
    dispoRank: 2,
    resume: "Immeuble tertiaire indépendant au cœur du quartier d'affaires, idéal siège régional.",
    specs: {
      "Surface utile": "1 250 m²",
      "Configuration": "R+5, plateaux divisibles",
      "Stationnement": "32 places",
      "DPE": "B",
      "Certification": "BREEAM Very Good",
      "Chauffage": "GTB centralisée",
      "Restauration": "RIE à 200 m",
      "Disponibilité": "2ᵉ trimestre 2026"
    },
    photos: [
      "Immeuble de bureaux contemporain, façade verre et métal",
      "Open space panoramique sur la ville",
      "Patio intérieur planté",
      "Accueil avec banque en chêne"
    ]
  },
  {
    id: "bureaux-paris9",
    segment: "Bureaux",
    titre: "Plateau premium — Paris 9ᵉ",
    ville: "Paris",
    dept: "75",
    surface: 540,
    loyer: 378000,
    dispo: "Immédiate",
    dispoRank: 0,
    resume: "Plateau de prestige dans un immeuble pierre de taille, prestations haut de gamme.",
    specs: {
      "Surface utile": "540 m²",
      "Étage": "6ᵉ étage avec terrasse",
      "Stationnement": "12 places",
      "DPE": "B",
      "Hauteur sous plafond": "3,10 m",
      "Climatisation": "Plafond rayonnant",
      "Sécurité": "Gardiennage 24/7",
      "Disponibilité": "Immédiate"
    },
    photos: [
      "Immeuble pierre de taille parisien, balcons filants",
      "Plateau moulures et parquet point de Hongrie",
      "Terrasse avec vue sur les toits de Paris",
      "Salle du conseil, table en noyer"
    ]
  },
  {
    id: "bureaux-nantes",
    segment: "Bureaux",
    titre: "Open space lumineux — Nantes, Île de Nantes",
    ville: "Nantes",
    dept: "44",
    surface: 680,
    loyer: 156400,
    dispo: "Immédiate",
    dispoRank: 0,
    resume: "Plateau en rez-de-jardin sur un site réhabilité, ambiance industrielle douce.",
    specs: {
      "Surface utile": "680 m²",
      "Configuration": "Plateau unique, hauteur 4 m",
      "Stationnement": "20 places + abri vélos",
      "DPE": "B",
      "Verrière": "Toiture nord ouvrante",
      "Chauffage": "Réseau de chaleur urbain",
      "Espaces verts": "Jardin partagé attenant",
      "Disponibilité": "Immédiate"
    },
    photos: [
      "Halle industrielle réhabilitée, briques et verrière",
      "Open space mezzanine métallique",
      "Coin cuisine convivial",
      "Cour pavée arborée"
    ]
  },
  {
    id: "commerce-bordeaux",
    segment: "Commerces",
    titre: "Local commercial pied d'immeuble — Bordeaux Saint-Pierre",
    ville: "Bordeaux",
    dept: "33",
    surface: 140,
    loyer: 84000,
    dispo: "Immédiate",
    dispoRank: 0,
    resume: "Emplacement n°1 bis dans le quartier piéton, forte vitrine et flux touristique.",
    specs: {
      "Surface commerciale": "140 m²",
      "Linéaire de vitrine": "8 m",
      "Réserve": "Sous-sol 45 m²",
      "DPE": "D",
      "Flux": "Zone piétonne, fort passage",
      "Activités": "Tous commerces hors nuisances",
      "Devanture": "Classée, à conserver",
      "Disponibilité": "Immédiate"
    },
    photos: [
      "Devanture en pierre, rue piétonne pavée",
      "Volume commercial, plafond voûté",
      "Vitrine d'angle vue de la rue",
      "Réserve en sous-sol"
    ]
  },
  {
    id: "commerce-lille",
    segment: "Commerces",
    titre: "Boutique d'angle — Lille, Vieux-Lille",
    ville: "Lille",
    dept: "59",
    surface: 95,
    loyer: 66000,
    dispo: "3ᵉ trim. 2026",
    dispoRank: 3,
    resume: "Cellule d'angle à double vitrine dans le quartier le plus prisé de la métropole.",
    specs: {
      "Surface commerciale": "95 m²",
      "Linéaire de vitrine": "11 m en angle",
      "Réserve": "Étage 30 m²",
      "DPE": "C",
      "Flux": "Vieux-Lille, clientèle premium",
      "Activités": "Prêt-à-porter, beauté, café",
      "Façade": "Brique flamande restaurée",
      "Disponibilité": "3ᵉ trimestre 2026"
    },
    photos: [
      "Façade brique rouge flamande, angle de rue",
      "Boutique double exposition",
      "Détail vitrine et enseigne",
      "Pavés du Vieux-Lille"
    ]
  },
  {
    id: "logistique-marne",
    segment: "Logistique",
    titre: "Entrepôt classe A — Marne-la-Vallée",
    ville: "Marne-la-Vallée",
    dept: "77",
    surface: 6800,
    loyer: 394400,
    dispo: "4ᵉ trim. 2026",
    dispoRank: 4,
    resume: "Cellule logistique neuve classe A, embranchée sur l'A4, idéale messagerie e-commerce.",
    specs: {
      "Surface entrepôt": "6 800 m²",
      "Hauteur libre": "11,5 m",
      "Quais": "12 quais à niveau + 2 plain-pied",
      "DPE": "A",
      "Résistance au sol": "5 T/m²",
      "Sprinklage": "ESFR conforme ICPE",
      "Bureaux": "350 m² de mezzanine",
      "Disponibilité": "4ᵉ trimestre 2026"
    },
    photos: [
      "Entrepôt logistique neuf, bardage clair",
      "Quais de chargement alignés",
      "Cellule intérieure, racks haute hauteur",
      "Cour camions et giration poids lourds"
    ]
  },
  {
    id: "logistique-toulouse",
    segment: "Logistique",
    titre: "Local d'activité — Toulouse Sud",
    ville: "Toulouse",
    dept: "31",
    surface: 2400,
    loyer: 172800,
    dispo: "Immédiate",
    dispoRank: 0,
    resume: "Local mixte activité-bureaux dans un parc clôturé, accès direct rocade sud.",
    specs: {
      "Surface totale": "2 400 m²",
      "Dont bureaux": "480 m²",
      "Hauteur libre": "8 m",
      "DPE": "C",
      "Accès": "1 quai + 2 portes sectionnelles",
      "Stationnement": "40 places privatives",
      "Parc": "Site clôturé, gardienné",
      "Disponibilité": "Immédiate"
    },
    photos: [
      "Local d'activité, façade béton et bardage",
      "Atelier hauteur 8 m, éclairage zénithal",
      "Plateau de bureaux attenant",
      "Parking et accès poids lourds"
    ]
  },
  {
    id: "terrain-rennes",
    segment: "Terrains",
    titre: "Terrain d'activité viabilisé — périphérie de Rennes",
    ville: "Rennes",
    dept: "35",
    surface: 3200,
    loyer: 96000,
    dispo: "Immédiate",
    dispoRank: 0,
    resume: "Parcelle viabilisée en zone d'activité, constructible, à proximité immédiate de la rocade.",
    specs: {
      "Surface du terrain": "3 200 m²",
      "Zonage PLU": "UE — zone d'activité économique",
      "Viabilisation": "Eau, EDF, télécom en limite",
      "Constructibilité": "Emprise jusqu'à 60 %",
      "Accès": "Voirie poids lourds existante",
      "Plat": "Terrain plan, sans pollution connue",
      "Disposition": "Bail à construction possible",
      "Disponibilité": "Immédiate"
    },
    photos: [
      "Terrain plat viabilisé, zone d'activité",
      "Vue aérienne de la parcelle",
      "Accès voirie et bordures",
      "Plan de masse indicatif"
    ]
  }
];

/* Helpers partagés ----------------------------------------- */
window.XEEXT = {
  nombre(n) {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
  },

  /* ----- Devises : conversion depuis l'EUR (base) vers la devise active ----- */
  CUR: {
    EUR: { sym: "€", loc: "fr-FR" }, USD: { sym: "$", loc: "en-US" },
    GBP: { sym: "£", loc: "en-GB" }, CHF: { sym: "CHF", loc: "de-CH" },
    JPY: { sym: "¥", loc: "ja-JP" }
  },
  currency() {
    try { var c = localStorage.getItem("xeext.currency"); if (this.CUR[c]) return c; } catch (e) {}
    return "EUR";   // défaut : devise de référence
  },
  setCurrency(c) {
    try { localStorage.setItem("xeext.currency", c); } catch (e) {}
    location.reload();
  },
  // montant en EUR → formaté dans la devise active (taux dans _rates)
  money(eur) {
    var c = this.currency(), info = this.CUR[c] || this.CUR.EUR;
    var rate = (this._rates && this._rates[c]) || 1;
    return new Intl.NumberFormat(info.loc, { style: "currency", currency: c, maximumFractionDigits: 0 }).format(eur * rate);
  },
  // compat : euros() = montant déjà en EUR, formaté dans la devise active
  euros(n) { return this.money(n); },
  loyerM2(b) { return Math.round(b.loyer / b.surface); },
  honoraires(b) { return Math.round(b.loyer * 0.05); },

  /* ----- Unités de surface : m² ⇄ sq ft (les données sont toujours en m²) ----- */
  SQFT_PER_M2: 10.7639,
  unit() {
    try { var u = localStorage.getItem("xeext.unit"); if (u === "m2" || u === "sqft") return u; } catch (e) {}
    return (this.lang && this.lang() === "en") ? "sqft" : "m2";   // défaut selon la langue
  },
  setUnit(u) {
    try { localStorage.setItem("xeext.unit", u); } catch (e) {}
    location.reload();   // tout se re-rend dans la nouvelle unité
  },
  _nfSurf() {
    var ln = (this.lang && this.lang()) || "fr";
    return new Intl.NumberFormat(ln === "en" ? "en-US" : "fr-FR", { maximumFractionDigits: 0 });
  },
  // surface formatée dans l'unité active (entrée en m²)
  surface(m2) {
    return this.unit() === "sqft"
      ? this._nfSurf().format(Math.round(m2 * this.SQFT_PER_M2)) + " sq ft"
      : this._nfSurf().format(m2) + " m²";
  },
  // convertit les « N m² » présents dans une chaîne libre (caractéristiques)
  convSurf(str) {
    if (str == null || this.unit() !== "sqft") return str;
    var self = this;
    return String(str).replace(/(\d[\d.,   ]*)\s*m²/g, function (m, num) {
      var n = parseFloat(num.replace(/[^\d.]/g, ""));
      return isFinite(n) ? self._nfSurf().format(Math.round(n * self.SQFT_PER_M2)) + " sq ft" : m;
    });
  },
  areaUnit() { return this.unit() === "sqft" ? "sq ft" : "m²"; },
  // loyer annuel formaté « 75 600 €/an » (devise active + période traduite)
  rent(b) {
    return this.money(b.loyer) + (this.t ? this.t("cat.peran") : "/an");
  },
  // loyer rapporté à la surface « 180 €/m²/an » (devise + unité de surface actives)
  rentPerArea(b) {
    var area = this.unit() === "sqft" ? b.surface * this.SQFT_PER_M2 : b.surface;
    return this.money(b.loyer / area) + "/" + this.areaUnit() + (this.t ? this.t("cat.peran") : "/an");
  },
  /* ----- Traduction des titres de biens (glossaire métier FR→EN) -----
     Appliqué uniquement en anglais. Les expressions les plus spécifiques
     d'abord, puis des termes génériques en repli ; le reste (noms de villes,
     quartiers…) est laissé tel quel. */
  _titleGloss: [
    [/Local commercial pied d'immeuble/gi, "Ground-floor retail unit"],
    [/Terrain d'activité viabilisé/gi, "Serviced business land"],
    [/Plateau de bureaux/gi, "Office floor"],
    [/Immeuble indépendant/gi, "Standalone building"],
    [/Open space lumineux/gi, "Bright open space"],
    [/Boutique d'angle/gi, "Corner shop"],
    [/Entrepôt classe A/gi, "Class A warehouse"],
    [/Local d'activité/gi, "Light-industrial unit"],
    [/Plateau premium/gi, "Premium floor"],
    [/Local commercial/gi, "Retail unit"],
    // termes génériques (replis pour de nouveaux titres)
    [/Plateau/gi, "Floor"], [/Bureaux/gi, "Offices"], [/Bureau/gi, "Office"],
    [/Entrepôt/gi, "Warehouse"], [/Boutique/gi, "Shop"], [/Terrain/gi, "Land"],
    [/Immeuble/gi, "Building"], [/lumineux/gi, "bright"], [/indépendant/gi, "standalone"],
    [/viabilisé/gi, "serviced"], [/rénové/gi, "renovated"], [/périphérie de/gi, "outskirts of"],
    // transaction & termes courants (phrases avant mots simples)
    [/à la vente/gi, "for sale"], [/en vente/gi, "for sale"], [/à vendre/gi, "for sale"], [/à l'achat/gi, "for sale"],
    [/en location/gi, "to let"], [/à louer/gi, "to let"],
    [/rez-de-chaussée/gi, "ground floor"], [/centre-ville/gi, "city centre"],
    [/location/gi, "rental"], [/achat/gi, "purchase"], [/vente/gi, "sale"],
    [/meublé(?:e|s|es)?/gi, "furnished"], [/spacieu(?:x|se)/gi, "spacious"],
    [/disponible/gi, "available"], [/neu(?:f|ve|ves|fs)/gi, "new"],
    [/étage/gi, "floor"], [/proche/gi, "near"],
    // ordinaux : 1er→1st, 2ᵉ→2nd, 3ᵉ→3rd, 9ᵉ→9th, 11ᵉ→11th…
    [/(\d+)\s*ᵉ/g, function (_, n) { n = +n; var v = n % 100; return n + (v >= 11 && v <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] || "th")); }],
    [/(\d+)\s*er\b/gi, "$1st"],
    [/ Sud\b/g, " South"], [/ Nord\b/g, " North"], [/ Ouest\b/g, " West"], [/ Est\b/g, " East"]
  ],
  transTitle(s) {
    if (!s || !(this.lang && this.lang() === "en")) return s;
    var g = this._titleGloss;
    for (var i = 0; i < g.length; i++) s = s.replace(g[i][0], g[i][1]);
    return s.charAt(0).toUpperCase() + s.slice(1);   // majuscule en tête (casse de phrase)
  },

  bySegment(seg) {
    return seg === "Tous" ? window.XEEXT_BIENS
      : window.XEEXT_BIENS.filter(b => b.segment === seg);
  },
  find(id) { return window.XEEXT_BIENS.find(b => b.id === id); }
};

/* Photos libres de droits (Unsplash, hotlink autorisé par leur licence).
   La première de chaque liste sert de couverture (cards). ----------- */
window.XEEXT_IMAGES = {
  "bureaux-nancy":       ["photo-1464082354059-27db6ce50048", "photo-1497366811353-6870744d04b2", "photo-1497366754035-f200968a6e72"],
  "bureaux-lyon":        ["photo-1486406146926-c627a92ad1ab", "photo-1531973576160-7125cd663d86", "photo-1497215728101-856f4ea42174"],
  "bureaux-paris9":      ["photo-1524758631624-e2822e304c36", "photo-1604328698692-f76ea9498e76", "photo-1497366811353-6870744d04b2"],
  "bureaux-nantes":      ["photo-1497366811353-6870744d04b2", "photo-1497366754035-f200968a6e72", "photo-1531973576160-7125cd663d86"],
  "commerce-bordeaux":   ["photo-1441986300917-64674bd600d8", "photo-1604719312566-8912e9227c6a", "photo-1555529669-e69e7aa0ba9a"],
  "commerce-lille":      ["photo-1567401893414-76b7b1e5a7a5", "photo-1555529669-e69e7aa0ba9a", "photo-1441986300917-64674bd600d8"],
  "logistique-marne":    ["photo-1565891741441-64926e441838", "photo-1586528116311-ad8dd3c8310d", "photo-1553413077-190dd305871c"],
  "logistique-toulouse": ["photo-1586528116311-ad8dd3c8310d", "photo-1553413077-190dd305871c", "photo-1565891741441-64926e441838"],
  "terrain-rennes":      ["photo-1500382017468-9049fed747ef"]
};
window.XEEXT_HERO = "assets/hero.webp";

/* Coordonnées approximatives des villes (centre) pour la carte OSM. */
window.XEEXT_VILLES_COORDS = {
  "Nancy": [48.6921, 6.1844],
  "Lyon": [45.7640, 4.8357],
  "Paris": [48.8722, 2.3387],
  "Nantes": [47.2110, -1.5530],
  "Bordeaux": [44.8412, -0.5800],
  "Lille": [50.6365, 3.0635],
  "Marne-la-Vallée": [48.8406, 2.6210],
  "Toulouse": [43.6045, 1.4440],
  "Rennes": [48.1119, -1.6800]
};

window.XEEXT.imgUrl = function (id, w) {
  if (!id) return "";
  if (/^https?:\/\//.test(id)) return id; // URL complète fournie telle quelle
  return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&q=80&w=" + (w || 1100);
};
// images portées par le bien (back-office) sinon repli sur la table par défaut
window.XEEXT.cover = function (b, w) {
  var a = (b.images && b.images.length) ? b.images : window.XEEXT_IMAGES[b.id];
  return a && a.length ? window.XEEXT.imgUrl(a[0], w || 800) : null;
};
window.XEEXT.galleryUrls = function (b) {
  var a = (b.images && b.images.length) ? b.images : (window.XEEXT_IMAGES[b.id] || []);
  return a.map(function (id) { return window.XEEXT.imgUrl(id, 1100); });
};
// <img> de couverture posé dans un placeholder .ph ; en cas d'échec réseau,
// il se retire et le placeholder rayé (avec légende) réapparaît.
window.XEEXT.imgTag = function (url, alt, eager) {
  if (!url) return "";
  alt = (alt || "").replace(/"/g, "&quot;");
  return '<img class="ph__img" src="' + url + '" alt="' + alt + '" ' +
    'loading="' + (eager ? "eager" : "lazy") + '" onerror="this.remove()">';
};

/* Chargement dynamique des biens depuis Supabase (back-office).
   Si la table `biens` existe et contient des lignes, elles remplacent la liste
   de démonstration ci-dessus ; sinon on garde ces 9 biens par défaut.
   window.XEEXT.biensReady : promesse résolue à la fin du chargement. */
window.XEEXT.biensReady = (function () {
  var cfg = window.XEEXT_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return Promise.resolve();
  function mapRow(r) {
    return {
      id: r.id, segment: r.segment, titre: r.titre, ville: r.ville, dept: r.dept,
      surface: r.surface, loyer: r.loyer, dispo: r.dispo, dispoRank: r.dispo_rank || 0,
      resume: r.resume || "", specs: r.specs || {}, photos: r.photos || [], images: r.images || [],
      created_at: r.created_at
    };
  }
  return fetch(cfg.SUPABASE_URL + "/rest/v1/biens?select=*&order=ordre.asc,created_at.asc", {
    headers: { apikey: cfg.SUPABASE_ANON_KEY }
  })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (rows) {
      if (rows && rows.length) {
        var mapped = rows.map(mapRow);
        window.XEEXT_BIENS.length = 0;
        Array.prototype.push.apply(window.XEEXT_BIENS, mapped);
      }
    })
    .catch(function () { /* réseau indisponible : on garde les biens par défaut */ });
})();

/* Taux de change (base EUR). Repli fixe garanti (hors-ligne), rafraîchi une fois
   par jour depuis l'API Frankfurter (taux BCE, gratuite, sans clé) et mis en cache.
   money() lit window.XEEXT._rates de façon synchrone (cache → repli). */
window.XEEXT._rates = { EUR: 1, USD: 1.08, GBP: 0.85, CHF: 0.95, JPY: 170 };
(function () {
  var KEY = "xeext.rates";
  var today = new Date().toISOString().slice(0, 10);
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
  if (cached && cached.rates) window.XEEXT._rates = cached.rates;   // dispo immédiatement
  if (cached && cached.date === today) return;                      // déjà à jour aujourd'hui
  fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,CHF,JPY")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.rates) return;
      var rr = { EUR: 1, USD: d.rates.USD, GBP: d.rates.GBP, CHF: d.rates.CHF, JPY: d.rates.JPY };
      window.XEEXT._rates = rr;
      try { localStorage.setItem(KEY, JSON.stringify({ date: today, rates: rr })); } catch (e) {}
    })
    .catch(function () { /* hors-ligne : on garde le repli / cache */ });
})();
