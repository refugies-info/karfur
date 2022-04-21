import React from "react";
import styled from "styled-components";
import { colors } from "../../../../colors";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";

const MainContainer = styled.div`
  background: ${(props: {state: string}) =>
    props.state === "selected"
      ? colors.focus
      : props.state === "current"
      ? colors.grey2
      : colors.white};
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.state === "selected" ? colors.focus : colors.gray90};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px;
  margin: 4px 0px 4px 0px;
  cursor: pointer;
  color: ${(props) =>
    props.state === "selected" ? colors.white : colors.gray90};
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const getTitle = (role: "Rédacteur" | "Responsable") => {
  if (role === "Rédacteur") return "Nommer « rédacteur » ";
  return "Nommer « responsable »";
};

interface Props {
  role: "Rédacteur" | "Responsable";
  onRoleSelect: (role: "Rédacteur" | "Responsable") => void;
  state: "selected" | "current" | "none";
}
export const Role = (props: Props) => (
  <MainContainer
    onClick={() => props.onRoleSelect(props.role)}
    state={props.state}
    // @ts-ignore
    testid={"test-role-" + props.role}
  >
    <Row>
      <Title>{getTitle(props.role)}</Title>

      <EVAIcon
        name={
          "radio-button-" +
          (["selected", "current"].includes(props.state) ? "on" : "off")
        }
        fill={props.state === "selected" ? colors.white : colors.gray90}
      />
    </Row>
    Éditer et valider les fiches <br />
    Accepter les fiches proposées à ma structure <br />
    Voir les réactions aux fiches de ma structure <br />
    Compléter la fiche annuaire de ma structure <br />
    {props.role === "Responsable" && (
      <>
        <span>
          {"+ Ajouter ou supprimer d'autres membres"}
          <br />
        </span>
        <span>
          {"+ Nommer d'autres responsables"}
          <br />
        </span>
      </>
    )}
  </MainContainer>
);
