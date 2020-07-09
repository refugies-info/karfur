import React from "react";
// @ts-ignore
import styled from "styled-components";

interface PropsType {
  isHover: boolean;
  isSelected: boolean;
  frenchLevel: string;
}

const StyledContainer = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border-width: 1px 
  border-style : solid
  border-color : ${(props: PropsType) =>
    props.isSelected ? "#4CAF50" : "black"};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: PropsType) =>
    props.isSelected ? "#4CAF50" : props.isHover ? "black" : "white"};
`;

const StyledText = styled.div`
  font-size: 18px;
  line-height: 23px;
  font-weight: bold;
  margin: 0;
  color: ${(props: PropsType) =>
    props.isSelected || props.isHover ? "white" : "black"};
`;

export const FrenchLevelButton = (props: PropsType) => (
  <StyledContainer {...props}>
    <StyledText {...props}>{props.frenchLevel}</StyledText>
  </StyledContainer>
);
