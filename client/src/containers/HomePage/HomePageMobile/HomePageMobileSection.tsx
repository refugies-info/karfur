import React from "react";
import styled from "styled-components";
import { colors } from "../../../colors";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import traductionIconBlanc from "../../../assets/icon_traduction_blanc.svg";
import icon_mobilisation from "../../../assets/icon_mobilisation.svg";

declare const window: Window;
interface Props {
  image: string;
  title: string;
  defaultTitle: string;
  text: string;
  defaultText: string;
  iconName: string;
  iconType: string;
  buttonTitle: string;
  defaultBoutonTitle: string;
  buttonColor: string;
  buttonTextColor: string;
  t: (text: string, defaultText: string) => void;
  backgroundColor: string;
  textColor: string;
  onClick: (e: any) => void;
  isDisabled: boolean;
}

const SectionContainer = styled.div`
  padding: 35px;
  margin: -10px;
  text-align: left;
  background-color: ${(props) => props.backgroundColor};
`;

const TitleContainer = styled.div`
  font-size: 32px;
  font-weight: 400;
  margin-top: 15px;
  margin-bottom: 24px;
  color: ${(props) => props.textColor};
`;

const TextContainer = styled.div`
  font-size: 19px;
  margin-bottom: 24px;
  color: ${(props) => props.textColor};
`;

const ButtonContainer = styled.div`
  display:flex;
  width: 100%;
  justify-content:center;
  padding:20px
  text-align: center;
  border-radius: 12px;
  margin: auto;
  align-items:center;
  background-color: ${(props) =>
    props.isDisabled ? colors.grey : props.backgroundColor};
  font-size:16px;
  color:${(props) => props.color};
  font-weight:700;
  cursor:pointer;
`;

const IconContainer = styled.div`
  margin-right: 10px;
`;

export const HomePageMobileSection = (props: Props) => (
  <SectionContainer backgroundColor={props.backgroundColor}>
    <img src={props.image} />
    <TitleContainer textColor={props.textColor}>
      {props.t(props.title, props.defaultTitle)}
    </TitleContainer>
    <TextContainer textColor={props.textColor}>
      {props.t(props.text, props.defaultText)}
    </TextContainer>
    <ButtonContainer
      onClick={props.isDisabled ? null : props.onClick}
      isDisabled={props.isDisabled}
      backgroundColor={props.buttonColor}
      color={props.buttonTextColor}
    >
      <IconContainer>
        {props.iconType === "eva" ? (
          <EVAIcon
            name={props.iconName}
            fill={props.buttonTextColor}
            size={"large"}
          />
        ) : props.iconType === "traduction" ? (
          <img src={traductionIconBlanc} alt="picto-traduction" />
        ) : props.iconType === "territoire" ? (
          <img src={icon_mobilisation} alt="picto-mobilisation" />
        ) : null}
      </IconContainer>

      {props.t(props.buttonTitle, props.defaultBoutonTitle)}
    </ButtonContainer>
  </SectionContainer>
);
