const ln = "(en|ps|fa|ti|ru|ar|uk)";
const urlTranslations = [
  ["/recherche", "/advanced-search"],
  ["/annuaire", "/directory"],
  ["/annuaire/:id", "/directory/:id"],
  ["/annuaire-creation", "/directory-create"],
  ["/demarche", "/processe"],
  ["/demarche/:id", "/procedure/:id"],
  ["/dispositif", "/program"],
  ["/dispositif/:id", "/program/:id"],
  ["/publier", "/publish"],
  ["/traduire", "/translate"],
  ["/qui-sommes-nous", "/who-are-we"],
  ["/mentions-legales", "/legal-notices"],
  ["/declaration-accessibilite", "/accessibility-statement"],
  ["/politique-de-confidentialite", "/privacy-policy"],
  ["/plan-du-site", "/sitemap"],
];

const oldPathsRedirects = [
  ["/fr/advanced-search", "/fr/recherche"],
  ["/fr/annuaire-create", "/fr/annuaire-creation"],
  [`/:lang${ln}?/annuaire-create`, "/:lang/directory-create"],
  ["/fr/comment-contribuer", "/fr/publier"],
  [`/:lang${ln}?/how-to-contribute`, "/:lang/publish"],
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
  rewrites: urlTranslations.map((paths) => ({
    source: `/:lang${ln}?${paths[1]}`, // all translated paths except /fr
    destination: `/:lang${paths[0]}`, // loads french path
    locale: false,
  })),
};
