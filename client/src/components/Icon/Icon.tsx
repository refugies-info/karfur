import React from "react";
import { streamlineIconCorrespondency } from "data/dispositif";
import find from "lodash/find";
import EVAIcon from "../UI/EVAIcon/EVAIcon";

export const infoCardIcon = (iconTitle: string | undefined, color?: string) => {
  // const defaultIcon = streamlineIconCorrespondency[0].streamlineIcon;
  // let iconType = defaultIcon;
  let iconTypeEva = streamlineIconCorrespondency[0].titleIcon;
  if (iconTitle) {
    const correspondingElement = find(
      streamlineIconCorrespondency,
      (element) => element.titleIcon === iconTitle
    );
    if (correspondingElement) {
      // iconType = correspondingElement.streamlineIcon;
      iconTypeEva = correspondingElement.evaIcon
        ? correspondingElement.evaIcon
        : correspondingElement.titleIcon;
    }
  }

  // if (color) {
  //   return <StreamlineIcon icon={iconType} stroke={color} size="18" />;
  // }
  // return <StreamlineIcon icon={iconType} size="18" />;

  if (color) {
    return <EVAIcon name={iconTypeEva} fill={color} />;
  }

  return <EVAIcon name={iconTypeEva} fill="#212121" />;
};
