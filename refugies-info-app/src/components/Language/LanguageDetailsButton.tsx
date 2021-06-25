import * as React from "react";
import styled from "styled-components/native";
import { StyledTextSmallBold, StyledTextSmall } from "../StyledText";
import { theme } from "../../theme";
import { Flag } from "./Flag";
import { RowContainer } from "../BasicComponents";

const MainContainer = styled.TouchableOpacity`
  background: ${(props: { isSelected: any }) =>
    props.isSelected ? theme.colors.darkBlue : theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.margin * 2}px;
  margin-vertical: ${theme.margin}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  elevation: 1;
  box-shadow: 0px 8px 16px rgba(33, 33, 33, 0.24);
`;

const StyledTextBold = styled(StyledTextSmallBold)`
  text-align: left;
  margin-left: ${theme.margin}px;
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
`;

const StyledText = styled(StyledTextSmall)`
  text-align: left;
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
`;

const FlagBackground = styled.View`
  margin: 4px;
  background-color: ${theme.colors.white};
  width: 22px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

interface Props {
  langueFr: string;
  langueLoc: string;
  onPress: () => void;
  isSelected?: boolean;
}
export const LanguageDetailsButton = (props: Props) => (
  <MainContainer
    onPress={props.onPress}
    testID={"test-language-button-" + props.langueFr}
    isSelected={props.isSelected}
  >
    <RowContainer>
      <FlagBackground>
        <Flag langueFr={props.langueFr} />
      </FlagBackground>
      <StyledTextBold isSelected={props.isSelected}>
        {props.langueFr}
      </StyledTextBold>
      {props.langueFr !== "Français" && (
        <RowContainer>
          <StyledText isSelected={props.isSelected}>{" - "}</StyledText>
          <StyledText isSelected={props.isSelected}>
            {props.langueLoc}
          </StyledText>
        </RowContainer>
      )}
    </RowContainer>
  </MainContainer>
);
