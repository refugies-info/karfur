/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import * as React from "react";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabParamList } from "../../types";
import { ExplorerNavigator } from "./BottomTabBar/ExplorerNavigator";
import { ProfileNavigator } from "./BottomTabBar/ProfileNavigator";
import { FavorisNavigator } from "./BottomTabBar/FavorisNavigator";
import { SearchNavigator } from "./BottomTabBar/SearchNavigator";
import { ReadButton } from "../components/UI/ReadButton";
import { TabBarItem } from "./components/TabBarItem";
import { theme } from "../theme";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabBarContainer = styled(View)`
  flex-direction: row;
  background-color: white;
  height: 48px;
  align-items: center;
  box-shadow: 0px 0px 4px #2121210A;
`;
const Space = styled(View)`
  width: 56px;
  margin: ${theme.margin}px;
`

function BottomTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  // Hide tab bar if needed
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  //@ts-ignore
  if (focusedOptions?.tabBarStyle?.display === "none") return null;

  const items = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel as string;
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        // The `merge: true` option makes sure that the params inside the tab screen are preserved
        navigation.navigate({ name: route.name, merge: true , params: undefined });
      }
    };

    return (
      <TabBarItem
        key={index}
        isFocused={isFocused}
        onPress={onPress}
        options={options}
        route={route}
        label={label}
      />
    );
  })

  const explorerScreen = state.routes.find(route => route.name === "Explorer")?.state?.index
    || 0; // will return undefined if explorerScreen just mounted, 0 else
  const noReadButton = state.index === 3 // profil tab
    || (state.index === 0 && explorerScreen === 0); // explorer screen
  if (!noReadButton) items.splice(2, 0, <Space />);

  return (
    <BottomTabBarContainer
      style={{
        height: 48 + (insets.bottom || 0),
        paddingBottom: (insets.bottom || 0)
      }}
    >
      {!noReadButton && <ReadButton bottomInset={insets.bottom} />}
      {items.map(i => i)}
    </BottomTabBarContainer>
  );
}

export default function BottomTabNavigator() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <BottomTab.Navigator
      initialRouteName="Explorer"
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabBar {...props} insets={insets} />}
    >
      <BottomTab.Screen
        name="Explorer"
        component={ExplorerNavigator}
        options={{ tabBarLabel: t("tab_bar.explorer", "Explorer") }}
      />
      <BottomTab.Screen
        name="Favoris"
        component={FavorisNavigator}
        options={{ tabBarLabel: t("tab_bar.favorites", "Favoris") }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchNavigator}
        options={{ tabBarLabel: t("tab_bar.search", "Rechercher") }}
      />
      <BottomTab.Screen
        name="Profil"
        component={ProfileNavigator}
        options={{ tabBarLabel:  t("tab_bar.profile", "Moi") }}
      />
    </BottomTab.Navigator>
  );
}
