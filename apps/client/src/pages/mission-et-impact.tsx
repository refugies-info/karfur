import Card from "@codegouvfr/react-dsfr/Card";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import HeroBack from "~/assets/staticPages/mission-et-impact/hero-back.svg";
import HeroMobile from "~/assets/staticPages/mission-et-impact/hero-illu-mobile.svg";
import PDFScreenshot from "~/assets/staticPages/mission-et-impact/pdf-screenshot.png";
import AlainRegnier from "~/assets/staticPages/mission-et-impact/photo-alain-regnier.png";
import ScreenshotRI from "~/assets/staticPages/mission-et-impact/ri-screenshot.png";
import { Section, Title2 } from "~/components/Pages/staticPages/common";
import { ImpactCol } from "~/components/Pages/staticPages/mission-et-impact";
import SEO from "~/components/Seo";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";

const MissionImpact: NextPage = () => {
  const { t } = useTranslation();
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
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default MissionImpact;
