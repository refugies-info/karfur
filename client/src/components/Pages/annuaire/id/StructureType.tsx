import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  font-size: 16px;
  line-height: 20px;
  padding: 8px;
  width: fit-content;
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 8px;
`;

interface Props {
  type: string;
}
export const StructureType = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Container>
      {t("Annuaire." + props.type, props.type)}
    </Container>
  )
}
