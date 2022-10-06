import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserFavoritesActionCreator,
  updateUserFavoritesActionCreator
} from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { userFavoritesSelector } from "services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import styled from "styled-components";
import { NoFavorites } from "./components/NoFavorites.component";
import { CardContainer, FavoritesContainer, CardsContainer } from "./components/SubComponents";
import { FrameModal } from "components/Modals";
import { TitleWithNumber } from "../middleOfficeSharedComponents";
import FButton from "components/UI/FButton/FButton";
import { FavoritesLoading } from "./components/FavoritesLoading";
import Navigation from "../Navigation";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import DemarcheCard from "components/Pages/recherche/DemarcheCard";
import DispositifCard from "components/Pages/recherche/DispositifCard";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-top: 26px;
  height: fit-content;
  margin-bottom: 42px;
`;

const TitleContainer = styled.div`
  margin-right: 40px;
  margin-left: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

interface Props {
  title: string;
}

const UserFavorites = (props: Props) => {
  const { t } = useTranslation();
  const [showTutoModal, setShowTutoModal] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const router = useRouter();
  const dispatch = useDispatch();
  const locale = router.locale || "fr";

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(fetchUserFavoritesActionCreator(locale));
    window.scrollTo(0, 0);
  }, [locale, dispatch]);

  const isLoadingFetch = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER_FAVORITES));
  const isLoadingUpdate = useSelector(isLoadingSelector(LoadingStatusKey.UPDATE_USER_FAVORITES));
  const isLoading = isLoadingFetch || isLoadingUpdate;

  const favorites = useSelector(userFavoritesSelector);

  if (isLoading)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Navigation selected="favoris" />
        <MainContainer>
          <FavoritesLoading t={t} />
        </MainContainer>
      </div>
    );

  const removeAllFavorites = () => {
    dispatch(
      updateUserFavoritesActionCreator({
        type: "remove-all",
        locale
      })
    );
  };

  if (favorites.length === 0)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Navigation selected="favoris" />
        <MainContainer>
          <NoFavorites t={t} toggleTutoModal={toggleTutoModal} />
          {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutoModal} section={"Mes favoris"} />}
        </MainContainer>
      </div>
    );
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Navigation selected="favoris" />
      <MainContainer>
        <FavoritesContainer>
          <TitleContainer>
            <TitleWithNumber
              amount={favorites.length}
              textSingular={t("UserFavorites.fiche sauvegardée", "fiche sauvegardée")}
              textPlural={t("UserFavorites.fiches sauvegardées", "fiches sauvegardées")}
            />
            <div>
              <FButton
                type="outline-black"
                name="trash-outline"
                onClick={removeAllFavorites}
                data-test-id="test-delete-button"
              >
                {t("UserFavorites.Tout supprimer", "Tout supprimer")}
              </FButton>
            </div>
          </TitleContainer>

          <CardsContainer>
            {favorites.map((fav, index) => (
              <CardContainer key={index}>
                {fav.typeContenu === "demarche" ? <DemarcheCard demarche={fav} /> : <DispositifCard dispositif={fav} />}
              </CardContainer>
            ))}
          </CardsContainer>
        </FavoritesContainer>
      </MainContainer>
    </div>
  );
};

export default UserFavorites;
