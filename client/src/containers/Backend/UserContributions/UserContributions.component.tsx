import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserContributionsActionCreator } from "../../../services/UserContributions/userContributions.actions";
import { userContributionsSelector } from "../../../services/UserContributions/userContributions.selectors";
import {
  userStructureDisposAssociesSelector,
  userStructureNameSelector,
} from "../../../services/UserStructure/userStructure.selectors";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { formatContributions } from "./functions";
import styled from "styled-components";
import { NoContribution } from "./components/NoContribution";
import { FrameModal } from "../../../components/Modals";
import { ContribContainer } from "./components/SubComponents";
import { TitleWithNumber } from "../middleOfficeSharedComponents";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { NavHashLink } from "react-router-hash-link";
import { UserContribTable } from "./components/UserContribTable";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-top: 42px;
  height: fit-content;
  margin-bottom: 42px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const WhiteContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  padding: 32px;
`;

export const UserContributionsComponent = () => {
  const [showTutoModal, setShowTutoModal] = useState(false);
  const [tutoModalDisplayed, setTutoModalDisplayed] = useState("");
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const dispatch = useDispatch();

  const userContributions = useSelector(userContributionsSelector);
  const userStructureContributions = useSelector(
    userStructureDisposAssociesSelector
  );
  const userStructureName = useSelector(userStructureNameSelector);
  const isLoadingUserContrib = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS)
  );
  const isLoadingUserStructureContrib = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE)
  );
  const isLoading = isLoadingUserContrib || isLoadingUserStructureContrib;

  useEffect(() => {
    dispatch(fetchUserContributionsActionCreator());
  }, []);

  const contributions = formatContributions(
    userContributions,
    userStructureContributions,
    userStructureName
  );

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (contributions.length === 0)
    return (
      <MainContainer>
        <NoContribution
          toggleTutoModal={toggleTutoModal}
          setTutoModalDisplayed={setTutoModalDisplayed}
        />
        {showTutoModal && (
          <FrameModal
            show={showTutoModal}
            toggle={toggleTutoModal}
            section={"Mes fiches"}
          />
        )}
      </MainContainer>
    );
  return (
    <MainContainer>
      <ContribContainer>
        <TitleContainer>
          <TitleWithNumber
            amount={contributions.length}
            textPlural="fiches."
            textSingular="fiche."
            textBefore="Vous avez rédigé"
          />
          <div>
            <FButton
              type="tuto"
              name="video-outline"
              className="mr-8"
              onClick={() => {
                setTutoModalDisplayed("Mes fiches");
                toggleTutoModal();
              }}
            >
              Explications
            </FButton>
            <FButton
              tag={NavHashLink}
              to="/comment-contribuer#ecrire"
              type="dark"
              name="file-add-outline"
            >
              Créer une nouvelle fiche
            </FButton>
          </div>
        </TitleContainer>
        <WhiteContainer>
          <UserContribTable
            contributions={contributions}
            toggleTutoModal={toggleTutoModal}
            setTutoModalDisplayed={setTutoModalDisplayed}
          />
        </WhiteContainer>
      </ContribContainer>
      {showTutoModal && (
        <FrameModal
          show={showTutoModal}
          toggle={toggleTutoModal}
          section={tutoModalDisplayed}
        />
      )}
    </MainContainer>
  );
};
