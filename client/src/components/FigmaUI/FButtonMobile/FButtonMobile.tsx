import React from "react";
import styled from "styled-components";

import EVAIcon from "../../UI/EVAIcon/EVAIcon";

interface Props {
  name: string;
  t: (a: string, b: string) => void;
  fill: string;
  title: string;
  defaultTitle: string;
  color: string;
  disabled: boolean;
  onClick: (e: any) => void;
}

const ButtonContainer = styled.div`
display:flex;
  width: 100%;
  justify-content:center;
  padding:14px
  text-align: center;
  height: 52px;
  border-radius: 12px;
  margin: auto;
 align-items:center;
  background-color: ${(props) => props.backgroundColor};
  font-size:16px;
  color:${(props) => props.color};
  font-weight:700;

`;
const Icon = styled.div`
  margin-right: 10px;
`;

export const FButtonMobile = (props: Props) => {
  return (
    <ButtonContainer
      onClick={props.onClick}
      backgroundColor={props.color}
      color={props.fill}
    >
      <Icon>
        <EVAIcon name={props.name} fill={props.fill} size={"large"} />
      </Icon>

      {props.t(props.title, props.defaultTitle)}
    </ButtonContainer>
  );
};
