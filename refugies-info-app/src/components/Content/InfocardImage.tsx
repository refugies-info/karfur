import Gratuit from "../../theme/images/infocards/gratuit.png";
import Payant from "../../theme/images/infocards/payant.png";
import acte_naissance from "../../theme/images/infocards/acte_naissance.png";
import duree from "../../theme/images/infocards/duree.png";
import important from "../../theme/images/infocards/important.png";
import localisation from "../../theme/images/infocards/localisation.png";
import titreSejour from "../../theme/images/infocards/titreSejour.png";
import age from "../../theme/images/infocards/age.png";
import francais from "../../theme/images/infocards/francais.png";

import React from "react";
import { Image } from "react-native";

interface Props {
  title: string;
  isFree: boolean;
}
export const InfocardImage = ({ title, isFree }: Props) => {
  if (title === "Combien ça coûte ?" && isFree) {
    return <Image source={Gratuit} />;
  }

  if (title === "Combien ça coûte ?" && !isFree) {
    return <Image source={Payant} />;
  }

  switch (title) {
    case "Acte de naissance OFPRA":
      return <Image source={acte_naissance} />;
    case "Durée":
      return <Image source={duree} />;
    case "Important !":
      return <Image source={important} />;
    case "Zone d'action":
      return <Image source={localisation} />;
    case "Titre de séjour":
      return <Image source={titreSejour} />;
    case "Âge requis":
      return <Image source={age} />;
    case "Niveau de français":
      return <Image source={francais} />;
    default:
      return <Image source={Payant} />;
  }
};
