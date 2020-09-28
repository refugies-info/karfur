import React, { useState, useEffect } from "react";
import { Props } from "./AnnuaireCreate.container";
import styled from "styled-components";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { AnnuaireGauge } from "./AnnuaireGauge/AnnuaireGauge";

export interface PropsBeforeInjection {
  history: any;
}
const MainContainer = styled.div`
  background: #e5e5e5;
  display: flex;
  flex: 1;
  margin-top: -75px;
  padding-left: 120px;
  padding-right: 120px;
`;

const LeftContainer = styled.div`
  background: #0421b1;
  width: 360px;
  height: 600px;
  border-radius: 12px;
  margin-top: 112px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-right: 40px;
`;

const LeftTitleContainer = styled.div`
  background: #ffffff;
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  padding-right: 16px;
  padding-left: 16px;
  width: 202px;
  margin-bottom: 13px;
`;

const StepDescription = styled.div`
  font-weight: bold;
  font-size: 52px;
  line-height: 66px;
  color: #ffffff;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
export const AnnuaireCreateComponent = (props: Props) => {
  const checkUserIsContribOrRespo = () => {
    const structureMembers = props.structure ? props.structure.membres : [];
    const userInStructure = structureMembers.filter(
      (member) => member.userId === props.userId
    );
    if (userInStructure.length === 0) {
      return props.history.push("/");
    }
    const isUserRedacteurOrRespo = userInStructure
      ? userInStructure[0].roles.filter(
          (role) => role === "administrateur" || role === "contributeur"
        ).length > 0
      : null;
    if (!isUserRedacteurOrRespo) {
      return props.history.push("/");
    }
  };

  useEffect(() => {
    if (props.isLoading === false) {
      return checkUserIsContribOrRespo();
    }
  });

  if (props.isLoading) {
    return <div>isLoading</div>;
  }
  return (
    <MainContainer>
      <LeftContainer>
        <div>
          <LeftTitleContainer>Annuaire</LeftTitleContainer>
          <StepDescription>
            Vérification de l'identité de votre structure
          </StepDescription>
        </div>
        <ButtonContainer>
          <FButton
            type="tuto"
            name={"play-circle-outline"}
            className="mr-12"
            // onClick={() => this.props.toggleTutorielModal("Tags")}
          />
          <FButton type={"white"} name="close-outline" className="ml-12">
            Quitter
          </FButton>

          <FButton
            type={"validate"}
            name="arrow-forward-outline"
            className="ml-12"
          >
            Suivant
          </FButton>
        </ButtonContainer>
      </LeftContainer>
      <RightContainer>
        <AnnuaireGauge step={1} />
      </RightContainer>
    </MainContainer>
  );
};
