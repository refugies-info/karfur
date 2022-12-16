import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";
import {
  AllThemes,
  Community,
  FreeResources,
  HelpUs,
  Hero,
  Infos,
  MainFigures,
  MobileApp,
  NewContent,
  WhyAccordions
} from "components/Pages/homepage/Sections";
import API from "utils/API";
import { wrapper } from "services/configureStore";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { DispositifStatistics, StructuresStatistics, TranslationStatistics } from "types/interface";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import commonStyles from "scss/components/staticPages.module.scss";

interface Props {
  contentStatistics: DispositifStatistics;
  structuresStatistics: StructuresStatistics;
  translationStatistics: TranslationStatistics;
}

const Homepage = (props: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchNeedsActionCreator());
  }, [dispatch]);

  useEffect(() => {
    if (isInBrowser() && new URLSearchParams(window.location.search).get("newsletter") === "") {
      dispatch(toggleNewsletterModalAction(true));
    }
  }, [dispatch]);

  return (
    <div className={commonStyles.main}>
      <SEO title="Accueil" description={t("Homepage.title")} />

      <Hero targetArrow="themes" />

      <AllThemes id="themes" />

      <MobileApp />

      <NewContent
        nbDemarches={props.contentStatistics.nbDemarches}
        nbDispositifs={props.contentStatistics.nbDispositifs}
        nbStructures={props.structuresStatistics.nbStructures}
      />

      <WhyAccordions nbDemarches={props.contentStatistics.nbDemarches} />

      <FreeResources />

      <HelpUs />

      <MainFigures
        nbVues={props.contentStatistics.nbVues + props.contentStatistics.nbVuesMobile}
        nbMercis={props.contentStatistics.nbMercis}
        nbUpdatedRecently={props.contentStatistics.nbUpdatedRecently}
      />

      <Community
        nbRedactors={props.translationStatistics.nbRedactors}
        nbStructureAdmins={props.structuresStatistics.nbStructureAdmins}
        nbCDA={props.structuresStatistics.nbCDA}
        nbTranslators={props.translationStatistics.nbTranslators}
      />

      <Infos />
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const action = fetchThemesActionCreator();
  store.dispatch(action);
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  const contentStatistics = (await API.getDispositifsStatistics()).data.data;
  const structuresStatistics = (await API.getStructuresStatistics()).data.data;
  const translationStatistics = (await API.getTranslationStatistics()).data.data;

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      contentStatistics,
      structuresStatistics,
      translationStatistics
    },
    revalidate: 60 * 10
  };
});

export default Homepage;
