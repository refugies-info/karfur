import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { getLanguageFromLocale } from "lib/getLanguageFromLocale";

import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { selectedStructureSelector } from "services/SelectedStructure/selectedStructure.selector";
import { userSelector } from "services/User/user.selectors";
import { fetchSelectedStructureActionCreator } from "services/SelectedStructure/selectedStructure.actions";
import { wrapper } from "services/configureStore";

import { LeftAnnuaireDetail } from "components/Pages/annuaire/id/LeftAnnuaireDetail";
import { MiddleAnnuaireDetail } from "components/Pages/annuaire/id/MiddleAnnuaireDetails";
import { RightAnnuaireDetails } from "components/Pages/annuaire/id/RightAnnuaireDetails";
import SEO from "components/Seo";

import styles from "scss/pages/annuaire-id.module.scss";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";

interface Props {
  history: string[];
}

const AnnuaireDetail = (props: Props) => {
  const structure = useSelector(selectedStructureSelector);
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_STRUCTURE)) && !structure;
  const user = useSelector(userSelector);

  const [isMember, setIsMember] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const structureId = router.query.id as string;

  const locale = router.locale || "fr";
  const [currentLoadedLocale, setCurrentLoadedLocale] = useState(locale);

  // Reload structure if locale change
  useEffect(() => {
    if ((structureId && currentLoadedLocale !== locale) || !structure?.membres) {
      dispatch(
        fetchSelectedStructureActionCreator({
          id: structureId as string,
          locale,
        }),
      );
      setCurrentLoadedLocale(locale);
    }
  }, [dispatch, locale, currentLoadedLocale, structureId, structure]);

  useEffect(() => {
    setIsMember(!!structure && !!structure.membres && !!structure.membres.find((el) => el.userId === user.userId));
  }, [structure, user.userId]);

  return (
    <div className={styles.container}>
      <SEO />
      <div className={styles.content}>
        <LeftAnnuaireDetail structure={structure} isLoading={isLoading} history={props.history} />

        <MiddleAnnuaireDetail structure={structure} isLoading={isLoading} isMember={isMember} />
        {!isLoading && structure && <RightAnnuaireDetails dispositifsAssocies={structure.dispositifsAssocies} />}
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query, locale }) => {
  if (query.id) {
    const action = fetchSelectedStructureActionCreator({
      id: query.id as string,
      locale: !locale || locale === "default" ? "fr" : locale,
      token: req.cookies.authorization,
    });
    store.dispatch(action);
    store.dispatch(fetchThemesActionCreator());
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default AnnuaireDetail;
