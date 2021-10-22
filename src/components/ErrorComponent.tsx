import * as React from "react";

import styled from "styled-components/native";
import { theme } from "../theme";
import { StyledTextSmall } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

const RedContainer = styled.View`
  background-color: ${theme.colors.red};
  padding: ${theme.margin * 2}px;
  border-radius: ${theme.radius * 2}px;
  align-items: center;
  justify-content: center;
  margin-top: ${theme.margin}px;
`;

const StyledText = styled(StyledTextSmall)`
  color: ${theme.colors.white};
`;

export const ErrorComponent = (props: { text: string }) => {
  const { isRTL } = useTranslationWithRTL();
  return (
    <RedContainer isRTL={isRTL}>
      <StyledText>{props.text}</StyledText>
    </RedContainer>
  );
};
