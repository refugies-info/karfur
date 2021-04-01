/* eslint-disable no-console */
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
  &:hover {
    background: ${(props) => props.textColor};
    color: ${(props) => props.backgroundColor};
  }
`;
interface NavButtonProps {
  title: string;
  iconName: string;
  isSelected: boolean;
  type: SelectedPage;
}
export const NavButton = (props: NavButtonProps) => {
  const [hoverType, setHoverType] = useState("none");

  const onMouseEnter = (type: SelectedPage) => setHoverType(type);
  const onMouseLeave = () => setHoverType("none");
  console.log("hover", hoverType);

  const name = props.isSelected ? props.iconName : props.iconName + "-outline";
  const backgroundColor = props.isSelected ? colors.noir : colors.blancSimple;
  const textColor = props.isSelected ? colors.blancSimple : colors.noir;
  return (
    <NavButtonContainer
      backgroundColor={backgroundColor}
      textColor={textColor}
      onMouseEnter={() => onMouseEnter(props.type)}
      onMouseLeave={onMouseLeave}
    >
      <EVAIcon name={name} fill={textColor} className={"mr-10"} />
      {props.title}
    </NavButtonContainer>
  );
};
