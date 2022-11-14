import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styled from "styled-components/native";
import { withProps } from "../../../utils";

// const InternalSafeAreaViewTopInset = styled.View<{ insetTop: number }>`
//   padding-top: ${({ insetTop }) => insetTop}px;
// `;

// /**
//  * @internal design-system
//  */
// const SafeAreaViewTopInset = withProps(() => {
//   const insets = useSafeAreaInsets();
//   return { insetTop: insets.top };
// })(InternalSafeAreaViewTopInset);

const SafeAreaViewTopInset = withProps({ edges: ["top"] })(SafeAreaView);

export default SafeAreaViewTopInset;
