/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
} from "../../../services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import i18n from "../../../i18n";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { userFavoritesSelector } from "../../../services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import styled from "styled-components";
import SearchResultCard from "../../AdvancedSearch/SearchResultCard";
import { Props } from "../UserProfile/UserProfile.container";
import { NoFavorites } from "./components/NoFavorites.component";
import {
  CardContainer,
  FavoritesContainer,
  CardsContainer,
} from "./components/SubComponents";
import { FrameModal } from "../../../components/Modals";
import { TitleWithNumber } from "../middleOfficeSharedComponents";
import { IUserFavorite } from "../../../types/interface";

export interface PropsBeforeInjection {
  t: any;
}

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-top: 42px;
  height: fit-content;
  margin-bottom: 42px;
`;
export const UserFavoritesComponent = (props: Props) => {
  const [showTutoModal, setShowTutoModal] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const dispatch = useDispatch();
  const locale = i18n.language;

  useEffect(() => {
    dispatch(fetchUserFavoritesActionCreator(locale));
  }, [locale]);

  const isLoadingFetch = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_FAVORITES)
  );
  const isLoadingUpdate = useSelector(
    isLoadingSelector(LoadingStatusKey.UPDATE_USER_FAVORITES)
  );
  const isLoading = isLoadingFetch || isLoadingUpdate;

  const favorites = useSelector(userFavoritesSelector);

  if (isLoading) return <div>loading </div>;

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

  if (favorites.length === 0)
    return (
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
    );
  return (
    <MainContainer>
      <FavoritesContainer>
        <div style={{ marginRight: "40px", marginLeft: "40px" }}>
          <TitleWithNumber
            amount={favorites.length}
            textSingular={props.t(
              "UserFavorites.fiches sauvegardée",
              "fiches sauvegardée"
            )}
            textPlural={props.t(
              "UserFavorites.fiches sauvegardées",
              "fiches sauvegardées"
            )}
          />
        </div>
        <CardsContainer>
          {favorites.map((fav) => (
            <CardContainer key={fav._id}>
              <SearchResultCard
                //@ts-ignore
                pin={removePinnedDispositif}
                pinnedList={pinnedList}
                dispositif={fav}
                themeList={null}
                showPinned={true}
              />
            </CardContainer>
          ))}
        </CardsContainer>
      </FavoritesContainer>
    </MainContainer>
  );
};
