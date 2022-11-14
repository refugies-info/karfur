import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { withProps } from "../../../utils";
import { useTheme } from "styled-components";
import styled from "styled-components/native";

const SkeletonListPage = styled(
  withProps(() => {
    const theme = useTheme();
    return {
      isLoading: true,
      layout: [
        {
          key: "Section1",
          width: "100%",
          height: 80,
          marginBottom: theme.layout.content.normalValue,
        },
        {
          key: "Section2",
          width: "100%",
          height: 80,
          marginBottom: theme.layout.content.normalValue,
        },
        {
          key: "Section3",
          width: "100%",
          height: 80,
          marginBottom: theme.layout.content.normalValue,
        },
      ],
      boneColor: theme.colors.grey,
      highlightColor: theme.colors.lightGrey,
    };
  })(SkeletonContent)
)`
  padding: ${({ theme }) => theme.layout.content.normal};
`;

export default SkeletonListPage;
