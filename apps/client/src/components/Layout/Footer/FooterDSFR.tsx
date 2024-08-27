import { Footer as DSFRFooter, FooterProps } from "@codegouvfr/react-dsfr/Footer";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getPath } from "routes";
import { useEditionMode } from "~/hooks";
import { FooterConsentManagementItem, FooterPersonalDataPolicyItem } from "~/hooks/useConsentContext";
import { Event } from "~/lib/tracking";
import { toggleNewsletterModalAction } from "~/services/Miscellaneous/miscellaneous.actions";
import { themesSelector } from "~/services/Themes/themes.selectors";

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
      accessibility="non compliant"
      accessibilityLinkProps={{ href: getPath("/declaration-accessibilite", router.locale), prefetch: false }}
      brandTop="GOUVERNEMENT"
      operatorLogo={{
        alt: "Logo DIAIR",
        imgUrl: "/images/Logo-DIAIR.png",
        orientation: "horizontal",
      }}
      contentDescription={t(
        "Footer.info",
        "Réfugiés.info est un portail d’information collaboratif visant à donner de l’information simple et traduite aux personnes réfugiées en France.",
      )}
      homeLinkProps={{
        href: "/",
        title: "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)",
      }}
      bottomItems={[
        <FooterPersonalDataPolicyItem key={2} />,
        <FooterConsentManagementItem key={3} />,
        <Link
          href="https://kit.refugies.info/stats/"
          key={4}
          className="fr-footer__bottom-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Statistiques
        </Link>,
      ]}
      termsLinkProps={{
        href: getPath("/mentions-legales", router.locale),
        title: t("Footer.legal_terms", "Mentions légales"),
        prefetch: false,
      }}
      websiteMapLinkProps={{
        href: getPath("/plan-du-site", router.locale),
        title: t("Footer.Plan du site", "Plan du site"),
        prefetch: false,
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
          categoryName: t("Footer.information_types", "Trois types d’information"),
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
              text: t("Footer.procedures", "Les fiches démarches"),
            },
            {
              linkProps: {
                href: getPath("/annuaire", router.locale),
                hrefLang: router.locale,
                prefetch: false,
              },
              text: t("Footer.directory", "L’annuaire des acteurs"),
            },
          ],
        },
        {
          categoryName: t("Footer.Participer", "Participer"),
          links: [
            {
              linkProps: {
                href: getPath("/publier", router.locale),
                prefetch: false,
              },
              text: t("Footer.Recenser mon action", "Recenser mon action"),
            },
            {
              linkProps: {
                href: getPath("/traduire", router.locale),
                prefetch: false,
              },
              text: t("Footer.help_translate", "Aider à traduire"),
            },
            {
              linkProps: {
                href: "https://avec.refugies.info/",
                target: "_blank",
              },
              text: t("Footer.join_network", "Rejoindre le Réseau des contributeurs"),
            },
            {
              linkProps: {
                href: "/",
                onClick: () => {
                  dispatch(toggleNewsletterModalAction());
                  Event("NEWSLETTER", "open modal", "footer");
                },
              },
              text: t("Footer.subscribe_to_newsletter", "S’inscrire à la newsletter"),
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
              text: t("Footer.youtube_channel", "Chaîne Youtube"),
            },
            {
              linkProps: {
                href: "https://kit.refugies.info/flyers/",
                target: "_blank",
              },
              text: t("Toolbar.posters_leaflets", "Affiches et dépliants"),
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
                href: "https://x.com/refugies_info",
                target: "_blank",
              },
              text: "X (ex-Twitter)",
            },
          ],
        },
        {
          categoryName: t("Footer.A propos", "A propos"),
          links: [
            {
              linkProps: {
                href: getPath("/qui-sommes-nous", router.locale),
                prefetch: false,
              },
              text: t("Footer.Le projet", "Le projet"),
            },
            {
              linkProps: {
                href: "https://accueil-integration-refugies.fr/",
                target: "_blank",
              },
              text: t("Footer.diair", "La Délégation interministérielle à l’accueil et l’intégration des réfugiés"),
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
              text: t("Footer.eig_program", "Le programme Entrepreneur d’Intérêt Général"),
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
              text: t("Footer.help_center", "Consulter le centre d'aide"),
            },
            {
              linkProps: {
                onClick: openCrisp,
                href: "/",
              },
              text: t("Footer.contact_team", "Contacter l'équipe"),
            },
            {
              linkProps: {
                href: "https://www.youtube.com/watch?v=h275aGr0r9E&list=PLa8oaTXn0u3QNXX1t9fYL54RElUYuZSqq",
                target: "_blank",
              },
              text: t("Footer.how_to_use_app", "Comment utiliser l'application"),
            },
          ],
        },
      ]}
    />
  );
};

export default Footer;
