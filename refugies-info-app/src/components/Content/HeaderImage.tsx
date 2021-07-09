import Francais from "../../theme/images/contentsHeaders/francais.png";
import Admin from "../../theme/images/contentsHeaders/admin.png";
import Benevolat from "../../theme/images/contentsHeaders/benevolat.png";
import Culture from "../../theme/images/contentsHeaders/culture.png";
import Etudes from "../../theme/images/contentsHeaders/etudes.png";
import Formation from "../../theme/images/contentsHeaders/formationPro.png";
import Insertion from "../../theme/images/contentsHeaders/insertionPro.png";
import Logement from "../../theme/images/contentsHeaders/logement.png";
import Loisirs from "../../theme/images/contentsHeaders/loisirs.png";
import Mobilite from "../../theme/images/contentsHeaders/mobilite.png";
import Rencontres from "../../theme/images/contentsHeaders/rencontres.png";
import Sante from "../../theme/images/contentsHeaders/sante.png";

import React from "react";
import { Image } from "react-native";

export const HeaderImage = ({
  tagName,
  height,
}: {
  tagName: string;
  height: number;
}) => {
  switch (tagName) {
    case "apprendre le français":
      return (
        <Image
          source={Francais}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "gérer mes papiers":
      return (
        <Image
          source={Admin}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "me loger":
      return (
        <Image
          source={Logement}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "me déplacer":
      return (
        <Image
          source={Mobilite}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "trouver un travail":
      return (
        <Image
          source={Insertion}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "me soigner":
      return (
        <Image
          source={Sante}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "apprendre un métier":
      return (
        <Image
          source={Formation}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "faire des études":
      return (
        <Image
          source={Etudes}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "aider une association":
      return (
        <Image
          source={Benevolat}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "rencontrer des gens":
      return (
        <Image
          source={Rencontres}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "occuper mon temps libre":
      return (
        <Image
          source={Loisirs}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
    case "découvrir la culture":
      return (
        <Image
          source={Culture}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );

    default:
      return (
        <Image
          source={Francais}
          resizeMode="cover"
          style={{ width: "100%", height }}
        />
      );
  }
};
