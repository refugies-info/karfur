import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { SearchParamList } from "../../../types";
import { SearchScreen } from "../../screens/SearchTab/SearchScreen";
import { SearchResultsScreen } from "../../screens/SearchTab/SearchResultsScreen";

interface Props {
  navigation?: any;
  route?: any;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const SearchStack = createStackNavigator<SearchParamList>();

export const SearchNavigator = ({ navigation, route }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: (getFocusedRouteNameFromRoute(route) !== "SearchResultsScreen") // show tab bar everywhere except search results screen
    })
  }, [navigation, route]);

  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen name="SearchResultsScreen" component={SearchResultsScreen}
        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
    </SearchStack.Navigator>
  )
}
