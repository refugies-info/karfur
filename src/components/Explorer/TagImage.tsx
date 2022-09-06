import React from "react";
import { SvgUri } from "react-native-svg";
import { Theme } from "../../types/interface";
import { getImageUri } from "../../libs/getImageUri";
import { View } from "react-native";

interface Props {
  theme: Theme;
}
export const TagImage = ({ theme }: Props) => {
  return (
    <View style={{width: 190, height: 190}}>
      <SvgUri
        width={"100%"}
        height={"100%"}
        uri={getImageUri(theme.appImage.secure_url)}
      />
    </View>
  )
};
