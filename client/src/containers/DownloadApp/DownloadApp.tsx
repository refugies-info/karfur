import React from "react";
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import {
  iosStoreLink,
  androidStoreLink
} from "../../assets/storeLinks";
declare const window: Window;

const DownloadApp = (props: any) => {
  React.useEffect(() => {
    props.history.replace("/");
    if (isMobileOnly) {
      if (isAndroid) {
        window.open(androidStoreLink, "_blank");
        return;
      }
      if (isIOS) {
        window.open(iosStoreLink, "_blank");
        return;
      }
    }
  }, []);
  return null
}

export default DownloadApp;
