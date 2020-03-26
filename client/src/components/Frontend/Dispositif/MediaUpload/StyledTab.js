import React from "react";
import styled from "styled-components";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";

const StyledButton = styled.button`
  display: flex;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  background-color: ${props => (props.selected ? "black" : "#f2f2f2")};
  border-width: 0;
  font-weight: bold;
  flex-grow: 1;
  width: 90%;
  align-items: center;
  flex-direction: row;
`;

const StyledText = styled.p`
  align-self: center;
  margin-bottom: 0;
  margin: 10px;
  color: ${props => (props.selected ? "white" : "black")};
`;

const StyledTab = ({ ...props }) => {
  return(
  <StyledButton {...props}>
    <EVAIcon name={props.icon} fill={'#bdbdbd'} />
    <StyledText {...props}>{props.title}</StyledText>
  </StyledButton>
  );
};

export default StyledTab;
