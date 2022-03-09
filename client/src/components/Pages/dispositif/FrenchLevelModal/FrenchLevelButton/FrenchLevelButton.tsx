import React from "react";
import styled from "styled-components";

interface PropsType {
  isHover: boolean;
  isSelected: boolean;
  frenchLevel: string;
  onClick: (arg1: string) => void;
  disableEdit: boolean;
}

interface ComponentProps {
  disableEdit: boolean
  isSelected: boolean
}
const StyledContainerEdit = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border-width: 1px
  border-style : solid
  border-color : ${(props: ComponentProps) =>
    props.isSelected ? "#4CAF50" : "black"};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: ComponentProps) =>
    props.isSelected ? "#4CAF50" : "white"};
  cursor: ${(props: ComponentProps) => (props.disableEdit ? "default" : "pointer")};
  color: ${(props: ComponentProps) => (props.isSelected ? "white" : "black")};


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
  border-color : ${(props: ComponentProps) =>
    props.isSelected ? "#4CAF50" : "black"};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: ComponentProps) =>
    props.isSelected ? "#4CAF50" : "white"};
  cursor: ${(props: ComponentProps) => (props.disableEdit ? "default" : "pointer")};
  color: ${(props: ComponentProps) => (props.isSelected ? "white" : "black")};
`;

const StyledText = styled.div`
  font-size: 18px;
  line-height: 23px;
  font-weight: bold;
  margin: 0;
`;

export const FrenchLevelButton = (props: PropsType) =>
  props.disableEdit ? (
    <StyledContainerLecture
      isSelected={props.isSelected}
      disableEdit={props.disableEdit}
    >
      <StyledText>{props.frenchLevel}</StyledText>
    </StyledContainerLecture>
  ) : (
    <StyledContainerEdit
      isSelected={props.isSelected}
      disableEdit={props.disableEdit}
      onClick={() => props.onClick(props.frenchLevel)}
    >
      <StyledText>{props.frenchLevel}</StyledText>
    </StyledContainerEdit>
  );
