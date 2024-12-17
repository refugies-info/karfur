import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { useTranslations } from "next-intl";

const SkipLinksNavigation = () => {
  const t = useTranslations();
  return (
    <SkipLinks
      links={[
        {
          anchor: "#contenu",
          label: t("SkipLinks.Contenu"),
        },
        {
          anchor: "#fr-header-main-navigation",
          label: t("SkipLinks.Menu"),
        },
        {
          anchor: "#fr-footer",
          label: t("SkipLinks.PiedDePage"),
        },
      ]}
    />
  );
};

export default SkipLinksNavigation;
