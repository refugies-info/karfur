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
  ["/qui-sommes-nous", "/who-are-we"],
  ["/mentions-legales", "/legal-notices"],
  ["/declaration-accessibilite", "/accessibility-statement"],
  ["/politique-de-confidentialite", "/privacy-policy"]
];

const oldPathsRedirects = [
  ["/fr/advanced-search", "/fr/recherche"],
  ["/fr/annuaire-create", "/fr/annuaire-creation"],
  [`/:lang${ln}?/annuaire-create`, "/:lang/directory-create"]
];

module.exports = {
  translatedRedirects: urlTranslations.map((paths) => ({
    source: `/:lang${ln}?${paths[0]}`, // all french paths except /fr
    destination: `/:lang${paths[1]}`, // redirect to translated path
    permanent: true,
    locale: false
  })),
  oldPathsRedirects: oldPathsRedirects.map((paths) => ({
    source: paths[0],
    destination: paths[1],
    permanent: true,
    locale: false
  })),
  rewrites: urlTranslations.map((paths) => ({
    source: `/:lang${ln}?${paths[1]}`, // all translated paths except /fr
    destination: `/:lang${paths[0]}`, // loads french path
    locale: false
  }))
};
