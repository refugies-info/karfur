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
        <h4 className="!text-large !mb-0 !font-normal !text-purple-france italic">
          {t("MissionImpact.impact_arguments_figures_title")}
        </h4>
        <p className="!text-large !mb-0">{props.figureText}</p>
      </div>
    </div>
  );
};
