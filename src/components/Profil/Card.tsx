import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";

const CardContainer = styled.View`
  background-color: ${theme.colors.white};
  padding: ${theme.margin * 3}px;
  margin-bottom: ${theme.margin * 3}px;
  border-radius: ${theme.radius * 2}px;
  ${theme.shadows.lg}
`;

interface Props {
  children: any;
  style?: any;
}

export const Card = (props: Props) => (
  <CardContainer style={props.style || {}}>
    {props.children}
  </CardContainer>
);
