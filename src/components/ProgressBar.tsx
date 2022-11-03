import * as React from "react";
import styled from "styled-components/native";

interface Props {
  avancement: number;
  isSelected?: boolean;
}

const PROGRESS_BAR_WIDTH = 56;
const PROGRESS_BAR_HEIGHT = 8;

const StyledView = styled.View<{ isSelected?: boolean }>`
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.darkBlue : theme.colors.grey};
  width: ${PROGRESS_BAR_WIDTH + 2}px;
  height: ${PROGRESS_BAR_HEIGHT + 2}px;
  border-radius: ${({ theme }) => theme.radius}px;
  margin-right: ${({ theme }) => theme.margin}px;
  border-width: 1px;
  border-color: white;
  border-style: solid;
`;

const FilledView = styled.View<{ isSelected?: boolean; width: number }>`
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.white : theme.colors.darkBlue};
  height: 8px;
  border-radius: ${({ theme }) => theme.radius}px;
  width: ${({ width }) => width}px;
`;

export const ProgressBar = (props: Props) => {
  const filledWidth = Math.round((PROGRESS_BAR_WIDTH * props.avancement) / 100);
  return (
    <StyledView isSelected={props.isSelected}>
      <FilledView width={filledWidth} isSelected={props.isSelected} />
    </StyledView>
  );
};
