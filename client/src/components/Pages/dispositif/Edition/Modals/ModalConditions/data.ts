import { conditionType } from "api-types";
import imgCb from "assets/dispositif/form-icons/conditions-cb.svg";
import imgDriver from "assets/dispositif/form-icons/conditions-driver.svg";
import imgOfpra from "assets/dispositif/form-icons/conditions-ofpra.svg";
import imgPoleEmploi from "assets/dispositif/form-icons/conditions-pole-emploi.svg";
import imgTse from "assets/dispositif/form-icons/conditions-tse.svg";
import imgOfii from "assets/dispositif/form-icons/conditions-ofii.svg";
import imgSchool from "assets/dispositif/form-icons/conditions-school.svg";

export const help = {
  title: "Quelques conseils",
  content: [
    "Précisez ici les prérequis que les personnes doivent remplir pour accéder à votre dispositif.",
    "Si vos prérequis ne sont pas indiqués ci- contre, choisissez « Ce n'est pas pertinent pour mon action » et expliquez les détails dans votre fiche."
  ]
};

export const dropdownOptions: Record<conditionType, any> = {
  "acte naissance": imgOfpra,
  "titre sejour": imgTse,
  "cir": imgOfii,
  "bank account": imgCb,
  "pole emploi": imgPoleEmploi,
  "driver license": imgDriver,
  "school": imgSchool,
};
