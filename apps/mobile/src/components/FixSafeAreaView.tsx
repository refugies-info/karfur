import type { PropsWithChildren } from "react";
import { SafeAreaView, type SafeAreaViewProps } from "react-native-safe-area-context";
import styled from "styled-components/native";

const StyledSafeAreaView = styled(SafeAreaView)`
  z-index: 2;
  position: relative;
`;

type FixSafeAreaViewProps = PropsWithChildren<SafeAreaViewProps>;

export const FixSafeAreaView = (props: FixSafeAreaViewProps) => {
  // there is an issue with react-native-safe-area-context on iPhone12 height is too big. I have not found simple fix other than what is below
  return <StyledSafeAreaView {...props}>{props.children}</StyledSafeAreaView>;
};
