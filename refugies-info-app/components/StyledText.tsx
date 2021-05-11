import * as React from "react";

import { Text, TextProps } from "./Themed";
import { View } from "react-native";

export function MonoText(props: TextProps) {
  return (
    <View>
      <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
      <Text {...props} style={[props.style, { fontFamily: "circular" }]} />
    </View>
  );
}
