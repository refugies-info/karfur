import React from "react";
import { useTheme } from "styled-components/native";
import { SkeletonContent } from "../../../components";

const PageSkeleton: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  return (
    <SkeletonContent
      containerStyle={{
        display: "flex",
        flex: 1,
        marginTop: 50,
        marginHorizontal: 24,
      }}
      isLoading={true}
      layout={[
        { key: "titreInfo", width: 220, height: 40, marginBottom: 16 },
        { key: "titreMarque", width: 180, height: 40, marginBottom: 52 },
        { key: "Title", width: 130, height: 35, marginBottom: 16 },
        { key: "Section1", width: "100%", height: 100 },
      ]}
      boneColor={theme.colors.grey}
      highlightColor={theme.colors.lightGrey}
    >
      {children}
    </SkeletonContent>
  );
};

export default PageSkeleton;
