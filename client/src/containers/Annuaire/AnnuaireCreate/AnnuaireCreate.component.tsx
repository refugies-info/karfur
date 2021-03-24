import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { AnnuaireGauge } from "./AnnuaireGauge/AnnuaireGauge";
import { Step1 } from "./components/Step1/Step1";
import { Step2 } from "./components/Step2/Step2";
import { Step3 } from "./components/Step3/Step3";
import { Step4 } from "./components/Step4/Step4";
import { Step5 } from "./components/Step5/Step5";
import { Step6 } from "./components/Step6/Step6";
import { Spinner } from "reactstrap";
import { FrameModal } from "../../../components/Modals";
import img from "../../../assets/annuaire/annuaire_create.svg";
import { Modifications } from "./components/Modifications";
import {
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
  setUserStructureActionCreator,
} from "../../../services/UserStructure/userStructure.actions";
import { useDispatch, useSelector } from "react-redux";
import { userStructureIdSelector } from "../../../services/User/user.selectors";
import { userStructureSelector } from "../../../services/UserStructure/userStructure.selectors";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { UserStructure } from "../../../types/interface";

declare const window: Window;
interface Props {
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

const LoaderContainer = styled.div`
  diplay: flex;
  flex: 1;
  margin-top: 200px;
  margin-left: 300px;
`;
const HeaderContainer = styled.div`
  background-image: url(${img});
  width: 360px;
  height: 600px;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-right: 40px;
  margin-bottom: 8px;
`;

const LeftTitleContainer = styled.div`
  background: #ffffff;
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  padding-right: 16px;
  padding-left: 16px;
  width: fit-content;
  margin-bottom: 13px;
  padding-bottom: 8px;
  padding-top: 8px;
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
  justify-content: space-between;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 112px;
`;
const LeftContainer = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 112px;
  margin-bottom: 24px;
  height: 650px;
  margin-top: 112px;
`;

export const AnnuaireCreateComponent = (props: Props) => {
  const [step, setStep] = useState(1);
  const [showTutoModal, setShowTutoModal] = useState(false);
  const [hasModifications, setHasModifications] = useState(false);

  const dispatch = useDispatch();
  const structureId = useSelector(userStructureIdSelector);
  const structure = useSelector(userStructureSelector);
  const isLoadingFetch = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE)
  );
  const isLoadingUpdate = useSelector(
    isLoadingSelector(LoadingStatusKey.UPDATE_USER_STRUCTURE)
  );
  const isLoading = isLoadingUpdate || isLoadingFetch;

  const toggleTutorielModal = () => setShowTutoModal(!showTutoModal);

  const getStepDescription = () => {
    if (step === 1) return "Vérification de l'identité de votre structure";
    if (step === 2) return "Sites et réseaux";
    if (step === 3) return "Activités";
    if (step === 5) return "Description";
    if (step > 5) return "Bien joué !";
    return "";
  };

  const updateStructure = () => {
    dispatch(updateUserStructureActionCreator({ modifyMembres: false }));
  };

  const setStructure = (structure: UserStructure) => {
    dispatch(setUserStructureActionCreator(structure));
  };

  useEffect(() => {
    const loadUserStructure = async () => {
      if (structureId) {
        await dispatch(
          fetchUserStructureActionCreator({ structureId, shouldRedirect: true })
        );
      }
    };
    loadUserStructure();
  }, [dispatch, structureId]);

  const onStepValidate = () => {
    updateStructure();
    setStep(step + 1);
    setHasModifications(false);
    window.scrollTo(0, 0);
  };

  const onBackClick = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // at the begining we do not show modifications
  const showModifications = step !== 1 || hasModifications;

  return (
    <MainContainer>
      <LeftContainer>
        <HeaderContainer>
          <div>
            <LeftTitleContainer>Annuaire</LeftTitleContainer>
            {step !== 4 && (
              <StepDescription>{getStepDescription()}</StepDescription>
            )}
            {step === 4 && (
              <StepDescription>
                Contacts <br /> et infos pratiques
              </StepDescription>
            )}
          </div>
          <ButtonContainer>
            <FButton
              type="tuto"
              name={"play-circle-outline"}
              onClick={toggleTutorielModal}
            />
            <div>
              {step === 1 ? (
                <FButton
                  type={"white"}
                  name="close-outline"
                  onClick={() =>
                    props.history.push("/backend/user-dash-structure")
                  }
                >
                  Quitter
                </FButton>
              ) : (
                <FButton
                  type={"white"}
                  name="arrow-back-outline"
                  onClick={onBackClick}
                >
                  Retour
                </FButton>
              )}

              {step < 6 ? (
                isLoading ? (
                  <FButton
                    type={"validate"}
                    className="ml-8"
                    onClick={onStepValidate}
                    disabled={true}
                  >
                    <Spinner className="mr-8" size="sm" />
                    Suivant
                  </FButton>
                ) : (
                  <FButton
                    type={"validate"}
                    name="arrow-forward-outline"
                    className="ml-8"
                    onClick={onStepValidate}
                    disabled={isLoading}
                  >
                    Suivant
                  </FButton>
                )
              ) : (
                <FButton
                  type={"validate"}
                  name="done-all-outline"
                  className="ml-8"
                  onClick={() =>
                    props.history.push("/backend/user-dash-structure")
                  }
                >
                  Terminer
                </FButton>
              )}
            </div>
          </ButtonContainer>
        </HeaderContainer>
        {showModifications && hasModifications && (
          <Modifications hasModifications={hasModifications} />
        )}
      </LeftContainer>

      <RightContainer>
        {!isLoading && (
          <>
            <AnnuaireGauge step={step} />
            {step === 1 && (
              <Step1
                structure={structure}
                setStructure={setStructure}
                setHasModifications={setHasModifications}
              />
            )}
            {step === 2 && (
              <Step2
                structure={structure}
                setStructure={setStructure}
                setHasModifications={setHasModifications}
              />
            )}
            {step === 3 && (
              <Step3
                structure={structure}
                setStructure={setStructure}
                setHasModifications={setHasModifications}
              />
            )}

            {step === 4 && (
              <Step4
                structure={structure}
                setStructure={setStructure}
                setHasModifications={setHasModifications}
              />
            )}
            {step === 5 && (
              <Step5
                structure={structure}
                setStructure={setStructure}
                setHasModifications={setHasModifications}
              />
            )}
            {step === 6 && (
              <Step6 structureId={structure ? structure._id : ""} />
            )}
          </>
        )}
        {isLoading && (
          <LoaderContainer>
            <Spinner />
          </LoaderContainer>
        )}
      </RightContainer>
      {showTutoModal && (
        <FrameModal
          show={showTutoModal}
          toggle={toggleTutorielModal}
          section={"Annuaire"}
        />
      )}
    </MainContainer>
  );
};
