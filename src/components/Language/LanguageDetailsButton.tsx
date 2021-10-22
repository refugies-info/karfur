import * as React from "react";
import styled from "styled-components/native";
import { StyledTextSmallBold, StyledTextSmall } from "../StyledText";
import { theme } from "../../theme";
import { Flag } from "./Flag";
import { RowContainer } from "../BasicComponents";

const MainContainer = styled.TouchableOpacity`
  background: ${(props: { isSelected: any }) =>
    props.isSelected ? theme.colors.black : theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.margin * 2}px;
  margin-vertical: ${theme.margin * 1.5}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  elevation: 2;
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);
`;

const StyledTextBold = styled(StyledTextSmallBold)`
  text-align: left;
  margin-left: ${theme.margin * 2}px;
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
`;

const StyledText = styled(StyledTextSmall)`
  text-align: left;
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
  margin-left: ${theme.margin}px;
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
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);
  elevation: 2;
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
      <RowContainer>
        <StyledTextBold isSelected={props.isSelected}>
          {props.langueLoc}
        </StyledTextBold>
      </RowContainer>
      {props.langueFr !== "Français" && (
        <StyledText isSelected={props.isSelected}>
          ({props.langueFr})
        </StyledText>
      )}
    </RowContainer>
  </MainContainer>
);
