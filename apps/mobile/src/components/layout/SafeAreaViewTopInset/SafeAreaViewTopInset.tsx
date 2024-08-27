import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropsOf } from "~/utils";

const SafeAreaViewTopInset: React.FC<React.PropsWithChildren<PropsOf<typeof SafeAreaView>>> = ({
  children,
  ...others
}) => (
  <SafeAreaView edges={["top"]} {...others}>
    {children}
  </SafeAreaView>
);

SafeAreaViewTopInset.displayName = "SafeAreaViewTopInset";

export default SafeAreaViewTopInset;
