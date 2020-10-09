import React, { useState } from "react";
import styled from "styled-components";
import { CustomCheckBox } from "../CustomCheckBox/CustomCheckBox";
import { OpeningHours } from "../../../../../@types/interface";

interface Props {
  day: string;
  onClick: (day: string) => void;
  openingHours: OpeningHours[];
}

const MainContainer = styled.div`
  background: ${(props) => (props.isDayChecked ? "#DEF7C2" : "#f2f2f2")};
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
  cursor: pointer;
`;
const Text = styled.div`
  color: #828282;
  margin-left: 4px;
`;
export const HoursDetails = (props: Props) => {
  const isDayChecked =
    props.openingHours.filter((element) => element.day === props.day).length >
    0;

  return (
    <MainContainer
      onClick={() => props.onClick(props.day)}
      isDayChecked={isDayChecked}
    >
      <CustomCheckBox checked={isDayChecked} />
      {`${props.day} `}
      <Text>de à </Text>
    </MainContainer>
  );
};
