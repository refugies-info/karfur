import React from "react";
import { streamlineIconCorrespondency } from "../../containers/Dispositif/data";
import _ from "lodash";
// @ts-ignore
import StreamlineIcon from "@streamlinehq/streamline-icons-react";

export const infoCardIcon = (iconTitle: string | undefined, color?: string) => {
  const defaultIcon = streamlineIconCorrespondency[0].streamlineIcon;
  let iconType = defaultIcon;
  if (iconTitle) {
    const correspondingElement = _.find(
      streamlineIconCorrespondency,
      (element) => element.titleIcon === iconTitle
    );
    if (correspondingElement) {
      iconType = correspondingElement.streamlineIcon;
    }
  }

  if (color) {
    return <StreamlineIcon icon={iconType} stroke={color} size="18" />;
  }
  return <StreamlineIcon icon={iconType} size="18" />;
};
