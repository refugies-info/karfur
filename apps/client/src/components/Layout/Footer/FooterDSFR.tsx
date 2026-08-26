"use client";
import { Footer as DSFRFooter, type FooterProps } from "@codegouvfr/react-dsfr/Footer";
import { useWindowSize } from "@refugies-info/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { type MouseEvent, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPath } from "routes";
import { useEditionMode, useLocale, useSupportAvailability } from "~/hooks";
import { FooterConsentManagementItem } from "~/hooks/useConsentContext";
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
  const supportAvailability = useSupportAvailability();

  const openCrisp = () => {
    window.$crisp.push(["do", "chat:open"]);
  };

  const contactTeamLabel = {
    open: t("Footer.contact_team", "Contacter l'équipe"),
    closed: t(
      "Footer.contact_team_closed",
      "Contacter l'équipe du lundi au jeudi, de 9h30 à 12h30 et de 14h à 18h",
    ),
    unavailable: t(
      "Footer.contact_team_unavailable",
      "Contacter l'équipe (momentanément indisponible)",
    ),
  }[supportAvailability];

  // Hors horaires, le lien garde sa place et son apparence mais n'ouvre plus rien : rôle lien,
  // état désactivé, hors de l'ordre de tabulation. Le href subsiste car le Footer DSFR rend ce
  // lien avec next/link, qui l'exige ; la navigation est neutralisée par preventDefault.
  const contactTeamLinkProps =
    supportAvailability === "open"
      ? { onClick: openCrisp, href: "/" }
      : {
          href: "/",
          role: "link",
          "aria-disabled": true,
          tabIndex: -1,
          onClick: (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault(),
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
        brandTop="GOUVERNEMENT"
        id="fr-footer"
        className={cn(styles.footer)}
        operatorLogo={{
          alt: "Délégation interministérielle à l’accueil et à l’intégration des réfugiés",
          imgUrl: "/images/Logo-DIAIR.png",
          orientation: "horizontal",
        }}
        contentDescription={t(
          "Footer.info",
          "Réfugiés.info est un portail d’information collaboratif visant à donner de l’information simple et traduite aux personnes réfugiées en France.",
        )}
        // Le lien du bloc marque pointe vers le site de la DIAIR (décision du 26/08, audit RGAA 6.1) :
        // l'alt du logo, seul contenu du lien, en est le nom accessible et reflète la destination.
        // Le target est explicite ; l'URL étant absolue, le Link enregistré par react-dsfr rend de
        // toute façon ce lien en target="_blank" avec rel="noreferrer". Le title reprend l'intitulé
        // et signale la nouvelle fenêtre, comme les autres liens du Footer DSFR.
        homeLinkProps={{
          href: "https://accueil-integration-refugies.fr/",
          target: "_blank",
          title: `${t(
            "Footer.diair_full_name",
            "Délégation interministérielle à l’accueil et à l’intégration des réfugiés",
          )} - ${t("Footer.open_new_window", "ouvre une nouvelle fenêtre")}`,
        }}
        bottomItems={[
          <Link
            href={getPath("/plan-du-site", locale)}
            key="sitemap"
            className="fr-footer__bottom-link"
            prefetch={false}
          >
            {t("Footer.Plan du site", "Plan du site")}
          </Link>,
          <Link
            href={getPath("/declaration-accessibilite", locale)}
            key="accessibility"
            className="fr-footer__bottom-link"
            prefetch={false}
          >
            {t("Footer.accessibility_link", "Accessibilité : partiellement conforme")}
          </Link>,
          <Link
            href={getPath("/mentions-legales", locale)}
            key="legal-terms"
            className="fr-footer__bottom-link"
            prefetch={false}
          >
            {t("Footer.legal_terms", "Mentions légales")}
          </Link>,
          <Link
            href={getPath("/politique-de-confidentialite", locale)}
            key="personal-data"
            className="fr-footer__bottom-link"
            prefetch={false}
          >
            {t("Footer.privacy_policy", "Politique de confidentialité")}
          </Link>,
          <FooterConsentManagementItem key="consent" />,
          <Link
            href="https://kit.refugies.info/stats/"
            key="stats"
            className="fr-footer__bottom-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Footer.statistiques", "Statistiques")}
          </Link>,
        ]}
        linkList={[
          {
            categoryName: t("Footer.search_by_topics", "Chercher par thématiques"),
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
                linkProps: contactTeamLinkProps,
                text: contactTeamLabel,
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
