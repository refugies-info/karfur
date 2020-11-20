import React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  border-radius: 12px 12px 0px 0px;
  width: 48px;
  height: 44px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: ${(props) => (props.isSelected ? "25" : props.index)};
  cursor: pointer;
  background: ${(props) => (props.isSelected ? "#212121" : "#ffffff")};
  color: ${(props) => (props.isSelected ? "#ffffff" : "#212121")};

  &:hover {
    background: #212121;
    color: #ffffff;
  }
`;

interface Props {
  letter: string;
  index: number;
  onLetterClick: (arg: string) => void;
  isSelected: boolean;
}

export const Letter = (props: Props) => (
  <MainContainer
    index={props.index}
    onClick={() => props.onLetterClick(props.letter)}
    isSelected={props.isSelected}
  >
    {props.letter.toUpperCase()}
  </MainContainer>
);
