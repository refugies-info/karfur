const urlTranslations = [
  ["/demarche/", "/procedure/"],
  ["/dispositif/", "/program/"],
  ["/comment-contribuer", "/how-to-contribute"],
  ["/qui-sommes-nous", "/who-are-we"],
  ["/mentions-legales", "/legal-notices"],
  ["/politique-de-confidentialite", "/privacy-policy"],
  ["/declaration-accessibilite", "/accessibility-statement"],
];

const deepLinks = [
  {
    scheme: "https",
    host: "refugies.info",
    path: ""
  },
  {
    scheme: "https",
    host: "refugies.info",
    path: "/"
  },
  ...urlTranslations.map(url => ( // https://refugies.info/dispositif/
    {
      scheme: "https",
      host: "refugies.info",
      pathPrefix: url[0]
    }
  )),
  ...urlTranslations.map(url => ( // https://refugies.info/fr/dispositif/
    {
      scheme: "https",
      host: "refugies.info",
      pathPrefix: "/*" + url[0]
    }
  )),
  ...urlTranslations.map(url => ( // https://refugies.info/en/program/
    {
      scheme: "https",
      host: "refugies.info",
      pathPrefix: "/*" + url[1]
    }
  ))
]

module.exports = deepLinks;