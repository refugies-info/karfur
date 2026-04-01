"use client";
import { Footer as DSFRFooter, type FooterProps } from "@codegouvfr/react-dsfr/Footer";
import { useWindowSize } from "@refugies-info/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPath } from "routes";
import { useEditionMode, useLocale } from "~/hooks";
import {
  FooterConsentManagementItem,
  FooterPersonalDataPolicyItem,
} from "~/hooks/useConsentContext";
import { cn } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { toggleNewsletterModalAction } from "~/services/Miscellaneous/miscellaneous.actions";
import { themesSelector } from "~/services/Themes/themes.selectors";
import styles from "./FooterDSFR.module.scss";

const Footer = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isEditionMode = useEditionMode();
  const { isMobile } = useWindowSize();
  const router = useRouter();

  const themes = useSelector(themesSelector);

  const openCrisp = () => {
    window.$crisp.push(["do", "chat:open"]);
  };

  const toggleNewsletter = useCallback(() => {
    dispatch(toggleNewsletterModalAction());
    Event("NEWSLETTER", "open modal", "footer");
  }, [dispatch]);

  if (isEditionMode) return null;

  return (
    <>
      <h2 className="sr-only">{t("Footer.useful_links", "Liens utiles")}</h2>
      <DSFRFooter
        accessibility="partially compliant"
        accessibilityLinkProps={{
          href: getPath("/declaration-accessibilite", locale),
          prefetch: false,
        }}
        brandTop="GOUVERNEMENT"
        id="fr-footer"
        className={cn(styles.footer)}
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
          title: "Accueil - Réfugiés.info",
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
          href: getPath("/mentions-legales", locale),
          title: t("Footer.legal_terms", "Mentions légales"),
          prefetch: false,
        }}
        websiteMapLinkProps={{
          href: getPath("/plan-du-site", locale),
          title: t("Footer.Plan du site", "Plan du site"),
          prefetch: false,
        }}
        linkList={[
          {
            categoryName: "Chercher par thématique",
            links: themes.map((theme) => ({
              linkProps: {
                href: `${getPath("/recherche", locale)}?themes=${theme._id}`,
              },
              text: theme.short[locale || "fr"],
            })) as FooterProps.LinkList.Links,
          },
          {
            categoryName: t("Footer.information_types", "Trois types d’information"),
            links: [
              {
                linkProps: {
                  href: getPath("/recherche", locale, "?type=dispositif"),
                  hrefLang: locale,
                },
                text: t("Footer.Les fiches actions", "Les fiches actions"),
              },
              {
                linkProps: {
                  href: getPath("/recherche", locale, "?type=demarche"),
                  hrefLang: locale,
                },
                text: t("Footer.procedures", "Les fiches démarches"),
              },
              // Temporary disabled
              // {
              //   linkProps: {
              //     href: getPath("/annuaire", locale),
              //     hrefLang: locale,
              //     prefetch: false,
              //   },
              //   text: t("Footer.directory", "L’annuaire des acteurs"),
              // },
            ],
          },
          {
            categoryName: t("Footer.Participer", "Participer"),
            links: [
              {
                linkProps: {
                  href: getPath("/publier", locale),
                  prefetch: false,
                },
                text: t("Footer.Recenser mon action", "Recenser mon action"),
              },
              {
                linkProps: {
                  href: getPath("/traduire", locale),
                  prefetch: false,
                },
                text: t("Footer.help_translate", "Aider à traduire"),
              },

              {
                linkProps: {
                  href: isMobile ? "#" : getPath("/", router.locale, "#newsletter"),
                  onClick: isMobile ? toggleNewsletter : undefined,
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
            ],
          },
          {
            categoryName: t("Footer.A propos", "A propos"),
            links: [
              {
                linkProps: {
                  href: getPath("/mission-et-impact", locale),
                  prefetch: false,
                },
                text: t("Footer.mission_impact", "Mission et impact"),
              },
              {
                linkProps: {
                  href: "https://accueil-integration-refugies.fr/",
                  target: "_blank",
                },
                text: t(
                  "Footer.diair",
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
    </>
  );
};

export default Footer;
