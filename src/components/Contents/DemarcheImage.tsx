import { ObjectId } from "../../types/interface";
import { StreamlineIcon } from "../StreamlineIcon";
import React from "react";
import ameli from "../../theme/images/demarche/ameli.png";
import caf from "../../theme/images/demarche/caf.png";
import carteBancaire from "../../theme/images/demarche/carteBancaire.png";
import carteIdentite from "../../theme/images/demarche/carteIdentite.png";
import carteVitale from "../../theme/images/demarche/carteVitale.png";
import covid from "../../theme/images/demarche/covid.png";
import ofpra from "../../theme/images/demarche/OFPRA.png";
import passeport from "../../theme/images/demarche/passeport.png";
import poleEmploi from "../../theme/images/demarche/poleEmploi.png";
import titreSejour from "../../theme/images/demarche/titreSejour.png";
import permisConduire from "../../theme/images/demarche/permisConduire.png";

import { Image } from "react-native";
import { getImageNameFromContentId } from "./contentsIdDemarcheImageCorrespondency";
import { Picture } from "@refugies-info/api-types";

interface Props {
  icon?: Picture;
  stroke?: string;
  contentId: ObjectId;
  isSmall?: boolean;
}

const CARD_WIDTH = 84;
const SMALL_CARD_WIDTH = 58;

export const DemarcheImage = (props: Props) => {
  const imageName = getImageNameFromContentId(props.contentId);

  const imageFiles = {
    ameli: ameli,
    caf: caf,
    carteVitale: carteVitale,
    carteIdentite: carteIdentite,
    covid: covid,
    poleEmploi: poleEmploi,
    permisConduire: permisConduire,
    passeport: passeport,
    ofpra: ofpra,
    titreSejour: titreSejour,
    carteBancaire: carteBancaire,
  };

  const cardWidth = props.isSmall ? SMALL_CARD_WIDTH : CARD_WIDTH;

  if (imageName && imageFiles[imageName]) {
    const passportRatio = 1.4;
    const height = imageName !== "passeport" ? "auto" : cardWidth;
    const width =
      imageName !== "passeport" ? cardWidth : cardWidth / passportRatio;

    return (
      <Image
        source={imageFiles[imageName]}
        resizeMode="contain"
        style={{ width: width, height: height, flex: 1 }}
      />
    );
  }

  return props.icon ? (
    <StreamlineIcon icon={props.icon} size={24} stroke={props.stroke} />
  ) : null;
};
