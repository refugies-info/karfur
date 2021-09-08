import * as React from "react";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { theme } from "../../theme";
import { RowTouchableOpacity, RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextSmallBold, StyledTextSmall } from "../StyledText";
import { Icon } from "react-native-eva-icons";
import { View } from "react-native";

const LeftButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  padding: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const RightButtonContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? theme.colors.grey60 : theme.colors.darkBlue};
  border-radius: ${theme.radius * 2}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 56px;
  align-items: center;
  box-shadow: ${(props: { isDisabled: boolean }) =>
    props.isDisabled
      ? `0px 8px 16px ${theme.colors.grey}`
      : "0px 8px 16px rgba(33, 33, 33, 0.24)"};
  elevation: ${(props: { isDisabled: boolean }) => (props.isDisabled ? 0 : 1)};
`;

const BottomButtonsContainer = styled(RowTouchableOpacity)`
  margin-top: ${theme.margin * 3}px;
`;

const TextBold = styled(StyledTextSmallBold)`
  margin-right: ${theme.margin}px;
  color: ${(props: { color: string }) => props.color};
  align-items: center;
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
        <LeftButtonContainer onPress={props.onLeftButtonClick}>
          <StyledTextSmall>
            {t("Passer l'étape", "Passer l'étape")}
          </StyledTextSmall>
        </LeftButtonContainer>
      </View>
      <View style={{ paddingLeft: 4, width: "50%" }}>
        <RightButtonContainer
          isDisabled={props.isRightButtonDisabled}
          onPress={props.onRightButtonClick}
          disabled={props.isRightButtonDisabled}
          testID="test-validate-button"
        >
          <TextBold
            color={
              props.isRightButtonDisabled
                ? theme.colors.black
                : theme.colors.white
            }
          >
            {t("Valider", "Valider")}
          </TextBold>
          <Icon
            name={"arrow-forward-outline"}
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={
              props.isRightButtonDisabled
                ? theme.colors.black
                : theme.colors.white
            }
          />
        </RightButtonContainer>
      </View>
    </BottomButtonsContainer>
  );
};
