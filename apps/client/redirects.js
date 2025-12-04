const ln = "(en|ps|fa|ti|ru|ar|uk)";
const urlTranslations = [
  ["/recherche", "/advanced-search"],
  ["/demarche", "/processe"],
  ["/demarche/:id", "/procedure/:id"],
  ["/dispositif", "/program"],
  ["/dispositif/:id", "/program/:id"],
  ["/publier", "/publish"],
  ["/traduire", "/translate"],
  ["/mission-et-impact", "/mission-and-impact"],
  ["/mentions-legales", "/legal-notices"],
  ["/declaration-accessibilite", "/accessibility-statement"],
  ["/politique-de-confidentialite", "/privacy-policy"],
  ["/plan-du-site", "/sitemap"],
];

const oldPathsRedirects = [
  ["/fr/qui-sommes-nous", "/fr/mission-et-impact"],
  [`/:lang${ln}?/who-are-we`, "/:lang/mission-and-impact"],
  ["/fr/advanced-search", "/fr/recherche"],
  ["/fr/annuaire-create", "/fr/annuaire-creation"],
  [`/:lang${ln}?/annuaire-create`, "/:lang/directory-create"],
  ["/fr/comment-contribuer", "/fr/publier"],
  [`/:lang${ln}?/how-to-contribute`, "/:lang/publish"],
];

// Annuaire removal redirects - redirect old annuaire URLs to appropriate pages
const annuaireRemovalRedirects = [
  // French locale redirects
  ["/fr/annuaire", "/fr/recherche?type=dispositif"],
  ["/fr/annuaire/:id", "/fr/recherche?type=dispositif"],
  ["/fr/annuaire-creation", "/fr/publier"],
  // English and other locales redirects
  [`/:lang${ln}/directory`, "/:lang/advanced-search?type=dispositif"],
  [`/:lang${ln}/directory/:id`, "/:lang/advanced-search?type=dispositif"],
  [`/:lang${ln}/directory-create`, "/:lang/publish"],
  // Legacy paths that might still exist
  ["/annuaire", "/fr/recherche?type=dispositif"],
  ["/annuaire/:id", "/fr/recherche?type=dispositif"],
  ["/annuaire-creation", "/fr/publier"],
  ["/directory", "/en/advanced-search?type=dispositif"],
  ["/directory/:id", "/en/advanced-search?type=dispositif"],
  ["/directory-create", "/en/publish"],
];

const partnersRedirect = [
  [
    "/fiche-ffr",
    "/fr/demarche/6479f6dc935b47644da052d8?utm_source=lettre-ffr&utm_medium=papier&utm_campaign=ofpra-lettre",
  ],
];

module.exports = {
  translatedRedirects: urlTranslations.map((paths) => ({
    source: `/:lang${ln}?${paths[0]}`, // all french paths except /fr
    destination: `/:lang${paths[1]}`, // redirect to translated path
    permanent: true,
    locale: false,
  })),
  oldPathsRedirects: oldPathsRedirects.map((paths) => ({
    source: paths[0],
    destination: paths[1],
    permanent: true,
    locale: false,
  })),
  partnersRedirect: partnersRedirect.map((paths) => ({
    source: paths[0],
    destination: paths[1],
    permanent: true,
  })),
  annuaireRemovalRedirects: annuaireRemovalRedirects.map((paths) => ({
    source: paths[0],
    destination: paths[1],
    permanent: true,
  })),
  rewrites: urlTranslations.map((paths) => ({
    source: `/:lang${ln}?${paths[1]}`, // all translated paths except /fr
    destination: `/:lang${paths[0]}`, // loads french path
    locale: false,
  })),
};
