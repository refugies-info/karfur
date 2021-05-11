import React from "react";
import styled from "styled-components";
import { colors } from "../../../colors";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

interface Props {
  name: string;
  t: (a: string, b: string) => void;
  fill: string;
  title: string;
  defaultTitle: string;
  color: string;
  isDisabled: boolean;
  onClick: (e: any) => void;
}

const ButtonContainer = styled.div`
  display:flex;
  width: 100%;
  justify-content:center;
  padding:20px
  text-align: center;
  border-radius: 12px;
  margin: auto;
  align-items:center;
  background-color: ${(props) =>
    props.isDisabled ? colors.grey : props.backgroundColor};
  font-size:16px;
  color:${(props) => props.color};
  font-weight:700;
  cursor:pointer;
`;

const IconContainer = styled.div`
  margin-right: 10px;
`;

export const FButtonMobile = (props: Props) => (
  <ButtonContainer
    onClick={props.isDisabled ? null : props.onClick}
    isDisabled={props.isDisabled}
    backgroundColor={props.color}
    color={props.fill}
  >
    <IconContainer>
      <EVAIcon name={props.name} fill={props.fill} size={"large"} />
    </IconContainer>

    {props.t(props.title, props.defaultTitle)}
  </ButtonContainer>
);
