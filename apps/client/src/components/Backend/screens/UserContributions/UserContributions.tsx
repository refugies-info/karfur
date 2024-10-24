import { Id } from "@refugies-info/api-types";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import TitleWithNumber from "~/components/Backend/TitleWithNumber";
import { FrameModal } from "~/components/Modals";
import WriteContentModal from "~/components/Modals/WriteContentModal/WriteContentModal";
import FButton from "~/components/UI/FButton/FButton";
import { useUser } from "~/hooks";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/LoadingStatus/loadingStatus.selectors";
import {
  deleteDispositifActionCreator,
  fetchUserContributionsActionCreator,
} from "~/services/UserContributions/userContributions.actions";
import { userContributionsSelector } from "~/services/UserContributions/userContributions.selectors";
import { fetchUserStructureActionCreator } from "~/services/UserStructure/userStructure.actions";
import {
  userStructureDisposAssociesSelector,
  userStructureSelector,
} from "~/services/UserStructure/userStructure.selectors";
import { colors } from "~/utils/colors";
import { NoContribution } from "./components/NoContribution";
import { ContribContainer } from "./components/SubComponents";
import { UserContribTable } from "./components/UserContribTable";
import { formatContributions } from "./functions";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-top: 26px;
  height: fit-content;
  margin-bottom: 42px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const WhiteContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  width: 100%;
  padding: 20px;
`;
interface Props {
  history: any;
  title: string;
}
const UserContributions = (props: Props) => {
  const [showTutoModal, setShowTutoModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [tutoModalDisplayed, setTutoModalDisplayed] = useState("");
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const dispatch = useDispatch();

  const userContributions = useSelector(userContributionsSelector);
  const userStructureContributions = useSelector(userStructureDisposAssociesSelector);
  const isLoadingUserContrib = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
  const isLoadingUserStructureContrib = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE));
  const isLoading = isLoadingUserContrib || isLoadingUserStructureContrib;
  const userStructure = useSelector(userStructureSelector);

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (hasInitiallyLoaded) return;

    const fetchData = async () => {
      dispatch(fetchUserContributionsActionCreator());
      if (userStructure) {
        dispatch(
          fetchUserStructureActionCreator({
            structureId: userStructure._id,
            shouldRedirect: false,
          }),
        );
      }
      window.scrollTo(0, 0);
      setHasInitiallyLoaded(true);
    };

    if (!isLoading) {
      fetchData();
    }
  }, [dispatch, userStructure, isLoading, hasInitiallyLoaded]);

  const { user } = useUser();

  const contributions = formatContributions(
    userContributions,
    userStructureContributions,
    userStructure,
    user?.user?._id,
    !!user?.admin,
  );

  const deleteDispositif = (event: any, dispositifId: Id, isAuthorizedToDelete: boolean) => {
    event.stopPropagation();
    if (!isAuthorizedToDelete) {
      return;
    }
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "La suppression d'un dispositif est irréversible",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.value) {
        dispatch(deleteDispositifActionCreator(dispositifId));
        Swal.fire({
          title: "Yay...",
          text: "Le dispositif a été supprimé",
          icon: "success",
          timer: 1500,
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <MainContainer>
          <ContribContainer>
            <TitleWithNumber
              amount={0}
              textPlural="fiches."
              textSingular="fiche."
              isLoading={true}
              textBefore="Vous avez rédigé"
            />
            <Skeleton count={3} height={50} />
          </ContribContainer>
        </MainContainer>
      </div>
    );
  }

  if (contributions.length === 0)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <MainContainer>
          <NoContribution
            toggleTutoModal={toggleTutoModal}
            toggleWriteModal={() => setShowWriteModal(true)}
            setTutoModalDisplayed={setTutoModalDisplayed}
          />
          {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutoModal} section={"Mes fiches"} />}
        </MainContainer>
        <WriteContentModal show={showWriteModal} close={() => setShowWriteModal(false)} />
      </div>
    );
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                className="me-2"
                onClick={() => {
                  setTutoModalDisplayed("Mes fiches");
                  toggleTutoModal();
                }}
              >
                Explications
              </FButton>
              <FButton onClick={() => setShowWriteModal(true)} type="dark" name="file-add-outline">
                Créer une nouvelle fiche
              </FButton>
            </div>
          </TitleContainer>
          <WhiteContainer>
            <UserContribTable
              contributions={contributions}
              toggleTutoModal={toggleTutoModal}
              setTutoModalDisplayed={setTutoModalDisplayed}
              deleteDispositif={deleteDispositif}
              isAdmin={user.admin}
            />
          </WhiteContainer>
        </ContribContainer>
        {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutoModal} section={tutoModalDisplayed} />}
      </MainContainer>
      <WriteContentModal show={showWriteModal} close={() => setShowWriteModal(false)} />
    </div>
  );
};

export default UserContributions;
