import React, { useState, useEffect } from "react";
import { Props } from "./AnnuaireCreate.container";
import styled from "styled-components";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { AnnuaireGauge } from "./AnnuaireGauge/AnnuaireGauge";
import { Step1 } from "./components/Step1/Step1";
import { Step2 } from "./components/Step2/Step2";
import { Step3 } from "./components/Step3/Step3";
import { Step4 } from "./components/Step4/Step4";

export interface PropsBeforeInjection {
  history: any;
}
const MainContainer = styled.div`
  background: #fbfbfb;
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
  margin-top: 112px;
`;
export const AnnuaireCreateComponent = (props: Props) => {
  const [step, setStep] = useState(3);

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

  const getStepDesciption = () => {
    if (step === 1) return "Vérification de l'identité de votre structure";
    if (step === 2) return "Sites et réseaux";
    if (step === 3) return "Thèmes et activités";
    if (step === 4) return "Contacts et info pratique";
    if (step === 5) return "Description";
    if (step > 5) return "Bien joué !";
    return "";
  };

  useEffect(() => {
    if (props.isLoading === false) {
      return checkUserIsContribOrRespo();
    }
  });

  const onStepValidate = () => {
    props.updateStructure();
    setStep(step + 1);
  };

  if (props.isLoading) {
    return <div>isLoading</div>;
  }
  return (
    <MainContainer>
      <LeftContainer>
        <div>
          <LeftTitleContainer>Annuaire</LeftTitleContainer>
          <StepDescription>{getStepDesciption()}</StepDescription>
        </div>
        <ButtonContainer>
          <FButton
            type="tuto"
            name={"play-circle-outline"}
            className="mr-12"
            // onClick={() => this.props.toggleTutorielModal("Tags")}
          />
          <FButton
            type={"white"}
            name="close-outline"
            className="ml-12"
            onClick={() => props.history.push("/backend/user-dash-structure")}
          >
            Quitter
          </FButton>

          <FButton
            type={"validate"}
            name="arrow-forward-outline"
            className="ml-12"
            onClick={onStepValidate}
          >
            Suivant
          </FButton>
        </ButtonContainer>
      </LeftContainer>
      <RightContainer>
        <AnnuaireGauge step={step} />
        {step === 1 && (
          <Step1
            structure={props.structure}
            setStructure={props.setStructure}
          />
        )}
        {step === 2 && (
          <Step2
            structure={props.structure}
            setStructure={props.setStructure}
          />
        )}
        {step === 3 && (
          <Step3
            structure={props.structure}
            setStructure={props.setStructure}
          />
        )}

        {step === 4 && (
          <Step4
            structure={props.structure}
            setStructure={props.setStructure}
          />
        )}
      </RightContainer>
    </MainContainer>
  );
};
