type FrenchLevel = {
  level: string
  title: string
  description: string
  linkToKnowMore: string
  linkToMakeTheTest?: string
}
export const frenchLevels: FrenchLevel[] = [
  {
    level: "A1",
    title: "Je découvre le français",
    description: `Je peux comprendre et utiliser des expressions familières et
quotidiennes avec des phrases très simples pour satisfaire des
besoins concrets.`,
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_A1.pdf",
    linkToMakeTheTest:
      "https://savoirs.rfi.fr/fr/apprendre-enseigner/langue-francaise/test-de-placement-ndeg2-a1/1",
  },

  {
    level: "A2",
    title: "Je comprends des messages simples",
    description:
      "Je peux comprendre des phrases isolées et des expressions en relation avec mon environnement immédiat : famille, travail, école. Je peux parler de sujets familiers.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_A2.pdf",
    linkToMakeTheTest:
      "https://savoirs.rfi.fr/fr/apprendre-enseigner/langue-francaise/test-de-placement-ndeg2-a2/1",
  },
  {
    level: "B1",
    title: "Je communique avec des francophones",
    description:
      "Je peux comprendre les points essentiels d’un message quand un langage clair et standard est utilisé. Je peux communiquer dans la plupart des situations rencontrées en voyage. Je peux raconter un événement, une expérience.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_B1.pdf",
    linkToMakeTheTest:
      "https://savoirs.rfi.fr/fr/apprendre-enseigner/langue-francaise/test-de-placement-ndeg2-b1/1",
  },
  {
    level: "B2",
    title: "Je communique avec aisance",
    description:
      "Je peux comprendre le contenu essentiel de messages complexes sur des sujets concrets ou abstraits. Je communique avec aisance avec un locuteur natif et je m'exprime de façon claire et détaillée sur une grande gamme de sujets.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_B2.pdf",
    linkToMakeTheTest:
      "https://savoirs.rfi.fr/fr/apprendre-enseigner/langue-francaise/test-de-placement-ndeg2-b2/1",
  },
  {
    level: "C1",
    title: "Je communique avec grande aisance",
    description: "Pratiquement aucune difficulté particulière.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/pdf/Guide_de_l___valuation_linguistique.pdf",
  },
];
