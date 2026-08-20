import Link from "next/link";
import { useTranslation } from "next-i18next";
import type { ReactElement, ReactNode } from "react";
import LegalPagesLayout from "~/components/Layout/LegalPagesLayout";
import SEO from "~/components/Seo";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";
import { Event } from "~/lib/tracking";

interface SitemapLink {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  onClick?: () => void;
  children?: SitemapLink[];
}

interface SitemapSection {
  id: string;
  title: string;
  links: SitemapLink[];
}

const PlanDuSite = () => {
  const { t } = useTranslation();

  const sitemapData: SitemapSection[] = [
    {
      id: "mainNavigation",
      title: t("sitemap.sections.mainNavigation", "Navigation principale"),
      links: [
        {
          id: "home",
          label: t("sitemap.links.home", "Accueil"),
          href: "/",
          isExternal: true,
        },
        {
          id: "publishSheet",
          label: t("sitemap.links.publishSheet", "Publier une fiche"),
          href: "/publier",
          isExternal: true,
        },
        {
          id: "translateSheet",
          label: t("sitemap.links.translateSheet", "Traduire une fiche"),
          href: "/traduire",
          isExternal: true,
        },
        {
          id: "login",
          label: t("sitemap.links.login", "Connexion"),
          href: "/auth",
          isExternal: true,
          onClick: () => Event("AUTH", "start", "footer"),
        },
        {
          id: "procedures",
          label: t("sitemap.links.procedures", "Fiches démarches"),
          href: "/recherche",
          isExternal: true,
        },
        {
          id: "localDevices",
          label: t("sitemap.links.localDevices", "Dispositifs locaux"),
          href: "/recherche?type=dispositif",
          isExternal: true,
        },
        {
          id: "act",
          label: t("sitemap.links.act", "AGIR"),
          href: "/agir",
          isExternal: false,
        },
        {
          id: "missionImpact",
          label: t("sitemap.links.missionImpact", "Mission et impact"),
          href: "/mission-impact",
          isExternal: false,
        },
        {
          id: "freeResources",
          label: t("sitemap.links.freeResources", "Ressources gratuites"),
          href: "https://kit.refugies.info/",
          isExternal: true,
          children: [
            {
              id: "communicationKit",
              label: t("sitemap.links.communicationKit", "Kit de communication"),
              href: "https://kit.refugies.info/flyers/",
              isExternal: true,
            },
            {
              id: "orderPosters",
              label: t("sitemap.links.orderPosters", "Commander des affiches et dépliants"),
              href: "https://kit.refugies.info/flyers/",
              isExternal: true,
            },
            {
              id: "forPress",
              label: t("sitemap.links.forPress", "Pour la presse"),
              href: "https://kit.refugies.info/presse/",
              isExternal: true,
            },
            {
              id: "forAmbassadors",
              label: t("sitemap.links.forAmbassadors", "Pour les ambassadeurs"),
              href: "https://kit.refugies.info/ambassadeurs/",
              isExternal: true,
            },
          ],
        },
        {
          id: "installApp",
          label: t("sitemap.links.installApp", "Installer l'application"),
          href: "/#application",
          isExternal: true,
        },
        {
          id: "helpCenter",
          label: t("sitemap.links.helpCenter", "Centre d'aide"),
          href: "https://help.refugies.info/fr/",
          isExternal: true,
        },
      ],
    },
    {
      id: "quickLinks",
      title: t("sitemap.sections.quickLinks", "Liens d'accès rapide"),
      links: [
        {
          id: "accessibility",
          label: t("sitemap.links.accessibility", "Déclaration d'accessibilité"),
          href: "/declaration-accessibilite",
          isExternal: true,
        },
        {
          id: "legalNotice",
          label: t("sitemap.links.legalNotice", "Mentions légales"),
          href: "/mentions-legales",
          isExternal: true,
        },
        {
          id: "privacyPolicy",
          label: t("sitemap.links.privacyPolicy", "Politique de confidentialité"),
          href: "/politique-de-confidentialite",
          isExternal: true,
        },
        {
          id: "statistics",
          label: t("sitemap.links.statistics", "Statistiques"),
          href: "https://kit.refugies.info/stats/",
          isExternal: true,
        },
      ],
    },
    {
      id: "socialNetworks",
      title: t("sitemap.sections.socialNetworks", "Réseaux sociaux"),
      links: [
        {
          id: "youtube",
          label: t("sitemap.links.youtube", "Chaîne YouTube"),
          href: "https://www.youtube.com/channel/UCdj-KP_whcRiS5XWoAa8HXw",
          isExternal: true,
        },
        {
          id: "facebook",
          label: t("sitemap.links.facebook", "Facebook"),
          href: "https://www.facebook.com/refugies.info",
          isExternal: true,
        },
        {
          id: "linkedin",
          label: t("sitemap.links.linkedin", "LinkedIn"),
          href: "https://www.linkedin.com/showcase/r%C3%A9fugi%C3%A9s.info",
          isExternal: true,
        },
        {
          id: "instagram",
          label: t("sitemap.links.instagram", "Instagram"),
          href: "https://www.instagram.com/refugies.info",
          isExternal: true,
        },
      ],
    },
  ];

  const renderLink = (link: SitemapLink) => {
    const linkContent = (
      <span className="text-tokens-lighttextdefault-grey hover:text-tokens-lighttexttitle-grey hover:underline">
        {link.label}
      </span>
    );

    return (
      <Link
        href={link.href}
        onClick={link.onClick}
        className="fr-link hover:underline"
        prefetch={link.isExternal ? false : undefined}
        {...(link.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {linkContent}
      </Link>
    );
  };

  return (
    <>
      <SEO title={t("sitemap.title", "Plan du site")} />
      <h1 className="mb-8 md:mb-20">{t("sitemap.title", "Plan du site")}</h1>

      <div className="space-y-10 md:space-y-20">
        {sitemapData.map((section) => (
          <div key={section.id} className="border-default-grey border p-4 md:p-10">
            <h2>{section.title}</h2>

            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.id} className="text-base">
                  {renderLink(link)}
                  {link.children && (
                    <ul className="mb-0 space-y-2">
                      {link.children.map((childLink) => (
                        <li key={childLink.id} className="text-base">
                          {renderLink(childLink)}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

/**
 * Dedicated layout component that handles translations and page title.
 * Separated from main component to ensure proper hook usage and improve maintainability.
 * This pattern is used because Next.js page components require special handling for hooks in getLayout.
 */
const PlanDuSiteLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  return <LegalPagesLayout title={t("sitemap.title", "Plan du site")}>{children}</LegalPagesLayout>;
};

// Using Next.js layout pattern with a separate component to avoid hook usage in static method
// This ensures proper React hooks behavior and server-side rendering compatibility
PlanDuSite.getLayout = (page: ReactElement) => <PlanDuSiteLayout>{page}</PlanDuSiteLayout>;

export const getStaticProps = defaultStaticProps;

export default PlanDuSite;
