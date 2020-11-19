import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 360px;
  background: blue;
  margin-right: 0px;
  overflow: scroll;
  height: ${(props) => props.height}px;
`;

const Test = styled.div`
  width: 200px;
  height: 200px;
  background: red;
  margin-top: 50px;
  margin-bottom: 50px;
`;
interface Props {
  leftPartHeight: number;
}
export const RightAnnuaireDetails = (props: Props) => (
  <Container height={props.leftPartHeight}>
    <Test />
    <Test />
    <Test />
    <Test />
    <Test />
  </Container>
);
