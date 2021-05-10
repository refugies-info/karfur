import React from "react";
import { colors } from "../../colors";
import styled from "styled-components";
import { FButtonMobile } from "../../components/FigmaUI/FButtonMobile/FButtonMobile";

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
  padding: 30px;
  border-radius: 12px;
  height: 440px;
  background-color: ${(props) => props.backgroundColor};
  margin: 8px;
  text-align: center;
`;

const TextContainer = styled.div`
  color: ${(props) => props.textColor};
  font-size: 22px;
  font-weight: 700;
  margin-top: 40px;
  margin-bottom: 20px;
`;

export const HomeCard = (props: Props) => (
  <MainContainer backgroundColor={props.backgroundColor}>
    <img src={props.image} />
    <TextContainer textColor={props.textColor}>
      {props.t(props.text, props.defaultText)}
    </TextContainer>
    <FButtonMobile
      name="search-outline"
      isDisabled={props.isDisabled}
      fill={colors.noir}
      color={colors.blancSimple}
      onClick={props.onClick}
      t={props.t}
      title={props.buttonTitle}
      defaultTitle={props.defaultBoutonTitle}
    />
  </MainContainer>
);
