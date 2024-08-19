import * as React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const originalWidth = 375;
const originalHeight = 403;
const aspectRatio = originalWidth / originalHeight;

export const BackStep1 = () => (
  <View style={{ width: "100%", aspectRatio }}>
    <Svg
      fill="none"
      height="100%"
      width="100%"
      viewBox={`0 0 ${originalWidth} ${originalHeight}`}
    >
      <Path
        d="m198 402.673c-155.5-9.151-198-67.621-198-67.621v-335.052h375v370.75s-107.103 36.036-177 31.923z"
        fill="#fb9175"
      />
    </Svg>
  </View>
);
