import { createStackNavigator } from "@react-navigation/stack";
import { SearchParamList } from "../../../types";
import React from "react";
import { SearchScreen } from "../../screens/SearchTab/SearchScreen";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const SearchStack = createStackNavigator<SearchParamList>();

export const SearchNavigator = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
  </SearchStack.Navigator>
);
