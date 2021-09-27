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

import { Image } from "react-native";
import { theme } from "../../theme";
import styled from "styled-components/native";

interface Props {
  name: string;
  stroke: string;
  contentId: ObjectId;
}

const CardsContainer = styled.View`
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
  if (props.contentId === "6051e8eebf0a6d0014ee6809") {
    return (
      <Image
        source={Ameli}
        resizeMode="cover"
        style={{ width: 48, height: 28 }}
      />
    );
  }
  if (props.contentId === "604794f9b898f10014c9892b") {
    return (
      <CardsContainer>
        <Image
          source={carteVitale}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </CardsContainer>
    );
  }

  if (
    [
      "60f53d7e75d5980014162589",
      "5e71fededea008004e986958",
      "6123baf66bf6bc00148a58a4",
      "60f53a5175d5980014162000",
      "5fa3f7376e3ea80047c13d49",
    ].includes(props.contentId)
  ) {
    return (
      <Image
        source={covid}
        resizeMode="cover"
        style={{ width: 28, height: 42 }}
      />
    );
  }

  if (
    ["5dc947cebceb3c004fc43214", "605dc3375b99ca0014a9feb2"].includes(
      props.contentId
    )
  ) {
    return (
      <Image
        source={poleEmploi}
        resizeMode="cover"
        style={{ width: 40, height: 32 }}
      />
    );
  }

  if (props.contentId === "5dc53daebceb3c004fc43060") {
    return (
      <CardsContainer>
        <Image
          source={permisConduire}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </CardsContainer>
    );
  }

  if (props.contentId === "5dc2e40c2e9859001680b916") {
    return (
      <Image
        source={passeport}
        resizeMode="cover"
        style={{ width: 48, height: 68 }}
      />
    );
  }

  if (
    ["605237c2464aa50014a1fb69", "603510f966ec880014e6e86c"].includes(
      props.contentId
    )
  ) {
    return (
      <Image
        source={OFPRA}
        resizeMode="cover"
        style={{ width: 40, height: 40 }}
      />
    );
  }

  if (
    ["5eb91481c2622f004e5fa686", "5dc2da982e9859001680b8a2"].includes(
      props.contentId
    )
  ) {
    return (
      <Image
        source={titreSejour}
        resizeMode="cover"
        style={{ width: 68, height: 48 }}
      />
    );
  }

  if (
    ["5fcf5a0afaef7600140a1a2d", "6092ab8e6e6476001437f0b0"].includes(
      props.contentId
    )
  ) {
    return (
      <Image
        source={carteBancaire}
        resizeMode="cover"
        style={{ width: 68, height: 48 }}
      />
    );
  }

  if (
    [
      "6124e425b82f500013bd9978",
      "60e4649a5f46ee00146d570f",
      "60e4649a5f46ee00146d570f",
      "5e1c8c0e0742580052a33972",
    ].includes(props.contentId)
  ) {
    return (
      <Image
        source={caf}
        resizeMode="cover"
        style={{ width: 40, height: 40 }}
      />
    );
  }

  if (props.contentId === "5e189ed30742580052a332b6") {
    return (
      <Image
        source={carteIdentite}
        resizeMode="cover"
        style={{ width: 68, height: 48 }}
      />
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
