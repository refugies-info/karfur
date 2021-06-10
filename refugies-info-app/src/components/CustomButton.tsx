import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "./BasicComponents";
import { theme } from "../theme";
import { StyledTextSmallBold } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";

const ButtonContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.white};
  justify-content: center;
  padding: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
  align-items: center;
  width: 100%;
`;

const ColoredText = styled(StyledTextSmallBold)`
  color: ${(props: { textColor: string }) => props.textColor};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
`;

interface Props {
  textColor: string;
  text?: string;
  onPress: () => void;
  iconName?: string;
}

const ICON_SIZE = 24;

export const CustomButton = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  return (
    <ButtonContainer onPress={props.onPress}>
      <ColoredText textColor={props.textColor} isRTL={isRTL}>
        {props.text || t("Suivant", "trad")}
      </ColoredText>
      {props.iconName && (
        <Icon
          name={props.iconName}
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={theme.colors.black}
        />
      )}
    </ButtonContainer>
  );
};
