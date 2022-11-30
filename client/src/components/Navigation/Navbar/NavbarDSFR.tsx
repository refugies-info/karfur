import {
  Header,
  HeaderBody,
  HeaderNav,
  HeaderOperator,
  Logo,
  NavItem,
  NavSubItem,
  Tool,
  ToolItemGroup
} from "@dataesr/react-dsfr";
import { logoRI } from "assets/figma";
import { BackendNavigation } from "containers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { getPath } from "routes";
import {
  UserToolItem,
  SpeekToolItem,
  NewsletterSubscribeNavItem,
  SubscribeToolItem,
  TranslationToolItem
} from "./NavbarItems";

const Navbar = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Header closeButtonLabel={t`Fermeture`}>
      <HeaderBody>
        <Logo splitCharacter={10}>République Française</Logo>
        <HeaderOperator>
          <Image key="logo" src={logoRI} alt="logo refugies-info" />
        </HeaderOperator>
        <Tool>
          <ToolItemGroup>
            <SpeekToolItem />
            <SubscribeToolItem />
            <UserToolItem />
            <TranslationToolItem />
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      <HeaderNav>
        <NavItem
          asLink={<Link href={getPath("/recherche", router.locale)} />}
          title={t("Toolbar.Trouver de l'information", "Trouver de l'information")}
        />
        <NavItem
          asLink={<Link href={`${getPath("/comment-contribuer", router.locale)}#ecrire-card`} />}
          title={t("Toolbar.Publier une fiche", "Publier une fiche")}
        />
        <NavItem
          asLink={<Link href={`${getPath("/comment-contribuer", router.locale)}#traduire-card`} />}
          title={t("Toolbar.Traduire", "Traduire")}
        />
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
        <NavItem asLink={<a href="#application" />} title={t("MobileAppModal.Télécharger l'application")} />
        <NewsletterSubscribeNavItem />
      </HeaderNav>
      <BackendNavigation />
    </Header>
  );
};

export default Navbar;
