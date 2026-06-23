/* ============================================================
   Xeext — store : comptes, favoris et rendez-vous via Supabase.
   L'UI lit un cache synchrone (currentUser, favs, rdvs) rechargé
   depuis Supabase à la connexion ; chaque mutation est optimiste
   (cache d'abord, requête ensuite) et émet "xeext:change".
   ============================================================ */
(function () {
  var cfg = window.XEEXT_CONFIG || {};
  var sb = (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY)
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        // Flux "implicit" : la session revient directement dans l'URL (hash),
        // sans échange de code côté client — plus fiable qu'un PKCE sur un site
        // statique multi-pages (le code verifier s'y perd entre les pages).
        auth: { flowType: "implicit", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
      })
    : null;

  function t(k) { return (window.XEEXT && window.XEEXT.t) ? window.XEEXT.t(k) : k; }
  var NO_CONFIG = { ok: false, error: t("err.noconfig") };
  var OFFLINE = { ok: false, error: t("err.offline") };
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function emit() { window.dispatchEvent(new CustomEvent("xeext:change")); }

  // messages Supabase (anglais) → libellé traduit (FR / EN)
  function frError(message) {
    var m = message || "";
    if (/already registered|already exists/i.test(m)) return t("err.exists");
    if (/invalid login credentials/i.test(m)) return t("err.invalidLogin");
    if (/email not confirmed/i.test(m)) return t("err.notConfirmed");
    if (/address.*invalid|invalid.*email/i.test(m)) return t("err.invalidEmail2");
    if (/at least 6|password should/i.test(m)) return t("err.pw6");
    if (/rate limit|too many|security purposes/i.test(m)) return t("err.rate");
    return m || t("err.generic");
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
      var meta = u.user_metadata || {};
      cachedUser = {
        id: u.id,
        name: meta.name || meta.full_name || (u.email || "").split("@")[0],
        email: u.email,
        avatar: meta.avatar_url || meta.picture || null   // photo Google le cas échéant
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
        }).catch(function (e) { try { console.warn("Xeext auth init:", e); } catch (_) {} })
      : Promise.resolve(),

    signup: function (name, email, pass) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      name = (name || "").trim(); email = (email || "").trim().toLowerCase();
      if (!name || !email || !pass) return Promise.resolve({ ok: false, error: t("err.allRequired") });
      if (!EMAIL_RE.test(email)) return Promise.resolve({ ok: false, error: t("err.invalidEmail") });
      if (pass.length < 6) return Promise.resolve({ ok: false, error: t("err.pw6") });
      return sb.auth.signUp({ email: email, password: pass, options: { data: { name: name } } })
        .then(function (res) {
          if (res.error) return { ok: false, error: frError(res.error.message) };
          // e-mail déjà inscrit : Supabase renvoie un faux utilisateur sans identité
          if (res.data.user && res.data.user.identities && res.data.user.identities.length === 0)
            return { ok: false, error: t("err.exists") };
          // confirmation d'e-mail exigée par le projet : pas de session immédiate
          if (!res.data.session)
            return { ok: false, error: t("err.signupConfirm") };
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

    // Connexion via Google (OAuth) — option en plus de l'e-mail / mot de passe.
    // En cas de succès, le navigateur est redirigé vers Google puis revient sur
    // `returnUrl` ; supabase-js détecte alors la session dans l'URL et émet le
    // changement (onAuthStateChange / getSession). On ne renvoie ici que les
    // erreurs de démarrage du flux.
    loginWithGoogle: function (returnUrl) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      return sb.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: returnUrl || location.href }
      }).then(function (res) {
        if (res.error) return { ok: false, error: frError(res.error.message) };
        return { ok: true };
      }).catch(function () { return OFFLINE; });
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
    },

    /* ----- Leads (estimation / contact / alerte) — sans compte requis ----- */
    submitLead: function (data) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      var email = (data.email || "").trim().toLowerCase();
      if (!email || !EMAIL_RE.test(email)) return Promise.resolve({ ok: false, error: t("err.invalidEmail") });
      var row = {
        type: data.type || "contact",
        nom: (data.nom || (cachedUser && cachedUser.name) || "").trim() || null,
        email: email,
        telephone: (data.telephone || "").trim() || null,
        message: (data.message || "").trim() || null,
        segment: data.segment || null,
        ville: data.ville || null,
        surface: data.surface != null ? data.surface : null,
        loyer: data.loyer != null ? data.loyer : null,
        criteres: data.criteres || null,
        documents: (data.documents && data.documents.length) ? data.documents : null,
        user_id: cachedUser ? cachedUser.id : null
      };
      return sb.from("leads").insert(row)
        .then(function (res) {
          if (res.error) return { ok: false, error: frError(res.error.message) };
          return { ok: true };
        })
        .catch(function () { return OFFLINE; });
    },

    /* Envoi des pièces d'un dossier vers le bucket privé `dossiers` (Supabase
       Storage). Renvoie { ok, paths } ; les chemins sont ensuite rattachés au
       lead via submitLead({ documents: paths }). Bucket privé : lecture admin
       uniquement (taille/type limités côté bucket). */
    uploadDocs: function (files) {
      if (!files || !files.length) return Promise.resolve({ ok: true, paths: [] });
      if (!sb) return Promise.resolve({ ok: false, paths: [], error: t("err.offline") });
      var folder = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
      var ups = Array.prototype.map.call(files, function (f) {
        var safe = (f.name || "fichier").replace(/[^\w.\-]+/g, "_").slice(-80);
        var path = folder + "/" + safe;
        return sb.storage.from("dossiers").upload(path, f, { upsert: false, contentType: f.type || undefined })
          .then(function (res) { return (res && res.error) ? null : (res.data && res.data.path) || path; })
          .catch(function () { return null; });
      });
      return Promise.all(ups).then(function (paths) {
        var ok = paths.filter(Boolean);
        return { ok: ok.length === paths.length, paths: ok, error: ok.length === paths.length ? null : t("lead.docsErr") };
      });
    },

    /* ----- Mot de passe oublié ----- */
    requestPasswordReset: function (email) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      email = (email || "").trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return Promise.resolve({ ok: false, error: t("err.invalidEmail") });
      var redirectTo = location.origin + location.pathname.replace(/[^/]*$/, "") + "reinitialisation.html";
      return sb.auth.resetPasswordForEmail(email, { redirectTo: redirectTo })
        .then(function (res) { return res.error ? { ok: false, error: frError(res.error.message) } : { ok: true }; })
        .catch(function () { return OFFLINE; });
    },
    updatePassword: function (pwd) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      if (!pwd || pwd.length < 6) return Promise.resolve({ ok: false, error: t("err.pw6") });
      return sb.auth.updateUser({ password: pwd })
        .then(function (res) {
          if (res.error) return { ok: false, error: frError(res.error.message) };
          setUserFromSession({ user: res.data.user });
          emit();
          return { ok: true };
        })
        .catch(function () { return OFFLINE; });
    },

    /* ----- Back-office (admin) : gestion des biens ----- */
    isAdmin: function () {
      var cfg = window.XEEXT_CONFIG || {};
      return !!(cachedUser && cfg.ADMIN_EMAIL && cachedUser.email === cfg.ADMIN_EMAIL.toLowerCase());
    },
    adminListBiens: function () {
      if (!sb) return Promise.resolve([]);
      return sb.from("biens").select("*").order("ordre", { ascending: true }).order("created_at", { ascending: true })
        .then(function (r) { return r.data || []; })
        .catch(function () { return []; });
    },
    adminSaveBien: function (row) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      return sb.from("biens").upsert(row, { onConflict: "id" })
        .then(function (r) { return r.error ? { ok: false, error: r.error.message } : { ok: true }; })
        .catch(function () { return OFFLINE; });
    },
    adminDeleteBien: function (id) {
      if (!sb) return Promise.resolve(NO_CONFIG);
      return sb.from("biens").delete().eq("id", id)
        .then(function (r) { return r.error ? { ok: false, error: r.error.message } : { ok: true }; })
        .catch(function () { return OFFLINE; });
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
