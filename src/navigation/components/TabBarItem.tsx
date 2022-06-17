import React from "react";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { getTabBarIcon } from "../../libs/getTabBarIcon";
import { hasUserNewFavoritesSelector } from "../../services/redux/User/user.selectors";
import { theme } from "../../theme";
import { TabBarIcon } from "./TabBarIcon";
import { TabBarLabel } from "./TabBarLabel";

interface Props {
  isFocused: boolean;
  onPress: () => void;
  options: any;
  route: {name: string};
  label: string|undefined;
}

export const TabBarItem = (props: Props) => {
  const hasUserNewFavorites = useSelector(hasUserNewFavoritesSelector);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={props.isFocused ? { selected: true } : {}}
      accessibilityLabel={props.options.tabBarAccessibilityLabel}
      testID={props.options.tabBarTestID}
      onPress={props.onPress}
      style={{ flex: 1, alignItems: "center" }}
    >
      <TabBarIcon
        color={props.isFocused ? theme.colors.darkBlue : theme.colors.darkGrey}
        focused={props.isFocused}
        iconName={getTabBarIcon(props.route.name)}
        badge={props.route.name === "Favoris" ? hasUserNewFavorites : false}
      />
      <TabBarLabel
        focused={props.isFocused}
        label={props.label || ""}
      />
    </TouchableOpacity>
  );
}

