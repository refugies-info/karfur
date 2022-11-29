import {
  Header,
  HeaderBody,
  HeaderNav,
  HeaderOperator,
  Logo,
  NavItem,
  NavSubItem,
  Tool,
  ToolItem,
  ToolItemGroup
} from "@dataesr/react-dsfr";
import { logoRI } from "assets/figma";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { getPath } from "routes";
import LanguageToolItem from "./LanguageToolItem";
import NewsletterSubscribeNavItem from "./NewsletterSubscribeNavItem";
import SpeekToolItem from "./SpeekToolItem";

const Navbar = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Header closeButtonLabel="Fermeture">
      <HeaderBody>
        <Logo splitCharacter={10}>République Française</Logo>
        <HeaderOperator>
          <Image key="logo" src={logoRI} alt="logo refugies-info" />
        </HeaderOperator>
        <Tool>
          <ToolItemGroup>
            <SpeekToolItem />
            <LanguageToolItem />
            {/* <ToolTranslate currentLang="fr" descCurrentLang="Français">
              {/* <ToolTranslateItem href="#" hrefLang="fr" active>
                <span>
                  <i className="flag-icon flag-icon-fr" title="fr" /> Français
                </span>
              </ToolTranslateItem> * /}
              <ToolTranslateItem href="#" hrefLang="EN" active={false}>
                Anglais - English
              </ToolTranslateItem>
              <ToolTranslateItem href="#" hrefLang="AR" active={false}>
                Arabe - arabe
              </ToolTranslateItem>
            </ToolTranslate> */}
            <ToolItem asLink={<Link href={getPath("/register", router.locale)} />} icon="ri-user-add-line">
              {t("Toolbar.Inscription", "Inscription")}
            </ToolItem>
            <ToolItem asLink={<Link href={getPath("/login", router.locale)} />} icon="ri-user-line">
              {t("Toolbar.Connexion", "Connexion")}
            </ToolItem>
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      <HeaderNav>
        <NavItem asLink={<Link href={getPath("/recherche", router.locale)} />} title="Trouver de l'information" />
        <NavItem
          asLink={<Link href={`${getPath("/comment-contribuer", router.locale)}#ecrire-card`} />}
          title="Publier une fiche"
        />
        <NavItem
          asLink={<Link href={`${getPath("/comment-contribuer", router.locale)}#traduire-card`} />}
          title="Traduire"
        />
        <NavItem title="Parler de nous">
          <NavSubItem asLink={<a href="https://kit.refugies.info/" target="_blank" />} title="Kit de communication" />
          <NavSubItem
            asLink={<a href="https://kit.refugies.info/flyers/" target="_blank" />}
            title="Affiches et dépliants"
          />
          <NavSubItem asLink={<a href="https://kit.refugies.info/presse/" target="_blank" />} title="Pour la presse" />
          <NavSubItem
            asLink={<a href="https://kit.refugies.info/ambassadeurs/" target="_blank" />}
            title="Pour les ambassadeurs"
          />
        </NavItem>
        <NavItem asLink={<a href="https://parrainage.refugies.info/" target="_blank" />} title="Pour l'Ukraine" />
        <NavItem asLink={<a href="#application" />} title="Télécharger l'application" />
        <NewsletterSubscribeNavItem />
      </HeaderNav>
    </Header>
  );
};

export default Navbar;
