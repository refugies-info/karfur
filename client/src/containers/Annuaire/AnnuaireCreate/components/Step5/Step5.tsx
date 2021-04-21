import React, { useState } from "react";
import styled from "styled-components";
import { UserStructure } from "../../../../../types/interface";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import { Input } from "reactstrap";

interface Props {
  structure: UserStructure | null;
  setStructure: (arg: any) => void;
  setHasModifications: (arg: boolean) => void;
}

const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 800px;
  margin-top: 16px;
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
`;
const HelpHeader = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  width: 120px;
  color: #fbfbfb;
  margin-right: 16px;
`;

const HelpDescription = styled.div`
  line-height: 28px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  display: flex;
  felx: 1;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const IconContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 16px;
`;

const RemainingCaracters = styled.div`
  margin-top: 8px;
  align-self: flex-end;
  color: ${(props) => (props.caractersRemaining ? "#4CAF50" : "red")};
`;

const NB_CARACTERS_MAX = 1000;
export const Step5 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);
  const nbCaracters =
    props.structure && props.structure.description
      ? props.structure.description.length
      : 0;

  const nbCaractersRemaining = NB_CARACTERS_MAX - nbCaracters;

  const onChange = (e: any) => {
    // if too many caracters, don't save the new but possible to remove caracters
    if (nbCaractersRemaining > 0 || e.target.value.length < NB_CARACTERS_MAX) {
      props.setHasModifications(true);
      return props.setStructure({
        ...props.structure,
        [e.target.id]: e.target.value,
      });
    }
  };
  return (
    <MainContainer>
      {showHelp ? (
        <HelpContainer>
          <IconContainer onClick={() => setShowHelp(false)}>
            <EVAIcon name="close" />
          </IconContainer>
          <HelpHeader>Comment ça marche ?</HelpHeader>
          <HelpDescription>
            Rédigez un court paragraphe pour décrire votre structure : missions,
            valeurs, services, etc.
          </HelpDescription>
        </HelpContainer>
      ) : (
        <div style={{ marginTop: "24px" }} />
      )}
      <Title>Présentation de votre structure</Title>
      <Input
        type="textarea"
        placeholder="Rédigez un court paragraphe sur votre structure"
        rows={10}
        value={props.structure ? props.structure.description : ""}
        onChange={onChange}
        id="description"
      />
      <RemainingCaracters caractersRemaining={nbCaractersRemaining > 0}>
        {nbCaractersRemaining} caractères restants
      </RemainingCaracters>
    </MainContainer>
  );
};
