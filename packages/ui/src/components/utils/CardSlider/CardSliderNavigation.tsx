import { cn } from "@/lib/cn";
import { Button } from "@codegouvfr/react-dsfr/Button";

// import { useTranslation } from "next-i18next";

type CardSliderNavigationProps = {
  className?: string;
  children?: React.ReactNode;
};
function CardSliderNavigation({ className, children }: CardSliderNavigationProps) {
  // const { t } = useTranslation();
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {children}
      <Button iconId="fr-icon-arrow-left-line" priority="tertiary" title="Label button" />
      <Button iconId="fr-icon-arrow-right-line" priority="tertiary" title="Label button" />
      <Button onClick={function noRefCheck() {}} priority="tertiary">
        {/* {t("cardSlider.seeAll", "Voir tout")} */}
        Voir tout
      </Button>
    </div>
  );
}

CardSliderNavigation.displayName = "CardSliderNavigation";

export { CardSliderNavigation };
