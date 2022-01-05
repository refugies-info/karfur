/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { useSelector } from "react-redux";
import { View } from "react-native";

import { BottomTabParamList } from "../../types";
import { ExplorerNavigator } from "./BottomTabBar/ExplorerNavigator";
import { ProfileNavigator } from "./BottomTabBar/ProfileNavigator";
import { Icon } from "react-native-eva-icons";
import { theme } from "../theme";
import { useTranslation } from "react-i18next";
import { hasUserNewFavoritesSelector } from "../services/redux/User/user.selectors";
import {
  StyledTextVerySmallBold,
  StyledTextVerySmall,
} from "../components/StyledText";
import styled from "styled-components/native";
import { FavorisNavigator } from "./BottomTabBar/FavorisNavigator";
import { SearchNavigator } from "./BottomTabBar/SearchNavigator";

const ICON_SIZE = 24;
const ICON_SIZE_SMALL = 18;
const ICON_EXPLORER = "compass";
const ICON_FAVORITES = "star";
const ICON_SEARCH = "search";
const ICON_PROFILE = "person";
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const renderTabBarIcon = (
  color: string,
  focused: boolean,
  iconName: string,
  badge?: boolean,
  isSmall?: boolean,
) => {
  const iconNameWithFocus = focused ? iconName : iconName + "-outline";
  return (
    <>
      <Icon
        name={iconNameWithFocus}
        width={!isSmall ? ICON_SIZE : ICON_SIZE_SMALL}
        height={!isSmall ? ICON_SIZE : ICON_SIZE_SMALL}
        fill={color}
      />
      {badge &&
      <View
        style={{
          width: theme.margin,
          height: theme.margin,
          position: "absolute",
          top: 2,
          left: "50%",
          marginLeft: 10,
          backgroundColor: theme.colors.darkBlue,
          borderRadius: theme.margin / 2
        }}
      ></View>
      }
    </>
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
  const hasUserNewFavorites = useSelector(hasUserNewFavoritesSelector);

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
          }) => renderTabBarIcon(color, focused, ICON_EXPLORER),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            renderTabBarLabel(color, focused, t("tab_bar.explorer", "Explorer")),
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
          }) => renderTabBarIcon(color, focused, ICON_FAVORITES, hasUserNewFavorites),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            renderTabBarLabel(color, focused, t("tab_bar.favorites", "Favoris")),
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
          }) => renderTabBarIcon(color, focused, ICON_SEARCH),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) =>
            renderTabBarLabel(color, focused, t("tab_bar.search", "Rechercher")),
        }}
      />
      <BottomTab.Screen
        name="Profil"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => renderTabBarIcon(color, focused, ICON_PROFILE),
          tabBarLabel: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => renderTabBarLabel(color, focused, t("tab_bar.profile", "Moi")),
        }}
      />
    </BottomTab.Navigator>
  );
}

interface TabBarProps {
  width: number
}
const FakeTabBarContainer = styled.View`
  background-color: ${theme.colors.greyF7};
  height: 40px;
  width: ${(props: {width: number}) => props.width}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: ${theme.radius * 2}px;
`;
const FakeTabBarItem = styled.View`
  align-items: center;
  width: 25%;
  padding-top: 4px;
`;
export const FakeTabBar = (props: TabBarProps) => {
  const { t } = useTranslation();

  return (
    <FakeTabBarContainer width={props.width}>
      <FakeTabBarItem>
        {renderTabBarIcon(theme.colors.darkGrey, false, ICON_EXPLORER, false, true)}
        {renderTabBarLabel(theme.colors.darkGrey, false, t("tab_bar.explorer", "Explorer"))}
      </FakeTabBarItem>
      <FakeTabBarItem>
        {renderTabBarIcon(theme.colors.darkGrey, false, ICON_FAVORITES, false, true)}
        {renderTabBarLabel(theme.colors.darkGrey, false, t("tab_bar.favorites", "Favoris"))}
      </FakeTabBarItem>
      <FakeTabBarItem>
        {renderTabBarIcon(theme.colors.darkGrey, false, ICON_SEARCH, false, true)}
        {renderTabBarLabel(theme.colors.darkGrey, false, t("tab_bar.search", "Rechercher"))}
      </FakeTabBarItem>
      <FakeTabBarItem>
        {renderTabBarIcon(theme.colors.darkBlue, true, ICON_PROFILE, false, true)}
        {renderTabBarLabel(theme.colors.darkBlue, true, t("tab_bar.profile", "Moi"))}
      </FakeTabBarItem>
    </FakeTabBarContainer>
  )
}