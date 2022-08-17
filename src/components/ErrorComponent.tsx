import * as React from "react";

import styled from "styled-components/native";
import { styles } from "../theme";
import { StyledTextSmall } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

const RedContainer = styled.View`
  background-color: ${styles.colors.red};
  padding: ${styles.margin * 2}px;
  border-radius: ${styles.radius * 2}px;
  align-items: center;
  justify-content: center;
  margin-top: ${styles.margin}px;
`;

const StyledText = styled(StyledTextSmall)`
  color: ${styles.colors.white};
`;

export const ErrorComponent = (props: { text: string }) => {
  const { isRTL } = useTranslationWithRTL();
  return (
    <RedContainer isRTL={isRTL}>
      <StyledText>{props.text}</StyledText>
    </RedContainer>
  );
};
