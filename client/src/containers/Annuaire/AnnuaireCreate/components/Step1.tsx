import React from "react";
import styled from "styled-components";
import FInput from "../../../../components/FigmaUI/FInput/FInput";
import { Structure } from "../../../../@types/interface";

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 16px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 24px;
`;

interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

export const Step1 = (props: Props) => {
  const onChange = (e: any) =>
    props.setStructure({ ...props.structure, [e.target.id]: e.target.value });

  return (
    <MainContainer>
      <Title>Nom d'affichage</Title>
      <div style={{ marginBottom: "16px" }}>
        <FInput
          id="nom"
          placeholder={"test"}
          value={props.structure && props.structure.nom}
          onChange={onChange}
        />
      </div>
      <Title>Acronyme</Title>
      <div style={{ marginBottom: "16px" }}>
        <FInput
          id="acronyme"
          placeholder={"test"}
          value={props.structure && props.structure.acronyme}
          onChange={onChange}
        />
      </div>
      <Title>Logo</Title>
    </MainContainer>
  );
};
