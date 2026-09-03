import Button from "@codegouvfr/react-dsfr/Button";
import { cn, useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import LanguageMenu from "~/components/Navigation/Navbar/QuickAccessMenu/LanguageMenu";
import LoginButton from "~/components/Navigation/Navbar/QuickAccessMenu/LoginButton";
import { useLocale, useMediaQuery } from "~/hooks";
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
  const { zoomLevel } = useWindowSize();
  // We negate the exact DSFR media query rather than writing a complementary
  // one: at exactly 992 px, Chrome matches both (min-width: 62em) and
  // (max-width: 61.9999em), and the two layouts overlapped. The default value
  // keeps the server render in desktop mode.
  const isDsfrCompactHeader = !useMediaQuery("(min-width: 62em)", true);
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
      {/* Same breakpoint as the header layout: otherwise the long label showed
          up in the desktop bar from 200 % zoom onwards. */}
      {isDsfrCompactHeader
        ? t("Toolbar.TraduireUneFiche", "Traduire une fiche")
        : t("Toolbar.Traduire", "Traduire")}
    </Button>,
    <LanguageMenu
      key="language"
      // The DSFR moves its tools bar into the burger menu at 62em, and the em
      // unit of a media query does not follow text zoom. Without this guard, the
      // menu believed it was on mobile from 200 % text zoom onwards and rendered
      // its accordion in the desktop bar, which then overflowed by 952 px
      // (RGAA 10.4).
      isCompact={isDsfrCompactHeader}
      className={cn(zoomLevel >= 175 && "!w-full")}
      dropDownClassName={cn(zoomLevel >= 175 && "!w-full")}
    />,
    // The login button stays in the list at every width (RGAA 10.11).
    // The DSFR renders it in the tools bar above 62em and in the burger menu
    // below: removing it under 48em made it unreachable everywhere.
    <LoginButton key="login" />,
  ];

  return menuItems.filter((item) => item !== null);
};

export { QuickAccessMenu };
