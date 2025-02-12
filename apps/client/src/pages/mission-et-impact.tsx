import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CommunityIlluAmbassadeurs from "~/assets/staticPages/mission-et-impact/community-ambassadeurs.png";
import CommunityIlluCda from "~/assets/staticPages/mission-et-impact/community-cda.png";
import CommunityIlluDinum from "~/assets/staticPages/mission-et-impact/community-dinum.png";
import CommunityIlluDispositifs from "~/assets/staticPages/mission-et-impact/community-dispositifs.png";
import CommunityIlluExperts from "~/assets/staticPages/mission-et-impact/community-experts.png";
import CommunityIlluInfluenceurs from "~/assets/staticPages/mission-et-impact/community-influenceurs.png";
import CommunityIlluPartenaires from "~/assets/staticPages/mission-et-impact/community-partenaires.png";
import CommunityIlluTesteurs from "~/assets/staticPages/mission-et-impact/community-testeurs.png";
import CommunityIlluTraducteurs from "~/assets/staticPages/mission-et-impact/community-traducteurs.png";
import HeroBack from "~/assets/staticPages/mission-et-impact/hero-back.svg";
import HeroMobile from "~/assets/staticPages/mission-et-impact/hero-illu-mobile.svg";
import IconAdministration from "~/assets/staticPages/mission-et-impact/icon-administration.svg";
import IconAgir from "~/assets/staticPages/mission-et-impact/icon-agir.png";
import IconOperators from "~/assets/staticPages/mission-et-impact/icon-operators.png";
import IconStructure from "~/assets/staticPages/mission-et-impact/icon-structure.svg";
import IconTranslator from "~/assets/staticPages/mission-et-impact/icon-translator.svg";
import IconTs from "~/assets/staticPages/mission-et-impact/icon-ts.svg";
import PDFScreenshot from "~/assets/staticPages/mission-et-impact/pdf-screenshot.png";
import AlainRegnier from "~/assets/staticPages/mission-et-impact/photo-alain-regnier.png";
import ScreenshotRI from "~/assets/staticPages/mission-et-impact/ri-screenshot.png";
import StatGraph from "~/assets/staticPages/mission-et-impact/stat-graph.svg";
import StatPodium from "~/assets/staticPages/mission-et-impact/stat-podium.svg";
import StatStars from "~/assets/staticPages/mission-et-impact/stat-stars.svg";
import StepIllu1 from "~/assets/staticPages/mission-et-impact/steps-illu-1.png";
import StepIllu2 from "~/assets/staticPages/mission-et-impact/steps-illu-2.png";
import StepIllu3 from "~/assets/staticPages/mission-et-impact/steps-illu-3.png";
import StepIllu4 from "~/assets/staticPages/mission-et-impact/steps-illu-4.png";
import StepIllu5 from "~/assets/staticPages/mission-et-impact/steps-illu-5.png";
import StepIllu6 from "~/assets/staticPages/mission-et-impact/steps-illu-6.png";
import StepIllu7 from "~/assets/staticPages/mission-et-impact/steps-illu-7.png";
import UsersGraph1 from "~/assets/staticPages/mission-et-impact/users-graph-1.png";
import UsersGraph2 from "~/assets/staticPages/mission-et-impact/users-graph-2.svg";
import {
  Anchor,
  Card as RICard,
  SecondaryNavbar,
  Section,
  StepContent,
  Title2,
} from "~/components/Pages/staticPages/common";
import { Figure, ImpactCol, TeamCard } from "~/components/Pages/staticPages/mission-et-impact";
import SEO from "~/components/Seo";
import { useTeamData } from "~/data/useTeamData";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";

export type View = "mission" | "impact" | "users" | "figures" | "team" | "contributors" | "steps";

