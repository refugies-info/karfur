import { Header } from "@codegouvfr/react-dsfr/Header";
import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { isInBrowser, useWindowSize } from "@refugies-info/ui";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { memo, useCallback, useMemo } from "react";
import { isIOS } from "react-device-detect";
import { useDispatch } from "react-redux";
import { getPath } from "routes";
import { assetsOnServer } from "~/assets/assetsOnServer";
import useBackendNavigation from "~/components/Backend/Navigation/useBackendNavigation";
import { QuickAccessMenu } from "~/components/Navigation/Navbar/QuickAccessMenu/QuickAccessMenu";
import Image from "~/components/UI/Image";
import { useEditionMode, useLocale } from "~/hooks";
import { cn } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { toggleNewsletterModalAction } from "~/services/Miscellaneous/miscellaneous.actions";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = useLocale();
  const isEditionMode = useEditionMode();
  const backendNavigation = useBackendNavigation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();

  const toggleNewsletter = useCallback(() => {
    dispatch(toggleNewsletterModalAction());
    Event("NEWSLETTER", "open modal", "navbar");
  }, [dispatch]);

  const navigationItems: MainNavigationProps.Item[] = useMemo(() => {
    const isCurrent = (href: string, paramCheck?: { param: string; value: string }) => {
      const currentPath = router.pathname;
      const isPathMatching = currentPath === href;

      if (paramCheck) {
        return isPathMatching && router.query[paramCheck.param] === paramCheck.value;
      }

      return isPathMatching;
    };
    const isBackend = router.pathname.includes("/backend");
    const appStoreBadge =
      assetsOnServer.storeBadges.appStore[locale] || assetsOnServer.storeBadges.appStore.en;
    const playStoreBadge =
      assetsOnServer.storeBadges.playStore[locale] || assetsOnServer.storeBadges.playStore.en;

    if (isBackend) return backendNavigation;
    return [
      {
        linkProps: {
          href: getPath("/recherche", locale, "?search=&sort=default&type=demarche"),
          className: styles.navLinkWithSearchIcon,
        },
        text: t("Toolbar.fichesDemarches", "Fiches démarches"),
        isActive: isCurrent(getPath("/recherche", locale), {
          param: "type",
          value: "demarche",
        }),
      },
      {
        linkProps: {
          href: getPath("/recherche", locale, "?search=&sort=default&type=dispositif"),
          prefetch: false,
          className: styles.navLinkWithSearchIcon,
        },
        text: t("Toolbar.dispositifsLocaux", "Dispositifs locaux"),
        isActive: isCurrent(getPath("/recherche", locale), {
          param: "type",
          value: "dispositif",
        }),
      },
      {
        linkProps: { href: getPath("/agir", locale), prefetch: false },
        text: t("Toolbar.agir", "AGIR"),
        isActive: isCurrent(getPath("/agir", locale)),
      },
      {
        linkProps: {
          href: getPath("/mission-et-impact", locale),
          prefetch: false,
        },
        text: t("Toolbar.missionImpact", "Mission et impact"),
        isActive: isCurrent(getPath("/mission-et-impact", locale)),
      },
      {
        text: t("Toolbar.partagerProjet", "Ressources"),
        menuLinks: [
          {
            linkProps: {
              href: "https://kit.refugies.info/formation/",
              target: "_blank",
            },
            text: t("Toolbar.webinaire", "Participer à un webinaire de découverte"),
          },
          {
            linkProps: {
              href: "https://kit.refugies.info/flyers/",
              target: "_blank",
            },
            text: t("Toolbar.posters_leaflets", "Commander des affiches et des dépliants"),
          },
          {
            linkProps: { href: "https://kit.refugies.info/", target: "_blank" },
            text: t("Toolbar.Kit de communication", "Parler du projet (kit de communication)"),
          },

          {
            linkProps: {
              href: "https://kit.refugies.info/agir",
              target: "_blank",
            },
            text: t("Toolbar.forAgirOperators", "Pour les opérateurs AGIR"),
          },
        ],
      },

      !isMobile
        ? {
            linkProps: {
              href: getPath("/", locale, "#application"),
              className: styles.navLinkWithAppIcon,
            },
            text: t("Toolbar.shareApplication", "Partager l'application"),
          }
        : null,

      {
        linkProps: {
          href: isMobile ? "#" : getPath("/", locale, "#newsletter"),
          onClick: isMobile ? toggleNewsletter : undefined,
        },
        text: t("Toolbar.newsletter", "Newsletter"),
      },

      isMobile
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
  }, [locale, router.pathname, backendNavigation, t, isMobile, toggleNewsletter]);

  const quickAccessMenu = QuickAccessMenu();

  if (isEditionMode) return null;
  return (
    <>
      <Header
        id="main-navigation"
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
        serviceTagline={t("Header.serviceTagline", "L'information pour les réfugiés en France")}
        quickAccessItems={quickAccessMenu}
        navigation={navigationItems}
        className={cn(styles.navBar, "print:hidden")}
      />
    </>
  );
};

export default memo(Navbar);
