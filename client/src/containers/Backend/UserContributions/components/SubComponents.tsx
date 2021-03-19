import styled from "styled-components";
import { colors } from "../../../../colors";
import React from "react";
import { limitNbCaracters } from "../../../../lib";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";

export const ContribContainer = styled.div`
  background: #edebeb;
  border-radius: 12px;
  padding: 40px;
  margin-left: 156px;
  margin-right: 156px;
  width: 100%;
  display: flex;
  flex-direction: column;
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
  border: 1px solid #212121;
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
