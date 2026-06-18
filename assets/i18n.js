/* ============================================================
   Xeext — bilingue FR / EN.
   Le français est la source (texte dans le HTML). L'anglais vient du
   dictionnaire ci-dessous. Détection : ?lang= → choix mémorisé →
   langue du navigateur (en → anglais, sinon français).
   - HTML statique : attributs data-i18n / data-i18n-html / data-i18n-attr.
   - Texte généré en JS : window.XEEXT.t("clé").
   Le bouton de langue recharge la page (tout se reconstruit dans la langue).
   ============================================================ */
window.XEEXT_I18N = {
  // ---- Anglais : toutes les clés (le FR du HTML sert de repli) ----
  en: {
    // Navigation
    "nav.biens": "Properties",
    "nav.besoins": "Find my space",
    "nav.honoraires": "Fees",
    "nav.contact": "Contact",
    "nav.apropos": "About",
    "nav.estimer": "Value my property",
    "nav.voirbiens": "View properties",
    // Thème (sélecteur du footer)
    "theme.label": "Theme", "theme.light": "Light", "theme.dark": "Dark", "theme.auto": "Auto",
    // Fil d'Ariane (pied de page)
    "bc.home": "Home", "bc.aria": "Breadcrumb", "bc.account": "My account",
    "bc.signup": "Create account", "bc.reset": "Reset password", "bc.admin": "Administration",
    // Hero
    "hero.h1": "Corporate real estate advisory.<br><span class=\"grad-loop\">Reinvented at&nbsp;5%.</span>",
    "hero.lead": "Offices, retail, logistics, land. The same support as a major network — for fees divided by three.",
    "hero.cta2": "Estimate my fees <span class=\"chev\">›</span>",
    "hero.imgalt": "Business partners in suits looking at an office building — corporate real estate",
    // Le chiffre
    "chiffre.eyebrow": "The Xeext rate",
    "chiffre.sub": "instead of 15 to 30% at traditional advisors.",
    "chiffre.note": "A single rate, stated before the mandate. Calculated on the annual rent.",
    // Simulateur
    "sim.h2": "What you save.",
    "sim.lead": "Set the annual rent. Compare in real time.",
    "sim.loyerlabel": "Annual rent of the property",
    "sim.taux": "Fees of a traditional advisor:",
    "sim.classiqueLabel": "Traditional advisor",
    "sim.eco": "Your saving",
    // Catalogue (statique)
    "cat.eyebrow": "Available properties",
    "cat.h2": "Find your next space.",
    "cat.intro": "No time to browse everything? <a class=\"link-chevron\" href=\"besoins.html\">Answer 5 questions and we'll suggest the properties made for you <span class=\"chev\">›</span></a>",
    "cat.seg.tous": "All",
    "cat.seg.bureaux": "Offices",
    "cat.seg.commerces": "Retail",
    "cat.seg.logistique": "Logistics",
    "cat.seg.terrains": "Land",
    "cat.opt.villeAll": "All cities",
    "cat.opt.surfAll": "All areas",
    "cat.opt.surfS": "Under 500 m²",
    "cat.opt.surfM": "500 to 2,000 m²",
    "cat.opt.surfL": "Over 2,000 m²",
    "cat.opt.loyerAll": "All rents",
    "cat.opt.loyerS": "Under €100,000",
    "cat.opt.loyerM": "€100,000 to €250,000",
    "cat.opt.loyerL": "Over €250,000",
    "cat.opt.triPert": "Sort: relevance",
    "cat.opt.triLoyerAsc": "Rent, low to high",
    "cat.opt.triLoyerDesc": "Rent, high to low",
    "cat.opt.triSurfAsc": "Area, low to high",
    "cat.opt.triSurfDesc": "Area, high to low",
    // Pourquoi 5%
    "why.h2": "Why 5% is enough.",
    "why.1.t": "Lean structure",
    "why.1.p": "No prestige branch network to amortise. You pay for advice, not for storefronts.",
    "why.2.t": "Digital process",
    "why.2.p": "From valuation to signing, everything is tooled. Less friction, lower costs.",
    "why.3.t": "Single rate",
    "why.3.p": "5% of the annual rent, stated before the mandate. No negotiation, no surprises.",
    // Méthode
    "method.eyebrow": "The method",
    "method.h2": "Four steps. Nothing more.",
    "method.1.t": "Valuation",
    "method.1.p": "Market analysis and a substantiated rental value, within 48 hours.",
    "method.2.t": "Strategy",
    "method.2.p": "Positioning, target tenants and a tailored marketing plan.",
    "method.3.t": "Marketing",
    "method.3.p": "Distribution, qualified viewings and transparent reporting at every step.",
    "method.4.t": "Signing",
    "method.4.p": "Negotiation, drafting and support all the way to the signed lease.",
    // Barème
    "bareme.eyebrow": "Rate comparison",
    "bareme.h2": "The same service. A third of the price.",
    "bareme.th.prestation": "Service",
    "bareme.th.classique": "Traditional advisor",
    "bareme.r1.t": "Letting fees",
    "bareme.r1.c": "15 to 30% of annual rent",
    "bareme.r1.x": "5%",
    "bareme.r2.t": "Valuation and opinion of value",
    "bareme.r2.c": "Variable",
    "bareme.r2.x": "Included",
    "bareme.r3.t": "Multichannel marketing",
    "bareme.r3.c": "Included",
    "bareme.r3.x": "Included",
    "bareme.r4.t": "Mandate reporting",
    "bareme.r4.c": "On request",
    "bareme.r4.x": "Continuous",
    "bareme.r5.t": "Rate known before mandate",
    "bareme.r5.c": "Rarely",
    "bareme.r5.x": "Always",
    // Propriétaires
    "owners.eyebrow": "Are you an owner?",
    "owners.h2": "Entrust us with your property.",
    "owners.lead": "Opinion of value within 48 hours, multichannel marketing — and fees of 5% instead of 15 to 30%.",
    "owners.cta": "Value my property for free",
    "owners.bareme": "See the rate <span class=\"chev\">›</span>",
    // Contact
    "contact.h2": "Let's talk about your asset.",
    "contact.lead": "A quick reply from an advisor, no commitment.",
    "contact.nom": "Name",
    "contact.mail": "Email",
    "contact.msg": "Message",
    "contact.ph.nom": "Your name",
    "contact.ph.mail": "you@company.com",
    "contact.ph.msg": "Your project, the property you're interested in…",
    "contact.send": "Send",
    "contact.note": "By sending, you agree to be contacted by Xeext.",
    "contact.or": "Or by email:",
    // Footer
    "footer.tagline": "Corporate real estate advisory. Offices, retail, logistics, land.",
    "footer.methode": "Method",
    "footer.bareme": "Rate",
    "footer.legal1": "<strong>Xeext</strong> — Corporate real estate advisory. A company carrying out transactions on real estate and business assets under French law no. 70-9 of 2 January 1970 (loi Hoguet).",
    "footer.legal2": "Holder of a professional licence “Transactions on real estate and business assets (T)” issued by the relevant CCI — financial guarantee and professional liability insurance taken out with an approved body. Full legal notice provided before any mandate. Information shown for illustration only.",
    "footer.legalLink": "Legal notice",
    "footer.privacy": "Privacy policy",
    "footer.rights": "© 2026 Xeext. All rights reserved.",
    "footer.brainup": "A Brain Up startup",
    "home.latestEyebrow": "Latest properties",
    "home.latestH": "Just arrived.",
    "home.seeAll": "View all properties",
    "biens.meta.title": "Our properties — Xeext",
    "biens.meta.desc": "All Xeext corporate properties to let: offices, retail, logistics, land. A single 5% fee.",
    "apropos.meta.title": "About — Xeext",
    "apropos.meta.desc": "Xeext, corporate real estate advisory reinvented at 5%. Our conviction, our values, our approach.",
    "apropos.eyebrow": "About",
    "apropos.h1": "Corporate real estate advisory, without the prestige premium.",
    "apropos.sub": "We kept the standards of the big networks. We stripped out everything that doesn't serve your asset.",
    "apropos.manifesto.eyebrow": "Why we exist",
    "apropos.manifesto.p1": "For decades, letting a commercial asset cost <span class=\"hl\">15 to 30% of a year's rent</span>. That fee paid for showrooms, head offices and brochures — rarely your bottom line.",
    "apropos.manifesto.p2": "We made the opposite choice. A lean structure, a process tooled end to end, a single rate stated before the mandate. <span class=\"hl\">5%.</span> The same work, without the prestige premium.",
    "apropos.stats.eyebrow": "In a few figures",
    "apropos.stats.h2": "A measurable promise.",
    "apropos.stat1": "A single rate, whatever the property.",
    "apropos.stat2": "For a reasoned valuation.",
    "apropos.stat3": "Segments: offices, retail, logistics, land.",
    "apropos.stat4": "Of fees saved on average.",
    "apropos.values.eyebrow": "Our principles",
    "apropos.values.h2": "Three commitments. Kept.",
    "apropos.val1.t": "Transparency",
    "apropos.val1.p": "The rate is known before the mandate is signed. No negotiation, no grey areas, no surprises.",
    "apropos.val2.t": "Technology",
    "apropos.val2.p": "Valuation, marketing, viewings, reporting: a digitalised process that removes needless costs, not the support.",
    "apropos.val3.t": "Alignment",
    "apropos.val3.p": "We're paid on results. Your property let on the right terms: that's our only definition of success.",
    "apropos.presence.eyebrow": "Our presence",
    "apropos.presence.h2": "Where your assets are.",
    "apropos.team.eyebrow": "The team",
    "apropos.team.h2": "A tight-knit team, not a network.",
    "apropos.team1.role": "Management",
    "apropos.team1.desc": "Asset strategy and owner relations.",
    "apropos.team2.role": "Office advisory",
    "apropos.team2.desc": "Floor plates and office buildings, major cities.",
    "apropos.team3.role": "Logistics advisory",
    "apropos.team3.desc": "Warehouses, business premises, land.",
    "apropos.team4.role": "Data & marketing",
    "apropos.team4.desc": "Tooled valuation, reporting and marketing.",
    "apropos.cta.h2": "Let's talk about your asset.",
    "apropos.cta.sub": "A valuation within 48 hours, no commitment.",
    "apropos.cta.write": "Write to an advisor",
    "apropos.cta.see": "View properties <span class=\"chev\">›</span>",
    "footer.legalBesoins": "<strong>Xeext</strong> — Corporate real estate advisory. Recommendations provided for guidance based on your answers. Information shown for illustration only.",
    "besoins.meta.title": "Find my space — Xeext",
    "besoins.meta.desc": "Answer 5 questions and get the corporate properties that match your needs: offices, retail, logistics, land.",
    "skip": "Skip to content",
    // Méta
    "meta.title": "Xeext — Corporate real estate advisory, reinvented at 5%",
    "meta.desc": "Corporate real estate advisory: offices, retail, logistics, land. A single fee of 5% of the annual rent.",
    // Compte (généré en JS)
    "acct.signin": "Sign in",
    "acct.favoris": "My favourites",
    "acct.rdv": "My appointments",
    "acct.profil": "My profile",
    "acct.admin": "Administration",
    "acct.logout": "Sign out",
    "acct.loggedout": "You are signed out.",
    // Catalogue (généré en JS)
    "cat.surface": "Area",
    "cat.loyer": "Rent",
    "cat.dispo": "Availability",
    "cat.peran": "/yr",
    "cat.perm2an": "€/m²/yr",
    "cat.countSingular": "property available",
    "cat.countPlural": "properties available",
    "cat.empty": "No property matches these criteria. Broaden your search.",
    // Segments (badges / libellés)
    "seg.Bureaux": "Offices",
    "seg.Commerces": "Retail",
    "seg.Logistique": "Logistics",
    "seg.Terrains": "Land",
    // Fiche bien
    "fiche.meta.title": "Property — Xeext",
    "fiche.meta.desc": "Corporate property to let. Xeext fees: 5% of the annual rent, stated before the mandate.",
    "fiche.back": "All properties",
    "fiche.honoLabel": "Xeext fees — 5% of the annual rent",
    "fiche.cta": "Book a viewing",
    "fiche.q.segment": "Type",
    "fiche.q.loc": "Location",
    "fiche.savePre": "i.e.",
    "fiche.saveSuf": "saved versus a 20% advisor",
    "fiche.specs": "Features",
    "fiche.loc": "Location",
    "fiche.locLead": "In the heart of <span id=\"f-map-ville\">—</span>. Exact address provided on request.",
    "fiche.mapLabel": "Map — location plan and points of interest (transport, roads, services)",
    "fiche.reminderEyebrow": "Xeext fees",
    "fiche.reminderH": "5% of the annual rent, i.e. <span class=\"num\" id=\"f-reminder-num\">—</span>.",
    "fiche.reminderLead": "A single rate, stated before the mandate. Where a traditional advisor would charge three to six times more.",
    "fiche.writeAdvisor": "Write to an advisor",
    "fiche.simOther": "Simulate another rent <span class=\"chev\">›</span>",
    "fiche.alsoSee": "Also worth a look",
    "fiche.allPhotos": "Show all {n} photos",
    // Trouver mon bien (questionnaire)
    "b.act.bureaux": "Offices & services",       "b.acth.bureaux": "Consulting, agency, tech, finance…",
    "b.act.sante": "Health & professions",       "b.acth.sante": "Medical, legal, advisory practice",
    "b.act.commerce": "Retail & shop",           "b.acth.commerce": "Retail, showroom",
    "b.act.restauration": "Restaurant & café",   "b.acth.restauration": "Restaurant, bar, café",
    "b.act.ecommerce": "E-commerce & distribution", "b.acth.ecommerce": "Storage and shipping",
    "b.act.logistique": "Logistics & transport", "b.acth.logistique": "Warehousing, courier",
    "b.act.industrie": "Industry & crafts",      "b.acth.industrie": "Workshop, production, manufacturing",
    "b.act.construction": "Construction project","b.acth.construction": "Build to suit on land",
    "b.act.autre": "I'm not sure yet",           "b.acth.autre": "Help me define my need",
    "b.q.activity": "What is your business?",
    "b.sub.activity": "We'll deduce the right type of property for you.",
    "b.q.nature": "What will this space mainly be used for?",
    "b.opt.nat.bureaux": "House offices / a team",
    "b.opt.nat.commerces": "Welcome customers in a shop",
    "b.opt.nat.logistique": "Store or ship goods",
    "b.opt.nat.terrains": "Build a custom building",
    "b.q.effectif": "How many people will work on site?",
    "b.sub.effectif": "We'll estimate the ideal area for you.",
    "b.opt.eff.1": "1 to 5",     "b.h.eff.1": "≈ up to 150 m²",
    "b.opt.eff.2": "6 to 15",    "b.h.eff.2": "≈ 80–350 m²",
    "b.opt.eff.3": "16 to 40",   "b.h.eff.3": "≈ 300–800 m²",
    "b.opt.eff.4": "More than 40", "b.h.eff.4": "≈ 700 m² and up",
    "b.q.reception": "Do you receive clients at your premises?",
    "b.opt.rec.1": "Yes, regularly", "b.opt.rec.2": "Occasionally", "b.opt.rec.3": "No",
    "b.q.surfaceCom": "What sales area do you need?",
    "b.opt.sc.1": "Small (< 80 m²)", "b.opt.sc.2": "Medium (80–200 m²)", "b.opt.sc.3": "Large (> 200 m²)",
    "b.opt.idk": "I don't know",
    "b.q.emplacement": "What location targets your customers?",
    "b.opt.emp.1": "City centre / busy street", "b.opt.emp.2": "Local neighbourhood", "b.opt.emp.3": "Outskirts / retail park",
    "b.q.surfaceLog": "What storage / activity area?",
    "b.opt.sl.1": "Under 1,000 m²", "b.opt.sl.2": "1,000 to 5,000 m²", "b.opt.sl.3": "Over 5,000 m²",
    "b.q.quais": "Need HGV access / loading docks?",
    "b.opt.q.1": "Yes, essential", "b.opt.q.2": "Simple access is enough", "b.opt.q.3": "Not needed",
    "b.q.surfaceTer": "What land area are you considering?",
    "b.opt.st.1": "Under 1,500 m²", "b.opt.st.2": "1,500 to 5,000 m²", "b.opt.st.3": "Over 5,000 m²",
    "b.q.terrainUsage": "To build what on it?",
    "b.opt.tu.1": "Offices", "b.opt.tu.2": "A retail unit", "b.opt.tu.3": "A warehouse / activity", "b.opt.idk2": "Not sure yet",
    "b.q.ville": "A specific location?",
    "b.opt.ville.any": "No preference",
    "b.q.budget": "Your annual rent budget?",
    "b.sub.budget": "A range is enough — otherwise we adapt.",
    "b.opt.bud.1": "Under €100,000", "b.opt.bud.2": "€100,000 to €250,000", "b.opt.bud.3": "€250,000 to €400,000", "b.opt.bud.4": "Over €400,000",
    "b.q.dispo": "For when?",
    "b.opt.dispo.1": "As soon as possible", "b.opt.dispo.2": "Within 6 months", "b.opt.dispo.3": "No specific date",
    "b.step": "Step", "b.prev": "‹ Previous",
    "b.reco": "Our recommendation",
    "b.recoPre": "For your business, we point you to ", "b.recoPost": ".",
    "b.label.Bureaux": "offices", "b.label.Commerces": "a retail unit", "b.label.Logistique": "a logistics or activity unit", "b.label.Terrains": "land to build on",
    "b.why.Bureaux": "The right format to house your teams and welcome your contacts in good conditions.",
    "b.why.Commerces": "Here visibility is key: storefront, accessibility and the quality of the location make the difference.",
    "b.why.Logistique": "Designed for storage and goods flows: clear height, loading docks and HGV access.",
    "b.why.Terrains": "To build a property perfectly sized for your project.",
    "b.tipPre": "Our advice:",
    "b.tip.reception": "you receive clients regularly: prioritise a welcoming reception and easy access.",
    "b.tip.passant": "a busy-street location will maximise your visibility and footfall.",
    "b.tip.peripherie": "the outskirts will give you more space and customer parking.",
    "b.tip.quais": "prioritise properties with loading docks and HGV access.",
    "b.tip.activite": "look for a serviced plot with HGV access.",
    "b.res.title": "The properties made for you.",
    "b.res.none": "No property matches yet.",
    "b.restart": "Start over",
    "b.browsePre": "Prefer to browse yourself? ",
    "b.browseLink": "See all matching properties <span class=\"chev\">›</span>",
    "b.matchSuffix": "% match",
    "b.sum.asap": "as soon as possible", "b.sum.six": "within 6 months",
    "b.alert.h": "Get alerted to new properties",
    "b.alert.p": "Receive an email as soon as a property matches your profile.",
    "b.alert.mail": "you@company.com",
    "b.alert.btn": "Alert me",
    "b.alert.doneH": "Alert created",
    "b.alert.doneP": "You'll be notified by email as soon as a property matches.",
    "b.alert.toast": "Alert saved.",
    // Auth (connexion / inscription)
    "auth.back": "Back to home",
    "auth.or": "or",
    "auth.google": "Continue with Google",
    "auth.mail": "Email",
    "auth.pass": "Password",
    "auth.forgot": "Forgot password?",
    "auth.noAccount": "No account yet?",
    "auth.haveAccount": "Already have an account?",
    "auth.createAccount": "Create an account",
    "auth.signin": "Sign in",
    "auth.ph.name": "Jane Smith",
    "auth.ph.pass": "At least 6 characters",
    "auth.login.meta": "Sign in — Xeext",
    "auth.login.pitchH": "Reinvented at 5%.",
    "auth.login.pitchP": "Sign in to save your favourite properties and book viewings in seconds.",
    "auth.login.legal": "Your credentials are protected: password hashed server-side, never stored in clear. <a href=\"confidentialite.html\" style=\"color:#6f8cff\">Privacy</a>.",
    "auth.login.h1": "Sign in",
    "auth.login.sub": "Find your favourites and viewings again.",
    "auth.login.btn": "Sign in",
    "auth.signup.meta": "Create an account — Xeext",
    "auth.signup.pitchH": "Your real estate space.",
    "auth.signup.pitchP": "Create your account to track your favourite properties and organise your viewings, all in one place.",
    "auth.signup.legal": "By creating an account, you accept our <a href=\"confidentialite.html\" style=\"color:#6f8cff\">privacy policy</a>. Password hashed server-side, never stored in clear.",
    "auth.signup.h1": "Create an account",
    "auth.signup.sub": "Save your favourites and book viewings.",
    "auth.signup.name": "Full name",
    "auth.signup.btn": "Create my account",
    "auth.js.needEmail": "Enter your email above first, then click “Forgot password?” again.",
    "auth.js.sending": "Sending…",
    "auth.js.resetPre": "If an account exists for ",
    "auth.js.resetPost": ", a reset email has just been sent. Check your spam folder.",
    // Favoris
    "fav.save": "Save",
    "fav.saved": "Saved",
    "fav.add": "Add to favourites",
    "fav.added": "Added to your favourites.",
    "fav.removed": "Removed from your favourites.",
    // Messages (store : auth, erreurs, statut)
    "err.exists": "An account already exists with this email.",
    "err.invalidLogin": "Incorrect email or password.",
    "err.notConfirmed": "Confirm your address via the email received first, then sign in again.",
    "err.invalidEmail2": "Invalid or non-existent email address.",
    "err.pw6": "The password must be at least 6 characters.",
    "err.rate": "Too many attempts. Please wait a moment.",
    "err.generic": "An error occurred. Please try again.",
    "err.noconfig": "Supabase configuration missing (assets/config.js).",
    "err.offline": "Connection failed. Check your internet access.",
    "err.allRequired": "All fields are required.",
    "err.invalidEmail": "Invalid email address.",
    "err.signupConfirm": "Account created! Confirm your address via the email you just received, then sign in.",
    // Mon compte
    "compte.meta": "My space — Xeext",
    "compte.cancel": "Cancel",
    "compte.loginH": "Sign in to your space",
    "compte.loginP": "Find your favourite properties and your viewings.",
    "compte.title": "My space",
    "compte.hello": "Hello",
    "compte.tab.favoris": "Favourites",
    "compte.tab.rdv": "Viewings",
    "compte.tab.profil": "Profile",
    "compte.favEmptyH": "No favourites yet",
    "compte.favEmptyP": "Browse properties and save the ones you like.",
    "compte.rdvEmptyH": "No viewings",
    "compte.rdvEmptyP": "Pick a property and book a viewing in seconds.",
    "compte.findBien": "Find a property",
    "compte.profil.nom": "Name",
    "compte.rdvCancelled": "Viewing cancelled.",
    "footer.legalCompte": "<strong>Xeext</strong> — Corporate real estate advisory. Accounts, favourites and viewings are managed securely via Supabase (European hosting).",
    // Réinitialisation du mot de passe
    "reinit.meta": "Reset password — Xeext",
    "reinit.pitchH": "New password.",
    "reinit.pitchP": "Choose a new password to secure your space.",
    "reinit.legal": "Link valid for a short time. If it has expired, request a new email from the sign-in page.",
    "reinit.back": "Back to sign in",
    "reinit.h1": "Reset",
    "reinit.sub": "Enter your new password.",
    "reinit.newpass": "New password",
    "reinit.confirm": "Confirm",
    "reinit.ph.repeat": "Repeat the password",
    "reinit.btn": "Update",
    "reinit.mismatch": "The two passwords don't match.",
    "reinit.expired": " The link may have expired — request a new email from sign-in.",
    "reinit.done": "Password updated. Redirecting to your space…",
    // Prise de rendez-vous
    "rdv.title": "Book a viewing",
    "rdv.sub": "Choose a time to visit this property.",
    "rdv.date": "Date",
    "rdv.slot": "Time slot",
    "rdv.name": "Name",
    "rdv.tel": "Phone",
    "rdv.msg": "Message (optional)",
    "rdv.msgPh": "Specify your availability, your questions…",
    "rdv.submit": "Confirm the viewing",
    "rdv.errDate": "Choose a date.",
    "rdv.errSlot": "Choose a time slot.",
    "rdv.errNameMail": "Enter your name and email.",
    "rdv.confirmedH": "Viewing confirmed",
    "rdv.confirmedPre": "Viewing of ",
    "rdv.at": "at",
    "rdv.note": "A Xeext advisor will confirm by email. Find this viewing in “My space”.",
    "rdv.seeMine": "See my viewings",
    "rdv.toast": "Viewing saved.",
    // Estimation / contact (lead)
    "lead.estTitle": "Value my property",
    "lead.estSub": "A substantiated opinion of value within 48 hours, no commitment.",
    "lead.type": "Property type",
    "lead.other": "Other",
    "lead.loc": "Location",
    "lead.locPh": "City or area",
    "lead.surface": "Area (m²)",
    "lead.surfacePh": "e.g. 450",
    "lead.value": "Desired annual rent or value (€)",
    "lead.valuePh": "e.g. 90000",
    "lead.nom": "Name",
    "lead.msg": "Message (optional)",
    "lead.msgPh": "Specify your project, your timeline…",
    "lead.estBtn": "Get my estimate",
    "lead.estNote": "By sending, you agree to be contacted by Xeext about your property.",
    "lead.estDoneH": "Request sent",
    "lead.estDoneP": "A Xeext advisor will contact you within 48 hours with an initial opinion of value.",
    "lead.estToast": "Estimate request sent.",
    "lead.ok": "OK",
    "lead.contactDoneH": "Message sent",
    "lead.contactDoneP": "Thank you, a Xeext advisor will reply shortly.",
    "lead.contactToast": "Message sent.",
    // Footer des pages légales
    "footer.legalShort": "<strong>Xeext</strong> — Corporate real estate advisory.",
    "footer.privacyShort": "Privacy",
    "legal.updated": "Last updated: June 2026",
    // Mentions légales
    "ml.meta.title": "Legal notice — Xeext",
    "ml.meta.desc": "Legal notice for the Xeext website: publisher, host, intellectual property, regulated activity (loi Hoguet).",
    "ml.h1": "Legal notice",
    "ml.editorH": "Site publisher",
    "ml.editorP": "Xeext — [legal form, share capital], registered office at [address to complete].<br>SIREN/SIRET: [to complete] · Publication director: [name to complete].<br>Contact: <a href=\"mailto:contact@xeext.fr\">contact@xeext.fr</a>.",
    "ml.regH": "Regulated activity (loi Hoguet)",
    "ml.regP": "Xeext carries out transactions on real estate and business assets under French law no. 70-9 of 2 January 1970 (loi Hoguet). Holder of a professional licence “Transactions on real estate and business assets (T)” no. [to complete], issued by the CCI of [to complete] — financial guarantee and professional liability insurance taken out with an approved body [to complete].",
    "ml.hostH": "Hosting",
    "ml.hostP": "The site is hosted by <strong>GitHub Pages</strong> — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Application data (accounts, requests) is managed via <strong>Supabase</strong>, on infrastructure located in the European Union.",
    "ml.ipH": "Intellectual property",
    "ml.ipP": "All content on this site (text, visual identity, layout) is the property of Xeext, unless otherwise stated. Illustration photographs come from Unsplash and are used in accordance with their licence. Any unauthorised reproduction is prohibited.",
    "ml.dataH": "Personal data",
    "ml.dataP": "The processing of your data is described in our <a href=\"confidentialite.html\">privacy policy</a>.",
    "ml.respH": "Liability",
    "ml.respP": "The properties and figures shown on this site are indicative and have no contractual value. Exact features and conditions are provided before any mandate.",
    // Politique de confidentialité
    "conf.meta.title": "Privacy policy — Xeext",
    "conf.meta.desc": "Xeext privacy policy: data collected, purposes, retention and your rights (GDPR).",
    "conf.h1": "Privacy policy",
    "conf.intro": "This policy explains what personal data Xeext collects via this site, why, how long it is kept and how to exercise your rights, in accordance with the General Data Protection Regulation (GDPR).",
    "conf.s1H": "1. Data controller",
    "conf.s1P": "Xeext — [legal form, address to complete]. Contact: <a href=\"mailto:contact@xeext.fr\">contact@xeext.fr</a>.",
    "conf.s2H": "2. Data collected",
    "conf.s2li1": "<strong>Account</strong>: name and email address, on sign-up / sign-in.",
    "conf.s2li2": "<strong>Favourites and viewings</strong>: saved properties, time slots and the contact details you enter.",
    "conf.s2li3": "<strong>Requests</strong> (estimate, contact, alert): name, email, phone, message and search criteria you send us.",
    "conf.s2P": "No data is bought from third parties or resold.",
    "conf.s3H": "3. Purposes",
    "conf.s3li1": "Give you access to your space (favourites, viewings).",
    "conf.s3li2": "Process your estimate, contact and viewing requests.",
    "conf.s3li3": "Contact you about a property or a mandate.",
    "conf.s4H": "4. Legal basis",
    "conf.s4P": "Processing is based on your <strong>consent</strong> (forms you fill in) and on the <strong>performance of pre-contractual measures</strong> taken at your request.",
    "conf.s5H": "5. Hosting and processors",
    "conf.s5P": "The site is hosted by <strong>GitHub Pages</strong> (GitHub, Inc.). Accounts and data (favourites, viewings, requests) are managed via <strong>Supabase</strong>, on infrastructure located in the <strong>European Union</strong>. These providers act as processors within the meaning of the GDPR.",
    "conf.s6H": "6. Retention period",
    "conf.s6P": "Account data is kept as long as the account is active. Requests (estimate, contact) are kept for as long as necessary to process them and for the business relationship, then archived or deleted.",
    "conf.s7H": "7. Cookies",
    "conf.s7P": "The site only uses a <strong>technical session cookie/storage</strong> (required to sign in to your account) — exempt from consent. If audience measurement is enabled, it uses a <strong>cookieless</strong> solution. No advertising cookies are placed.",
    "conf.s8H": "8. Your rights",
    "conf.s8P": "You have the right to access, rectify, erase, restrict and object. To exercise them, write to <a href=\"mailto:contact@xeext.fr\">contact@xeext.fr</a>. You may also lodge a complaint with the CNIL (<a href=\"https://www.cnil.fr\" target=\"_blank\" rel=\"noopener\">cnil.fr</a>).",
    "conf.seeML": "See the legal notice <span class=\"chev\">›</span>"
  },
  // ---- Français : seulement les clés utilisées par le JS (le reste vient du HTML) ----
  fr: {
    "theme.label": "Thème", "theme.light": "Clair", "theme.dark": "Sombre", "theme.auto": "Auto",
    "acct.signin": "Se connecter",
    "acct.favoris": "Mes favoris",
    "acct.rdv": "Mes rendez-vous",
    "acct.profil": "Mon profil",
    "acct.admin": "Administration",
    "acct.logout": "Se déconnecter",
    "acct.loggedout": "Vous êtes déconnecté.",
    "cat.surface": "Surface",
    "cat.loyer": "Loyer",
    "cat.dispo": "Disponibilité",
    "cat.peran": "/an",
    "cat.perm2an": "€/m²/an",
    "cat.countSingular": "bien disponible",
    "cat.countPlural": "biens disponibles",
    "cat.empty": "Aucun bien ne correspond à ces critères. Élargissez votre recherche.",
    "seg.Bureaux": "Bureaux",
    "seg.Commerces": "Commerces",
    "seg.Logistique": "Logistique",
    "seg.Terrains": "Terrains",
    "fiche.q.segment": "Segment",
    "fiche.q.loc": "Localisation",
    "fiche.savePre": "soit",
    "fiche.saveSuf": "d'économie face à un conseil à 20 %",
    "fiche.allPhotos": "Voir les {n} photos",
    "b.act.bureaux": "Bureaux & services",       "b.acth.bureaux": "Conseil, agence, tech, finance…",
    "b.act.sante": "Santé & professions libérales", "b.acth.sante": "Cabinet médical, juridique, expertise",
    "b.act.commerce": "Commerce & boutique",     "b.acth.commerce": "Vente au détail, showroom",
    "b.act.restauration": "Restauration & café", "b.acth.restauration": "Restaurant, bar, café",
    "b.act.ecommerce": "E-commerce & distribution", "b.acth.ecommerce": "Stockage et expédition",
    "b.act.logistique": "Logistique & transport","b.acth.logistique": "Entreposage, messagerie",
    "b.act.industrie": "Industrie & artisanat",  "b.acth.industrie": "Atelier, production, fabrication",
    "b.act.construction": "Projet de construction", "b.acth.construction": "Bâtir sur-mesure sur un terrain",
    "b.act.autre": "Je ne sais pas encore",      "b.acth.autre": "Aidez-moi à définir mon besoin",
    "b.q.activity": "Quelle est votre activité ?",
    "b.sub.activity": "On en déduit le type de bien qui vous convient.",
    "b.q.nature": "Concrètement, ce lieu servira surtout à…",
    "b.opt.nat.bureaux": "Héberger des bureaux / une équipe",
    "b.opt.nat.commerces": "Recevoir des clients en boutique",
    "b.opt.nat.logistique": "Stocker ou expédier des marchandises",
    "b.opt.nat.terrains": "Construire un bâtiment sur-mesure",
    "b.q.effectif": "Combien de personnes travailleront sur place ?",
    "b.sub.effectif": "On estime la surface idéale à votre place.",
    "b.opt.eff.1": "1 à 5",     "b.h.eff.1": "≈ jusqu'à 150 m²",
    "b.opt.eff.2": "6 à 15",    "b.h.eff.2": "≈ 80 – 350 m²",
    "b.opt.eff.3": "16 à 40",   "b.h.eff.3": "≈ 300 – 800 m²",
    "b.opt.eff.4": "Plus de 40", "b.h.eff.4": "≈ 700 m² et +",
    "b.q.reception": "Recevez-vous des clients dans vos locaux ?",
    "b.opt.rec.1": "Oui, régulièrement", "b.opt.rec.2": "Occasionnellement", "b.opt.rec.3": "Non",
    "b.q.surfaceCom": "Quelle surface de vente vous faut-il ?",
    "b.opt.sc.1": "Petite (< 80 m²)", "b.opt.sc.2": "Moyenne (80 – 200 m²)", "b.opt.sc.3": "Grande (> 200 m²)",
    "b.opt.idk": "Je ne sais pas",
    "b.q.emplacement": "Quel emplacement vise votre clientèle ?",
    "b.opt.emp.1": "Hyper-centre / rue passante", "b.opt.emp.2": "Quartier de proximité", "b.opt.emp.3": "Périphérie / retail park",
    "b.q.surfaceLog": "Quelle surface de stockage / d'activité ?",
    "b.opt.sl.1": "Moins de 1 000 m²", "b.opt.sl.2": "1 000 à 5 000 m²", "b.opt.sl.3": "Plus de 5 000 m²",
    "b.q.quais": "Besoin d'un accès poids lourds / de quais ?",
    "b.opt.q.1": "Oui, indispensable", "b.opt.q.2": "Un accès simple suffit", "b.opt.q.3": "Pas nécessaire",
    "b.q.surfaceTer": "Quelle surface de terrain envisagez-vous ?",
    "b.opt.st.1": "Moins de 1 500 m²", "b.opt.st.2": "1 500 à 5 000 m²", "b.opt.st.3": "Plus de 5 000 m²",
    "b.q.terrainUsage": "Pour y implanter quoi ?",
    "b.opt.tu.1": "Des bureaux", "b.opt.tu.2": "Un local commercial", "b.opt.tu.3": "Un entrepôt / une activité", "b.opt.idk2": "Je ne sais pas encore",
    "b.q.ville": "Une localisation en particulier ?",
    "b.opt.ville.any": "Indifférent",
    "b.q.budget": "Votre budget de loyer annuel ?",
    "b.sub.budget": "Une fourchette suffit — sinon, on s'adapte.",
    "b.opt.bud.1": "Moins de 100 000 €", "b.opt.bud.2": "100 000 à 250 000 €", "b.opt.bud.3": "250 000 à 400 000 €", "b.opt.bud.4": "Plus de 400 000 €",
    "b.q.dispo": "Pour quand ?",
    "b.opt.dispo.1": "Le plus tôt possible", "b.opt.dispo.2": "Dans les 6 mois", "b.opt.dispo.3": "Pas de date précise",
    "b.step": "Étape", "b.prev": "‹ Précédent",
    "b.reco": "Notre recommandation",
    "b.recoPre": "Pour votre activité, nous vous orientons vers ", "b.recoPost": ".",
    "b.label.Bureaux": "des bureaux", "b.label.Commerces": "un local commercial", "b.label.Logistique": "un local logistique ou d'activité", "b.label.Terrains": "un terrain à bâtir",
    "b.why.Bureaux": "Le format adapté pour héberger vos équipes et recevoir vos interlocuteurs dans de bonnes conditions.",
    "b.why.Commerces": "Ici, la visibilité prime : vitrine, accessibilité et qualité de l'emplacement font la différence.",
    "b.why.Logistique": "Pensé pour le stockage et les flux de marchandises : hauteur libre, quais et accès poids lourds.",
    "b.why.Terrains": "Pour construire un bâtiment parfaitement dimensionné pour votre projet.",
    "b.tipPre": "Notre conseil :",
    "b.tip.reception": "vous recevez des clients régulièrement : privilégiez un bon standing d'accueil et une desserte facile.",
    "b.tip.passant": "un emplacement en rue passante maximisera votre visibilité et votre flux.",
    "b.tip.peripherie": "la périphérie vous offrira plus de surface et de stationnement client.",
    "b.tip.quais": "ciblez en priorité des biens avec quais et accès poids lourds.",
    "b.tip.activite": "orientez-vous vers une parcelle viabilisée avec accès poids lourds.",
    "b.res.title": "Les biens faits pour vous.",
    "b.res.none": "Aucun bien ne correspond pour l'instant.",
    "b.restart": "Recommencer",
    "b.browsePre": "Vous préférez parcourir vous-même ? ",
    "b.browseLink": "Voir tous les biens correspondants <span class=\"chev\">›</span>",
    "b.matchSuffix": "% compatible",
    "b.sum.asap": "dès que possible", "b.sum.six": "sous 6 mois",
    "b.alert.h": "Être alerté des nouveaux biens",
    "b.alert.p": "Recevez un e-mail dès qu'un bien correspond à votre profil.",
    "b.alert.mail": "vous@entreprise.fr",
    "b.alert.btn": "M'alerter",
    "b.alert.doneH": "Alerte créée",
    "b.alert.doneP": "Vous serez prévenu par e-mail dès qu'un bien correspond.",
    "b.alert.toast": "Alerte enregistrée.",
    "auth.forgot": "Mot de passe oublié ?",
    "auth.js.needEmail": "Saisissez d'abord votre e-mail ci-dessus, puis recliquez sur « Mot de passe oublié ? ».",
    "auth.js.sending": "Envoi…",
    "auth.js.resetPre": "Si un compte existe pour ",
    "auth.js.resetPost": ", un e-mail de réinitialisation vient d'être envoyé. Pensez à vérifier vos spams.",
    "fav.save": "Enregistrer",
    "fav.saved": "Enregistré",
    "fav.add": "Ajouter aux favoris",
    "fav.added": "Ajouté à vos favoris.",
    "fav.removed": "Retiré de vos favoris.",
    "err.exists": "Un compte existe déjà avec cet e-mail.",
    "err.invalidLogin": "E-mail ou mot de passe incorrect.",
    "err.notConfirmed": "Confirmez d'abord votre adresse via l'e-mail reçu, puis reconnectez-vous.",
    "err.invalidEmail2": "Adresse e-mail invalide ou inexistante.",
    "err.pw6": "Le mot de passe doit contenir au moins 6 caractères.",
    "err.rate": "Trop de tentatives. Patientez quelques instants.",
    "err.generic": "Une erreur est survenue. Réessayez.",
    "err.noconfig": "Configuration Supabase manquante (assets/config.js).",
    "err.offline": "Connexion impossible. Vérifiez votre accès internet.",
    "err.allRequired": "Tous les champs sont requis.",
    "err.invalidEmail": "Adresse e-mail invalide.",
    "err.signupConfirm": "Compte créé ! Confirmez votre adresse via l'e-mail que vous venez de recevoir, puis connectez-vous.",
    "compte.cancel": "Annuler",
    "compte.loginH": "Connectez-vous à votre espace",
    "compte.loginP": "Retrouvez vos biens favoris et vos rendez-vous.",
    "compte.title": "Mon espace",
    "compte.hello": "Bonjour",
    "compte.tab.favoris": "Favoris",
    "compte.tab.rdv": "Rendez-vous",
    "compte.tab.profil": "Profil",
    "compte.favEmptyH": "Aucun favori pour l'instant",
    "compte.favEmptyP": "Parcourez les biens et enregistrez ceux qui vous intéressent.",
    "compte.rdvEmptyH": "Aucun rendez-vous",
    "compte.rdvEmptyP": "Choisissez un bien et réservez une visite en quelques secondes.",
    "compte.findBien": "Trouver un bien",
    "compte.profil.nom": "Nom",
    "compte.rdvCancelled": "Rendez-vous annulé.",
    "reinit.mismatch": "Les deux mots de passe ne correspondent pas.",
    "reinit.expired": " Le lien a peut-être expiré — redemandez un e-mail depuis la connexion.",
    "reinit.done": "Mot de passe mis à jour. Redirection vers votre espace…",
    "rdv.title": "Prendre rendez-vous",
    "rdv.sub": "Choisissez un créneau pour visiter ce bien.",
    "rdv.date": "Date",
    "rdv.slot": "Créneau",
    "rdv.name": "Nom",
    "rdv.tel": "Téléphone",
    "rdv.msg": "Message (facultatif)",
    "rdv.msgPh": "Précisez vos disponibilités, vos questions…",
    "rdv.submit": "Confirmer le rendez-vous",
    "rdv.errDate": "Choisissez une date.",
    "rdv.errSlot": "Choisissez un créneau horaire.",
    "rdv.errNameMail": "Indiquez votre nom et votre e-mail.",
    "rdv.confirmedH": "Rendez-vous confirmé",
    "rdv.confirmedPre": "Visite de ",
    "rdv.at": "à",
    "rdv.note": "Un conseiller Xeext vous confirmera par e-mail. Retrouvez ce rendez-vous dans « Mon espace ».",
    "rdv.seeMine": "Voir mes rendez-vous",
    "rdv.toast": "Rendez-vous enregistré.",
    "lead.estTitle": "Estimer mon bien",
    "lead.estSub": "Un avis de valeur argumenté sous 48 heures, sans engagement.",
    "lead.type": "Type de bien",
    "lead.other": "Autre",
    "lead.loc": "Localisation",
    "lead.locPh": "Ville ou secteur",
    "lead.surface": "Surface (m²)",
    "lead.surfacePh": "Ex. 450",
    "lead.value": "Loyer annuel souhaité ou valeur (€)",
    "lead.valuePh": "Ex. 90000",
    "lead.nom": "Nom",
    "lead.msg": "Message (facultatif)",
    "lead.msgPh": "Précisez votre projet, vos délais…",
    "lead.estBtn": "Recevoir mon estimation",
    "lead.estNote": "En envoyant, vous acceptez d'être recontacté par Xeext à propos de votre bien.",
    "lead.estDoneH": "Demande envoyée",
    "lead.estDoneP": "Un conseiller Xeext vous recontacte sous 48 heures avec un premier avis de valeur.",
    "lead.estToast": "Demande d'estimation envoyée.",
    "lead.ok": "OK",
    "lead.contactDoneH": "Message envoyé",
    "lead.contactDoneP": "Merci, un conseiller Xeext vous répond rapidement.",
    "lead.contactToast": "Message envoyé."
  }
};

