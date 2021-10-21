import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";

const MainContainer = styled.View`
  flex-direction: row;
  margin-horizontal: -${theme.margin * 0.75}px;
`;

const ProgressBar = styled.View`
  height: 4px;
  width: 100%;
  background-color: ${(props: { isDone: boolean }) =>
  props.isDone ? theme.colors.darkBlue : theme.colors.grey60};
  border-radius: ${theme.radius * 2}px;
  margin-horizontal: ${theme.margin * 0.75}px;
  flex: 1;
`;

interface Props {
  step: number;
}
export const OnboardingProgressBar = (props: Props) => {
  return (
    <MainContainer>
      <ProgressBar isDone={props.step >= 1} />
      <ProgressBar isDone={props.step >= 2} />
      <ProgressBar isDone={props.step >= 3} />
    </MainContainer>
  );
};
