import React from "react";
import styled from "styled-components";
import placeholder from "../../../../../assets/placeholder_annuaire.png";

interface Props {
  activity: string;
}

const CardContainer = styled.div`
  width: 180px;
  height: 180px;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  width: 150px;
`;
export const ActivityCard = (props: Props) => (
  <CardContainer>
    <ImageContainer>
      <img src={placeholder} />
    </ImageContainer>
    {props.activity}
  </CardContainer>
);
