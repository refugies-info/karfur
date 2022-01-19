import React from "react";
import styled from "styled-components";

interface PropsType {
  isHover: boolean;
  isSelected: boolean;
  frenchLevel: string;
  onClick: (arg1: string) => void;
  disableEdit: boolean;
}

const StyledContainerEdit = styled.div`
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
    props.isSelected ? "#4CAF50" : "white"};
  cursor: ${(props: PropsType) => (props.disableEdit ? "default" : "pointer")};
  color: ${(props: PropsType) => (props.isSelected ? "white" : "black")};


  &:hover {
  background-color : black;
  color: white;
  border-color: white
  }
`;

const StyledContainerLecture = styled.div`
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
    props.isSelected ? "#4CAF50" : "white"};
  cursor: ${(props: PropsType) => (props.disableEdit ? "default" : "pointer")};
  color: ${(props: PropsType) => (props.isSelected ? "white" : "black")};
`;

const StyledText = styled.div`
  font-size: 18px;
  line-height: 23px;
  font-weight: bold;
  margin: 0;
`;

export const FrenchLevelButton = (props: PropsType) =>
  props.disableEdit ? (
    <StyledContainerLecture {...props}>
      <StyledText {...props}>{props.frenchLevel}</StyledText>
    </StyledContainerLecture>
  ) : (
    <StyledContainerEdit
      {...props}
      onClick={() => props.onClick(props.frenchLevel)}
    >
      <StyledText {...props}>{props.frenchLevel}</StyledText>
    </StyledContainerEdit>
  );
