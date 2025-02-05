import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import HeroBack from "~/assets/staticPages/mission-et-impact/hero-back.svg";
import HeroMobile from "~/assets/staticPages/mission-et-impact/hero-illu-mobile.svg";
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
import { Section, StepContent, Title2 } from "~/components/Pages/staticPages/common";
import { Figure, ImpactCol, TeamCard } from "~/components/Pages/staticPages/mission-et-impact";
import SEO from "~/components/Seo";
import { useTeamData } from "~/data/useTeamData";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";

const MissionImpact: NextPage = () => {
  const { t } = useTranslation();
  const teamData = useTeamData();
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

      <Section>
        <div className="fr-container">
          <div className="flex gap-10 md:gap-20 flex-col md:flex-row">
            <div className="flex-1">
              <Title2 smallMb className="!text-left">
                {t("MissionImpact.mission_title")}
              </Title2>
              <p className="!text-h4 md:!text-h3 text-purple-france !mb-0">{t("MissionImpact.mission_subtitle")}</p>
              <Image src={ScreenshotRI} alt="" width={540} height={357} className="mt-10 md:mt-14 mx-auto max-w-full" />
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
  );
};

export const getStaticProps = defaultStaticProps;

export default MissionImpact;
