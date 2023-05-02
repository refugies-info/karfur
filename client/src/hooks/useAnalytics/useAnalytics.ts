import useConsentContext, { Consents } from "hooks/useConsentContext";
import { initGA, PageView } from "lib/tracking";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useAnalytics = () => {
  const router = useRouter();
  const { isAccepted } = useConsentContext();

  useEffect(() => {
    if (isAccepted(Consents.GOOGLE_ANALYTICS)) {
      initGA();
      const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
        if (isAccepted(Consents.GOOGLE_ANALYTICS) && !shallow) {
          PageView();
        }
      };
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
    return;
  }, [router, isAccepted]);
};

export default useAnalytics;
