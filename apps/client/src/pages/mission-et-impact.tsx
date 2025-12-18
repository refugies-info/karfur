import type {
  GetStructureStatisticsResponse,
  TranslationStatisticsResponse,
} from "@refugies-info/api-types";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { END } from "redux-saga";
import HeroBack from "~/assets/staticPages/mission-et-impact/hero-back.svg";
import HeroMobile from "~/assets/staticPages/mission-et-impact/hero-illu-mobile.svg";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import { Anchor, SecondaryNavbar, Section } from "~/components/Pages/staticPages/common";
import WorkTogether from "~/components/Pages/staticPages/common/WorkTogether";
import {
  SectionContributors,
  SectionFigures,
  SectionImpact,
  SectionMission,
  SectionSteps,
  SectionTeam,
  SectionUsers,
} from "~/components/Pages/staticPages/mission-et-impact";
import SEO from "~/components/Seo";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { logger } from "~/logger";
import { wrapper } from "~/services/configureStore";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import API from "~/utils/API";

export type View = "mission" | "impact" | "users" | "figures" | "team" | "contributors" | "steps";

interface Props {
  structuresStatistics: GetStructureStatisticsResponse;
  translationStatistics: TranslationStatisticsResponse;
}

const MissionImpact = (props: Props) => {
  const { t } = useTranslation();

  // active links
  const [activeView, setActiveView] = useState<View | null>(null);
  const [refMission, inViewMission] = useInView({ threshold: 0 });
  const [refImpact, inViewImpact] = useInView({ threshold: 0.5 });
  const [refUsers, inViewUsers] = useInView({ threshold: 0.3 });
  const [refFigures, inViewFigures] = useInView({ threshold: 0.8 });
  const [refTeam, inViewHteam] = useInView({ threshold: 0.3 });
  const [refContributors, inViewContributors] = useInView({ threshold: 0.2 });
  const [refSteps, inViewSteps] = useInView({ threshold: 0.1 });

  useEffect(() => {
    const views: { inView: boolean; id: View }[] = [
      { inView: inViewMission, id: "mission" },
      { inView: inViewImpact, id: "impact" },
      { inView: inViewUsers, id: "users" },
      { inView: inViewFigures, id: "figures" },
      { inView: inViewHteam, id: "team" },
      { inView: inViewContributors, id: "contributors" },
      { inView: inViewSteps, id: "steps" },
    ];
    for (const view of views.reverse()) {
      if (view.inView) {
        setActiveView(view.id);
        return;
      }
    }
    setActiveView(null);
  }, [
    inViewMission,
    inViewImpact,
    inViewUsers,
    inViewFigures,
    inViewHteam,
    inViewContributors,
    inViewSteps,
  ]);

  return (
    <div className="w-full">
      <SEO title={t("MissionImpact.seoTitle", "Mission et impact - Réfugiés.info")} />
      <HelpNotice />

      <Section
        className="bg-action-low-blue-france bg-contain bg-bottom bg-no-repeat px-4 max-lg:!bg-none md:min-h-[520px]"
        style={{
          backgroundImage: `url(${HeroBack.src})`,
        }}
      >
        <div className="mx-auto md:max-w-[45rem] lg:max-w-[37.5rem] xl:max-w-[45rem]">
          <h1 className="!text-h1 md:!text-alt-title mb-6">{t("MissionImpact.title")}</h1>
          <p className="!text-chapo !mb-0">{t("MissionImpact.subtitle")}</p>
        </div>
        <Image src={HeroMobile} alt="" width={343} className="mx-auto mt-10 max-w-full lg:hidden" />
      </Section>

      <SecondaryNavbar
        leftLinks={[
          { id: "mission", text: t("MissionImpact.navbarItem1") },
          { id: "impact", text: t("MissionImpact.navbarItem2") },
          { id: "users", text: t("MissionImpact.navbarItem3") },
          { id: "figures", text: t("MissionImpact.navbarItem4") },
          { id: "team", text: t("MissionImpact.navbarItem5") },
          { id: "contributors", text: t("MissionImpact.navbarItem6") },
          { id: "steps", text: t("MissionImpact.navbarItem7") },
        ]}
        rightLink={{
          id: "",
          href: "https://kit.refugies.info/stats/",
          iconId: "fr-icon-line-chart-line",
          text: t("MissionImpact.navbarItem8"),
        }}
        activeView={activeView}
      />
      <div ref={refMission} className="relative">
        <Anchor id="mission" />
        <SectionMission />
      </div>

      <div ref={refImpact} className="relative">
        <Anchor id="impact" />
        <SectionImpact />
      </div>

      <div ref={refUsers} className="relative">
        <Anchor id="users" />
        <SectionUsers />
      </div>

      <div ref={refFigures} className="relative">
        <Anchor id="figures" />
        <SectionFigures />
      </div>

      <div ref={refTeam} className="relative">
        <Anchor id="team" />
        <SectionTeam />
      </div>

      <div ref={refContributors} className="relative">
        <Anchor id="contributors" />
        <SectionContributors
          nbRedactors={props.translationStatistics.nbRedactors || 0}
          nbStructureAdmins={props.structuresStatistics.nbStructureAdmins || 0}
          nbCDA={props.structuresStatistics.nbCDA || 0}
          nbTranslators={props.translationStatistics.nbTranslators || 0}
        />
      </div>

      <div ref={refSteps} className="relative">
        <Anchor id="steps" />
        <SectionSteps />
      </div>

      <WorkTogether />
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const action = fetchThemesActionCreator();
  store.dispatch(action);
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  let translationStatistics: TranslationStatisticsResponse = {};
  let structuresStatistics: GetStructureStatisticsResponse = {};

  try {
    structuresStatistics = await API.getStructuresStatistics({
      facets: ["nbCDA", "nbStructureAdmins"],
    });
    translationStatistics = await API.getTranslationStatistics({
      facets: ["nbTranslators", "nbRedactors"],
    });
  } catch (e) {
    logger.error("[index] build page", e);
  }

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      structuresStatistics,
      translationStatistics,
    },
    revalidate: 60 * 10,
  };
});

export default MissionImpact;
