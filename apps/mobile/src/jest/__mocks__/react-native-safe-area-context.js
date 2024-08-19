// __mocks__/react-native-safe-area-context.js
import React from "react";
import { View } from "react-native";

const inset = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const SafeAreaProvider = ({ children }) => children;

const SafeAreaConsumer = ({ children }) => children(inset);

const SafeAreaView = ({ children }) => <View style={inset}>{children}</View>;

const useSafeAreaInsets = () => inset;

module.exports = {
  SafeAreaProvider,
  SafeAreaConsumer,
  SafeAreaView,
  useSafeAreaInsets,
};
