import React from "react";
import { Theme } from "../../types/interface";
import { SvgUri } from "react-native-svg";
import { getImageUri } from "../../libs/getImageUri";
import { View } from "react-native";

interface Props {
  theme: Theme | null;
  height: number;
}
export const HeaderImage = (props: Props) => {
  return props.theme ? (
    <View style={{height: props.height, display: "flex", alignItems: "center"}}>
      <SvgUri
        uri={getImageUri(props.theme.banner.secure_url)}
        height={props.height}
      />
    </View>
  ) : null;
};
