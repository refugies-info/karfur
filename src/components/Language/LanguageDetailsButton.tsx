import * as React from "react";
import styled from "styled-components/native";
import { StyledTextSmallBold, StyledTextSmall } from "../StyledText";
import { theme } from "../../theme";
import { Flag } from "./Flag";
import { RowContainer, RTLView } from "../BasicComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ChoiceButton } from "../UI/ChoiceButton";

const StyledTextBold = styled(StyledTextSmallBold)`
  text-align: left;
  margin-left: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin * 2 : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
  props.isRTL ? theme.margin * 2 : 0}px;
  color: ${theme.colors.black};
`;

const StyledText = styled(StyledTextSmall)`
  text-align: left;
  color: ${theme.colors.darkGrey};
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
  ${theme.shadows.sm}
`;

interface Props {
  langueFr: string;
  langueLoc: string;
  onPress: () => void;
  isSelected?: boolean;
  hideRadio?: boolean;
}
export const LanguageDetailsButton = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
  <ChoiceButton
    onPress={props.onPress}
    testID={"test-language-button-" + props.langueFr}
    isSelected={!!props.isSelected}
    accessibilityRole="button"
    hideRadio={props.hideRadio}
  >
    <RTLView>
      <FlagBackground>
        <Flag langueFr={props.langueFr} />
      </FlagBackground>
      <RowContainer>
        <StyledTextBold isRTL={isRTL}>
          {props.langueLoc}
        </StyledTextBold>
      </RowContainer>
      {props.langueFr !== "Français" && (
        <StyledText>
          {!isRTL ? " - " + props.langueFr : props.langueFr + " - "}
        </StyledText>
      )}
    </RTLView>
  </ChoiceButton>
  )
}
