import { useMemo } from "react";
import { StreamlineIcon } from "../StreamlineIcon";

import { Picture } from "@refugies-info/api-types";
import { Image } from "react-native";

interface Props {
  icon?: Picture;
  stroke?: string;
  contentId: string;
  isSmall?: boolean;
  logo?: string | null;
}

const CARD_WIDTH = 84;
const SMALL_CARD_WIDTH = 58;

export const DemarcheImage = (props: Props) => {
  const cardWidth = useMemo(() => (props.isSmall ? SMALL_CARD_WIDTH : CARD_WIDTH), [props.isSmall]);

  return props.logo ? (
    <Image source={{ uri: props.logo }} resizeMode="contain" style={{ width: cardWidth, height: cardWidth, flex: 1 }} />
  ) : props.icon ? (
    <StreamlineIcon icon={props.icon} size={24} stroke={props.stroke} />
  ) : null;
};
