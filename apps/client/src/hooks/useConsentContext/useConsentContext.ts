import { createConsentManagement } from "@codegouvfr/react-dsfr/consentManagement";
import { initGA } from "lib/tracking";

export const {
  ConsentBannerAndConsentManagement,
  FooterConsentManagementItem,
  FooterPersonalDataPolicyItem,
  useConsent
} = createConsentManagement({
  finalityDescription: () => ({
    analytics: {
      title: "Analyse",
      description: "Nous utilisons des cookies pour mesurer l’audience de notre site et améliorer son contenu.",
    },
    youtube: {
      title: "Youtube",
      description: "Nous utilisons des cookies pour afficher les vidéos Youtube."
    },
  }),
  personalDataPolicyLinkProps: {
    href: "/politique-de-confidentialite",
  },
  consentCallback: async ({ finalityConsent, finalityConsent_prev }) => {
    if (finalityConsent_prev?.analytics !== finalityConsent.analytics) {
      initGA(finalityConsent.analytics);
    }
  }
});
