import React from "react";

import styled from "styled-components";

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
}

const MainContainer = styled.div`
  padding: 40px;
  border-radius: 12px;
  height: 440px;
  width: 312px;
  background-color: ${(props) => props.backgroundColor};
  margin: 8px;
`;

export const HomeCard = (props: Props) => (
  <MainContainer backgroundColor={props.backgroundColor}>
    <img src={props.image} />
    {props.text}
  </MainContainer>
);
