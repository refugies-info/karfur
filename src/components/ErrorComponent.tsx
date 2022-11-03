import * as React from "react";

import styled from "styled-components/native";
import { StyledTextSmall } from "./StyledText";

const RedContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.red};
  padding: ${({ theme }) => theme.margin * 2}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.margin}px;
`;

const StyledText = styled(StyledTextSmall)`
  color: ${({ theme }) => theme.colors.white};
`;

export const ErrorComponent = (props: { text: string }) => (
  <RedContainer>
    <StyledText>{props.text}</StyledText>
  </RedContainer>
);
