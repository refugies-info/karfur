import { Header, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getPath } from "routes";
import useSpeekToolItem from "./NavbarItems/SpeekToolItem/useSpeekToolItem";
import useSubscribeToolItem from "./NavbarItems/SubscribeToolItem/useSubscribeToolItem";
import useUserToolItem from "./NavbarItems/UserToolItem/useUserToolItem";
import isInBrowser from "lib/isInBrowser";
import { Event } from "lib/tracking";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";
import { useDispatch } from "react-redux";
import useBackendNavigation from "components/Backend/Navigation/useBackendNavigation";
import { useLanguageItem } from "./NavbarItems";
import Image from "next/image";
import { useEditionMode } from "hooks";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import { assetsOnServer } from "assets/assetsOnServer";
import { Languages } from "@refugies-info/api-types";
import { isMobileOnly, isIOS } from "react-device-detect";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useMemo } from "react";

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const isEditionMode = useEditionMode();
  const backendNavigation = useBackendNavigation();

  const speekItem = useSpeekToolItem();
  const subscribeItem = useSubscribeToolItem();
  const userItem = useUserToolItem();
  const languageItem = useLanguageItem();

  const quickAccessItems: HeaderProps.QuickAccessItem[] = useMemo(() => {
    return [speekItem, subscribeItem, userItem, languageItem].filter(
      (n) => n !== null,
    ) as HeaderProps.QuickAccessItem[];
  }, [speekItem, subscribeItem, userItem, languageItem]);

  const navigationItems: MainNavigationProps.Item[] = useMemo(() => {
    const locale: Languages = (router.locale || "fr") as Languages;
    const isCurrent = (href: string) =>
      isInBrowser() && (window?.location?.pathname || "") === "/" + router.locale + href;
    const isBackend = router.pathname.includes("/backend");
    const appStoreBadge = assetsOnServer.storeBadges.appStore[locale] || assetsOnServer.storeBadges.appStore.en;
    const playStoreBadge = assetsOnServer.storeBadges.playStore[locale] || assetsOnServer.storeBadges.playStore.en;

    if (isBackend) return backendNavigation;
    return [
      {
        linkProps: { href: getPath("/recherche", router.locale) },
        text: t("Toolbar.find_information", "Trouver de l'information"),
        isActive: isCurrent(getPath("/recherche", router.locale)),
      },
      {
        linkProps: { href: getPath("/publier", router.locale), prefetch: false },
        text: t("Toolbar.Publier une fiche", "Publier une fiche"),
        isActive: isCurrent(getPath("/publier", router.locale)),
      },
      {
        linkProps: { href: getPath("/traduire", router.locale), prefetch: false },
        text: t("Toolbar.Traduire", "Traduire"),
        isActive: isCurrent(getPath("/traduire", router.locale)),
      },
      {
        text: t("Toolbar.Parler de nous", "Parler de nous"),
        menuLinks: [
          {
            linkProps: { href: "https://kit.refugies.info/", target: "_blank" },
            text: t("Toolbar.Kit de communication", "Kit de communication"),
          },
          {
            linkProps: { href: "https://kit.refugies.info/flyers/", target: "_blank" },
            text: t("Toolbar.posters_leaflets", "Affiches et dépliants"),
          },
          {
            linkProps: { href: "https://kit.refugies.info/presse/", target: "_blank" },
            text: t("Toolbar.Pour la presse", "Pour la presse"),
          },
          {
            linkProps: { href: "https://kit.refugies.info/ambassadeurs/", target: "_blank" },
            text: t("Toolbar.Pour les ambassadeurs", "Pour les ambassadeurs"),
          },
        ],
      },
      {
        linkProps: { href: "https://parrainage.refugies.info/", target: "_blank" },
        text: t("Toolbar.for_ukraine", "Pour l'Ukraine"),
      },
      {
        linkProps: { href: getPath("/agir", router.locale), prefetch: false },
        text: "AGIR",
        isActive: isCurrent(getPath("/agir", router.locale)),
      },
      !isMobileOnly
        ? {
            linkProps: { href: `${getPath("/", router.locale)}#application` },
            text: t("MobileAppModal.download", "Télécharger l'application"),
            isActive: isCurrent(getPath("/", router.locale)),
          }
        : null,
      {
        linkProps: {
          href: "#",
          onClick: () => {
            dispatch(toggleNewsletterModalAction());
            Event("NEWSLETTER", "open modal", "navbar");
          },
        },
        text: t("Toolbar.newsletter", "S'inscrire à la newsletter"),
      },
      isMobileOnly
        ? {
            linkProps: {
              href: isIOS ? iosStoreLink : androidStoreLink,
              target: "_blank",
              className: "px-0",
            },
            text: isIOS ? (
              <Image src={appStoreBadge} alt="Get it on App Store" width={120} height={40} className="mt-3" />
            ) : (
              <Image src={playStoreBadge} alt="Get it on Play Store" width={134} height={40} className="mt-3" />
            ),
          }
        : null,
    ].filter((n) => n !== null) as MainNavigationProps.Item[];
  }, [router.locale, router.pathname, backendNavigation, dispatch, t]);

  if (isEditionMode) return null;
  return (
    <Header
      brandTop="GOUVERNEMENT"
      homeLinkProps={{
        href: "/",
        title: "Accueil - Réfugiés.info",
      }}
      operatorLogo={{
        alt: "Réfugiés.info",
        imgUrl: "/images/logoRI.svg",
        orientation: "horizontal",
      }}
      quickAccessItems={quickAccessItems}
      navigation={navigationItems}
    />
  );
};

export default Navbar;
