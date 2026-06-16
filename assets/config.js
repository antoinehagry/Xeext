/* ============================================================
   Xeext — configuration Supabase.
   Ces valeurs sont publiques (clé « anon ») : elles sont prévues
   pour être embarquées côté client. La sécurité des données est
   assurée par les politiques RLS (voir supabase-setup.sql).
   ============================================================ */
window.XEEXT_CONFIG = {
  SUPABASE_URL: "https://iajadtbvumnhvedlxubs.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhamFkdGJ2dW1uaHZlZGx4dWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTQxOTgsImV4cCI6MjA5NjY5MDE5OH0.h7vQsWxYJe55eKdvrBOWJbR1IlbaUtG3ZWG2iwvmMwg",
  // Compte autorisé à gérer le catalogue (back-office /admin.html).
  // Doit correspondre à l'e-mail défini dans la policy RLS « biens : admin écrit ».
  ADMIN_EMAIL: "ahagry54@gmail.com",
  // Token Mapbox (public) pour les cartes des fiches. Laissez vide pour rester
  // sur OpenStreetMap (sans clé). Pensez à le restreindre à votre domaine
  // (antoinehagry.github.io) dans le tableau de bord Mapbox.
  MAPBOX_TOKEN: "pk.eyJ1IjoiYW50b2luZS13IiwiYSI6ImNsZ2xkcmFoNDA5OGkzZHFpcHlwODFwenMifQ.0FNZr9cF72SgEa1f4mF_Yw"
};