(function () {
  var KEY = "xeext.lang";
  var SUP = ["fr", "en"];
  var DICT = window.XEEXT_I18N;

  function detect() {
    try {
      var p = new URLSearchParams(location.search).get("lang");
      if (p && SUP.indexOf(p) !== -1) return p;
      var s = localStorage.getItem(KEY);
      if (s && SUP.indexOf(s) !== -1) return s;
      var n = (navigator.language || navigator.userLanguage || "fr").slice(0, 2).toLowerCase();
      return n === "en" ? "en" : "fr";
    } catch (e) { return "fr"; }
  }

  var lang = detect();
  try { document.documentElement.lang = lang; } catch (e) {}

  function t(key) {
    var d = DICT[lang] || {};
    if (d[key] != null) return d[key];
    return (DICT.fr && DICT.fr[key] != null) ? DICT.fr[key] : key;
  }

  // Traduit le HTML statique (uniquement en anglais ; le FR est déjà la source).
  function apply(root) {
    if (lang !== "en") return;
    root = root || document;
    var en = DICT.en;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = en[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = en[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var i = pair.indexOf(":");
        if (i < 0) return;
        var attr = pair.slice(0, i).trim(), k = pair.slice(i + 1).trim();
        if (en[k] != null) el.setAttribute(attr, en[k]);
      });
    });
  }

  function setLang(l) {
    if (SUP.indexOf(l) === -1) return;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    // recharge : tout se reconstruit dans la nouvelle langue
    if (new URLSearchParams(location.search).get("lang")) {
      var u = new URL(location.href); u.searchParams.delete("lang");
      location.replace(u.toString());
    } else {
      location.reload();
    }
  }

  // Menu de préférences : bouton « globe » → dropdown 3 colonnes
  // (Langue / Unité / Devise). Unité + Devise n'apparaissent que là où les
  // helpers de biens sont chargés (pages avec des prix/surfaces).
  function injectToggle() {
    var inner = document.querySelector(".nav__inner");
    if (!inner || document.getElementById("prefs-toggle")) return;
    var host = inner.querySelector(".nav__menu") || inner;
    var X = window.XEEXT;
    var hasBiens = X && typeof X.money === "function";
    var fr = lang === "fr";
    var H = fr ? { lang: "Langue", unit: "Unité", cur: "Devise", aria: "Préférences" }
               : { lang: "Language", unit: "Unit", cur: "Currency", aria: "Preferences" };

    function col(title, opts) {
      var h = '<div class="prefs-col"><h4>' + title + '</h4>';
      opts.forEach(function (o) {
        h += '<button type="button" class="prefs-opt' + (o.active ? " is-active" : "") +
             '" data-k="' + o.k + '">' + o.label + '</button>';
      });
      return h + '</div>';
    }

    var cols = col(H.lang, [
      { k: "lang:fr", label: "Français", active: lang === "fr" },
      { k: "lang:en", label: "English", active: lang === "en" }
    ]);
    if (hasBiens) {
      var u = X.unit(), cur = X.currency();
      cols += col(H.unit, [
        { k: "unit:m2", label: "m²", active: u === "m2" },
        { k: "unit:sqft", label: "sq ft", active: u === "sqft" }
      ]);
      cols += col(H.cur, Object.keys(X.CUR).map(function (code) {
        return { k: "cur:" + code, label: X.CUR[code].sym + "&nbsp;&nbsp;" + code, active: cur === code };
      }));
    }

    var globe = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>';

    // Groupe « profil + globe + thème » : alignés (surtout sur mobile). On y
    // déplace le compte (account.js) et le bouton de thème (theme.js) ; le menu
    // déroulant des préférences vient en dernier.
    var controls = document.createElement("div");
    controls.className = "nav__controls";
    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn && themeBtn.parentNode === host) host.insertBefore(controls, themeBtn);
    else host.appendChild(controls);
    var acct = document.getElementById("nav-account");
    if (acct) controls.appendChild(acct);                      // 1) profil
    controls.insertAdjacentHTML("beforeend",                    // 2) globe
      '<button type="button" id="prefs-toggle" class="prefs-btn" aria-label="' + H.aria + '" aria-expanded="false">' + globe + '</button>');
    if (themeBtn) controls.appendChild(themeBtn);              // 3) thème
    controls.insertAdjacentHTML("beforeend", '<div class="prefs-menu" id="prefs-menu" role="menu">' + cols + '</div>');

    var btn = controls.querySelector("#prefs-toggle");
    var menu = controls.querySelector("#prefs-menu");
    function close() { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); document.removeEventListener("click", onDoc); }
    function open() { menu.classList.add("open"); btn.setAttribute("aria-expanded", "true"); setTimeout(function () { document.addEventListener("click", onDoc); }, 0); }
    function onDoc(e) { if (!controls.contains(e.target)) close(); }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.classList.contains("open")) close(); else open();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    menu.addEventListener("click", function (e) {
      var o = e.target.closest && e.target.closest(".prefs-opt");
      if (!o) return;
      var kv = o.getAttribute("data-k").split(":"), kind = kv[0], val = kv[1];
      if (kind === "lang") { if (val !== lang) setLang(val); else close(); }
      else if (kind === "unit" && hasBiens) { if (X.unit() !== val) X.setUnit(val); else close(); }
      else if (kind === "cur" && hasBiens) { if (X.currency() !== val) X.setCurrency(val); else close(); }
    });
  }

  function init() {
    apply(document);
    // différé pour passer après nav.js (création de .nav__menu) et theme.js
    setTimeout(injectToggle, 0);
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  window.XEEXT = window.XEEXT || {};
  window.XEEXT.t = t;
  window.XEEXT.lang = function () { return lang; };
  window.XEEXT.setLang = setLang;
})();
