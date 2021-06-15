import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";

const MainContainer = styled.View`
  height: 4px;
  width: 100%;
  background-color: ${theme.colors.grey60};
  border-radius: ${theme.radius * 2}px;
`;

const FilledContainer = styled.View`
  width: ${(props: { width: string }) => props.width};
  height: 4px;
  background-color: ${theme.colors.darkBlue};
  border-radius: ${theme.radius * 2}px;
`;
interface Props {
  step: number;
}
export const OnboardingProgressBar = (props: Props) => (
  <MainContainer>
    <FilledContainer width={`${33 * props.step}%`} />
  </MainContainer>
);
