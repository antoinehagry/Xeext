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
  euros(n) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency", currency: "EUR", maximumFractionDigits: 0
    }).format(n);
  },
  nombre(n) {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
  },
  loyerM2(b) { return Math.round(b.loyer / b.surface); },
  honoraires(b) { return Math.round(b.loyer * 0.05); },
  bySegment(seg) {
    return seg === "Tous" ? window.XEEXT_BIENS
      : window.XEEXT_BIENS.filter(b => b.segment === seg);
  },
  find(id) { return window.XEEXT_BIENS.find(b => b.id === id); }
};
