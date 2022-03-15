import React from "react";
import styled from "styled-components";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import traductionIconBlanc from "assets/icon_traduction_blanc.svg";
import icon_mobilisation from "assets/icon_mobilisation.svg";
import Image from "next/image";
import useRTL from "hooks/useRTL";
import { useTranslation } from "next-i18next";

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
  backgroundColor: string;
  textColor: string;
  onClick: (e: any) => void;
  isDisabled: boolean;
}

const SectionContainer = styled.div`
  padding: 35px;
  text-align: left;
  background-color: ${(props: {backgroundColor: string}) => props.backgroundColor};
`;

const TitleContainer = styled.div`
  font-size: 32px;
  font-weight: normal;
  margin-top: 15px;
  margin-bottom: 24px;
  color: ${(props: {textColor: string}) => props.textColor};
`;

const TextContainer = styled.div`
  font-size: 19px;
  margin-bottom: 24px;
  color: ${(props: {textColor: string}) => props.textColor};
`;
interface ButtonContainerProps {
  isDisabled: boolean
  color: string
  backgroundColor: string
}
const ButtonContainer = styled.div`
  display:flex;
  width: 100%;
  justify-content:center;
  padding:20px
  text-align: center;
  border-radius: 12px;
  margin: auto;
  align-items:center;
  background-color: ${(props: ButtonContainerProps) =>
    props.isDisabled ? colors.gray60 : props.backgroundColor};
  font-size:16px;
  color:${(props: ButtonContainerProps) => props.color};
  font-weight:700;
  cursor:pointer;
`;

const IconContainer = styled.div`
  margin-right: ${(props: {isRTL: boolean}) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props: {isRTL: boolean}) => (props.isRTL ? "10px" : "0px")};
`;

export const HomePageMobileSection = (props: Props) => {
  const isRTL = useRTL();
  const { t } = useTranslation();

  return (
    <SectionContainer backgroundColor={props.backgroundColor}>
      <div
        style={
          props.text === "Homepage.Contribuer à la traduction"
            ? { marginLeft: "-15px" }
            : undefined
        }
      >
        <Image
          alt="illustration section"
          src={props.image}
        />
      </div>
      <TitleContainer textColor={props.textColor}>
        {t(props.title, props.defaultTitle)}
      </TitleContainer>
      <TextContainer textColor={props.textColor}>
        {t(props.text, props.defaultText)}
      </TextContainer>
      <ButtonContainer
        onClick={props.isDisabled ? undefined : props.onClick}
        isDisabled={props.isDisabled}
        backgroundColor={props.buttonColor}
        color={props.buttonTextColor}
      >
        <IconContainer isRTL={isRTL}>
          {props.iconType === "eva" ? (
            <EVAIcon
              name={props.iconName}
              fill={props.buttonTextColor}
              size={"large"}
            />
          ) : props.iconType === "traduction" ? (
            <Image src={traductionIconBlanc} alt="picto-traduction" />
          ) : props.iconType === "territoire" ? (
            <Image src={icon_mobilisation} alt="picto-mobilisation" />
          ) : null}
        </IconContainer>

        {t(props.buttonTitle, props.defaultBoutonTitle)}
      </ButtonContainer>
    </SectionContainer>
  );
};
