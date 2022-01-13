import React from "react";
import { colors } from "../../../colors";
import styled from "styled-components";
import { FButtonMobile } from "../../FigmaUI/FButtonMobile/FButtonMobile";

declare const window: Window;
interface Props {
  text: string;
  defaultText: string;
  buttonTitle: string;
  defaultBoutonTitle: string;
  iconName: string;
  image: string;
  t: (text: string, defaultText: string) => void;
  backgroundColor: string;
  textColor: string;
  onClick: (e: any) => void;
  isDisabled: boolean;
}

const MainContainer = styled.div`
  padding: 20px;
  border-radius: 12px;
  height: 440px;
  width: 312px;
  background-color: ${(props) => props.backgroundColor};
  margin: 8px;
  justify-content: center;
  text-align: center;
  position: relative;
`;

const TextContainer = styled.div`
  color: ${(props) => props.textColor};
  font-size: 22px;
  font-weight: 700;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: ${(props) =>
    props.text === "Homepage.Lire le lexique"
      ? "-5px"
      : props.text ===
        "Homepage.Consulter l'annuaire pour trouver une association"
      ? "10px"
      : "40px"};
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 15px;
  width: 87%;
`;

export const HomeCard = (props: Props) => (
  <MainContainer backgroundColor={props.backgroundColor}>
    <img alt="img-homecard" src={props.image} />
    <TextContainer text={props.text} textColor={props.textColor}>
      {props.t(props.text, props.defaultText)}
    </TextContainer>
    <ButtonContainer>
      <FButtonMobile
        name={props.iconName}
        isDisabled={props.isDisabled}
        fill={colors.noir}
        color={colors.blancSimple}
        onClick={props.onClick}
        t={props.t}
        title={props.buttonTitle}
        defaultTitle={props.defaultBoutonTitle}
      />
    </ButtonContainer>
  </MainContainer>
);
