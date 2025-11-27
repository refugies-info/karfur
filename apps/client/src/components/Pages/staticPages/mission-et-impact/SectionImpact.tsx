import Card from "@codegouvfr/react-dsfr/Card";
import { useTranslation } from "next-i18next";
import PDFScreenshot from "~/assets/staticPages/mission-et-impact/pdf-screenshot.png";
import { Section, Title2 } from "~/components/Pages/staticPages/common";
import { ImpactCol } from "~/components/Pages/staticPages/mission-et-impact/ImpactCol";

export const SectionImpact = () => {
  const { t } = useTranslation();
  return (
    <Section className="bg-alt-blue-france">
      <div className="container">
        <div className="mb-10 flex flex-col gap-10 md:mb-20 md:flex-row md:gap-20">
          <div className="flex-1">
            <Title2 smallMb className="text-left md:text-left">
              {t("MissionImpact.impact_title")}
            </Title2>
            <p className="text-h4 md:text-h3 text-artwork-major-blue-france !mb-0">
              {t("MissionImpact.impact_subtitle")}
            </p>

            <Card
              enlargeLink
              imageUrl={PDFScreenshot.src}
              horizontal
              linkProps={{
                href:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/Livret-Impact-Refugies.infos-2024.pdf`
                    : "#",
                target: "_blank",
                rel: "noopener noreferrer",
              }}
              imageAlt=""
              title="Livret d'impact"
              aria-label="Livret d'impact - cliquez pour le télécharger"
              desc="Mai 2024"
              endDetail="PDF - 61,88 Ko"
              className="fr-card--download mt-10 max-w-[24rem] md:mt-14"
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

        <div className="flex flex-col gap-10 pt-10 md:flex-row md:gap-20">
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
        <p className="!text-small !mt-20 text-center">{t("MissionImpact.impact_arguments_legend")}</p>
      </div>
    </Section>
  );
};
