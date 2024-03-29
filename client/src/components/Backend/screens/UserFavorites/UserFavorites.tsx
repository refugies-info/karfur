import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
} from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { userFavoritesSelector } from "services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import { NoFavorites } from "./components/NoFavorites.component";
import { FrameModal } from "components/Modals";
import TitleWithNumber from "components/Backend/TitleWithNumber";
import FButton from "components/UI/FButton/FButton";
import DemarcheCard from "components/UI/DemarcheCard";
import DispositifCard from "components/UI/DispositifCard";
import Toast from "components/UI/Toast";
import { FavoritesLoading } from "./components/FavoritesLoading";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import styles from "./UserFavorites.module.scss";

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
  const favorites = useSelector(userFavoritesSelector);
  const isLoading = useMemo(
    () => (isLoadingFetch || isLoadingUpdate) && favorites.length === 0,
    [isLoadingFetch, isLoadingUpdate, favorites.length],
  );

  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const removeAllFavorites = () => {
    setShowDeleteToast(true);
    dispatch(
      updateUserFavoritesActionCreator({
        type: "remove-all",
        locale,
      }),
    );
  };

  return (
    <>
      {isLoading ? (
        <FavoritesLoading t={t} />
      ) : favorites.length === 0 ? (
        <NoFavorites t={t} toggleTutoModal={toggleTutoModal} />
      ) : (
        <>
          <div className={styles.container}>
            <div className={styles.title}>
              <TitleWithNumber
                amount={favorites.length}
                textSingular={t("UserFavorites.content_saved", "fiche sauvegardée")}
                textPlural={t("UserFavorites.contents_saved", "fiches sauvegardées")}
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
            </div>

            <div className={styles.cards}>
              {favorites.map((fav, index) => (
                <div key={index}>
                  {fav.typeContenu === "demarche" ? (
                    <DemarcheCard demarche={fav} />
                  ) : (
                    <DispositifCard dispositif={fav} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {showDeleteToast && <Toast close={() => setShowDeleteToast(false)}>Vos favoris ont été supprimés</Toast>}
      {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutoModal} section={"Mes favoris"} />}
    </>
  );
};

export default UserFavorites;
