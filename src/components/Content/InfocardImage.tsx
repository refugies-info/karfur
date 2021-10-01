import Gratuit from "../../theme/images/infocards/gratuit.png";
import Payant from "../../theme/images/infocards/payant.png";
import acte_naissance from "../../theme/images/infocards/acte_naissance.png";
import duree from "../../theme/images/infocards/duree.png";
import important from "../../theme/images/infocards/important.png";
import localisation from "../../theme/images/infocards/localisation.png";
import titreSejour from "../../theme/images/demarche/titreSejour.png";

import age from "../../theme/images/infocards/age.png";
import francais from "../../theme/images/infocards/francais.png";

import React from "react";
import { Image } from "react-native";

interface Props {
  title: string;
  isFree: boolean;
}

const IMAGE_SIZE = 56;
export const InfocardImage = ({ title, isFree }: Props) => {
  if (title === "Combien ça coûte ?" && isFree) {
    return (
      <Image
        source={Gratuit}
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
      />
    );
  }

  if (title === "Combien ça coûte ?" && !isFree) {
    return (
      <Image
        source={Payant}
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
      />
    );
  }

  switch (title) {
    case "Acte de naissance OFPRA":
      return (
        <Image
          source={acte_naissance}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
          resizeMode="contain"
        />
      );
    case "Durée":
      return (
        <Image
          source={duree}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
    case "Important !":
      return (
        <Image
          source={important}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
    case "Zone d'action":
      return (
        <Image
          source={localisation}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
    case "Titre de séjour":
      return (
        <Image
          source={titreSejour}
          style={{
            height: IMAGE_SIZE,
            width: IMAGE_SIZE,
            resizeMode: "contain",
          }}
        />
      );
    case "Âge requis":
      return (
        <Image source={age} style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }} />
      );
    case "Niveau de français":
      return (
        <Image
          source={francais}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
    default:
      return (
        <Image
          source={Payant}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
  }
};
