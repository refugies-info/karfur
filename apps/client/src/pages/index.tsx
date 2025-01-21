import {
  ContentType,
  GetStatisticsResponse,
  GetStructureStatisticsResponse,
  SimpleDispositif,
  TranslationStatisticsResponse,
} from "@refugies-info/api-types";
import { CardSlider, CardSliderHeader, CardSliderWrapper } from "@refugies-info/ui";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { END } from "redux-saga";
import {
  FreeResources,
  Hero,
  Infos,
  MainFigures,
  MobileApp,
  WhyAccordions,
} from "~/components/Pages/homepage/Sections";
import StructuresLogos from "~/components/Pages/homepage/Sections/StructuresLogos";
import SEO from "~/components/Seo";
import { useWindowSize } from "~/hooks";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import isInBrowser from "~/lib/isInBrowser";
import { Event } from "~/lib/tracking";
import commonStyles from "~/scss/components/staticPages.module.scss";
import { wrapper } from "~/services/configureStore";
import { toggleNewsletterModalAction } from "~/services/Miscellaneous/miscellaneous.actions";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import API from "~/utils/API";

export interface Props {
  contentStatistics: GetStatisticsResponse;
  structuresStatistics: GetStructureStatisticsResponse;
  translationStatistics: TranslationStatisticsResponse;
  demarches: SimpleDispositif[];
  dispositifs: SimpleDispositif[];
}

const Homepage = (props: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    dispatch(fetchNeedsActionCreator());
  }, [dispatch]);

  useEffect(() => {
    if (isInBrowser() && new URLSearchParams(window.location.search).get("newsletter") === "") {
      dispatch(toggleNewsletterModalAction(true));
      Event("NEWSLETTER", "open modal", "url param");
    }
  }, [dispatch]);

  return (
    <div className={commonStyles.main}>
      <SEO title="Accueil" description={t("Homepage.title")} />

      <Hero targetArrow="themes" />

      {!isMobile && <StructuresLogos />}

      {/* <ContentSlider
        nbDemarches={props.contentStatistics.nbDemarches || 0}
        nbDispositifs={props.contentStatistics.nbDispositifs || 0}
        nbStructures={props.structuresStatistics.nbStructures || 0}
        demarches={props.demarches}
        dispositifs={props.dispositifs}
      /> */}

      <CardSliderWrapper>
        <CardSliderHeader>
          <h2 className="!text-[2rem]">{`{${112}}`} démarches adminstratives expliquées</h2>
        </CardSliderHeader>
        <CardSlider>
          {[...Array(30)].map((_, index) => (
            <div key={index} className="w-[300px] bg-red-500">
              huhu
            </div>
          ))}
        </CardSlider>
      </CardSliderWrapper>

      <MobileApp />

      <WhyAccordions nbDemarches={props.contentStatistics.nbDemarches || 0} />

      <FreeResources />

      <MainFigures
        nbVues={(props.contentStatistics.nbVues || 0) + (props.contentStatistics.nbVuesMobile || 0)}
        nbMercis={props.contentStatistics.nbMercis || 0}
        nbUpdatedRecently={props.contentStatistics.nbUpdatedRecently || 0}
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
    sort: "nbVues",
    locale: locale || "fr",
  });
  const dispositifs = await API.getDispositifs({
    type: ContentType.DISPOSITIF,
    limit: 15,
    sort: "nbVues",
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
