import { RegisterGdprServices } from "@codegouvfr/react-dsfr/gdpr";
import { GdprStore } from "@codegouvfr/react-dsfr/gdpr/GdprStore";
import { useGdprStore } from "@codegouvfr/react-dsfr/useGdprStore";
import { Consents } from "./types";

/**
 * Temp function to override corrupted store from localStorage:
 * 1rst fix : get value from "mandatory-cookie-consumer" (old wrong key) and store the new one in local storage
 * 2nd fix : get value from google_analytics -> only the last item is stored in the store.
 * cf: https://github.com/codegouvfr/react-dsfr/issues/114
 */
const getFixConsent = (context: GdprStore) => {
  if (Object.keys((context?.consents || {})).includes("mandatory-cookie-consumer")) {
    const oldAccepted = !!context.consents?.["mandatory-cookie-consumer"];
    localStorage.setItem("dsfr-gdpr-consent", `{\"consents\":{\"google_analytics\":${oldAccepted ? "true" : "false"}},\"firstChoiceMade\":true}`);
    return oldAccepted;
  }
  if (Object.keys((context?.consents || {})).includes("google_analytics")) {
    return !!context.consents?.["google_analytics"];
  }
  return false
}

const useConsentContext = () => {
  const context = useGdprStore();

  /**
   * FIXME: when consentBanner is fixed, remove first line, return second one
   */
  const isAccepted = (consent: keyof RegisterGdprServices): boolean => {
    return getFixConsent(context);
    // return context.consents[consent] || false;
  };

  return {
    ...context,
    isAccepted,
  };
};

export default useConsentContext;
