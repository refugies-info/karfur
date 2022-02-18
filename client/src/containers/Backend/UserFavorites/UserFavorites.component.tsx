import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
} from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { userFavoritesSelector } from "services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import styled from "styled-components";
import SearchResultCard from "components/Pages/advanced-search/SearchResultCard";
import { Props } from "../UserProfile/UserProfile.container";
import { NoFavorites } from "./components/NoFavorites.component";
import {
  CardContainer,
  FavoritesContainer,
  CardsContainer,
} from "./components/SubComponents";
import { FrameModal } from "components/Modals";
import { TitleWithNumber } from "../middleOfficeSharedComponents";
import { IUserFavorite } from "types/interface";
import FButton from "components/FigmaUI/FButton/FButton";
import { FavoritesLoading } from "./components/FavoritesLoading";
import { Navigation } from "../Navigation";
import { useRouter } from "next/router";
declare const window: Window;

export interface PropsBeforeInjection {
}

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
export const UserFavoritesComponent = (props: Props) => {
  const [showTutoModal, setShowTutoModal] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const router = useRouter();
  const dispatch = useDispatch();
  const locale = router.locale || "fr";

  useEffect(() => {
    dispatch(fetchUserFavoritesActionCreator(locale));
    window.scrollTo(0, 0);
  }, [locale]);

  const isLoadingFetch = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_FAVORITES)
  );
  const isLoadingUpdate = useSelector(
    isLoadingSelector(LoadingStatusKey.UPDATE_USER_FAVORITES)
  );
  const isLoading = isLoadingFetch || isLoadingUpdate;

  const favorites = useSelector(userFavoritesSelector);

  if (isLoading)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Navigation selected="favoris" />
        <MainContainer>
          <FavoritesLoading t={props.t} />
        </MainContainer>
      </div>
    );

  const pinnedList = favorites.map((favorite) => favorite._id);
  const removePinnedDispositif = (e: any, dispositif: IUserFavorite) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(
      updateUserFavoritesActionCreator({
        type: "remove",
        dispositifId: dispositif._id,
        locale,
      })
    );
  };

  const removeAllFavorites = () => {
    dispatch(
      updateUserFavoritesActionCreator({
        type: "remove-all",
        locale,
      })
    );
  };

  if (favorites.length === 0)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Navigation selected="favoris" />
        <MainContainer>
          <NoFavorites t={props.t} toggleTutoModal={toggleTutoModal} />
          {showTutoModal && (
            <FrameModal
              show={showTutoModal}
              toggle={toggleTutoModal}
              section={"Mes favoris"}
            />
          )}
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
              textSingular={props.t(
                "UserFavorites.fiche sauvegardée",
                "fiche sauvegardée"
              )}
              textPlural={props.t(
                "UserFavorites.fiches sauvegardées",
                "fiches sauvegardées"
              )}
            />
            <div>
              <FButton
                type="outline-black"
                name="trash-outline"
                onClick={removeAllFavorites}
                testID="test-delete-button"
              >
                {props.t("UserFavorites.Tout supprimer", "Tout supprimer")}
              </FButton>
            </div>
          </TitleContainer>

          <CardsContainer>
            {favorites.map((fav) => (
              <CardContainer key={fav._id}>
                <SearchResultCard
                  //@ts-ignore
                  pin={removePinnedDispositif}
                  pinnedList={pinnedList}
                  dispositif={fav}
                  showPinned={true}
                />
              </CardContainer>
            ))}
          </CardsContainer>
        </FavoritesContainer>
      </MainContainer>
    </div>
  );
};
