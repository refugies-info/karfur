import * as React from "react";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { theme } from "../../theme";
import { RowTouchableOpacity } from "../BasicComponents";
import { StyledTextNormalBold, StyledTextNormal } from "../StyledText";
import { Icon } from "react-native-eva-icons";

const LeftButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  padding: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: ${theme.margin / 2}px;
`;

const RightButtonContainer = styled.TouchableOpacity`
  background-color: ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? theme.colors.grey60 : theme.colors.darkBlue};
  padding: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 56px;
  align-items: center;
  margin-left: ${theme.margin / 2}px;
  flex: 2;
`;

const BottomButtonsContainer = styled(RowTouchableOpacity)`
  margin-top: ${theme.margin * 3}px;
`;

const TextBold = styled(StyledTextNormalBold)`
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
      <LeftButtonContainer onPress={props.onLeftButtonClick}>
        <StyledTextNormal>{t("Passer", "Passer")}</StyledTextNormal>
      </LeftButtonContainer>
      <RightButtonContainer
        isDisabled={props.isRightButtonDisabled}
        onPress={props.onRightButtonClick}
        disabled={props.isRightButtonDisabled}
      >
        <TextBold
          color={
            props.isRightButtonDisabled
              ? theme.colors.black
              : theme.colors.white
          }
        >
          {t("Suivant", "Suivant")}
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
    </BottomButtonsContainer>
  );
};
