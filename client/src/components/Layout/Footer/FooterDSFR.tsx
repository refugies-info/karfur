import { Footer as DSFRFooter, FooterProps } from "@codegouvfr/react-dsfr/Footer";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getPath } from "routes";
import { useEditionMode } from "hooks";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";
import { themesSelector } from "services/Themes/themes.selectors";

const Footer = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isEditionMode = useEditionMode();

  const themes = useSelector(themesSelector);

  const openCrisp = () => {
    window.$crisp.push(["do", "chat:open"]);
  };

  if (isEditionMode) return null;

  return (
    <DSFRFooter
      accessibility="partially compliant"
      brandTop="GOUVERNEMENT"
      operatorLogo={{
        alt: "Logo DIAIR",
        imgUrl: "/images/Logo-DIAIR.png",
        orientation: "horizontal",
      }}
      contentDescription={t(
        "Footer.Réfugiés.info est un portail d’information collaboratif visant à donner de l’information simple et traduite aux personnes réfugiées en France.",
        "Réfugiés.info est un portail d’information collaboratif visant à donner de l’information simple et traduite aux personnes réfugiées en France.",
      )}
      homeLinkProps={{
        href: "/",
        title: "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)",
      }}
      linkList={[
        {
          categoryName: "Chercher par thématique",
          links: themes.map((theme) => ({
            linkProps: {
              href: `${getPath("/recherche", router.locale)}?themes=${theme._id}`,
            },
            text: theme.short[router.locale || "fr"],
          })) as FooterProps.LinkList.Links,
        },
        {
          categoryName: t("Footer.Trois types d’information", "Trois types d’information"),
          links: [
            {
              linkProps: {
                href: getPath("/recherche", router.locale, "?type=dispositif"),
                hrefLang: router.locale,
              },
              text: t("Footer.Les fiches actions", "Les fiches actions"),
            },
            {
              linkProps: {
                href: getPath("/recherche", router.locale, "?type=demarche"),
                hrefLang: router.locale,
              },
              text: t("Footer.Les fiches démarches", "Les fiches démarches"),
            },
            {
              linkProps: {
                href: getPath("/annuaire", router.locale),
                hrefLang: router.locale,
              },
              text: t("Footer.L’annuaire des acteurs", "L’annuaire des acteurs"),
            },
          ],
        },
        {
          categoryName: t("Footer.Participer", "Participer"),
          links: [
            {
              linkProps: {
                href: getPath("/publier", router.locale),
              },
              text: t("Footer.Recenser mon action", "Recenser mon action"),
            },
            {
              linkProps: {
                href: getPath("/traduire", router.locale),
              },
              text: t("Footer.Aider à traduire", "Aider à traduire"),
            },
            {
              linkProps: {
                href: "https://avec.refugies.info/",
                target: "_blank",
              },
              text: t("Footer.Rejoindre le Réseau des contributeurs", "Rejoindre le Réseau des contributeurs"),
            },
            {
              linkProps: {
                href: "/",
                onClick: () => dispatch(toggleNewsletterModalAction()),
              },
              text: t("Footer.S’inscrire à la newsletter", "S’inscrire à la newsletter"),
            },
          ],
        },
        {
          categoryName: t("Footer.Ressources", "Ressources"),
          links: [
            {
              linkProps: {
                href: "https://kit.refugies.info/",
                target: "_blank",
              },
              text: t("Toolbar.Kit de communication", "Kit de communication"),
            },
            {
              linkProps: {
                href: "https://www.youtube.com/channel/UCdj-KP_whcRiS5XWoAa8HXw",
                target: "_blank",
              },
              text: t("Footer.Chaîne Youtube", "Chaîne Youtube"),
            },
            {
              linkProps: {
                href: "https://kit.refugies.info/flyers/",
                target: "_blank",
              },
              text: t("Toolbar.Affiches et dépliants", "Affiches et dépliants"),
            },
            {
              linkProps: {
                href: "https://kit.refugies.info/presse/",
                target: "_blank",
              },
              text: t("Toolbar.Pour la presse", "Pour la presse"),
            },
            {
              linkProps: {
                href: "https://kit.refugies.info/ambassadeurs/",
                target: "_blank",
              },
              text: t("Toolbar.Pour les ambassadeurs", "Pour les ambassadeurs"),
            },
            {
              linkProps: {
                href: "https://www.facebook.com/refugies.info",
                target: "_blank",
              },
              text: "Facebook",
            },
            {
              linkProps: {
                href: "https://www.linkedin.com/showcase/r%C3%A9fugi%C3%A9s.info/",
                target: "_blank",
              },
              text: "LinkedIn",
            },
            {
              linkProps: {
                href: "https://twitter.com/refugies_info",
                target: "_blank",
              },
              text: "Twitter",
            },
          ],
        },
        {
          categoryName: t("Footer.A propos", "A propos"),
          links: [
            {
              linkProps: {
                href: "https://accueil-integration-refugies.fr/",
                target: "_blank",
              },
              text: t(
                "Footer.La Délégation interministérielle à l’accueil et l’intégration des réfugiés",
                "La Délégation interministérielle à l’accueil et l’intégration des réfugiés",
              ),
            },
            {
              linkProps: {
                href: "https://lamednum.coop/notre-cooperative/",
                target: "_blank",
              },
              text: t("La Mednum", "La Mednum"),
            },
            {
              linkProps: {
                href: "https://eig.etalab.gouv.fr/",
                target: "_blank",
              },
              text: t(
                "Footer.Le programme Entrepreneur d’Intérêt Général",
                "Le programme Entrepreneur d’Intérêt Général",
              ),
            },
          ],
        },
        {
          categoryName: t("Aide", "Aide"),
          links: [
            {
              linkProps: {
                href: "https://help.refugies.info/fr/",
                hrefLang: "fr",
                target: "_blank",
              },
              text: t("Footer.Centre d'aide", "Consulter le centre d'aide"),
            },
            {
              linkProps: {
                onClick: openCrisp,
                href: "/",
              },
              text: t("Démarche administrative", "Contacter l'équipe"),
            },
            {
              linkProps: {
                href: "https://www.youtube.com/watch?v=h275aGr0r9E&list=PLa8oaTXn0u3QNXX1t9fYL54RElUYuZSqq",
                target: "_blank",
              },
              text: t("Footer.Comment utiliser l'application", "Comment utiliser l'application"),
            },
          ],
        },
      ]}
    />
  );
};

export default Footer;
