import styled from "styled-components";
import React, { useState } from "react";
import { colors } from "../../../../colors";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
import { SelectedPage } from "../Navigation.component";

const NavButtonContainer = styled.div`
  background: ${(props) => props.backgroundColor};
  border-radius: 12px;
  margin: 0px 5px 0px 5px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  color: ${(props) => props.textColor};
  padding: 16px;

  }
`;
interface NavButtonProps {
  title: string;
  iconName: string;
  isSelected: boolean;
  type: SelectedPage;
  onClick: () => void;
}
const baseWhite = {
  textColor: colors.noir,
  backgroundColor: colors.blancSimple,
};
const selectedWhite = {
  textColor: colors.blancSimple,
  backgroundColor: colors.noir,
};

const baseBlue = {
  textColor: colors.bleuCharte,
  backgroundColor: colors.blancSimple,
};
const selectedBlue = {
  textColor: colors.blancSimple,
  backgroundColor: colors.bleuCharte,
};

const baseRed = {
  textColor: colors.rouge,
  backgroundColor: colors.blancSimple,
};
const selectedRed = {
  textColor: colors.blancSimple,
  backgroundColor: colors.rouge,
};

const notWhiteTypes = ["admin", "logout"];
const getColors = (
  type: SelectedPage,
  isSelected: boolean,
  hoverType: SelectedPage | "none"
) => {
  if (!notWhiteTypes.includes(type)) {
    if (isSelected) {
      return selectedWhite;
    }
    if (type === hoverType) {
      return selectedWhite;
    }
    return baseWhite;
  }

  if (type === "admin") {
    if (isSelected) {
      return selectedBlue;
    }
    if (type === hoverType) {
      return selectedBlue;
    }
    return baseBlue;
  }

  if (isSelected) {
    return selectedRed;
  }
  if (type === hoverType) {
    return selectedRed;
  }
  return baseRed;
};

const getIconName = (
  iconName: string,
  isSelected: boolean,
  hoverType: SelectedPage | "none",
  type: SelectedPage
) => {
  if (isSelected) return iconName;
  if (hoverType === type) return iconName;
  return iconName + "-outline";
};
export const NavButton = (props: NavButtonProps) => {
  const [hoverType, setHoverType] = useState<SelectedPage | "none">("none");

  const onMouseEnter = (type: SelectedPage) => setHoverType(type);

  const onMouseLeave = () => setHoverType("none");

  const { textColor, backgroundColor } = getColors(
    props.type,
    props.isSelected,
    hoverType
  );

  const name = getIconName(
    props.iconName,
    props.isSelected,
    hoverType,
    props.type
  );

  return (
    <NavButtonContainer
      backgroundColor={backgroundColor}
      textColor={textColor}
      onMouseEnter={() => onMouseEnter(props.type)}
      onMouseLeave={onMouseLeave}
      onClick={props.onClick}
    >
      <EVAIcon name={name} fill={textColor} className={"mr-10"} />

      {props.title}
    </NavButtonContainer>
  );
};
