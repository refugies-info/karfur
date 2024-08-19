import React from "react";
import { View } from "react-native";
import { Path, Svg } from "react-native-svg";

export const TextBubble = () => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}
  >
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 250 98"
      fill="none"
      preserveAspectRatio="none"
    >
      <Path
        d="M236.172 41.3636V1H1V97H236.172V56.6364L249 49L236.172 41.3636Z"
        fill="#E3E3FD"
        stroke="#DDDDDD"
      />
    </Svg>
  </View>
);
