import { createStackNavigator } from "@react-navigation/stack";
import { FavorisParamList } from "../../../types";
import React from "react";
import { FavorisScreen } from "../../screens/FavorisTab/FavorisScreen";
import { useDispatch } from "react-redux";
import { resetReadingList } from "../../services/redux/VoiceOver/voiceOver.actions";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const FavorisStack = createStackNavigator<FavorisParamList>();

export const FavorisNavigator = () => {
  const dispatch = useDispatch();

  return (
    <FavorisStack.Navigator
      screenOptions={{ headerShown: false }}
      screenListeners={{
        beforeRemove: () => {
          dispatch(resetReadingList());
        }
      }}
    >
      <FavorisStack.Screen name="FavorisScreen" component={FavorisScreen} />
    </FavorisStack.Navigator>
  )
}
