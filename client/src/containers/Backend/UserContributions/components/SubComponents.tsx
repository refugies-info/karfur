import styled from "styled-components";
import { colors } from "../../../../colors";
import React, { useState } from "react";
import { limitNbCaracters } from "../../../../lib";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
import { getColorAndStatus } from "../../Admin/sharedComponents/SubComponents";

export const ContribContainer = styled.div`
  background: ${colors.lightGrey};
  border-radius: 12px;
  padding: 40px;
  margin-left: 100px;
  margin-right: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;

const Container = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) =>
    props.isDarkBackground ? colors.blancSimple : colors.darkColor};
  background-color: ${(props) =>
    props.isDarkBackground ? colors.darkColor : colors.blancSimple};
  padding: 8px;
  border-radius: 6px;
  width: fit-content;
  cursor: pointer;
  border: 1px solid ${colors.noir};
`;

export const TypeContenu = (props: {
  type: string;
  isDetailedVue: boolean;
}) => {
  const correctedType = props.type === "dispositif" ? "Dispositif" : "Démarche";
  const isDarkBackground = props.type === "dispositif" || props.isDetailedVue;
  return (
    <Container isDarkBackground={isDarkBackground}>{correctedType}</Container>
  );
};
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
`;

export const Responsabilite = (props: { responsable: string | null }) => {
  if (!props.responsable) return <div />;
  return (
    <RowContainer>
      <div style={{ marginBottom: "4px", marginRight: "8px" }}>
        <EVAIcon
          name={
            props.responsable === "Moi" ? "person-outline" : "briefcase-outline"
          }
          size="20"
          fill={colors.noir}
        />
      </div>
      {limitNbCaracters(props.responsable, 30)}
    </RowContainer>
  );
};

const ContribStyledStatusContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  box-shadow: ${(props) =>
    props.size === "large" ? "0px 4px 40px rgba(0, 0, 0, 0.25);" : ""};
  border-radius: ${(props) => (props.size === "large" ? "12px" : "6px")};
  padding: ${(props) => (props.size === "large" ? "15px" : "8px")};
  background-color: ${(props) => props.color};
  width: ${(props) => (props.size === "large" ? "fit-content" : "fit-content")};
  height: ${(props) => (props.size === "large" ? "54px" : "")};
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
  color: ${(props) => (props.textColor ? props.textColor : colors.blancSimple)};
`;

export const ContribStyledStatus = (props: { text: string; size?: string }) => {
  const [onMouseHover, setOnMouseHover] = useState(false);

  const { status, color, textColor } = getColorAndStatus(props.text);
  return (
    <div style={{ width: props.size === "large" ? "" : "120px" }}>
      <ContribStyledStatusContainer
        color={color}
        textColor={textColor}
        onMouseEnter={() => setOnMouseHover(true)}
        onMouseLeave={() => setOnMouseHover(false)}
        size={props.size}
      >
        {status}
        {onMouseHover && (
          <EVAIcon
            name={"question-mark-circle"}
            size="20"
            fill={textColor}
            className="ml-8"
          />
        )}
      </ContribStyledStatusContainer>
    </div>
  );
};

export const StatutHeader = (props: { onClick: () => void }) => {
  return (
    <RowContainer onClick={props.onClick}>
      Statut
      <EVAIcon
        name={"question-mark-circle-outline"}
        size="20"
        fill={colors.noir}
        className="ml-8"
      />
    </RowContainer>
  );
};
