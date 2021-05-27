/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { TabOneScreen } from "../screens/TabOneScreen";
import { BottomTabParamList, TabOneParamList } from "../../types";
import { ExplorerNavigator } from "./BottomTabBar/ExplorerNavigator";
import { Icon } from "react-native-eva-icons";
import { theme } from "../theme";
import { t } from "../services/i18n";
import {
  StyledTextVerySmallBold,
  StyledTextVerySmall,
} from "../components/StyledText";
import styled from "styled-components/native";
import { FavorisNavigator } from "./BottomTabBar/FavorisNavigator";

const ICON_SIZE = 24;
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const renderTabBarIcon = (
  color: string,
  focused: boolean,
  iconName: string
) => {
  const iconNameWithFocus = focused ? iconName : iconName + "-outline";
  return (
    <Icon
      name={iconNameWithFocus}
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={color}
    />
  );
};

const TabBarLabelText = styled(StyledTextVerySmall)`
  color: ${(props: { color: string }) => props.color};
`;

const TabBarLabelTextBold = styled(StyledTextVerySmallBold)`
  color: ${(props: { color: string }) => props.color};
`;
const renderTabBarLabel = (color: string, focused: boolean, name: string) => {
  if (focused)
    return <TabBarLabelTextBold color={color}>{name}</TabBarLabelTextBold>;
  return <TabBarLabelText color={color}>{name}</TabBarLabelText>;
};
export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Explorer"
      tabBarOptions={{
        activeTintColor: theme.colors.darkBlue,
        inactiveTintColor: theme.colors.darkGrey,
      }}
    >
      <BottomTab.Screen
        name="Explorer"
        component={ExplorerNavigator}
        options={{
          // tabBarIcon: ({ color }: { color: string }) =>
          //   renderTabBarIcon(color, "compass"),
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => renderTabBarIcon(color, focused, "compass"),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            renderTabBarLabel(color, focused, t("tabBar.Explorer", "Explorer")),
        }}
      />
      <BottomTab.Screen
        name="Favoris"
        component={FavorisNavigator}
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => renderTabBarIcon(color, focused, "star"),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            renderTabBarLabel(color, focused, t("tabBar.Favoris", "Favoris")),
        }}
      />
      <BottomTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator screenOptions={{ headerShown: false }}>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        // options={{ headerTitle: "Tab One Title" }}
      />
    </TabOneStack.Navigator>
  );
}
