import React from "react";
import styled from "styled-components";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 24px;
  margin-bottom: 24px;
`;
export const Step6 = () => (
  <>
    <Title>
      Vos informations sont désormais disponibles dans l’annuaire des acteurs de
      l’intégration.
    </Title>
    <FButton type="dark" name="eye-outline">
      Voir ma structure dans l'annuaire
    </FButton>
  </>
);
