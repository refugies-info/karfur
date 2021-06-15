import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { RowContainer } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { StyledTextVerySmall } from "../StyledText";
import Triangle from "../../theme/images/onboarding/Polygon.svg";

const MainContainer = styled(RowContainer)`
  background-color: ${theme.colors.lightBlue};
  display: flex;
  flex-direction: row;
  padding: ${theme.margin * 2}px;
  align-items: center;
  width: 100%;
  border-radius: ${theme.margin}px;
  margin-top: ${theme.margin * 3}px;
`;

const StyledText = styled(StyledTextVerySmall)`
  color: ${theme.colors.blue};
  margin-left: ${theme.margin}px;
`;

const TriangleContainer = styled.View`
  position: absolute;
  top: -10px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;
const ICON_SIZE = 24;

export const Explaination = (props: { step: number; defaultText: string }) => {
  const { t } = useTranslationWithRTL();
  return (
    <MainContainer>
      <TriangleContainer>
        <Triangle />
      </TriangleContainer>
      <Icon
        name="info"
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={theme.colors.blue}
      />
      <StyledText>
        {t("Onboarding.help_" + props.step, props.defaultText)}
      </StyledText>
    </MainContainer>
  );
};
