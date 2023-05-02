import { Header, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getPath } from "routes";
import styled from "styled-components";
import useSpeekToolItem from "./NavbarItems/SpeekToolItem/useSpeekToolItem";
import useSubscribeToolItem from "./NavbarItems/SubscribeToolItem/useSubscribeToolItem";
import useUserToolItem from "./NavbarItems/UserToolItem/useUserToolItem";
import isInBrowser from "lib/isInBrowser";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";
import { useDispatch } from "react-redux";

const LogoImage = styled(Image)`
  max-width: 80%;
`;

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const speekItem = useSpeekToolItem();
  const subscribeItem = useSubscribeToolItem();
  const userItem = useUserToolItem();

  const quickAccessItems: HeaderProps.QuickAccessItem[] = [];
  if (speekItem) quickAccessItems.push(speekItem);
  if (subscribeItem) quickAccessItems.push(subscribeItem);
  if (userItem) quickAccessItems.push(userItem);

  const isCurrent = (href: string) =>
    isInBrowser() && (window?.location?.pathname || "") === "/" + router.locale + href;

  const isBackend = router.pathname.includes("/backend");

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
      navigation={
        !isBackend
          ? [
              {
                linkProps: { href: getPath("/recherche", router.locale) },
                text: t("Toolbar.Trouver de l'information", "Trouver de l'information"),
              },
              {
                linkProps: { href: getPath("/publier", router.locale) },
                text: t("Toolbar.Publier une fiche", "Publier une fiche"),
              },
              { linkProps: { href: getPath("/traduire", router.locale) }, text: t("Toolbar.Traduire", "Traduire") },
              {
                text: t("Toolbar.Parler de nous", "Parler de nous"),
                menuLinks: [
                  {
                    linkProps: { href: "https://kit.refugies.info/", target: "_blank" },
                    text: t("Toolbar.Kit de communication", "Kit de communication"),
                  },
                  {
                    linkProps: { href: "https://kit.refugies.info/flyers/", target: "_blank" },
                    text: t("Toolbar.Affiches et dépliants", "Affiches et dépliants"),
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
                linkProps: { href: "https://parrainage.refugies.info/" },
                text: t("Toolbar.Pour l'Ukraine", "Pour l'Ukraine"),
              },
              {
                linkProps: { href: `${getPath("/", router.locale)}#application` },
                text: t("MobileAppModal.Télécharger l'application", "Télécharger l'application"),
              },
              {
                linkProps: {
                  href: "#",
                  onClick: () => {
                    dispatch(toggleNewsletterModalAction());
                  },
                },
                text: t("Toolbar.S'inscrire à la newsletter", "S'inscrire à la newsletter"),
              },
            ]
          : []
      }
    />
  );
};

export default Navbar;
