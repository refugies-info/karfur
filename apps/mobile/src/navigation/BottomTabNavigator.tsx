/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { ReadButton } from "~/components/UI/ReadButton";
import { useStopVoiceover } from "~/hooks/useStopVoiceover";
import { getScreenFromUrl } from "~/libs/getScreenFromUrl";
import { noVoiceover } from "~/libs/noVoiceover";
import { setInitialUrlUsed } from "~/services/redux/User/user.actions";
import {
  currentI18nCodeSelector,
  initialUrlSelector,
  isInitialUrlUsedSelector,
} from "~/services/redux/User/user.selectors";
import { BottomTabParamList } from "~/types/navigation";
import { ExplorerNavigator } from "./BottomTabBar/ExplorerNavigator";
import { FavorisNavigator } from "./BottomTabBar/FavorisNavigator";
import { ProfileNavigator } from "./BottomTabBar/ProfileNavigator";
import { SearchNavigator } from "./BottomTabBar/SearchNavigator";
import { TabBarItem } from "./components/TabBarItem";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabBarContainer = styled.View`
  flex-direction: row;
  background-color: white;
  min-height: 48px;
  align-items: center;
  box-shadow: 0px 0px 4px #2121210a;
`;
const Space = styled.View`
  width: 56px;
  margin: ${({ theme }) => theme.margin}px;
`;

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
        navigation.navigate({
          name: route.name,
          merge: true,
          params: undefined,
        });
      }
    };

    return (
      <TabBarItem key={index} isFocused={isFocused} onPress={onPress} options={options} route={route} label={label} />
    );
  });

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const explorerScreen = state.routes.find((route) => route.name === "Explorer")?.state?.index || 0; // will return undefined if explorerScreen just mounted, 0 else

  const hasNotificationScreen = (
    state.routes.find((route) => route.name === "Explorer")?.state?.routes || ([] as any[])
  ).find((route) => route.name === "NotificationsScreen");

  const noReadButton =
    state.index === 3 || // profil tab
    (state.index === 0 && explorerScreen === 0) || // explorer screen
    (state.index === 0 && hasNotificationScreen) || // notification screen
    noVoiceover(currentLanguageI18nCode);
  if (!noReadButton) items.splice(2, 0, <Space key="space" />);

  const insetBottom = insets.bottom > 0 ? insets.bottom - 8 : 0;

  return (
    <BottomTabBarContainer
      style={{
        paddingTop: 5,
        paddingBottom: insetBottom,
      }}
    >
      {!noReadButton && <ReadButton bottomInset={insetBottom} />}
      {items.map((i) => i)}
    </BottomTabBarContainer>
  );
}

export default function BottomTabNavigator() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  // stop voiceover when changing screen
  const navigation = useNavigation();
  const stopVoiceover = useStopVoiceover();
  React.useEffect(() => {
    const unsubscribeState = navigation.addListener("state", () => {
      stopVoiceover();
    });

    return unsubscribeState;
  }, [navigation]);

  const initialUrl = useSelector(initialUrlSelector);
  const isInitialUrlUsed = useSelector(isInitialUrlUsedSelector);
  React.useEffect(() => {
    if (!isInitialUrlUsed && initialUrl) {
      if (!initialUrl.includes("refugies.info")) return;
      const screen = getScreenFromUrl(initialUrl);
      if (screen) {
        //@ts-ignore
        navigation.navigate(screen.rootNavigator, screen.screenParams);
      }
      dispatch(setInitialUrlUsed(true));
    }
  }, [initialUrl, isInitialUrlUsed]);

  return (
    <BottomTab.Navigator
      backBehavior="history"
      initialRouteName="Explorer"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} insets={insets} />}
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
        options={{ tabBarLabel: t("tab_bar.profile", "Moi") }}
      />
    </BottomTab.Navigator>
  );
}
