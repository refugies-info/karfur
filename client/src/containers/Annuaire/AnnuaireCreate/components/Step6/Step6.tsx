import React from "react";
import styled from "styled-components";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import gif from "../../../../../assets/annuaire/GIF-annuaire.gif";
import "./Step6.scss";
// import { NavLink } from "react-router-dom";
import { ObjectId } from "mongodb";

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 24px;
  margin-bottom: 24px;
  width: 700px;
`;

interface Props {
  structureId: string | ObjectId;
}
export const Step6 = (props: Props) => (
  <div className="step6">
    <div style={{ marginTop: "24px" }}>
      <img src={gif} className="gif" />
    </div>
    <Title>
      Vos informations sont désormais disponibles dans l’annuaire des acteurs de
      l’intégration.
    </Title>
    <NavLink to={`/annuaire/${props.structureId}`}>
      <FButton type="dark" name="eye-outline">
        Voir ma structure dans l'annuaire
      </FButton>
    </NavLink>
  </div>
);
