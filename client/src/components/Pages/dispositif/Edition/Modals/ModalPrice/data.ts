import { priceDetails } from "api-types";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez les éventuels frais d’inscription, les souscriptions ou les abonnements relatifs à votre action.",
};

export const dropdownOptions: Record<priceDetails, string> = {
  once: "Une seule fois",
  eachTime: "À chaque fois",
  hour: "Par heure",
  day: "Par jour",
  week: "Par semaine",
  month: "Par mois",
  trimester: "Par trimestre",
  semester: "Par semestre",
  year: "Par an",
};
