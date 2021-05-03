import styled from "styled-components";
import React, { useState } from "react";
import { colors } from "../../../../colors";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
import { SelectedPage } from "../Navigation.component";
import traductionIcon from "../../../../assets/icon_traduction.svg";
import traductionIconBlanc from "../../../../assets/icon_traduction_blanc.svg";
import "./NavButton.scss";
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
`;
interface NavButtonProps {
  title: string;
  iconName: string;
  isSelected: boolean;
  type: SelectedPage;
  onClick: () => void;
  t: any;
  nbNewNotifications: number;
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

  const getTitle = (
    type: SelectedPage,
    title: string,
    nbNewNotifications: number
  ) => {
    if (type === "admin") return title;
    if (type === "notifications")
      return (
        props.t("Toolbar." + props.title, props.title) +
        " (" +
        nbNewNotifications +
        ")"
      );
    return props.t("Toolbar." + props.title, props.title);
  };

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
      {props.type !== "traductions" && (
        <EVAIcon name={name} fill={textColor} className={"mr-10"} />
      )}
      {props.type === "traductions" &&
        !props.isSelected &&
        hoverType !== "traductions" && (
          <img src={traductionIcon} alt="a" className={"icon-traduction"} />
        )}
      {props.type === "traductions" &&
        (props.isSelected || hoverType === "traductions") && (
          <img
            src={traductionIconBlanc}
            alt="a"
            className={"icon-traduction"}
          />
        )}
      {getTitle(props.type, props.title, props.nbNewNotifications)}
    </NavButtonContainer>
  );
};
