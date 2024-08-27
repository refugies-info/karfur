import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SearchResultsScreen } from "~/screens/SearchTab/SearchResultsScreen";
import { SearchScreen } from "~/screens/SearchTab/SearchScreen";
import { SearchParamList } from "~/types/navigation";

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
      tabBarStyle:
        getFocusedRouteNameFromRoute(route) === "SearchResultsScreen"
          ? {
              display: "none", // show tab bar everywhere except search results screen
            }
          : {},
    });
  }, [navigation, route]);

  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen
        name="SearchResultsScreen"
        component={SearchResultsScreen}
        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
    </SearchStack.Navigator>
  );
};
