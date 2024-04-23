import * as React from "react";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { StyledTextSmall } from "../StyledText";
import { ReadableText } from "../ReadableText";

const StyledText = styled(StyledTextSmall)`
  color: ${styles.colors.dsfr_grey};
  margin-bottom: ${styles.margin * 6}px;
`;

export const Explaination = (props: { step: number; defaultText: string }) => {
  const { t, isRTL } = useTranslationWithRTL();
  return (
    <StyledText isRTL={isRTL}>
      <ReadableText>
        {t("onboarding_screens.help_" + props.step, props.defaultText)}
      </ReadableText>
    </StyledText>
  );
};
