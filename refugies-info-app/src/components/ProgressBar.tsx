import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../theme";

interface Props {
  avancement: number;
}

const PROGRESS_BAR_WIDTH = 56;
const StyledView = styled.View`
  background-color: ${theme.colors.grey};
  width: ${PROGRESS_BAR_WIDTH}px;
  height: 8px;
  border-radius: ${theme.radius}px;
  margin-right: ${theme.margin}px;
`;

const FilledView = styled.View`
  background-color: ${theme.colors.darkBlue};
  height: 8px;
  border-radius: ${theme.radius}px;
  width: ${(props: { width: number }) => props.width}px;
`;

export const ProgressBar = (props: Props) => {
  const filledWidth = Math.round((PROGRESS_BAR_WIDTH * props.avancement) / 100);
  return (
    <StyledView>
      <FilledView width={filledWidth} />
    </StyledView>
  );
};
