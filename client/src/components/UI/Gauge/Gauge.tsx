import React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  margin-top: 64px;
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const StickLine = styled.div`
  display: flex;
  flex: 1;
  background: ${(props: {filled: boolean}) => (props.filled ? "#0421b1" : "#CDCDCD;")};
  border-radius: 6px;
  height: 8px;
`;

interface StepContainerProps {
  filled: boolean
  selected: boolean
}
const StepContainer = styled.div`
  background: #ffffff;
  border-width: 3px;
  border-style: solid;
  border-color: ${(props: StepContainerProps) =>
    props.filled || props.selected ? "#0421b1" : "#CDCDCD;"};
  border-radius: 50%;
  height: 32px;
  width: 32px;
  margin-right: 8px;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: StepContainerProps) =>
    props.filled ? "#0421b1" : props.selected ? "#FFFFFF" : "#CDCDCD;"};
`;

const StepText = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  color: ${(props: {selected: boolean}) => (props.selected ? "#0421b1" : "#FFFFFF;")};
`;

const Step = (props: { value: number; filled: boolean; selected: boolean }) => (
  <StepContainer filled={props.filled} selected={props.selected}>
    <StepText selected={props.selected}>
      {props.value}
    </StepText>
  </StepContainer>
);

export const Gauge = (props: { step: number }) => {
  const stickLinesDisplay =
    props.step === 0
      ? [true, false, false]
      : props.step === 1
      ? [true, true, false]
      : [true, true, true];

  const filledStepsDisplay =
    props.step === 0
      ? [false, false, false]
      : props.step === 1
      ? [true, false, false]
      : [true, true, false];

  const selectedStepsDisplay =
    props.step === 0
      ? [true, false, false]
      : props.step === 1
      ? [false, true, false]
      : [false, false, true];
  return (
    <MainContainer>
      <StickLine filled={stickLinesDisplay[0]} />
      <Step
        value={1}
        filled={filledStepsDisplay[0]}
        selected={selectedStepsDisplay[0]}
      />
      <StickLine filled={stickLinesDisplay[1]} />
      <Step
        value={2}
        filled={filledStepsDisplay[1]}
        selected={selectedStepsDisplay[1]}
      />
      <StickLine filled={stickLinesDisplay[2]} />
      <Step
        value={3}
        filled={filledStepsDisplay[2]}
        selected={selectedStepsDisplay[2]}
      />
    </MainContainer>
  );
};
