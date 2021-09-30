import React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";

const StyledSafeAreaView = styled(SafeAreaView)`
  z-index: 2;
  margin-bottom: ${(props: { isIPhone12: boolean }) =>
  props.isIPhone12 ? "-25" : "0"}px;
    position: relative;
`;

export const FixSafeAreaView = (props: any) => {
  // there is an issue with react-native-safe-area-context on iPhone12 height is too big. I have not found simple fix other than what is below
  const isIPhone12 = [
    "iPhone13,1",
    "iPhone13,2",
    "iPhone13,3",
    "iPhone13,4",
  ].includes(Device.modelId);
  return (
    <StyledSafeAreaView isIPhone12={isIPhone12} {...props}>
      {props.children}
    </StyledSafeAreaView>
  );
};
