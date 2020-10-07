import React, { useState } from "react";
import styled from "styled-components";
import { Structure } from "../../../../../@types/interface";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";

interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

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

const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 800px;
  padding: 16px;
  margin-bottom: 24px;
  position: relative;
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

const IconContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;

export const Step4 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);

  return (
    <MainContainer>
      <Title>Départements d'action</Title>
      {showHelp && (
        <HelpContainer>
          <IconContainer onClick={() => setShowHelp(false)}>
            <EVAIcon name="close" />
          </IconContainer>
          <HelpDescription>
            Si votre structure est présente sur beaucoup de départements, cochez
            le choix “France entière” puis créez une structure pour chacune de
            vos antennes territoriales.
          </HelpDescription>
        </HelpContainer>
      )}
    </MainContainer>
  );
};
