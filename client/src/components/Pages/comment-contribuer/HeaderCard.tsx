import React from "react";
import styled from "styled-components";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import SVGIcon from "components/UI/SVGIcon/SVGIcon";
import { icon_France } from "assets/figma/index";

const CardContainer = styled.div`
width: 200px;
height: 200px;
background-color: #ffffff;
border-radius: 12px;
display: flex;
flex-direction: column;
justify-content: space-between;
padding-bottom: 20px;
padding-right: 20px;
padding-left: 20px;
padding-top: 10px;
font-weight: bold;
font-size: 40px;
line-height: 51px;
cursor: pointer;
border: 4px solid #ffffff;

&:hover {
  border: 4px solid #212121;
}
`;
const IconContainer = styled.div`
  align-self: flex-end;
  margin: 0px;
  padding: 0px;
`;

interface Props {
  title: string
  eva?: boolean
  iconName?: string
}

const HeaderCard = (props: Props) => (
  <CardContainer>
    <IconContainer>
      {props.eva ? (
        <EVAIcon name={props.iconName} size="xlarge" fill="#212121" />
      ) : props.iconName === "icon_France" ? (
        <img src={icon_France} alt="icon_france" />
      ) : (
        <SVGIcon name="translate" fill="#212121" width="40px" height="40px" />
      )}
    </IconContainer>
    {props.title}
  </CardContainer>
);

export default HeaderCard;
