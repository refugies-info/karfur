import React, { useState } from "react";
import styled from "styled-components";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Tooltip } from "reactstrap";

interface Props {
  hasModifications: boolean;
}

const MainContainer = styled.div`
  width: 360px;
  background: ${(props: {hasModifications: boolean}) => (props.hasModifications ? "#ffe2b8" : "#BDF0C7")};
  border-radius: 12px;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: ${(props: {hasModifications: boolean}) => (props.hasModifications ? " #ff9800" : "#4CAF50")};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TextTooltip = styled.div`
  font-size: 16px;
  line-height: 20px;
`;

export const Modifications = (props: Props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const getText = () => {
    if (props.hasModifications) return "Modifications détectées !";
    return "Informations à jour et publiées";
  };

  return (
    <MainContainer hasModifications={props.hasModifications}>
      {getText()}
      <EVAIcon
        name="info"
        fill={props.hasModifications ? "#ff9800" : "#4CAF50"}
        id={"alt-tooltip"}
      />
      <Tooltip isOpen={tooltipOpen} target="alt-tooltip" toggle={toggleTooltip}>
        <TextTooltip>
          Cliquer sur Suivant pour sauvegarder et publier vos modifications.
        </TextTooltip>
      </Tooltip>
    </MainContainer>
  );
};
