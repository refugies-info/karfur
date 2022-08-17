import * as React from "react";
import styled from "styled-components/native";
import { styles } from "../../theme";

const CardContainer = styled.View`
  background-color: ${styles.colors.white};
  padding: ${styles.margin * 3}px;
  margin-bottom: ${styles.margin * 3}px;
  border-radius: ${styles.radius * 2}px;
  ${styles.shadows.lg}
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
