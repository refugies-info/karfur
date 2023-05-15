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
  WhyAccordions,
} from "components/Pages/homepage/Sections";
import API from "utils/API";
import { wrapper } from "services/configureStore";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import commonStyles from "scss/components/staticPages.module.scss";
import {
  ContentType,
  GetDispositifsResponse,
  GetStatisticsResponse,
  GetStructureStatisticsResponse,
  TranslationStatisticsResponse,
} from "api-types";
import { logger } from "logger";

interface Props {
  contentStatistics: GetStatisticsResponse;
  structuresStatistics: GetStructureStatisticsResponse;
  translationStatistics: TranslationStatisticsResponse;
  demarches: GetDispositifsResponse[];
  dispositifs: GetDispositifsResponse[];
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
        nbDemarches={props.contentStatistics.nbDemarches || 0}
        nbDispositifs={props.contentStatistics.nbDispositifs || 0}
        nbStructures={props.structuresStatistics.nbStructures || 0}
        demarches={props.demarches}
        dispositifs={props.dispositifs}
      />

      <WhyAccordions nbDemarches={props.contentStatistics.nbDemarches || 0} />

      <FreeResources />

      <HelpUs />

      <MainFigures
        nbVues={(props.contentStatistics.nbVues || 0) + (props.contentStatistics.nbVuesMobile || 0)}
        nbMercis={props.contentStatistics.nbMercis || 0}
        nbUpdatedRecently={props.contentStatistics.nbUpdatedRecently || 0}
      />

      <Community
        nbRedactors={props.translationStatistics.nbRedactors || 0}
        nbStructureAdmins={props.structuresStatistics.nbStructureAdmins || 0}
        nbCDA={props.structuresStatistics.nbCDA || 0}
        nbTranslators={props.translationStatistics.nbTranslators || 0}
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

  let translationStatistics: TranslationStatisticsResponse = {};
  let contentStatistics: GetStatisticsResponse = {};
  let structuresStatistics: GetStructureStatisticsResponse = {};

  try {
    contentStatistics = await API.getDispositifsStatistics({
      facets: ["nbMercis", "nbVues", "nbVuesMobile", "nbDispositifs", "nbDemarches", "nbUpdatedRecently"],
    });
    structuresStatistics = await API.getStructuresStatistics({
      facets: ["nbStructures", "nbCDA", "nbStructureAdmins"],
    });
    translationStatistics = await API.getTranslationStatistics({ facets: ["nbTranslators", "nbRedactors"] });
  } catch (e) {
    logger.error("[index] build page", e);
  }

  const demarches = await API.getDispositifs({
    type: ContentType.DEMARCHE,
    limit: 15,
    sort: "publishedAt",
    locale: locale || "fr",
  });
  const dispositifs = await API.getDispositifs({
    type: ContentType.DISPOSITIF,
    limit: 15,
    sort: "publishedAt",
    locale: locale || "fr",
  });

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      contentStatistics,
      structuresStatistics,
      translationStatistics,
      demarches,
      dispositifs,
    },
    revalidate: 60 * 10,
  };
});

export default Homepage;
