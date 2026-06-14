/* ============================================================
   Xeext — liens réseaux sociaux dans le pied de page.
   Remplacez les URLs ci-dessous par vos pages réelles.
   La rangée est insérée au-dessus des mentions légales (présentes
   sur tous les pieds de page).
   ============================================================ */
(function () {
  var LINKS = [
    { name: "LinkedIn",  href: "https://www.linkedin.com/",  svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.51 2.5 2.5 0 0 1 4.98 3.5zM.25 8.25h4.5V24h-4.5zM8.25 8.25h4.31v2.15h.06c.6-1.07 2.07-2.2 4.26-2.2 4.56 0 5.4 2.84 5.4 6.53V24h-4.5v-6.37c0-1.52-.03-3.48-2.12-3.48-2.12 0-2.45 1.66-2.45 3.37V24h-4.47z"/></svg>' },
    { name: "Instagram", href: "https://www.instagram.com/", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>' },
    { name: "Facebook",  href: "https://www.facebook.com/",  svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>' },
    { name: "X",         href: "https://x.com/",             svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26L23 21.75h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.01 4.13H5.05z"/></svg>' }
  ];

  function init() {
    var legal = document.querySelector(".footer__legal");
    if (!legal || document.querySelector(".footer__social")) return;
    var row = document.createElement("div");
    row.className = "footer__social";
    row.setAttribute("aria-label", "Réseaux sociaux");
    row.innerHTML = LINKS.map(function (l) {
      return '<a href="' + l.href + '" target="_blank" rel="noopener" aria-label="' + l.name + '">' + l.svg + '</a>';
    }).join("");
    legal.parentNode.insertBefore(row, legal);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
