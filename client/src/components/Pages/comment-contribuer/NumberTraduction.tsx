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
  margin-right: ${(props: {isRTL: boolean}) => (props.isRTL ? "0px" : "8px")};
  margin-left: ${(props: {isRTL: boolean}) => (props.isRTL ? "8px" : "0px")};
`;

interface Props {
  isRTL: boolean
  amount: number
  text: string
  href?: string
}

const NumberTraduction = React.forwardRef((props: Props, ref: any) => (
  <NumberTraductionContainer ref={ref} href={props.href}>
    <NumberContainer isRTL={props.isRTL}>{props.amount}</NumberContainer>
    {props.text}
  </NumberTraductionContainer>
));

NumberTraduction.displayName = "NumberTraduction";


export default NumberTraduction
