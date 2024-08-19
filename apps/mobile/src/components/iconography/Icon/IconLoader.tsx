import React from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";

import IconProps from "./icons/IconProps";

const IconLoader = ({ size }: Omit<IconProps, "color">) => {
  const theme = useTheme();
  return (
    <ActivityIndicator
      style={{ width: size, height: size }}
      size="small"
      color={theme.colors.action}
    />
  );
};

export default IconLoader;
