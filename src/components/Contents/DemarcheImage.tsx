import { ObjectId } from "../../types/interface";
import { StreamlineIcon } from "../StreamlineIcon";
import React from "react";
import Ameli from "../../theme/images/demarche/ameli.png";
import caf from "../../theme/images/demarche/caf.png";
import carteBancaire from "../../theme/images/demarche/carteBancaire.png";
import carteIdentite from "../../theme/images/demarche/carteIdentite.png";
import carteVitale from "../../theme/images/demarche/carteVitale.png";
import covid from "../../theme/images/demarche/covid.png";
import OFPRA from "../../theme/images/demarche/OFPRA.png";
import passeport from "../../theme/images/demarche/passeport.png";
import poleEmploi from "../../theme/images/demarche/poleEmploi.png";
import titreSejour from "../../theme/images/demarche/titreSejour.png";
import permisConduire from "../../theme/images/demarche/permisConduire.png";

import { Image, View } from "react-native";
import { theme } from "../../theme";
import styled from "styled-components/native";
import { getImageNameFromContentId } from "./contentsIdDemarcheImageCorrespondency";

interface Props {
  name: string;
  stroke: string;
  contentId: ObjectId;
}

const CardContainer = styled.View`
  background-color: ${theme.colors.white};
  width: 52px;
  height: 34px;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
`;

const CARD_WIDTH = 48;
const CARD_HEIGHT = 30;

export const DemarcheImage = (props: Props) => {
  const imageName = getImageNameFromContentId(props.contentId);

  if (imageName === "ameli") {
    return (
      <Image
        source={Ameli}
        resizeMode="cover"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      />
    );
  }

  if (imageName === "carteVitale") {
    return (
      <CardContainer>
        <Image
          source={carteVitale}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </CardContainer>
    );
  }

  if (imageName === "covid") {
    return (
      <Image
        source={covid}
        resizeMode="cover"
        style={{ width: 28, height: 42 }}
      />
    );
  }

  if (imageName === "poleEmploi") {
    return (
      <Image
        source={poleEmploi}
        resizeMode="cover"
        style={{ width: 40, height: 32 }}
      />
    );
  }

  if (imageName === "permisConduire") {
    return (
      <CardContainer>
        <Image
          source={permisConduire}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </CardContainer>
    );
  }

  if (imageName === "passeport") {
    return (
      <View
        style={{
          backgroundColor: theme.colors.white,
          width: 38,
          height: 52,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 3,
        }}
      >
        <Image
          source={passeport}
          resizeMode="cover"
          style={{ width: 34, height: 48 }}
        />
      </View>
    );
  }

  if (imageName === "ofpra") {
    return (
      <Image
        source={OFPRA}
        resizeMode="cover"
        style={{ width: 40, height: 40 }}
      />
    );
  }

  if (imageName === "titreSejour") {
    return (
      <CardContainer>
        <Image
          source={titreSejour}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </CardContainer>
    );
  }

  if (imageName === "carteBancaire") {
    return (
      <CardContainer>
        <Image
          source={carteBancaire}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </CardContainer>
    );
  }

  if (imageName === "caf") {
    return (
      <Image
        source={caf}
        resizeMode="cover"
        style={{ width: 40, height: 40 }}
      />
    );
  }

  if (imageName === "carteIdentite") {
    return (
      <CardContainer>
        <Image
          source={carteIdentite}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </CardContainer>
    );
  }
  return (
    <StreamlineIcon
      name={props.name}
      width={24}
      height={24}
      stroke={props.stroke}
    />
  );
};
