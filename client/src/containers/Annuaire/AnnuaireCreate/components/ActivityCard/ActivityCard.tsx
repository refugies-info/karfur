import React from "react";
import styled from "styled-components";
import placeholder from "../../../../../assets/placeholder_annuaire.png";
import "./ActivityCard.scss";
import { ThemeButton } from "../../../../../components/FigmaUI/ThemeButton/ThemeButton";
import i18n from "../../../../../i18n";
import { Tag } from "../../../../../types/interface";

interface Props {
  activity: string;
  darkColor: string;
  lightColor: string;
  selectActivity: (arg: string) => void;
  isSelected: boolean;
  image: any | null;
  isLectureMode: boolean;
  t?: any;
  tag?: Tag;
}

const CardContainer = styled.div`
  width: 200px;
  height: ${(props) => (props.isLectureMode ? "260px" : "220px")};
  background: ${(props) => (props.isSelected ? props.lightColor : "#ffffff")};
  border-color: ${(props) =>
    props.isSelected
      ? props.isLectureMode
        ? props.lightColor
        : props.darkColor
      : "#ffffff"};
  color: ${(props) => props.darkColor};

  border-radius: 12px;
  padding: 16px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-right: 8px;
  margin-left: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: ${(props) => !props.isLectureMode && "pointer"};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-width: 3px;
  border-style: solid;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? props.lightColor : "#ffffff"};
    color: ${(props) => props.darkColor};
    border-width: 3px;
    border-style: solid;
    border-color: ${(props) =>
      props.isLectureMode ? props.lightColor : props.darkColor};
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Text = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
  width: fit-content;
  flex-direction: column;
  text-align: center;
`;

export const ActivityCard = (props: Props) => {
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

  return (
    <CardContainer
      lightColor={props.lightColor}
      darkColor={props.darkColor}
      onClick={() => props.selectActivity(props.activity)}
      isSelected={props.isSelected}
      isLectureMode={props.isLectureMode}
    >
      <ImageContainer>
        {!props.image && <img src={placeholder} className="image" />}
        <div>{props.image && <img src={props.image} className="image" />}</div>
      </ImageContainer>
      <Text>{props.activity}</Text>
      {props.isLectureMode && props.tag && (
        <ThemeButton isRTL={isRTL} tag={props.tag} t={props.t} />
      )}
    </CardContainer>
  );
};
