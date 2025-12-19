import {
  ContentType,
  GetStatisticsResponse,
  GetStructureStatisticsResponse,
  SimpleDispositif,
  TranslationStatisticsResponse,
} from "@refugies-info/api-types";
import { Carrousel, isInBrowser, useWindowSize } from "@refugies-info/ui";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { END } from "redux-saga";
import { FreeResources, Hero, MobileApp, WhyAccordions } from "~/components/Pages/homepage/Sections";
import Newsletter from "~/components/Pages/homepage/Sections/Newsletter";
import StructuresLogos from "~/components/Pages/homepage/Sections/StructuresLogos";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import WorkTogether from "~/components/Pages/staticPages/common/WorkTogether";
import SEO from "~/components/Seo";
import DispositifCard from "~/components/UI/DispositifCard";
import { useRTL } from "~/hooks";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
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
  const isRTL = useRTL();

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
      <div hidden aria-hidden="true">
        <Link href="/sitemap" prefetch={false}>
          <span>sitemap</span>
        </Link>
      </div>
      <SEO
        title={
          isMobile
            ? t("Homepage.titleMobile", "L'information <br/> pour les personnes réfugiées en France").replace(
                "<br/>",
                "",
              )
            : t("Homepage.titleDesktop", "Le service public d’information pour les personnes réfugiées")
        }
        description={
          isMobile
            ? t("Homepage.subtitleMobile", "Des informations claires et traduites pour construire votre vie en France")
            : `${t("Homepage.subtitle1", "Des ressources claires et traduites")} ${t("Homepage.subtitle2", "pour accompagner les personnes réfugiées en France")}`
        }
      />
      <HelpNotice />

      <Hero targetArrow="themes" />

      {!isMobile && <StructuresLogos />}

      <Carrousel
        className="mb-20"
        dir={isRTL ? "rtl" : "ltr"}
        texts={{
          title: t("Homepage.infoTypeDemarche", "{{count}} démarches administratives expliquées", {
            count: props.contentStatistics.nbDemarches || 0,
          }),
          seeMore: t("Homepage.demarcheSeeAll", "Voir toutes les démarches"),
          prev: t("ui.carrouselPrev", "Faire défiler à gauche", { type: "demarche" }),
          next: t("ui.carrouselNext", "Faire défiler à droite", { type: "demarche" }),
          countSeparator: t("ui.countSeparator", "sur"),
        }}
        seeMoreUrl="/recherche?search=&sort=default&type=demarche"
      >
        {props.demarches.map((demarche, index) => (
          <DispositifCard key={index} dispositif={demarche} />
        ))}
      </Carrousel>

      <Carrousel
        className="mb-20"
        dir={isRTL ? "rtl" : "ltr"}
        texts={{
          title: t("Homepage.infoTypeDispositif", "{{count}} dispositifs dans toute la France", {
            count: props.contentStatistics.nbDispositifs || 0,
          }),
          seeMore: t("Homepage.dispositifSeeAll", "Voir tous les dispositifs"),
          prev: t("ui.carrouselPrev", "Faire défiler à gauche"),
          next: t("ui.carrouselNext", "Faire défiler à droite"),
          countSeparator: t("ui.countSeparator", "sur"),
        }}
        seeMoreUrl="/recherche?search=&sort=default&type=dispositif"
      >
        {props.dispositifs.map((dispositif, index) => (
          <DispositifCard key={index} dispositif={dispositif} />
        ))}
      </Carrousel>

      {!isMobile && <FreeResources />}

      <WhyAccordions nbDemarches={props.contentStatistics.nbDemarches || 0} />

      <MobileApp />

      <Newsletter />

      {!isMobile && <WorkTogether />}
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
