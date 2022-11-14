import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { ExplorerParamList } from "../../../types";
import { ExplorerScreen } from "../../screens/ExplorerTab/ExplorerScreen";
import { ContentScreen } from "../../screens/ContentScreen";
import { ContentsScreen } from "../../screens/ContentsScreen";
import { NeedsScreen } from "../../screens/ExplorerTab/NeedsScreen";
import { NotificationsScreen } from "../../screens/NotificationsScreen";
import { NearMeCardsScreen } from "../../screens";

interface Props {
  navigation?: any;
  route?: any;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ExplorerStack = createStackNavigator<ExplorerParamList>();

export const ExplorerNavigator = ({ navigation, route }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle:
        getFocusedRouteNameFromRoute(route) === "ContentScreen"
          ? {
              display: "none", // show tab bar everywhere except content screen
            }
          : {},
    });
  }, [navigation, route]);

  return (
    <ExplorerStack.Navigator screenOptions={{ headerShown: false }}>
      <ExplorerStack.Screen name="ExplorerScreen" component={ExplorerScreen} />
      <ExplorerStack.Screen name="ContentScreen" component={ContentScreen} />
      <ExplorerStack.Screen name="ContentsScreen" component={ContentsScreen} />
      <ExplorerStack.Screen name="NeedsScreen" component={NeedsScreen} />
      <ExplorerStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <ExplorerStack.Screen
        name="NearMeCardsScreen"
        component={NearMeCardsScreen}
      />
    </ExplorerStack.Navigator>
  );
};
