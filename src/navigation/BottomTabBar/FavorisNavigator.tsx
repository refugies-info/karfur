import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { FavorisParamList } from "../../../types";
import React from "react";
import { FavorisScreen } from "../../screens/FavorisTab/FavorisScreen";
import { ContentScreen } from "../../screens/ContentScreen";

interface Props {
  navigation?: any;
  route?: any;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const FavorisStack = createStackNavigator<FavorisParamList>();

export const FavorisNavigator = ({ navigation, route }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: (getFocusedRouteNameFromRoute(route) !== "FavorisContentScreen") // show tab bar everywhere except content screen
    })
  }, [navigation, route]);

  return (
    <FavorisStack.Navigator screenOptions={{ headerShown: false }}>
      <FavorisStack.Screen name="FavorisScreen" component={FavorisScreen} />
      <FavorisStack.Screen name="FavorisContentScreen" component={ContentScreen} />
    </FavorisStack.Navigator>
  )
}
