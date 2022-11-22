import React from "react";
import styled from "styled-components/native";
import { StyledTextSmallBold, StyledTextSmall } from "../../StyledText";
import { Flag } from "../Flag";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { ChoiceButton, ChoiceButtonProps } from "../../formulaire";
import { Columns } from "../../layout";

const StyledTextBold = styled(StyledTextSmallBold)`
  text-align: left;
  margin-left: ${({ theme }) => (!theme.i18n.isRTL ? theme.margin * 2 : 0)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin * 2 : 0)}px;
  color: ${({ theme }) => theme.colors.black};
`;

const StyledText = styled(StyledTextSmall)`
  text-align: left;
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const FlagBackground = styled.View`
  margin: 4px;
  background-color: ${({ theme }) => theme.colors.white};
  width: 22px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  ${({ theme }) => theme.shadows.sm}
`;

export interface LanguageDetailsButtonProps {
  flatStyle?: boolean;
  hideRadio?: boolean;
  isSelected?: boolean;
  langueFr: string;
  langueLoc: string;
  onPress: ChoiceButtonProps["onPress"];
}

const LanguageDetailsButton = ({
  flatStyle,
  hideRadio,
  isSelected,
  langueFr,
  langueLoc,
  onPress,
}: LanguageDetailsButtonProps) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <ChoiceButton
      accessibilityRole="button"
      flatStyle={flatStyle}
      hideRadio={hideRadio}
      isSelected={!!isSelected}
      onPress={onPress}
      testID={"test-language-button-" + langueFr}
    >
      <Columns RTLBehaviour layout="auto">
        <FlagBackground>
          <Flag langueFr={langueFr} />
        </FlagBackground>
        <StyledTextBold>{langueLoc}</StyledTextBold>
        {langueFr !== "Français" && (
          <StyledText>
            {!isRTL ? " - " + langueFr : langueFr + " - "}
          </StyledText>
        )}
      </Columns>
    </ChoiceButton>
  );
};

export default LanguageDetailsButton;
