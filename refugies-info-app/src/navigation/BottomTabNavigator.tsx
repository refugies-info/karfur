/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import { BottomTabParamList } from "../../types";
import { ExplorerNavigator } from "./BottomTabBar/ExplorerNavigator";
import { Icon } from "react-native-eva-icons";
import { theme } from "../theme";
import { useTranslation } from "react-i18next";
import {
  StyledTextVerySmallBold,
  StyledTextVerySmall,
} from "../components/StyledText";
import styled from "styled-components/native";
import { FavorisNavigator } from "./BottomTabBar/FavorisNavigator";
import { SearchNavigator } from "./BottomTabBar/SearchNavigator";
import { ProfilScreen } from "../screens/ProfilTab/ProfilScreen";

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
  margin-bottom: 4px;
`;

const TabBarLabelTextBold = styled(StyledTextVerySmallBold)`
  color: ${(props: { color: string }) => props.color};
  margin-bottom: 4px;
`;
const renderTabBarLabel = (color: string, focused: boolean, name: string) => {
  if (focused)
    return <TabBarLabelTextBold color={color}>{name}</TabBarLabelTextBold>;
  return <TabBarLabelText color={color}>{name}</TabBarLabelText>;
};
export default function BottomTabNavigator() {
  const { t } = useTranslation();
  return (
    <BottomTab.Navigator
      initialRouteName="Explorer"
      tabBarOptions={{
        activeTintColor: theme.colors.darkBlue,
        inactiveTintColor: theme.colors.darkGrey,
        style: { borderTopWidth: 0, elevation: 0 },
      }}
    >
      <BottomTab.Screen
        name="Explorer"
        component={ExplorerNavigator}
        options={{
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
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => renderTabBarIcon(color, focused, "search"),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            renderTabBarLabel(color, focused, t("tabBar.Search", "Rechercher")),
        }}
      />
      <BottomTab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => renderTabBarIcon(color, focused, "person"),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => renderTabBarLabel(color, focused, t("tabBar.Profil", "Moi")),
        }}
      />
    </BottomTab.Navigator>
  );
}
