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
import { DispositifStatistics, SearchDispositif, StructuresStatistics, TranslationStatistics } from "types/interface";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import commonStyles from "scss/components/staticPages.module.scss";
import { createStateContext } from "react-use";
import AppLoader from "components/Layout/AppLoader";

export const [useLoadingContext, LoadingContextProvider] = createStateContext(false);

interface Props {
  contentStatistics: DispositifStatistics;
  structuresStatistics: StructuresStatistics;
  translationStatistics: TranslationStatistics;
  demarches: SearchDispositif[];
  dispositifs: SearchDispositif[];
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
    <LoadingContextProvider>
      <AppLoader>
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
      </AppLoader>
    </LoadingContextProvider>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const action = fetchThemesActionCreator();
  store.dispatch(action);
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  const contentStatistics = (
    await API.getDispositifsStatistics([
      "nbMercis",
      "nbVues",
      "nbVuesMobile",
      "nbDispositifs",
      "nbDemarches",
      "nbUpdatedRecently"
    ])
  ).data.data;
  const structuresStatistics = (await API.getStructuresStatistics(["nbStructures", "nbCDA", "nbStructureAdmins"])).data
    .data;
  const translationStatistics = (await API.getTranslationStatistics(["nbTranslators", "nbRedactors"])).data.data;

  const demarches = (
    await API.getDispositifs({
      query: { status: "Actif", typeContenu: "demarche" },
      limit: 15,
      sort: "publishedAt",
      locale: locale
    })
  ).data.data;
  const dispositifs = (
    await API.getDispositifs({
      query: { status: "Actif", typeContenu: "dispositif" },
      limit: 15,
      sort: "publishedAt",
      locale: locale
    })
  ).data.data;

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      contentStatistics,
      structuresStatistics,
      translationStatistics,
      demarches,
      dispositifs
    },
    revalidate: 60 * 10
  };
});

export default Homepage;
