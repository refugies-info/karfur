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
  // On negocie exactement la media query du DSFR plutot que d'en ecrire une
  // complementaire : a 992 px pile, Chrome fait matcher a la fois
  // (min-width: 62em) et (max-width: 61.9999em), et les deux mises en page se
  // superposaient. La valeur par defaut garde le rendu serveur en mode bureau.
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
      {/* Meme point de rupture que la mise en page de l'en-tete : sinon le
          libelle long s'affichait dans la barre de bureau des 200 % de zoom. */}
      {isDsfrCompactHeader
        ? t("Toolbar.TraduireUneFiche", "Traduire une fiche")
        : t("Toolbar.Traduire", "Traduire")}
    </Button>,
    <LanguageMenu
      key="language"
      // Le DSFR bascule sa barre d'outils vers le menu burger a 62em, et l'unite
      // em d'une media query ne suit pas l'agrandissement du texte. Sans ce
      // garde, le menu se croyait sur mobile a partir de 200 % de zoom texte et
      // rendait son accordeon dans la barre de bureau, qui debordait alors de
      // 952 px (RGAA 10.4).
      isCompact={isDsfrCompactHeader}
      className={cn(zoomLevel >= 175 && "!w-full")}
      dropDownClassName={cn(zoomLevel >= 175 && "!w-full")}
    />,
    // Le bouton de connexion reste dans la liste a toutes les largeurs (RGAA 10.11).
    // Le DSFR le rend dans la barre d'outils au-dessus de 62em et dans le menu
    // burger en dessous : le retirer sous 48em le rendait inatteignable partout.
    <LoginButton key="login" />,
  ];

  return menuItems.filter((item) => item !== null);
};

export { QuickAccessMenu };
