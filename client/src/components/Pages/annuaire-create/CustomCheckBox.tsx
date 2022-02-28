import React from "react";
import styled from "styled-components";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

const MainContainer = styled.div`
  width: 20px;
  height: 20px;
  background: ${(props: {checked: boolean}) => (props.checked ? "#4CAF50" : "#ffffff")};
  border: 1px solid #cdcdcd;
  border-color: ${(props: {checked: boolean}) => (props.checked ? "#4CAF50" : "#cdcdcd")};
  box-sizing: border-box;
  border-radius: 3px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

interface Props {
  checked: boolean;
  onClick?: () => void;
}

export const CustomCheckBox = (props: Props) => (
  <MainContainer checked={props.checked} onClick={props.onClick}>
    {props.checked && <EVAIcon name="checkmark" />}
  </MainContainer>
);
