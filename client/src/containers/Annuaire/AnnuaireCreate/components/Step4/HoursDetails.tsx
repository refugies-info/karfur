import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  day: string;
}

const MainContainer = styled.div`
  background: #f2f2f2;
  border-radius: 12px;
  padding: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
`;
const Text = styled.div`
  color: #828282;
`;
export const HoursDetails = (props: Props) => (
  <MainContainer>
    <input
      //   onChange={handleCheckboxChange}
      type="checkbox"
      checked={false}
      className="mr-8"
    />
    {`${props.day} `} <Text>{" de à"}</Text>
  </MainContainer>
);
