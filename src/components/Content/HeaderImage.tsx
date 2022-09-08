import React from "react";
import { Theme } from "../../types/interface";
import { getImageUri } from "../../libs/getImageUri";
import { Image, View } from "react-native";

interface Props {
  theme: Theme | null;
  height: number;
}
export const HeaderImage = (props: Props) => {
  return props.theme ? (
    <View style={{height: props.height, display: "flex", alignItems: "center"}}>
      <Image
        source={{ uri: getImageUri(props.theme.appBanner.secure_url) }}
        style={{height: props.height, width: "100%"}}
      />
    </View>
  ) : null;
};
