import {
  Footer as DSFRFooter,
  FooterBody,
  FooterBodyItem,
  FooterBottom,
  FooterCopy,
  FooterLink,
  FooterOperator,
  FooterTop,
  FooterTopCategory,
  Link,
  Logo
} from "@dataesr/react-dsfr";
import { logoDIAIR } from "assets";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { getPath } from "routes";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";
import ThemesFooterCategory from "./ThemesFooterCategory";
import styles from "./FooterDSFR.module.scss";

const Footer = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openCrisp = () => {
    window.$crisp.push(["do", "chat:open"]);
  };

  return (
    <DSFRFooter className={styles.footer}>
      <FooterTop>
        <ThemesFooterCategory />
        <FooterTopCategory title={t("Footer.Trois types d’information", "Trois types d’information")}>
          <FooterLink asLink={<NextLink href={getPath("/recherche", router.locale, "?type=dispositif")} />}>
            {t("Footer.Les fiches actions", "Les fiches actions")}
          </FooterLink>
          <FooterLink asLink={<NextLink href={getPath("/recherche", router.locale, "?type=demarche")} />}>
            {t("Footer.Les fiches démarches", "Les fiches démarches")}
          </FooterLink>
          <FooterLink asLink={<NextLink href={getPath("/annuaire", router.locale)} />}>
            {t("Footer.L’annuaire des acteurs", "L’annuaire des acteurs")}
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title={t("Footer.Participer", "Participer")}>
          <FooterLink asLink={<NextLink href={getPath("/publier", router.locale)} />}>
            {t("Footer.Recenser mon action", "Recenser mon action")}
          </FooterLink>
          <FooterLink asLink={<NextLink href={getPath("/traduire", router.locale)} />}>
            {t("Footer.Aider à traduire", "Aider à traduire")}
          </FooterLink>
          <FooterLink asLink={<a href="https://avec.refugies.info/" target="_blank" />}>
            {t("Footer.Rejoindre le Réseau des contributeurs", "Rejoindre le Réseau des contributeurs")}
          </FooterLink>
          <FooterLink href="#" onClick={() => dispatch(toggleNewsletterModalAction())}>
            {t("Footer.S’inscrire à la newsletter", "S’inscrire à la newsletter")}
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title={t("Footer.Ressources", "Ressources")}>
          <FooterLink asLink={<a href="https://kit.refugies.info/" target="_blank" />}>
            {t("Toolbar.Kit de communication", "Kit de communication")}
          </FooterLink>
          <FooterLink href="https://www.youtube.com/channel/UCdj-KP_whcRiS5XWoAa8HXw" target="_blank">
            {t("Footer.Chaîne Youtube", "Chaîne Youtube")}
          </FooterLink>
          <FooterLink href="https://kit.refugies.info/flyers/" target="_blank">
            {t("Toolbar.Affiches et dépliants", "Affiches et dépliants")}
          </FooterLink>
          <FooterLink href="https://kit.refugies.info/presse/" target="_blank">
            {t("Toolbar.Pour la presse", "Pour la presse")}
          </FooterLink>
          <FooterLink href="https://kit.refugies.info/ambassadeurs/" target="_blank">
            {t("Toolbar.Pour les ambassadeurs", "Pour les ambassadeurs")}
          </FooterLink>
          <FooterLink href="https://www.facebook.com/refugies.info" target="_blank">
            Facebook
          </FooterLink>
          <FooterLink href="https://www.linkedin.com/showcase/r%C3%A9fugi%C3%A9s.info/" target="_blank">
            LinkedIn
          </FooterLink>
          <FooterLink href="https://twitter.com/refugies_info" target="_blank">
            Twitter
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title={t("Footer.A propos", "A propos")}>
          <FooterLink asLink={<NextLink href={getPath("/qui-sommes-nous", router.locale)} />}>
            {t("Footer.Le projet", "Le projet")}
          </FooterLink>
          <FooterLink href="https://accueil-integration-refugies.fr/" target="_blank">
            {t(
              "Footer.La Délégation interministérielle à l’accueil et l’intégration des réfugiés",
              "La Délégation interministérielle à l’accueil et l’intégration des réfugiés"
            )}
          </FooterLink>
          <FooterLink href="https://lamednum.coop/notre-cooperative/" target="_blank">
            {t("La Mednum", "La Mednum")}
          </FooterLink>
          <FooterLink href="https://eig.etalab.gouv.fr/" target="_blank">
            {t("Footer.Le programme Entrepreneur d’Intérêt Général", "Le programme Entrepreneur d’Intérêt Général")}
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title={t("Aide", "Aide")}>
          <FooterLink target="_blank" href="https://help.refugies.info/fr/">
            {t("Footer.Centre d'aide", "Consulter le centre d'aide")}
          </FooterLink>
          <FooterLink onClick={openCrisp} href="/">
            {t("Démarche administrative", "Contacter l'équipe")}
          </FooterLink>
          <FooterLink
            href="https://www.youtube.com/watch?v=h275aGr0r9E&list=PLa8oaTXn0u3QNXX1t9fYL54RElUYuZSqq"
            target="_blank"
          >
            {t("Footer.Comment utiliser l'application", "Comment utiliser l'application")}
          </FooterLink>
        </FooterTopCategory>
      </FooterTop>
      <FooterBody
        description={t(
          "Footer.Réfugiés.info est un portail d’information collaboratif visant à donner de l’information simple et traduite aux personnes réfugiées en France.",
          "Réfugiés.info est un portail d’information collaboratif visant à donner de l’information simple et traduite aux personnes réfugiées en France."
        )}
      >
        <Logo>Gouvernement</Logo>
        <FooterOperator>
          <Image key="logo" src={logoDIAIR} alt="logo DIAIR" />
        </FooterOperator>
        <FooterBodyItem>
          <Link href="https://www.legifrance.gouv.fr">legifrance.gouv.fr</Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link href="https://www.gouvernement.fr">gouvernement.fr</Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link href="https://www.service-public.fr">service-public.fr</Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link href="https://www.data.gouv.fr">data.gouv.fr</Link>
        </FooterBodyItem>
      </FooterBody>
      <FooterBottom>
        <FooterLink asLink={<NextLink href={getPath("/plan-du-site", router.locale)} />}>
          {t("Footer.Plan du site", "Plan du site")}
        </FooterLink>
        <FooterLink asLink={<NextLink href={getPath("/declaration-accessibilite", router.locale)} />}>
          {t("Footer.accessibility_link", "Accessibilité : non conforme")}
        </FooterLink>
        <FooterLink asLink={<NextLink href={getPath("/mentions-legales", router.locale)} />}>
          {t("Mentions légales", "Mentions légales")}
        </FooterLink>
        <FooterLink asLink={<NextLink href={getPath("/politique-de-confidentialite", router.locale)} />}>
          {t("Politique de confidentialité", "Politique de confidentialité")}
        </FooterLink>
        <FooterLink href="/" onClick={() => window.__axeptioSDK.openCookies && window.__axeptioSDK.openCookies()}>
          {t("Footer.Gestion des cookies", "Gestion des cookies")}
        </FooterLink>
        <FooterCopy>
          {t(
            "Footer.Sauf mention contraire, tous les contenus de ce site sont sous",
            "Sauf mention contraire, tous les contenus de ce site sont sous"
          )}{" "}
          <a
            href="https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf"
            target="_blank"
          >
            licence etalab-2.0
          </a>
        </FooterCopy>
      </FooterBottom>
    </DSFRFooter>
  );
};

export default Footer;
