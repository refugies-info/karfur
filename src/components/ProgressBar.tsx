import * as React from "react";
import styled from "styled-components/native";
import { styles } from "../theme";

interface Props {
  avancement: number;
  isSelected?: boolean;
}

const PROGRESS_BAR_WIDTH = 56;
const PROGRESS_BAR_HEIGHT = 8;

const StyledView = styled.View`
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? styles.colors.darkBlue : styles.colors.grey};
  width: ${PROGRESS_BAR_WIDTH + 2}px;
  height: ${PROGRESS_BAR_HEIGHT + 2}px;
  border-radius: ${styles.radius}px;
  margin-right: ${styles.margin}px;
  border-width: 1px;
  border-color: white;
  border-style: solid;
`;

const FilledView = styled.View`
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? styles.colors.white : styles.colors.darkBlue};

  height: 8px;
  border-radius: ${styles.radius}px;
  width: ${(props: { width: number }) => props.width}px;
`;

export const ProgressBar = (props: Props) => {
  const filledWidth = Math.round((PROGRESS_BAR_WIDTH * props.avancement) / 100);
  return (
    <StyledView isSelected={props.isSelected}>
      <FilledView width={filledWidth} isSelected={props.isSelected} />
    </StyledView>
  );
};
