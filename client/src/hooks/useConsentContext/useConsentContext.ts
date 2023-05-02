import { GdprServiceNames } from "@codegouvfr/react-dsfr/ConsentBanner";
import { useGdprStore } from "@codegouvfr/react-dsfr/useGdprStore";

const useConsentContext = () => {
  const context = useGdprStore();

  const isAccepted = (consent: keyof GdprServiceNames): boolean => {
    return context.consents[consent] || false;
  };

  return {
    ...context,
    isAccepted,
  };
};

export default useConsentContext;
