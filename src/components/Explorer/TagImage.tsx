import React from "react";
import { SvgUri } from "react-native-svg";
import { Theme } from "../../types/interface";
import Config from "../../libs/getEnvironment";

interface Props {
  theme: Theme;
}
export const TagImage = ({ theme }: Props) => {
  return (
    <SvgUri
      width={190}
      height={190}
      uri={Config.siteUrl + theme.appImage}
    />
  )
};
