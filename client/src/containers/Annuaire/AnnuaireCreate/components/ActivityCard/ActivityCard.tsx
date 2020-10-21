import React from "react";
import styled from "styled-components";
import placeholder from "../../../../../assets/placeholder_annuaire.png";
import "./ActivityCard.scss";

interface Props {
  activity: string;
  darkColor: string;
  lightColor: string;
  selectActivity: (arg: string) => void;
  isSelected: boolean;
  image: any | null;
}

const CardContainer = styled.div`
  width: 180px;
  height: 180px;
  background: ${(props) => (props.isSelected ? props.darkColor : "#ffffff")};
  border-color: ${(props) => (props.isSelected ? props.darkColor : "#ffffff")};
  color: ${(props) => (props.isSelected ? "#ffffff" : props.darkColor)};

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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-width: 3px;
  border-style: solid;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? props.darkColor : props.lightColor};
    color: ${(props) => (props.isSelected ? "#ffffff" : props.darkColor)};
    border-width: 3px;
    border-style: solid;
    border-color: ${(props) => props.darkColor};
  }
`;

const ImageContainer = styled.div`
  margin-bottom: 16px;
  max-width: 156px;
  max-height: 100px;
`;
export const ActivityCard = (props: Props) => (
  <CardContainer
    lightColor={props.lightColor}
    darkColor={props.darkColor}
    onClick={() => props.selectActivity(props.activity)}
    isSelected={props.isSelected}
  >
    <ImageContainer>
      {!props.image && <img src={placeholder} className="image" />}
      <div>{props.image && <props.image className="image" />}</div>
    </ImageContainer>
    {props.activity}
  </CardContainer>
);
