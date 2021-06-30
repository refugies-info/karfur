import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { RTLView } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { StyledTextVerySmall } from "../StyledText";
import Triangle from "../../theme/images/onboarding/Polygon-white.svg";

const MainContainer = styled(RTLView)`
  background-color: ${theme.colors.white};
  display: flex;
  padding-vertical: ${theme.margin * 2}px;
  align-items: center;
  width: 100%;
  border-radius: ${theme.margin}px;
`;

const StyledText = styled(StyledTextVerySmall)`
  color: ${theme.colors.blue};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : theme.margin * 2}px;
  flex-shrink: 1;
`;

const TriangleContainer = styled.View`
  position: absolute;
  top: -10px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;
const IconContainer = styled.View`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
`;
const ICON_SIZE = 24;

export const Explaination = (props: { step: number; defaultText: string }) => {
  const { t, isRTL } = useTranslationWithRTL();
  return (
    <MainContainer>
      <TriangleContainer>
        <Triangle />
      </TriangleContainer>
      <IconContainer isRTL={isRTL}>
        <Icon
          name="info"
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={theme.colors.blue}
        />
      </IconContainer>
      <StyledText isRTL={isRTL}>
        {t("Onboarding.help_" + props.step, props.defaultText)}
      </StyledText>
    </MainContainer>
  );
};
