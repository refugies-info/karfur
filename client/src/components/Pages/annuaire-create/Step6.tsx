import React from "react";
import styled from "styled-components";
import { ObjectId } from "mongodb";
import Link from "next/link";
import FButton from "components/FigmaUI/FButton/FButton";
import gif from "assets/annuaire/GIF-annuaire.gif";

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
      <img src={gif} style={{width: 700}} />
    </div>
    <Title>
      Vos informations sont désormais disponibles dans l’annuaire des acteurs de
      l’intégration.
    </Title>
    <Link href={`/annuaire/${props.structureId}`}>
      <FButton type="dark" name="eye-outline" tag="a">
        Voir ma structure dans l'annuaire
      </FButton>
    </Link>
  </div>
);