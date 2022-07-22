import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { SearchParamList } from "../../../types";
import { SearchScreen } from "../../screens/SearchTab/SearchScreen";
import { SearchResultsScreen } from "../../screens/SearchTab/SearchResultsScreen";
import { useDispatch } from "react-redux";
import { resetReadingList } from "../../services/redux/VoiceOver/voiceOver.actions";

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
      tabBarStyle: getFocusedRouteNameFromRoute(route) === "SearchResultsScreen" ? {
        display: "none" // show tab bar everywhere except search results screen
      } : {}
    })
  }, [navigation, route]);

  const dispatch = useDispatch();

  return (
    <SearchStack.Navigator
      screenOptions={{ headerShown: false }}
      screenListeners={{
        beforeRemove: () => {
          dispatch(resetReadingList());
        }
      }}
    >
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen name="SearchResultsScreen" component={SearchResultsScreen}
        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
    </SearchStack.Navigator>
  )
}
