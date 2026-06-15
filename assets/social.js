/* ============================================================
   Xeext — liens réseaux sociaux dans le pied de page.
   Remplacez les URLs ci-dessous par vos pages réelles.
   La rangée est insérée au-dessus des mentions légales (présentes
   sur tous les pieds de page).
   ============================================================ */
(function () {
  var LINKS = [
    { name: "LinkedIn",  href: "https://www.linkedin.com/",  svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="4.983" cy="5.009" r="2.188"/><path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118c1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783c-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z"/></svg>' },
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
