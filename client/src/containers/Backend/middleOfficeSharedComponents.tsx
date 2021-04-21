import React from "react";
import styled from "styled-components";

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 32px;
  align-items: flex-end;
`;
const NumberContainer = styled.div`
  background: #212121;
  border-radius: 12px;
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  color: #ffffff;
  padding: 8px 19px 8px 19px;
  margin: 0px 8px 0px 8px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  margin-bottom: 8px;
`;

interface Props {
  amount: number;
  textSingular: string;
  textPlural: string;
  isLoading?: boolean;
  textBefore?: string;
}
export const TitleWithNumber = (props: Props) => (
  <TitleContainer>
    <Title>{props.textBefore || "Vous avez"}</Title>
    <NumberContainer>{props.isLoading ? "..." : props.amount}</NumberContainer>
    <Title>
      {props.isLoading || props.amount < 2
        ? props.textSingular
        : props.textPlural}
    </Title>
  </TitleContainer>
);
