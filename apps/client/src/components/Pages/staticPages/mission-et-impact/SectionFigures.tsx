import { useTranslation } from "next-i18next";
import StatGraph from "~/assets/staticPages/mission-et-impact/stat-graph.svg";
import StatPodium from "~/assets/staticPages/mission-et-impact/stat-podium.svg";
import StatStars from "~/assets/staticPages/mission-et-impact/stat-stars.svg";
import { Section, Title2 } from "~/components/Pages/staticPages/common";
import { Figure } from "~/components/Pages/staticPages/mission-et-impact/Figure";

export const SectionFigures = () => {
  const { t } = useTranslation();
  return (
    <Section className="bg-action-high-blue-france">
      <div className="@container container">
        <Title2 className="text-inverted-blue-france">{t("MissionImpact.figures_title")}</Title2>
        {/* Wrap only when the three fixed-width figures plus gaps (58rem at lg, 67rem at xl) no longer fit,
            e.g. at 200% text zoom where rem grows but the container does not (RGAA 10.4) */}
        <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:gap-20 lg:@max-[58rem]:flex-wrap xl:@max-[67rem]:flex-wrap">
          <Figure title="1,3M" text={t("MissionImpact.figures_text_1")} image={StatGraph} />
          <Figure title="n°1" text={t("MissionImpact.figures_text_2")} image={StatPodium} />
          <Figure title="4,6/5" text={t("MissionImpact.figures_text_3")} image={StatStars} />
        </div>
      </div>
    </Section>
  );
};
