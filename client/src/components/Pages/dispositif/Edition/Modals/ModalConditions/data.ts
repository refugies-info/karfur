import { conditionType } from "api-types";
import imgCb from "assets/dispositif/form-icons/conditions-cb.svg";
import imgDriver from "assets/dispositif/form-icons/conditions-driver.svg";
import imgOfpra from "assets/dispositif/form-icons/conditions-ofpra.svg";
import imgPoleEmploi from "assets/dispositif/form-icons/conditions-pole-emploi.svg";
import imgTse from "assets/dispositif/form-icons/conditions-tse.svg";
import imgOfii from "assets/dispositif/form-icons/conditions-ofii.svg";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez des conditions seulement si elles sont vraiment des critères excluant pour accéder à votre action.",
};

export const dropdownOptions: Record<conditionType, { text: string, image: any }> = {
  "acte naissance": {
    text: "Avoir l’acte de naissance donné par l’OFPRA",
    image: imgOfpra
  },
  "titre sejour": {
    text: "Avoir son titre de séjour ou son récépissé",
    image: imgTse
  },
  "cir": {
    text: "Avoir signé le CIR et terminé les cours OFII",
    image: imgOfii
  },
  "bank account": {
    text: "Avoir un compte bancaire",
    image: imgCb
  },
  "pole emploi": {
    text: "Être inscrit à Pôle Emploi",
    image: imgPoleEmploi
  },
  "driver license": {
    text: "Avoir son permis B",
    image: imgDriver
  },
  "school": {
    text: "Avoir le niveau de fin de lycée",
    image: imgDriver
  },
};
