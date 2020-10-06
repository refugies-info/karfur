import React, { useState } from "react";
import styled from "styled-components";
import { Structure } from "../../../../../@types/interface";

const MainContainer = styled.div``;
const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 800px;
  height: 136px;
  margin-top: 24px;
  padding: 16px;
`;
const HelpHeader = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  width: 100px;
  color: #fbfbfb;
  align-items: flex-wrap;
  margin-right: 40px;
`;

const HelpDescription = styled.div`
  line-height: 28px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`;

interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

export const Step3 = (props: Props) => {
  return (
    <MainContainer>
      <HelpContainer>
        <HelpHeader>Comment ça marche ?</HelpHeader>
        <HelpDescription>
          <>
            Choisissez les <b> thèmes </b> correspondant à votre structure puis
            précisez quelles <b> activités </b> vous proposez au sein des thèmes
            choisis.
            <br />
            L’utilisateur pourra ainsi connaître et reconnaître les activités
            liées à l’intégration des personnes réfugiés.
          </>
        </HelpDescription>
      </HelpContainer>
    </MainContainer>
  );
};
