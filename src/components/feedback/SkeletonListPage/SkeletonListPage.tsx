import React from "react";
import { View } from "react-native";
// import SkeletonContent from "react-native-skeleton-content";
import { useTheme } from "styled-components/native";

const SkeletonListPage = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        marginTop: theme.margin * 3,
        marginHorizontal: theme.margin * 3,
      }}
    />
  );
};

export default SkeletonListPage;
