import React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  border-radius: 8px;
  width: 36px;
  height: 36px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: ${(props) => (props.isSelected ? "25" : props.index)};
  cursor: pointer;
  background: #ffffff;
  color: ${(props) =>
    props.isSelected ? "#212121" : props.isOneSelected ? "#C6C6C6" : "#212121"};
  margin: 4px;
  &:hover {
    background: #212121;
    color: #ffffff;
  }
`;

interface Props {
  letter: string;
  index: number;
  isOneSelected: boolean;
  // onLetterClick: (arg: string) => void;
  isSelected: boolean;
}

export const Letter = (props: Props) => (
  <MainContainer
    index={props.index}
    // onClick={() => props.onLetterClick(props.letter)}
    isSelected={props.isSelected}
    isOneSelected={props.isOneSelected}
  >
    {props.letter.toUpperCase()}
  </MainContainer>
);
