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
        window.location.href = androidStoreLink;
        return;
      }
      if (isIOS) {
        window.location.href = iosStoreLink;
        return;
      }
    }
  }, []);
  return null
}

export default DownloadApp;
