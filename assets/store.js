/* ============================================================
   Xeext — store : comptes, favoris et rendez-vous via Supabase.
   L'UI lit un cache synchrone (currentUser, favs, rdvs) rechargé
   depuis Supabase à la connexion ; chaque mutation est optimiste
   (cache d'abord, requête ensuite) et émet "xeext:change".
   ============================================================ */
(function () {
  var cfg = window.XEEXT_CONFIG || {};
  var sb = (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY)
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
    : null;

  var NO_CONFIG = { ok: false, error: "Configuration Supabase manquante (assets/config.js)." };
  var OFFLINE = { ok: false, error: "Connexion impossible. Vérifiez votre accès internet." };
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function emit() { window.dispatchEvent(new CustomEvent("xeext:change")); }

  // messages Supabase (anglais) → français
  function frError(message) {
    var m = message || "";
    if (/already registered|already exists/i.test(m)) return "Un compte existe déjà avec cet e-mail.";
    if (/invalid login credentials/i.test(m)) return "E-mail ou mot de passe incorrect.";
    if (/email not confirmed/i.test(m)) return "Confirmez d'abord votre adresse via l'e-mail reçu, puis reconnectez-vous.";
    if (/address.*invalid|invalid.*email/i.test(m)) return "Adresse e-mail invalide ou inexistante.";
    if (/at least 6|password should/i.test(m)) return "Le mot de passe doit contenir au moins 6 caractères.";
    if (/rate limit|too many|security purposes/i.test(m)) return "Trop de tentatives. Patientez quelques instants.";
    return m || "Une erreur est survenue. Réessayez.";
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16); crypto.getRandomValues(b);
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  }

  /* ----- caches synchrones lus par toute l'UI ----- */
  var cachedUser = null;  // { id, name, email }
  var cachedFavs = [];    // [bien_id]
  var cachedRdvs = [];    // [{ id, bienId, bienTitre, ... }]

  function setUserFromSession(session) {
    if (session && session.user) {
      var u = session.user;
      cachedUser = {
        id: u.id,
        name: (u.user_metadata && u.user_metadata.name) || (u.email || "").split("@")[0],
        email: u.email
      };
    } else {
      cachedUser = null;
      cachedFavs = [];
      cachedRdvs = [];
    }
  }

  function mapRdv(r) {
    return {
      id: r.id, bienId: r.bien_id, bienTitre: r.bien_titre, bienVille: r.bien_ville,
      date: r.date_visite, dateLabel: r.date_label, time: r.creneau,
      name: r.nom, email: r.email, phone: r.telephone, message: r.message
    };
  }
  function sortRdvs() {
    cachedRdvs.sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
  }

  // recharge favoris + rendez-vous depuis Supabase (après connexion ou erreur)
  function loadData() {
    if (!sb || !cachedUser) return Promise.resolve();
    return Promise.all([
      sb.from("favoris").select("bien_id"),
      sb.from("rendez_vous").select("*")
    ]).then(function (res) {
      if (!res[0].error) cachedFavs = res[0].data.map(function (r) { return r.bien_id; });
      if (!res[1].error) { cachedRdvs = res[1].data.map(mapRdv); sortRdvs(); }
      emit();
    });
  }

  var store = {
    /* ----- Comptes / session ----- */
    currentUser: function () { return cachedUser; },

    // résolue quand la session locale est restaurée et les données chargées
    ready: sb
      ? sb.auth.getSession().then(function (res) {
          setUserFromSession(res.data.session);
          emit();
          return loadData();
        }).catch(function () {})
      : Promise.resolve(),

    signup: function (name, email, pass) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      name = (name || "").trim(); email = (email || "").trim().toLowerCase();
      if (!name || !email || !pass) return Promise.resolve({ ok: false, error: "Tous les champs sont requis." });
      if (!EMAIL_RE.test(email)) return Promise.resolve({ ok: false, error: "Adresse e-mail invalide." });
      if (pass.length < 6) return Promise.resolve({ ok: false, error: "Le mot de passe doit contenir au moins 6 caractères." });
      return sb.auth.signUp({ email: email, password: pass, options: { data: { name: name } } })
        .then(function (res) {
          if (res.error) return { ok: false, error: frError(res.error.message) };
          // e-mail déjà inscrit : Supabase renvoie un faux utilisateur sans identité
          if (res.data.user && res.data.user.identities && res.data.user.identities.length === 0)
            return { ok: false, error: "Un compte existe déjà avec cet e-mail." };
          // confirmation d'e-mail exigée par le projet : pas de session immédiate
          if (!res.data.session)
            return { ok: false, error: "Compte créé ! Confirmez votre adresse via l'e-mail que vous venez de recevoir, puis connectez-vous." };
          setUserFromSession(res.data.session);
          emit();
          return loadData().then(function () { return { ok: true }; });
        })
        .catch(function () { return OFFLINE; });
    },

    login: function (email, pass) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      email = (email || "").trim().toLowerCase();
      return sb.auth.signInWithPassword({ email: email, password: pass })
        .then(function (res) {
          if (res.error) return { ok: false, error: frError(res.error.message) };
          setUserFromSession(res.data.session);
          emit();
          return loadData().then(function () { return { ok: true }; });
        })
        .catch(function () { return OFFLINE; });
    },

    logout: function () {
      setUserFromSession(null);
      emit();
      if (sb) sb.auth.signOut().catch(function () {});
    },

    /* ----- Favoris ----- */
    favs: function () { return cachedFavs.slice(); },
    isFav: function (id) { return cachedFavs.indexOf(id) !== -1; },
    toggleFav: function (id) {
      if (!cachedUser) return { needAuth: true };
      var i = cachedFavs.indexOf(id);
      var adding = i === -1;
      if (adding) cachedFavs.push(id); else cachedFavs.splice(i, 1);
      emit();
      var done = !sb ? Promise.resolve() : (adding
        ? sb.from("favoris").upsert(
            { user_id: cachedUser.id, bien_id: id },
            { onConflict: "user_id,bien_id", ignoreDuplicates: true })
        : sb.from("favoris").delete().eq("user_id", cachedUser.id).eq("bien_id", id)
      ).then(function (res) { if (res.error) return loadData(); });
      return { ok: true, active: adding, done: done };
    },

    /* ----- Rendez-vous ----- */
    rdvs: function () { return cachedRdvs.slice(); },
    addRdv: function (data) {
      if (!cachedUser) return { needAuth: true };
      data.id = uuid();
      cachedRdvs.push(data);
      sortRdvs();
      emit();
      var done = !sb ? Promise.resolve() : sb.from("rendez_vous").insert({
        id: data.id, user_id: cachedUser.id,
        bien_id: data.bienId, bien_titre: data.bienTitre, bien_ville: data.bienVille,
        date_visite: data.date, date_label: data.dateLabel, creneau: data.time,
        nom: data.name, email: data.email,
        telephone: data.phone || null, message: data.message || null
      }).then(function (res) { if (res.error) return loadData(); });
      return { ok: true, id: data.id, done: done };
    },
    cancelRdv: function (id) {
      if (!cachedUser) return;
      cachedRdvs = cachedRdvs.filter(function (r) { return r.id !== id; });
      emit();
      if (sb) sb.from("rendez_vous").delete().eq("id", id)
        .then(function (res) { if (res.error) return loadData(); });
    }
  };

  // synchronisation entre onglets (connexion / déconnexion ailleurs)
  if (sb) {
    sb.auth.onAuthStateChange(function (event, session) {
      var hadUser = !!cachedUser;
      setUserFromSession(session);
      if (hadUser !== !!cachedUser) {
        emit();
        if (cachedUser) loadData();
      }
    });
  }

  window.XEEXT = window.XEEXT || {};
  window.XEEXT.store = store;
})();
