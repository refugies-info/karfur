import React from "react";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { styles } from "../../theme";
import { RowContainer, RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextSmallBold } from "../StyledText";
import { Icon } from "react-native-eva-icons";
import { Columns } from "../layout";

const LeftButtonContainer = styled.TouchableOpacity`
  padding-vertical: ${styles.radius * 3}px;
  border-radius: ${styles.radius * 2}px;
  min-height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightButtonContainer = styled(RTLTouchableOpacity)`
  background-color: ${styles.colors.darkBlue};
  opacity: ${(props: { isDisabled: boolean }) => (props.isDisabled ? 0.4 : 1)};
  border-radius: ${styles.radius * 2}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-height: 56px;
  align-items: center;
  ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? "" : styles.shadows.sm}
`;

const BottomButtonsContainer = styled(RowContainer)`
  margin-top: ${styles.margin * 3}px;
`;

const TextBold = styled(StyledTextSmallBold)`
  margin-right: ${styles.margin}px;
  color: ${(props: { color: string }) => props.color};
  align-items: center;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
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
      <Columns>
        <LeftButtonContainer
          onPress={props.onLeftButtonClick}
          accessibilityRole="button"
        >
          <StyledTextSmallBold style={{ color: styles.colors.darkBlue }}>
            {t("onboarding_screens.skip_step_button", "Passer l'étape")}
          </StyledTextSmallBold>
        </LeftButtonContainer>
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
            fill={styles.colors.white}
          />
          <TextBold color={styles.colors.white}>
            {t("global.validate", "Valider")}
          </TextBold>
        </RightButtonContainer>
      </Columns>
    </BottomButtonsContainer>
  );
};
