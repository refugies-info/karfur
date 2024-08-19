import { ObjectId } from "../../types/interface";
import { StreamlineIcon } from "../StreamlineIcon";
import React, { useMemo } from "react";
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
  contentId: string;
  isSmall?: boolean;
}

const CARD_WIDTH = 84;
const SMALL_CARD_WIDTH = 58;
const IMAGES = {
  ameli: {
    image: ameli,
    ratio: 1,
  },
  caf: {
    image: caf,
    ratio: 1,
  },
  carteVitale: {
    image: carteVitale,
    ratio: 1.5,
  },
  carteIdentite: {
    image: carteIdentite,
    ratio: 1.5,
  },
  covid: {
    image: covid,
    ratio: 1,
  },
  poleEmploi: {
    image: poleEmploi,
    ratio: 1,
  },
  permisConduire: {
    image: permisConduire,
    ratio: 1.5,
  },
  passeport: {
    image: passeport,
    ratio: 0.7,
  },
  ofpra: {
    image: ofpra,
    ratio: 1,
  },
  titreSejour: {
    image: titreSejour,
    ratio: 1.5,
  },
  carteBancaire: {
    image: carteBancaire,
    ratio: 1.5,
  },
};

export const DemarcheImage = (props: Props) => {
  const cardWidth = useMemo(
    () => (props.isSmall ? SMALL_CARD_WIDTH : CARD_WIDTH),
    [props.isSmall]
  );
  const imageData = useMemo(() => {
    const imageName = getImageNameFromContentId(props.contentId);
    return imageName ? IMAGES[imageName] : null;
  }, [props.contentId]);

  if (imageData) {
    const height = cardWidth / imageData.ratio;

    return (
      <Image
        source={imageData.image}
        resizeMode="contain"
        style={{ width: cardWidth, height: height, flex: 1 }}
      />
    );
  }

  return props.icon ? (
    <StreamlineIcon icon={props.icon} size={24} stroke={props.stroke} />
  ) : null;
};
