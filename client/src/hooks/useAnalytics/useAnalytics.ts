import { useEffect } from "react";
import { initGA } from "lib/tracking";

const useAnalytics = () => {
  // const router = useRouter();
  // const { isAccepted } = useConsentContext();

  useEffect(() => {
    // if (isAccepted(Consents.GOOGLE_ANALYTICS)) {
    initGA();
    // }
    return;
  }, []);
};

export default useAnalytics;
