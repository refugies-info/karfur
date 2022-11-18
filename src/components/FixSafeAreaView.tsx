import React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = styled(SafeAreaView)`
  z-index: 2;
  position: relative;
`;

export const FixSafeAreaView = (props: any) => {
  // there is an issue with react-native-safe-area-context on iPhone12 height is too big. I have not found simple fix other than what is below
  return <StyledSafeAreaView {...props}>{props.children}</StyledSafeAreaView>;
};
