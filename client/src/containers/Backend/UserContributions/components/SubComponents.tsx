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
  color: ${(props: { isDarkBackground: boolean }) => (props.isDarkBackground ? colors.white : colors.gray90)};
  background-color: ${(props: { isDarkBackground: boolean }) =>
    props.isDarkBackground ? colors.gray90 : colors.white};
  padding: 8px;
  border-radius: 6px;
  width: fit-content;
  cursor: default;
  border: 1px solid ${colors.gray90};
`;

export const TypeContenu = (props: { type: string; isDetailedVue: boolean }) => {
  const correctedType = props.type === "dispositif" ? "Dispositif" : "Démarche";
  const isDarkBackground = props.type === "dispositif" || props.isDetailedVue;
  return <Container isDarkBackground={isDarkBackground}>{correctedType}</Container>;
};
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  cursor: default;
`;

export const Responsabilite = (props: { responsable: string | null }) => {
  if (!props.responsable) return <div />;
  return (
    <RowContainer>
      <div style={{ marginBottom: "4px", marginRight: "8px" }}>
        <EVAIcon
          name={props.responsable === "Moi" ? "person-outline" : "briefcase-outline"}
          size={20}
          fill={colors.gray90}
        />
      </div>
      {limitNbCaracters(props.responsable, 30)}
    </RowContainer>
  );
};

interface ContribStyledStatusContainerProps {
  size?: string;
  textColor?: string;
  color: string;
}
const ContribStyledStatusContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  border-radius: ${(props: ContribStyledStatusContainerProps) => (props.size === "large" ? "12px" : "6px")};
  padding: ${(props: ContribStyledStatusContainerProps) => (props.size === "large" ? "15px" : "8px")};
  background-color: ${(props: ContribStyledStatusContainerProps) => props.color};
  width: ${(props: ContribStyledStatusContainerProps) => (props.size === "large" ? "fit-content" : "fit-content")};
  height: ${(props: ContribStyledStatusContainerProps) => (props.size === "large" ? "54px" : "")};
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
  color: ${(props: ContribStyledStatusContainerProps) => (props.textColor ? props.textColor : colors.white)};
`;

export const ContribStyledStatus = (props: {
  text: string;
  textToDisplay?: string;
  size?: string;
  isAdmin?: boolean;
}) => {
  const [onMouseHover, setOnMouseHover] = useState(false);

  const { status, color, textColor } = getColorAndStatus(props.text, props.isAdmin);
  return (
    <div style={{ width: props.size === "large" ? "" : "120px" }}>
      <ContribStyledStatusContainer
        color={color}
        textColor={textColor}
        onMouseEnter={() => setOnMouseHover(true)}
        onMouseLeave={() => setOnMouseHover(false)}
        size={props.size}
      >
        {props.textToDisplay || status}
        {onMouseHover && <EVAIcon name={"question-mark-circle"} size={20} fill={textColor} className="ms-2" />}
      </ContribStyledStatusContainer>
    </div>
  );
};

export const StatutHeader = (props: { onClick: () => void }) => {
  return (
    <RowContainer onClick={props.onClick}>
      Statut
      <EVAIcon name={"question-mark-circle-outline"} size={20} fill={colors.gray90} className="ms-2" />
    </RowContainer>
  );
};
