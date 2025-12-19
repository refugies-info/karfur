import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { useTranslation } from "next-i18next";

const SkipLinksNavigation = () => {
  const { t } = useTranslation();
  return (
    <SkipLinks
      links={[
        {
          anchor: "#contenu",
          label: t("SkipLinks.Contenu", "Aller au contenu"),
        },
        {
          anchor: "#main-navigation",
          label: t("SkipLinks.Menu", "Menu"),
        },
        {
          anchor: "#fr-footer",
          label: t("SkipLinks.PiedDePage", "Pied de page"),
        },
      ]}
    />
  );
};

export default SkipLinksNavigation;
