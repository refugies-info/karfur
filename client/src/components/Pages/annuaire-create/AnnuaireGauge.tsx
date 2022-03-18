import React from "react";
import styled from "styled-components";
import { colors } from "data/annuaireStepColors";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface StickLineProps {
  filled: boolean
  colorFilled: string
  colorToDo: string
}
const StickLine = styled.div`
  display: flex;
  flex: 1;
  background: ${(props: StickLineProps) =>
    props.filled ? props.colorFilled : props.colorToDo};
  border-radius: 6px;
  height: 8px;
`;
interface StepContainerProps {
  selected: boolean
  colorFilled: string
  colorToDo: string
  value: number
  filled: boolean
}
const StepContainer = styled.div`
  background: #ffffff;
  border-width: ${(props: StepContainerProps) => (props.selected ? "3px" : "0px")};
  border-style: solid;
  border-color: ${(props: StepContainerProps) => (props.selected ? props.colorFilled : "none")};
  border-radius: 50%;
  height: 32px;
  width: 32px;
  margin-right: 8px;
  margin-left: ${(props: StepContainerProps) => (props.value === 1 ? "0px" : "8px")};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: StepContainerProps) =>
    props.filled
      ? props.colorFilled
      : props.selected
      ? "#FFFFFF"
      : props.colorToDo};
`;
interface StepTextProps {
  selected: boolean
  colorFilled: string
}
const StepText = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  color: ${(props: StepTextProps) => (props.selected ? props.colorFilled : "#FFFFFF;")};
`;

const Step = (props: {
  value: number;
  filled: boolean;
  selected: boolean;
  colorFilled: string;
  colorToDo: string;
}) => (
  <StepContainer
    filled={props.filled}
    selected={props.selected}
    colorFilled={props.colorFilled}
    colorToDo={props.colorToDo}
    value={props.value}
  >
    <StepText
      selected={props.selected}
      colorFilled={props.colorFilled}
    >
      {props.value}
    </StepText>
  </StepContainer>
);

export const AnnuaireGauge = (props: { step: number }) => {
  return (
    <MainContainer>
      <Step
        value={1}
        filled={props.step > 1}
        selected={props.step === 1}
        colorToDo={colors[0].colorToDo}
        colorFilled={colors[0].colorFilled}
      />
      <StickLine
        filled={props.step > 1}
        colorFilled={colors[1].colorFilled}
        colorToDo={colors[1].colorToDo}
      />
      <Step
        value={2}
        filled={props.step > 2}
        selected={props.step === 2}
        colorToDo={colors[1].colorToDo}
        colorFilled={colors[1].colorFilled}
      />
      <StickLine
        filled={props.step > 2}
        colorFilled={colors[2].colorFilled}
        colorToDo={colors[2].colorToDo}
      />
      <Step
        value={3}
        filled={props.step > 3}
        selected={props.step === 3}
        colorToDo={colors[2].colorToDo}
        colorFilled={colors[2].colorFilled}
      />
      <StickLine
        filled={props.step > 3}
        colorFilled={colors[3].colorFilled}
        colorToDo={colors[3].colorToDo}
      />
      <Step
        value={4}
        filled={props.step > 4}
        selected={props.step === 4}
        colorToDo={colors[3].colorToDo}
        colorFilled={colors[3].colorFilled}
      />
      <StickLine
        filled={props.step > 4}
        colorFilled={colors[4].colorFilled}
        colorToDo={colors[4].colorToDo}
      />
      <Step
        value={5}
        filled={props.step > 5}
        selected={props.step === 5}
        colorToDo={colors[4].colorToDo}
        colorFilled={colors[4].colorFilled}
      />
    </MainContainer>
  );
};
