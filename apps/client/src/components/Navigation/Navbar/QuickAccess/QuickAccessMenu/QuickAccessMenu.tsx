import Button from "@codegouvfr/react-dsfr/Button";
import router from "next/router";
import { useTranslation } from "react-i18next";
import { getPath } from "~/routes";
import { LanguageSelect } from "../LanguageSelect/LanguageSelect";

const QuickAccessMenu = () => {
  const { t } = useTranslation();

  return (
    <nav>
      <Button
        linkProps={{
          href: getPath("/publier", router.locale),
          prefetch: false,
        }}
        iconId="fr-icon-file-add-line"
        priority="tertiary no outline"
      >
        {t("Toolbar.Publier une fiche", "Publier une fiche")}
      </Button>
      <Button
        linkProps={{
          href: getPath("/traduire", router.locale),
          prefetch: false,
        }}
        iconId="fr-icon-message-2-line"
        priority="tertiary"
      >
        {t("Toolbar.Traduire", "Traduire")}
      </Button>

      <LanguageSelect />
    </nav>
  );
};

export { QuickAccessMenu };
