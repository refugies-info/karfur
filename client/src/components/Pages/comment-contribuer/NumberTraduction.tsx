import React from "react";
import styled from "styled-components";

const NumberTraductionContainer = styled.a`
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  width: ${(props) => props.width};
  margin-right: 32px;
`;
const NumberContainer = styled.div`
  background: #212121;
  border-radius: 12px;
  color: #ffffff;
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  padding: 8px 16px;
  margin-right: ${(props) => (props.isRTL ? "0px" : "8px")};
  margin-left: ${(props) => (props.isRTL ? "8px" : "0px")};
`;

interface Props {
  isRTL: boolean
  width: number
  amount: number
  text: string
}

const NumberTraduction = (props: Props) => (
  <NumberTraductionContainer width={props.width}>
    <NumberContainer isRTL={props.isRTL}>{props.amount}</NumberContainer>
    {props.text}
  </NumberTraductionContainer>
);

export default NumberTraduction
