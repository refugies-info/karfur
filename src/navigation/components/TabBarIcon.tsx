import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { theme } from "../../theme";

interface TabBarIconProps {
  color: string;
  focused: boolean;
  iconName: string;
  badge?: boolean;
  isSmall?: boolean;
}

const ICON_SIZE = 24;
const ICON_SIZE_SMALL = 18;

export const TabBarIcon = (props: TabBarIconProps) => {
  const iconNameWithFocus = props.focused ? props.iconName : props.iconName + "-outline";
  return (
    <>
      <Icon
        name={iconNameWithFocus}
        width={!props.isSmall ? ICON_SIZE : ICON_SIZE_SMALL}
        height={!props.isSmall ? ICON_SIZE : ICON_SIZE_SMALL}
        fill={props.color}
      />
      {props.badge &&
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