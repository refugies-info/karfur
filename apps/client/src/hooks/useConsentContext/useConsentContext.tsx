import { createConsentManagement } from "@codegouvfr/react-dsfr/consentManagement";
import { useTranslation } from "next-i18next";
import { initGA } from "~/lib/tracking";

// finalityDescription est appelé dans un useMemo de react-dsfr : impossible d'y
// appeler useTranslation directement. On rend le libellé via un petit composant
// passé comme ReactNode : useTranslation s'exécute alors dans l'arbre React
// (contexte + locale corrects, contrairement à l'instance globale d'i18next).
const ConsentText = ({ tKey, fallback }: { tKey: string; fallback: string }) => {
  const { t } = useTranslation();
  return <>{t(tKey, fallback)}</>;
};

export const { ConsentBannerAndConsentManagement, FooterConsentManagementItem, useConsent } =
  createConsentManagement({
    finalityDescription: () => ({
      analytics: {
        title: <ConsentText tKey="Consent.analytics_title" fallback="Analyse" />,
        description: (
          <ConsentText
            tKey="Consent.analytics_description"
            fallback="Nous utilisons des cookies pour mesurer l’audience de notre site et améliorer son contenu."
          />
        ),
      },
      youtube: {
        title: "Youtube",
        description: (
          <ConsentText
            tKey="Consent.youtube_description"
            fallback="Nous utilisons des cookies pour afficher les vidéos Youtube."
          />
        ),
      },
    }),
    consentCallback: async ({ finalityConsent, finalityConsent_prev }) => {
      if (finalityConsent_prev?.analytics !== finalityConsent.analytics) {
        initGA(finalityConsent.analytics);
      }
    },
  });
