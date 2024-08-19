import { useEffect, ReactElement } from "react";
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { useRouter } from "next/router";
import { iosStoreLink, androidStoreLink } from "data/storeLinks";

const DownloadApp = () => {
  const router = useRouter();

  useEffect(() => {
    if (isMobileOnly) {
      if (isAndroid) {
        window.location.replace(androidStoreLink);
        return;
      }
      if (isIOS) {
        window.location.replace(iosStoreLink);
        return;
      }
    } else {
      router.replace("/");
    }
  }, [router]);

  return null;
};

export default DownloadApp;

// override default layout and options
DownloadApp.getLayout = (page: ReactElement) => page;
DownloadApp.options = {
  cookiesModule: false,
  supportModule: false,
};
