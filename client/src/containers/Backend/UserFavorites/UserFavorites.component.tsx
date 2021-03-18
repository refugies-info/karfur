/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavoritesActionCreator } from "../../../services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import i18n from "../../../i18n";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { userFavoritesSelector } from "../../../services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import styled from "styled-components";
import SearchResultCard from "../../AdvancedSearch/SearchResultCard";
import { Props } from "../UserProfile/UserProfile.container";
import { NoFavorites } from "./components/NoFavorites.component";
import { CardContainer } from "./components/SubComponents";
import { FrameModal } from "../../../components/Modals";

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

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_FAVORITES)
  );

  const favorites = useSelector(userFavoritesSelector);
  // eslint-disable-next-line no-console
  console.log("favorites", favorites);
  if (isLoading) return <div>loading </div>;

  const pinnedList = favorites.map((favorite) => favorite._id);

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
    <div>
      Favoris
      {favorites.map((fav) => (
        <CardContainer key={fav._id}>
          <SearchResultCard
            // @ts-ignore
            pin={() => {}}
            pinnedList={pinnedList}
            dispositif={fav}
            themeList={null}
            showPinned={true}
          />
        </CardContainer>
      ))}
    </div>
  );
};
