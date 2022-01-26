import {useEffect} from "react";
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { useRouter } from "next/router";
import {
  iosStoreLink,
  androidStoreLink
} from "assets/storeLinks";

const DownloadApp = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");

    if (isMobileOnly) {
      if (isAndroid) {
        window.location.replace(androidStoreLink);
        return;
      }
      if (isIOS) {
        window.location.replace(iosStoreLink);
        return;
      }
    }
  }, [router]);

  return null
}

export default DownloadApp;
