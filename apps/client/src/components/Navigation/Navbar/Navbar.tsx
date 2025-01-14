import { Header } from "@codegouvfr/react-dsfr/Header";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { Languages } from "@refugies-info/api-types";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { memo, useMemo } from "react";
import { isIOS, isMobileOnly } from "react-device-detect";
import { getPath } from "routes";
import { assetsOnServer } from "~/assets/assetsOnServer";
import useBackendNavigation from "~/components/Backend/Navigation/useBackendNavigation";
import { QuickAccessMenu } from "~/components/Navigation/Navbar/QuickAccessMenu/QuickAccessMenu";
import Image from "~/components/UI/Image";
import { useEditionMode } from "~/hooks";
import isInBrowser from "~/lib/isInBrowser";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const isEditionMode = useEditionMode();
  const backendNavigation = useBackendNavigation();

  const navigationItems: MainNavigationProps.Item[] = useMemo(() => {
    const locale: Languages = (router.locale || "fr") as Languages;
    const isCurrent = (href: string, paramCheck?: { param: string; value: string }) => {
      if (!isInBrowser()) return false;
      const currentPath = window?.location?.pathname || "";
      const isPathMatching = currentPath === "/" + router.locale + href;

      if (paramCheck) {
        const urlParams = new URLSearchParams(window?.location?.search || "");
        return isPathMatching && urlParams.get(paramCheck.param) === paramCheck.value;
      }

      return isPathMatching;
    };
    const isBackend = router.pathname.includes("/backend");
    const appStoreBadge = assetsOnServer.storeBadges.appStore[locale] || assetsOnServer.storeBadges.appStore.en;
    const playStoreBadge = assetsOnServer.storeBadges.playStore[locale] || assetsOnServer.storeBadges.playStore.en;

    if (isBackend) return backendNavigation;
    return [
      {
        linkProps: {
          href: getPath("/recherche", router.locale, "?search=&sort=default&type=demarche"),
          className: styles.navLinkWithSearchIcon,
        },
        text: t("Toolbar.fichesDemarches", "Fiches démarches"),
        isActive: isCurrent(getPath("/recherche", router.locale), {
          param: "type",
          value: "demarche",
        }),
      },
      {
        linkProps: {
          href: getPath("/recherche", router.locale, "?search=&sort=default&type=dispositif"),
          prefetch: false,
          className: styles.navLinkWithSearchIcon,
        },
        text: t("Toolbar.dispositifsLocaux", "Dispositifs locaux"),
        isActive: isCurrent(getPath("/recherche", router.locale), {
          param: "type",
          value: "dispositif",
        }),
      },
      {
        linkProps: { href: getPath("/agir", router.locale), prefetch: false },
        text: t("Toolbar.agir", "AGIR"),
        isActive: isCurrent(getPath("/agir", router.locale)),
      },
      {
        linkProps: { href: getPath("/mission-impact", router.locale), prefetch: false },
        text: t("Toolbar.missionImpact", "Mission et imapact"),
        isActive: isCurrent(getPath("/mission-impact", router.locale)),
      },
      {
        text: t("Toolbar.partagerProjet", "Partager le projet"),
        menuLinks: [
          {
            linkProps: { href: "https://kit.refugies.info/", target: "_blank" },
            text: t("Toolbar.Kit de communication", "Kit de communication"),
          },
          {
            linkProps: { href: "https://kit.refugies.info/flyers/", target: "_blank" },
            text: t("Toolbar.posters_leaflets", "Commander des affiches et dépliants"),
          },

          {
            linkProps: { href: "https://kit.refugies.info/agir", target: "_blank" },
            text: t("Toolbar.forAgirOperators", "Pour les opérateurs AGIR"),
          },
        ],
      },

      !isMobileOnly && {
        linkProps: {
          href: getPath("/", router.locale, "#application"),
          className: styles.navLinkWithAppIcon,
        },
        text: t("Toolbar.shareApplication", "Partager l'application"),
      },
      {
        linkProps: {
          href: "https://help.refugies.info",
          target: "_blank",
        },
        text: t("Toolbar.helpCenter", "Centre d'aide"),
      },

      isMobileOnly
        ? {
            linkProps: {
              href: isIOS ? iosStoreLink : androidStoreLink,
              target: "_blank",
              className: "px-0",
            },
            text: isIOS ? (
              <Image
                src={appStoreBadge}
                alt={t("Toolbar.getItOnAppStore", "Téléchager sur l'App Store")}
                width={120}
                height={40}
                className="mt-3"
              />
            ) : (
              <Image
                src={playStoreBadge}
                alt={t("Toolbar.getItOnPlayStore", "Téléchager sur le Play Store")}
                width={134}
                height={40}
                className="mt-3"
              />
            ),
          }
        : null,
    ].filter((n) => n !== null) as MainNavigationProps.Item[];
  }, [router.locale, router.pathname, backendNavigation, t]);

  const quickAccessMenu = QuickAccessMenu();

  if (isEditionMode) return null;
  return (
    <>
      <Header
        brandTop={
          <>
            République
            <br />
            Française
          </>
        }
        homeLinkProps={{
          href: "/",
          title: "Accueil - Réfugiés.info",
        }}
        operatorLogo={{
          alt: "Réfugiés.info",
          imgUrl: "/images/logoRI.svg",
          orientation: "horizontal",
        }}
        serviceTitle={t("Header.serviceName", "Réfugiés.info")}
        serviceTagline={t("Header.serviceTagline", "L’information pour les étrangers en France")}
        quickAccessItems={quickAccessMenu}
        navigation={navigationItems}
      />
    </>
  );
};

export default memo(Navbar);
