import Button from "@codegouvfr/react-dsfr/Button";
import { cn, useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import LanguageMenu from "~/components/Navigation/Navbar/QuickAccessMenu/LanguageMenu";
import LoginButton from "~/components/Navigation/Navbar/QuickAccessMenu/LoginButton";
import { useLocale } from "~/hooks";
import { getPath } from "~/routes";

// This component retunrs an array of JSX items specifically for the DSFR Header component
// - The Header expects an array of React elements for its quickAccessItems prop
// - This approach allows direct spreading of menu items into the Header
//
// TODO: If this pattern is no longer needed in future refactors:
// - Consider reverting to a single component or fragment
// - Evaluate if this approach adds unnecessary complexity

const QuickAccessMenu = () => {
  const { t } = useTranslation();
  const { isMobile, zoomLevel } = useWindowSize();
  const locale = useLocale();

  const menuItems = [
    <Button
      key="publish"
      linkProps={{
        href: getPath("/publier", locale),
        prefetch: false,
      }}
      iconId="fr-icon-file-add-line"
      priority="tertiary no outline"
    >
      {t("Toolbar.Publier une fiche", "Publier une fiche")}
    </Button>,
    <Button
      key="translate"
      linkProps={{
        href: getPath("/traduire", locale),
        prefetch: false,
      }}
      iconId="fr-icon-message-2-line"
      priority="tertiary no outline"
    >
      {isMobile
        ? t("Toolbar.TraduireUneFiche", "Traduire une fiche")
        : t("Toolbar.Traduire", "Traduire")}
    </Button>,
    <LanguageMenu
      key="language"
      className={cn(zoomLevel >= 175 && "!w-full")}
      dropDownClassName={cn(zoomLevel >= 175 && "!w-full")}
    />,
    !isMobile ? <LoginButton key="login" /> : null,
  ];

  return [...menuItems];
};

export { QuickAccessMenu };
