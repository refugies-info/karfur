// import SkeletonContent from "react-native-skeleton-content";
import { useTheme } from "styled-components/native";
import { withProps } from "../../../utils";
import { View } from "react-native";

const PageSkeleton = withProps(() => {
  return {
    style: {
      display: "flex",
      flex: 1,
      marginTop: 50,
      marginHorizontal: 24,
    },
  };
})(View);

export default PageSkeleton;
