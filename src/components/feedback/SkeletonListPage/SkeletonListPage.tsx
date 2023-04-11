import React from "react";
import SkeletonContent from "react-native-skeleton-content";
import { useTheme } from "styled-components/native";

const SkeletonListPage = () => {
  const theme = useTheme();
  return (
    <SkeletonContent
      containerStyle={{
        display: "flex",
        flex: 1,
        marginTop: theme.margin * 3,
        marginHorizontal: theme.margin * 3,
      }}
      isLoading={true}
      layout={[
        {
          key: "Section1",
          width: "100%",
          height: 80,
          marginBottom: theme.margin * 3,
        },
        {
          key: "Section2",
          width: "100%",
          height: 80,
          marginBottom: theme.margin * 3,
        },
        {
          key: "Section3",
          width: "100%",
          height: 80,
          marginBottom: theme.margin * 3,
        },
      ]}
      boneColor={theme.colors.grey}
      highlightColor={theme.colors.lightGrey}
    />
  );
};

export default SkeletonListPage;
