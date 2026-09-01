import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { useTranslation } from "next-i18next";

type Props = {
  /** Screens without the main navigation and the footer (auth tunnel) must not offer those links. */
  hasNavigationAndFooter?: boolean;
};

const SkipLinksNavigation = ({ hasNavigationAndFooter = true }: Props) => {
  const { t } = useTranslation();
  return (
    <SkipLinks
      links={[
        {
          anchor: "#contenu",
          label: t("SkipLinks.Contenu", "Aller au contenu"),
        },
        ...(hasNavigationAndFooter
          ? [
              {
                anchor: "#main-navigation",
                label: t("SkipLinks.Menu", "Menu"),
              },
              {
                anchor: "#fr-footer",
                label: t("SkipLinks.PiedDePage", "Pied de page"),
              },
            ]
          : []),
      ]}
    />
  );
};

export default SkipLinksNavigation;
