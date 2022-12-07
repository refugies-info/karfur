import React from "react";
import styled from "styled-components";
import Image from "next/legacy/image";
import { ThemeButton } from "components/UI/ThemeButton/ThemeButton";
import type { Theme } from "types/interface";
import placeholder from "assets/placeholder_annuaire.png";
import useRTL from "hooks/useRTL";

interface Props {
  activity: string;
  darkColor: string;
  lightColor: string;
  selectActivity: (arg: string) => void;
  isSelected: boolean;
  image: any | null;
  isLectureMode: boolean;
  t?: any;
  theme?: Theme;
}

interface CardContainerProps {
  isLectureMode: boolean
  isSelected: boolean
  lightColor: string
  darkColor: string
}
const CardContainer = styled.div`
  width: 200px;
  height: ${(props: CardContainerProps) => (props.isLectureMode ? "260px" : "220px")};
  background: ${(props: CardContainerProps) => (props.isSelected ? props.lightColor : "#ffffff")};
  border-color: ${(props: CardContainerProps) =>
    props.isSelected
      ? props.isLectureMode
        ? props.lightColor
        : props.darkColor
      : "#ffffff"};
  color: ${(props: CardContainerProps) => props.darkColor};

  border-radius: 12px;
  padding: 16px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-right: 8px;
  margin-left: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: ${(props: CardContainerProps) => !props.isLectureMode && "pointer"};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-width: 3px;
  border-style: solid;

  &:hover {
    background-color: ${(props: CardContainerProps) =>
      props.isSelected ? props.lightColor : "#ffffff"};
    color: ${(props: CardContainerProps) => props.darkColor};
    border-width: 3px;
    border-style: solid;
    border-color: ${(props: CardContainerProps) =>
      props.isLectureMode ? props.lightColor : props.darkColor};
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ActivityImage = styled(Image)`
  max-width: 144px;
  max-height: 100px;
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
  const isRTL = useRTL();

  return (
    <CardContainer
      lightColor={props.lightColor}
      darkColor={props.darkColor}
      onClick={() => props.selectActivity(props.activity)}
      isSelected={props.isSelected}
      isLectureMode={props.isLectureMode}
    >
      <ImageContainer>
        {!props.image && (
          <ActivityImage
            src={placeholder}
            alt="placeholder"
          />
        )}
        <div>
          {props.image && (
            <Image
              src={props.image}
              alt={props.activity}
              width={144}
              height={100}
              objectFit="contain"
            />
          )}
        </div>
      </ImageContainer>
      <Text>{props.activity}</Text>
      {props.isLectureMode && props.theme && (
        <ThemeButton isRTL={isRTL} theme={props.theme} />
      )}
    </CardContainer>
  );
};
