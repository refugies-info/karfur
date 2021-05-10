import React from "react";
import styled from "styled-components";
import { FButtonMobile } from "../../../components/FigmaUI/FButtonMobile/FButtonMobile";

declare const window: Window;
interface Props {
  image: string;
  title: string;
  defaultTitle: string;
  text: string;
  defaultText: string;
  iconName: string;
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

export const HomePageMobileSection = (props: Props) => (
  <SectionContainer backgroundColor={props.backgroundColor}>
    <img src={props.image} />
    <TitleContainer textColor={props.textColor}>
      {props.t(props.title, props.defaultTitle)}
    </TitleContainer>
    <TextContainer textColor={props.textColor}>
      {props.t(props.text, props.defaultText)}
    </TextContainer>
    <FButtonMobile
      name={props.iconName}
      isDisabled={props.isDisabled}
      fill={props.buttonTextColor}
      color={props.buttonColor}
      onClick={() => {}}
      t={props.t}
      title={props.buttonTitle}
      defaultTitle={props.defaultBoutonTitle}
    />
  </SectionContainer>
);
