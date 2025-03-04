import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import DSFRBadge from "~/components/UI/Badge";

interface Props {
  title: string;
  badge: string;
  text: string;
  figureText: string;
}

export const ImpactCol = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 !space-y-6">
      <h3 className="!text-h4">{props.title}</h3>
      <DSFRBadge severity="new">{props.badge}</DSFRBadge>
      <p className="!text-large">{props.text}</p>
      <div>
        <h4 className="text-large text-artwork-minor-blue-france mb-0 font-normal italic">
          {t("MissionImpact.impact_arguments_figures_title")}
        </h4>
        <p className="text-large mb-0">{props.figureText}</p>
      </div>
      <Button
        priority="tertiary"
        iconId="fr-icon-line-chart-line"
        iconPosition="right"
        linkProps={{
          href: "https://kit.refugies.info/stats/",
          target: "_blank",
          rel: "noopener noreferrer",
        }}
      >
        {t("MissionImpact.impact_button")}
      </Button>
    </div>
  );
};
