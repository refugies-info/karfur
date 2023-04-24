import { Step } from "../../CustomNavbarEdit/functions"

export const help = {
  draft: "Il reste quelques informations pour envoyer votre fiche pour relecture à l’équipe éditoriale de Réfugiés.info.",
  waiting: "Votre fiche va repasser en brouillon. Vous devrez la compléter et la valider pour qu’elle soit à nouveau envoyée à notre équipe éditoriale pour relecture.",
  published: "Il reste quelques informations à remplir. Vous pourrez les compléter plus tard. En attendant, l’ancienne version de votre fiche est toujours visible."
}

export const stepTranslations: Record<Step, string> = {
  // no translation available
  titreInformatif: "Titre de la fiche",
  titreMarque: "Nom de l'action",
  theme: "Thèmes",
  sponsors: "Partenaires",
  mainSponsor: "Structure",
  // translation available, use it
  what: "Dispositif.sectionWhat",
  why: "Dispositif.sectionWhy",
  how: "Dispositif.sectionHow",
  next: "Dispositif.sectionNext",
  abstract: "Dispositif.sectionAbstract",
  public: "Infocards.publicTitle",
  price: "Infocards.price",
  commitment: "Infocards.availability",
  conditions: "Infocards.conditions",
  location: "Infocards.location",
}
