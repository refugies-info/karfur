import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import { ReadableText } from "../ReadableText";
import { TextDSFR_MD } from "../StyledText";

const StyledText = styled(TextDSFR_MD)`
  color: ${styles.colors.dsfr_grey};
  margin-bottom: ${styles.margin * 6}px;
`;

export const Explaination = (props: { step: number; defaultText: string }) => {
  const { t, isRTL } = useTranslationWithRTL();
  return (
    <StyledText isRTL={isRTL}>
      <ReadableText>{t("onboarding_screens.help_" + props.step, props.defaultText)}</ReadableText>
    </StyledText>
  );
};
