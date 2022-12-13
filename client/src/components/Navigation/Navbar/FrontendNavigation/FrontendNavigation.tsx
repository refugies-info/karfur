import { HeaderNav, NavItem, NavSubItem } from "@dataesr/react-dsfr";
import isInBrowser from "lib/isInBrowser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { getPath } from "routes";
import { NewsletterSubscribeNavItem } from "../NavbarItems";

interface InternalNavItemProps {
  href: string;
  title: string;
}

const InternalNavItem = ({ href = "", title }: InternalNavItemProps) => {
  const router = useRouter();
  const current = isInBrowser() && (window?.location?.pathname || "") === "/" + router.locale + href;

  return <NavItem current={current} asLink={<Link href={href} />} title={title} />;
};

const FrontendNavigation = () => {
  const router = useRouter();
  const { t } = useTranslation();

  if (router.pathname.includes("/backend")) return null;

  return (
    <HeaderNav>
      <InternalNavItem
        href={getPath("/recherche", router.locale)}
        title={t("Toolbar.Trouver de l'information", "Trouver de l'information")}
      />
      <InternalNavItem
        href={getPath("/publier", router.locale)}
        title={t("Toolbar.Publier une fiche", "Publier une fiche")}
      />
      <InternalNavItem href={getPath("/traduire", router.locale)} title={t("Toolbar.Traduire", "Traduire")} />
      <NavItem title={t("Toolbar.Parler de nous", "Parler de nous")}>
        <NavSubItem
          asLink={<a href="https://kit.refugies.info/" target="_blank" />}
          title={t("Toolbar.Kit de communication", "Kit de communication")}
        />
        <NavSubItem
          asLink={<a href="https://kit.refugies.info/flyers/" target="_blank" />}
          title={t("Toolbar.Affiches et dépliants", "Affiches et dépliants")}
        />
        <NavSubItem
          asLink={<a href="https://kit.refugies.info/presse/" target="_blank" />}
          title={t("Toolbar.Pour la presse", "Pour la presse")}
        />
        <NavSubItem
          asLink={<a href="https://kit.refugies.info/ambassadeurs/" target="_blank" />}
          title={t("Toolbar.Pour les ambassadeurs", "Pour les ambassadeurs")}
        />
      </NavItem>
      <NavItem
        asLink={<a href="https://parrainage.refugies.info/" target="_blank" />}
        title={t("Toolbar.Pour l'Ukraine", "Pour l'Ukraine")}
      />
      <InternalNavItem
        href={`${getPath("/", router.locale)}#application`}
        title={t("MobileAppModal.Télécharger l'application", "Télécharger l'application")}
      />
      <NewsletterSubscribeNavItem />
    </HeaderNav>
  );
};

export default FrontendNavigation;
