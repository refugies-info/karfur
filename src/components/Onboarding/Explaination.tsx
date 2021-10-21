import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { StyledTextSmall } from "../StyledText";

const StyledText = styled(StyledTextSmall)`
  color: ${theme.colors.darkGrey};
  margin-bottom: ${theme.margin * 6}px;
`;

export const Explaination = (props: { step: number; defaultText: string }) => {
  const { t, isRTL } = useTranslationWithRTL();
  return (
    <StyledText isRTL={isRTL}>
      {t("Onboarding.help_" + props.step, props.defaultText)}
    </StyledText>
  );
};
