import React from "react";
import styled from "styled-components/native";
import { StyledTextSmallBold, StyledTextSmall } from "../../StyledText";
import { Flag } from "../Flag";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { ChoiceButton, ChoiceButtonProps } from "../../formulaire";
import Columns from "../../layout/Columns";
import { RTLView } from "../../BasicComponents";
import NoVoiceover from "../../../theme/images/profile/no-voiceover.svg";
import { noVoiceover } from "../../../libs/noVoiceover";

const StyledTextBold = styled(StyledTextSmallBold)`
  text-align: left;
  color: ${({ theme }) => theme.colors.black};
`;
const StyledText = styled(StyledTextSmall)`
  text-align: left;
  color: ${({ theme }) => theme.colors.darkGrey};
`;
const FlagBackground = styled.View`
  background-color: ${({ theme }) => theme.colors.dsfr_borderGrey};
  width: 22px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

export interface LanguageDetailsButtonProps {
  flatStyle?: boolean;
  hideRadio?: boolean;
  isSelected?: boolean;
  iconOverride?: string;
  langueFr: string;
  langueLoc: string;
  langueCode: string;
  showNoVoiceover?: boolean;
  onPress: ChoiceButtonProps["onPress"];
}

const LanguageDetailsButton = ({
  flatStyle,
  hideRadio,
  isSelected,
  iconOverride,
  langueFr,
  langueLoc,
  langueCode,
  showNoVoiceover,
  onPress,
}: LanguageDetailsButtonProps) => {
  const { isRTL } = useTranslationWithRTL();
  const noVoiceoverIcon = !!showNoVoiceover && noVoiceover(langueCode);

  return (
    <ChoiceButton
      accessibilityRole="button"
      flatStyle={flatStyle}
      hideRadio={hideRadio}
      isSelected={!!isSelected}
      iconOverride={iconOverride}
      onPress={onPress}
      testID={"test-language-button-" + langueFr}
    >
      <Columns RTLBehaviour layout="auto" verticalAlign="center">
        <FlagBackground>
          <Flag langueFr={langueFr} />
        </FlagBackground>
        <RTLView>
          <StyledTextBold>{langueLoc}</StyledTextBold>
          {langueFr !== "Français" && (
            <StyledText>
              {!isRTL ? " - " + langueFr : langueFr + " - "}
            </StyledText>
          )}
        </RTLView>
        {noVoiceoverIcon && (
          <NoVoiceover
            width={24}
            height={24}
            accessible={true}
            accessibilityLabel="Vocalisation non disponible"
          />
        )}
      </Columns>
    </ChoiceButton>
  );
};

export default LanguageDetailsButton;
