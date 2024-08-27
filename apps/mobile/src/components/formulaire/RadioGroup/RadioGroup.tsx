import React from "react";
import { View } from "react-native";
import { PropsOf } from "~/utils";

const RadioGroup: React.FC<React.PropsWithChildren<PropsOf<typeof View>>> = ({ children, ...other }) => {
  return (
    <View accessibilityRole="radiogroup" {...other}>
      {children}
    </View>
  );
};

export default RadioGroup;
