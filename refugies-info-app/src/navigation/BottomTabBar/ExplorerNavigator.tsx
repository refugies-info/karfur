import { createStackNavigator } from "@react-navigation/stack";
import { ExplorerParamList } from "../../../types";
import React from "react";
import { ExplorerScreen } from "../../screens/ExplorerTab/ExplorerScreen";
import { ContentScreen } from "../../screens/ContentScreen";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ExplorerStack = createStackNavigator<ExplorerParamList>();

export const ExplorerNavigator = () => (
  <ExplorerStack.Navigator screenOptions={{ headerShown: false }}>
    <ExplorerStack.Screen name="ExplorerScreen" component={ExplorerScreen} />
    <ExplorerStack.Screen name="ContentScreen" component={ContentScreen} />
  </ExplorerStack.Navigator>
);
