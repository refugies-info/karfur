import * as React from "react";
import styled from "styled-components/native";
import {
  StyledTextNormalBold,
  StyledTextNormal,
  StyledTextVerySmallBold,
} from "../StyledText";
import { theme } from "../../theme";
import { Flag } from "./Flag";
import { ProgressBar } from "../ProgressBar";
import { RowContainer } from "../BasicComponents";

const MainContainer = styled.TouchableOpacity`
  background: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.margin * 2}px;
  margin-vertical: ${theme.margin}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledTextBold = styled(StyledTextNormalBold)`
  text-align: left;
  margin-left: ${theme.margin}px;
`;

const StyledText = styled(StyledTextNormal)`
  text-align: left;
`;

const SmallStyledTextBold = styled(StyledTextVerySmallBold)`
  text-align: left;
`;

interface Props {
  langueFr: string;
  langueLoc: string;
  avancementTrad: number | null;
  onPress: () => void;
}
export const LanguageDetailsButton = (props: Props) => (
  <MainContainer onPress={props.onPress}>
    <RowContainer>
      <Flag langueFr={props.langueFr} />
      <StyledTextBold>{props.langueFr + " - "}</StyledTextBold>
      <StyledText>{props.langueLoc}</StyledText>
    </RowContainer>
    {props.avancementTrad && (
      <RowContainer>
        <ProgressBar avancement={props.avancementTrad} />
        <SmallStyledTextBold>{props.avancementTrad + "%"}</SmallStyledTextBold>
      </RowContainer>
    )}
  </MainContainer>
);
