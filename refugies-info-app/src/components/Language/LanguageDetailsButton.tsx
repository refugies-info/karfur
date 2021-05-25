import * as React from "react";
import styled from "styled-components/native";
import { StyledTextNormalBold, StyledTextNormal } from "../StyledText";
import { theme } from "../../theme";
import { Flag } from "./Flag";

const MainContainer = styled.View`
  background: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.margin * 2}px;
  margin-vertical: ${theme.margin}px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledTextBold = styled(StyledTextNormalBold)`
  text-align: left;
  margin-left: ${theme.margin}px;
`;

const StyledText = styled(StyledTextNormal)`
  text-align: left;
`;

interface Props {
  langueFr: string;
  langueLoc: string;
}
export const LanguageDetailsButton = (props: Props) => (
  <MainContainer>
    <Flag langueFr={props.langueFr} />
    <StyledTextBold>{props.langueFr + " - "}</StyledTextBold>
    <StyledText>{props.langueLoc}</StyledText>
  </MainContainer>
);
