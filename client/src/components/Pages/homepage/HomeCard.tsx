import React from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import Image from "next/image";
import { colors } from "colors";
import { FButtonMobile } from "components/FigmaUI/FButtonMobile/FButtonMobile";

declare const window: Window;
interface Props {
  text: string;
  defaultText: string;
  buttonTitle: string;
  defaultBoutonTitle: string;
  iconName: string;
  image: string;
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
  background-color: ${(props: {backgroundColor: string}) => props.backgroundColor};
  margin: 8px;
  justify-content: center;
  text-align: center;
  position: relative;
`;

interface TextContainerProps {
  textColor: string
  text: string
}
const TextContainer = styled.div`
  color: ${(props: TextContainerProps) => props.textColor};
  font-size: 22px;
  font-weight: bold;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: ${(props: TextContainerProps) =>
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

export const HomeCard = (props: Props) => {
  const { t } = useTranslation();

  return (
    <MainContainer backgroundColor={props.backgroundColor}>
    <Image alt="img-homecard" src={props.image} />
    <TextContainer text={props.text} textColor={props.textColor}>
      {t(props.text, props.defaultText)}
    </TextContainer>
    <ButtonContainer>
      <FButtonMobile
        name={props.iconName}
        isDisabled={props.isDisabled}
        fill={colors.gray90}
        color={colors.white}
        onClick={props.onClick}
        title={props.buttonTitle}
        defaultTitle={props.defaultBoutonTitle}
      />
    </ButtonContainer>
    </MainContainer>
  )
};
