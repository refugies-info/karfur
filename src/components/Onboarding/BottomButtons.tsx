import * as React from "react";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { theme } from "../../theme";
import { RowContainer, RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextSmallBold } from "../StyledText";
import { Icon } from "react-native-eva-icons";
import { View } from "react-native";

const LeftButtonContainer = styled.TouchableOpacity`
  padding-vertical: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightButtonContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.darkBlue};
  opacity: ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? 0.4 : 1};
  border-radius: ${theme.radius * 2}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 56px;
  align-items: center;
  ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? "" : theme.shadows.sm}
`;

const BottomButtonsContainer = styled(RowContainer)`
  margin-top: ${theme.margin * 3}px;
`;

const TextBold = styled(StyledTextSmallBold)`
  margin-right: ${theme.margin}px;
  color: ${(props: { color: string }) => props.color};
  align-items: center;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const ICON_SIZE = 24;

interface Props {
  onRightButtonClick: () => void;
  onLeftButtonClick: () => void;

  isRightButtonDisabled: boolean;
}
export const BottomButtons = (props: Props) => {
  const { t } = useTranslationWithRTL();
  return (
    <BottomButtonsContainer>
      <View style={{ paddingRight: 4, width: "50%" }}>
        <LeftButtonContainer
          onPress={props.onLeftButtonClick}
          accessibilityRole="button"
        >
          <StyledTextSmallBold style={{color: theme.colors.darkBlue}}>
            {t("onboarding_screens.skip_step_button", "Passer l'étape")}
          </StyledTextSmallBold>
        </LeftButtonContainer>
      </View>
      <View style={{ paddingLeft: 4, width: "50%" }}>
        <RightButtonContainer
          isDisabled={props.isRightButtonDisabled}
          onPress={props.onRightButtonClick}
          disabled={props.isRightButtonDisabled}
          testID="test-validate-button"
          accessibilityRole="button"
        >
          <Icon
            name={"checkmark-outline"}
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={theme.colors.white}
          />
          <TextBold color={theme.colors.white}>
            {t("global.validate", "Valider")}
          </TextBold>
        </RightButtonContainer>
      </View>
    </BottomButtonsContainer>
  );
};