const MissionImpact: NextPage = () => {
  const { t } = useTranslation();
  const teamData = useTeamData();

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
  }, [inViewMission, inViewImpact, inViewUsers, inViewFigures, inViewHteam, inViewContributors, inViewSteps]);

  return (
    <div className="w-full">
      <SEO title="Qui sommes nous ?" />

      <Section
        className="bg-light-low-blue-france px-4 md:min-h-[520px] bg-contain bg-no-repeat bg-bottom max-lg:!bg-none"
        style={{
          backgroundImage: `url(${HeroBack.src})`,
        }}
      >
        <div className="md:max-w-[720px] lg:max-w-[600px] xl:max-w-[720px] mx-auto">
          <h1 className="!text-h1 md:!text-alt-title mb-6">{t("MissionImpact.title")}</h1>
          <p className="!text-chapo !mb-0">{t("MissionImpact.subtitle")}</p>
        </div>
        <Image src={HeroMobile} alt="" width={343} className="lg:hidden mt-10 mx-auto max-w-full" />
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
        activeView={activeView}
      />
      <div ref={refMission} className="relative">
        <Anchor id="mission" />
        <Section>
          <div className="fr-container">
            <div className="flex gap-10 md:gap-20 flex-col md:flex-row">
              <div className="flex-1">
                <Title2 smallMb className="!text-left">
                  {t("MissionImpact.mission_title")}
                </Title2>
                <p className="!text-h4 md:!text-h3 text-purple-france !mb-0">{t("MissionImpact.mission_subtitle")}</p>
                <Image
                  src={ScreenshotRI}
                  alt=""
                  width={540}
                  height={357}
                  className="mt-10 md:mt-14 mx-auto max-w-full"
                />
              </div>
              <div className="flex-1">
                <p
                  className="!text-large"
                  dangerouslySetInnerHTML={{
                    __html: t("MissionImpact.mission_p1"),
                  }}
                />
                <p className="!text-large">{t("MissionImpact.mission_p2")}</p>
                <p className="!text-large !mb-0">{t("MissionImpact.mission_p3")}</p>
                <div className="mt-10 flex gap-6 items-center">
                  <Image src={AlainRegnier} alt="Alain Regnier - Photo" width={120} height={120} />
                  <p className="!text-large !mb-0">
                    <strong className="block">Alain Régnier</strong>
                    <span>{t("MissionImpact.mission_alain_position")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div ref={refImpact} className="relative">
        <Anchor id="impact" />
        <Section className="bg-light-alt-blue">
          <div className="fr-container">
            <div className="flex gap-10 md:gap-20 flex-col md:flex-row mb-10 md:mb-20">
              <div className="flex-1">
                <Title2 smallMb className="!text-left">
                  {t("MissionImpact.impact_title")}
                </Title2>
                <p className="!text-h4 md:!text-h3 text-purple-france !mb-0">{t("MissionImpact.impact_subtitle")}</p>

                <Card
                  enlargeLink
                  imageUrl={PDFScreenshot.src}
                  horizontal
                  linkProps={{
                    href: "#",
                  }}
                  imageAlt=""
                  title="Livret d'impact"
                  desc="Mai 2024"
                  endDetail="PDF - 61,88 Ko"
                  className="max-w-[384px] fr-card--download mt-10 md:mt-14"
                />
              </div>
              <div className="flex-1">
                <p className="!text-large">{t("MissionImpact.impact_p1")}</p>
                <p className="!text-large">{t("MissionImpact.impact_p2")}</p>
                <p
                  className="!text-large !mb-0"
                  dangerouslySetInnerHTML={{
                    __html: t("MissionImpact.impact_p3"),
                  }}
                ></p>
              </div>
            </div>

            <div className="flex gap-10 md:gap-20 flex-col md:flex-row pt-10">
              <ImpactCol
                title={t("MissionImpact.impact_arguments_title_1")}
                badge={t("MissionImpact.impact_arguments_badge_1")}
                text={t("MissionImpact.impact_arguments_text_1")}
                figureText={t("MissionImpact.impact_arguments_figures_1")}
              />
              <ImpactCol
                title={t("MissionImpact.impact_arguments_title_2")}
                badge={t("MissionImpact.impact_arguments_badge_2")}
                text={t("MissionImpact.impact_arguments_text_2")}
                figureText={t("MissionImpact.impact_arguments_figures_2")}
              />
              <ImpactCol
                title={t("MissionImpact.impact_arguments_title_3")}
                badge={t("MissionImpact.impact_arguments_badge_3")}
                text={t("MissionImpact.impact_arguments_text_3")}
                figureText={t("MissionImpact.impact_arguments_figures_3")}
              />
            </div>
            <p className="!text-small text-center !mt-20">{t("MissionImpact.impact_arguments_legend")}</p>
          </div>
        </Section>
      </div>

      <div ref={refUsers} className="relative">
        <Anchor id="users" />
        <Section>
          <div className="fr-container">
            <Title2>{t("MissionImpact.users_title")}</Title2>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 lg:px-30 mn-10 lg:mb-20">
              <div className="flex-1">
                <h3>{t("MissionImpact.users_subtitle_1")}</h3>
                <p className="text-large">{t("MissionImpact.users_text_1")}</p>
                <p className="text-large">{t("MissionImpact.users_testimony_1")}</p>
                <div className="space-x-2">
                  <Badge small severity="info" noIcon>
                    {t("MissionImpact.users_badges1_badge1")}
                  </Badge>
                  <Badge small severity="info" noIcon>
                    {t("MissionImpact.users_badges1_badge2")}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-8 justify-center">
                <Image
                  src={UsersGraph1}
                  alt={t("MissionImpact.users_legend_1")}
                  className="mx-auto lg:mx-5"
                  width={416}
                  height={271}
                />
                <p className="text-small text-center text-gray italic">{t("MissionImpact.users_legend_1")}</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 lg:px-30 mn-10 lg:mb-20">
              <div className="flex-1">
                <h3>{t("MissionImpact.users_subtitle_2")}</h3>
                <p className="text-large">{t("MissionImpact.users_text_2")}</p>
                <p className="text-large">{t("MissionImpact.users_testimony_2")}</p>
                <div className="space-x-2">
                  <Badge small severity="info" noIcon>
                    {t("MissionImpact.users_badges2_badge")}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-8 justify-center">
                <Image
                  src={UsersGraph2}
                  alt={t("MissionImpact.users_legend_2")}
                  className="mx-auto lg:mx-10"
                  width={376}
                  height={191}
                />
                <p className="text-small text-center text-gray italic">{t("MissionImpact.users_legend_2")}</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div ref={refFigures} className="relative">
        <Anchor id="figures" />
        <Section className="bg-blue-france">
          <div className="fr-container">
            <Title2 className="text-light-alt-blue">{t("MissionImpact.figures_title")}</Title2>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center lg:items-start justify-center">
              <Figure title="1,3M" text={t("MissionImpact.figures_text_1")} image={StatGraph} />
              <Figure title="n°1" text={t("MissionImpact.figures_text_2")} image={StatPodium} />
              <Figure title="4,6/5" text={t("MissionImpact.figures_text_3")} image={StatStars} />
            </div>
          </div>
        </Section>
      </div>

      <div ref={refTeam} className="relative">
        <Anchor id="team" />
        <Section>
          <div className="fr-container">
            <Title2>{t("MissionImpact.team_title")}</Title2>
            <div className="flex sm:px-20 gap-4 sm:gap-10 flex-wrap justify-center">
              {teamData.map((team) => (
                <TeamCard key={team.name} {...team} />
              ))}
            </div>
          </div>
        </Section>
      </div>

      <div ref={refContributors} className="relative">
        <Anchor id="contributors" />
        <Section className="bg-light-low-blue-france">
          <div className="fr-container">
            <Title2 className="!text-center">{t("MissionImpact.community_title")}</Title2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <RICard
                image={CommunityIlluDispositifs}
                imageWidth={240}
                title={t("MissionImpact.community_dispositifs_title")}
                footer={
                  <Badge severity="new" noIcon>
                    {t("MissionImpact.community_tag_redaction")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_dispositifs_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluCda}
                imageWidth={240}
                title={t("MissionImpact.community_cda_title")}
                footer={
                  <Badge severity="new" noIcon>
                    {t("MissionImpact.community_tag_redaction")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_cda_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluTraducteurs}
                imageWidth={232}
                title={t("MissionImpact.community_traducteurs_title")}
                footer={
                  <Badge severity="info" noIcon>
                    {t("MissionImpact.community_tag_traduction")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_traducteurs_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluExperts}
                imageWidth={240}
                title={t("MissionImpact.community_experts_title")}
                footer={
                  <Badge severity="info" noIcon>
                    {t("MissionImpact.community_tag_traduction")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_experts_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluAmbassadeurs}
                imageWidth={232}
                title={t("MissionImpact.community_ambassadeurs_title")}
                footer={
                  <Badge noIcon className="bg-pink-background text-pink-foreground">
                    {t("MissionImpact.community_tag_deploiement")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_ambassadeurs_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluInfluenceurs}
                imageWidth={232}
                title={t("MissionImpact.community_influenceurs_title")}
                footer={
                  <Badge noIcon className="bg-pink-background text-pink-foreground">
                    {t("MissionImpact.community_tag_deploiement")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_influenceurs_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluPartenaires}
                imageWidth={240}
                title={t("MissionImpact.community_partenaires_title")}
                footer={
                  <Badge noIcon className="bg-pink-background text-pink-foreground">
                    {t("MissionImpact.community_tag_deploiement")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_partenaires_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluTesteurs}
                imageWidth={232}
                title={t("MissionImpact.community_testeurs_title")}
                footer={
                  <Badge severity="success" noIcon>
                    {t("MissionImpact.community_tag_produit")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_testeurs_subtitle")}</p>
              </RICard>
              <RICard
                image={CommunityIlluDinum}
                title={t("MissionImpact.community_dinum_title")}
                footer={
                  <Badge severity="warning" noIcon>
                    {t("MissionImpact.community_tag_pilotage")}
                  </Badge>
                }
                footerBottom
              >
                <p>{t("MissionImpact.community_dinum_subtitle")}</p>
              </RICard>
            </div>
          </div>
        </Section>
      </div>

      <div ref={refSteps} className="relative">
        <Anchor id="steps" />
        <Section className="bg-beige">
          <div className="fr-container">
            <Title2>{t("MissionImpact.stepsTitle")}</Title2>
            <StepContent
              step={1}
              title={t("MissionImpact.steps_title_1")}
              texts={[t("MissionImpact.steps_text_1")]}
              badge={t("MissionImpact.steps_date_1")}
              image={StepIllu1}
              width={440}
            />
            <StepContent
              step={2}
              title={t("MissionImpact.steps_title_2")}
              texts={[t("MissionImpact.steps_text_2")]}
              badge={t("MissionImpact.steps_date_2")}
              image={StepIllu2}
              width={440}
            />
            <StepContent
              step={3}
              title={t("MissionImpact.steps_title_3")}
              texts={[t("MissionImpact.steps_text_3")]}
              badge={t("MissionImpact.steps_date_3")}
              image={StepIllu3}
              width={440}
            />
            <StepContent
              step={4}
              title={t("MissionImpact.steps_title_4")}
              texts={[t("MissionImpact.steps_text_4")]}
              badge={t("MissionImpact.steps_date_4")}
              image={StepIllu4}
              width={440}
            />
            <StepContent
              step={5}
              title={t("MissionImpact.steps_title_5")}
              texts={[t("MissionImpact.steps_text_5")]}
              badge={t("MissionImpact.steps_date_5")}
              image={StepIllu5}
              width={440}
            />
            <StepContent
              step={6}
              title={t("MissionImpact.steps_title_6")}
              texts={[t("MissionImpact.steps_text_6")]}
              badge={t("MissionImpact.steps_date_6")}
              image={StepIllu6}
              width={440}
            />
            <StepContent
              step={7}
              title={t("MissionImpact.steps_title_7")}
              texts={[
                t("MissionImpact.steps_text_7"),
                <ul key="list_7">
                  <li>{t("MissionImpact.steps_text_7_item1")}</li>
                  <li>{t("MissionImpact.steps_text_7_item2")}</li>
                </ul>,
              ]}
              badge={t("MissionImpact.steps_date_7")}
              image={StepIllu7}
              dottedLine
              width={440}
            />
          </div>
        </Section>
      </div>

      <Section>
        <div className="fr-container">
          <Title2 className="!text-center">{t("MissionImpact.community_title")}</Title2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <RICard
              image={IconTs}
              title={t("MissionImpact.join_ts_title")}
              footer={
                <Button
                  priority="tertiary"
                  iconId="fr-icon-arrow-right-line"
                  iconPosition="right"
                  className="fr-default"
                  linkProps={{
                    href: "https://airtable.com/shrrkFuyeG0BpKKT7",
                    rel: "noopener noreferrer",
                    target: "_blank",
                  }}
                >
                  {t("MissionImpact.join_ts_cta")}
                </Button>
              }
              footerBottom
            >
              <p>{t("MissionImpact.join_ts_subtitle")}</p>
            </RICard>
            <RICard
              image={IconAgir}
              title={t("MissionImpact.join_agir_title")}
              footer={
                <Button
                  priority="tertiary"
                  iconId="fr-icon-calendar-event-line"
                  iconPosition="right"
                  className="fr-default"
                  linkProps={{
                    href: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
                    rel: "noopener noreferrer",
                    target: "_blank",
                  }}
                >
                  {t("MissionImpact.join_meeting_cta")}
                </Button>
              }
              footerBottom
            >
              <p>{t("MissionImpact.join_agir_subtitle")}</p>
            </RICard>
            <RICard
              image={IconOperators}
              imageWidth={240}
              title={t("MissionImpact.join_etat_title")}
              footer={
                <Button
                  priority="tertiary"
                  iconId="fr-icon-calendar-event-line"
                  iconPosition="right"
                  className="fr-default"
                  linkProps={{
                    href: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
                    rel: "noopener noreferrer",
                    target: "_blank",
                  }}
                >
                  {t("MissionImpact.join_meeting_cta")}
                </Button>
              }
              footerBottom
            >
              <p>{t("MissionImpact.join_etat_subtitle")}</p>
            </RICard>
            <RICard
              image={IconAdministration}
              title={t("MissionImpact.join_administration_title")}
              footer={
                <Button
                  priority="tertiary"
                  iconId="fr-icon-calendar-event-line"
                  iconPosition="right"
                  className="fr-default"
                  linkProps={{
                    href: "https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info",
                    rel: "noopener noreferrer",
                    target: "_blank",
                  }}
                >
                  {t("MissionImpact.join_meeting_cta")}
                </Button>
              }
              footerBottom
            >
              <p>{t("MissionImpact.join_administration_subtitle")}</p>
            </RICard>
            <RICard
              image={IconStructure}
              title={t("MissionImpact.join_structure_title")}
              footer={
                <Button
                  priority="tertiary"
                  iconId="fr-icon-arrow-right-line"
                  iconPosition="right"
                  className="fr-default"
                  linkProps={{
                    href: "https://refugies.info/fr/publier",
                    rel: "noopener noreferrer",
                    target: "_blank",
                  }}
                >
                  {t("MissionImpact.join_structure_cta")}
                </Button>
              }
              footerBottom
            >
              <p>{t("MissionImpact.join_structure_subtitle")}</p>
            </RICard>
            <RICard
              image={IconTranslator}
              title={t("MissionImpact.join_traducteur_title")}
              footer={
                <Button
                  priority="tertiary"
                  iconId="fr-icon-arrow-right-line"
                  iconPosition="right"
                  className="fr-default"
                  linkProps={{
                    href: "https://refugies.info/fr/traduire",
                    rel: "noopener noreferrer",
                    target: "_blank",
                  }}
                >
                  {t("MissionImpact.join_traducteur_cta")}
                </Button>
              }
              footerBottom
            >
              <p>{t("MissionImpact.join_traducteur_subtitle")}</p>
            </RICard>
          </div>
        </div>
      </Section>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default MissionImpact;
