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
import { Metadatas } from "@refugies-info/api-types";

type metaKeys = keyof Metadatas;
interface Props {
  title: metaKeys;
  isFree: boolean;
}

const IMAGE_SIZE = 56;
export const InfocardImage = ({ title, isFree }: Props) => {
  if (title === "price" && isFree) {
    return (
      <Image
        source={Gratuit}
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
      />
    );
  }

  if (title === "price" && !isFree) {
    return (
      <Image
        source={Payant}
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
      />
    );
  }

  switch (title) {
    // FIXME
    // case "Acte de naissance OFPRA":
    //   return (
    //     <Image
    //       source={acte_naissance}
    //       style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
    //       resizeMode="contain"
    //     />
    //   );
    case "duration":
      return (
        <Image
          source={duree}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
    case "important":
      return (
        <Image
          source={important}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
    case "location":
      return (
        <Image
          source={localisation}
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        />
      );
    // FIXME
    // case "Titre de séjour":
    //   return (
    //     <Image
    //       source={titreSejour}
    //       style={{
    //         height: IMAGE_SIZE,
    //         width: IMAGE_SIZE,
    //         resizeMode: "contain",
    //       }}
    //     />
    //   );
    case "age":
      return (
        <Image source={age} style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }} />
      );
    case "frenchLevel":
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
