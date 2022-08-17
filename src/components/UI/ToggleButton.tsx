import React from "react";
import { View, Switch, StyleSheet } from "react-native";

import { styles } from "../../theme";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

import { TextSmallBold, TextVerySmallNormal } from "../StyledText";
import { StreamlineIcon } from "../StreamlineIcon";

const ICON_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: styles.margin * 2,
  },
  leftContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: styles.margin,
    flex: 1,
  },
  icon: {
    marginRight: styles.margin * 2,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

interface Props {
  enabled?: boolean; // Switch state
  title: string;
  subtitle?: string;
  icon?: string;
  onToggle?: (value: boolean) => void;
  disabled?: boolean; // Toggle button disabled
}

export const ToggleButton = ({
  title,
  subtitle,
  icon,
  enabled,
  onToggle,
  disabled,
}: Props) => {
  const { isRTL } = useTranslationWithRTL();

  const onToggleSwitch = () => {
    if (onToggle) {
      onToggle(!enabled);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isRTL && {
          flexDirection: "row-reverse",
        },
      ]}
    >
      <View
        style={[
          styles.leftContainer,
          isRTL && {
            flexDirection: "row-reverse",
          },
        ]}
      >
        {icon && (
          <View
            style={{
              marginRight: isRTL ? 0 : styles.margin,
              marginLeft: isRTL ? styles.margin : 0,
            }}
          >
            <StreamlineIcon
              name={icon}
              width={ICON_SIZE}
              height={ICON_SIZE}
              stroke={disabled ? styles.colors.greyDisabled : styles.colors.black}
            />
          </View>
        )}
        <View
          style={[
            styles.titleContainer,
            isRTL && {
              alignItems: "flex-end",
            },
          ]}
        >
          <TextSmallBold
            style={
              disabled && {
                color: styles.colors.greyDisabled,
              }
            }
          >
            {title}
          </TextSmallBold>
          {subtitle && (
            <TextVerySmallNormal
              style={[
                {
                  color: styles.colors.darkGrey,
                  marginTop: styles.margin * 2
                },
                disabled && {
                  color: styles.colors.greyDisabled,
                },
              ]}
            >
              {subtitle}
            </TextVerySmallNormal>
          )}
        </View>
      </View>
      <View>
        <Switch
          onValueChange={onToggleSwitch}
          value={enabled}
          disabled={disabled}
          trackColor={
            disabled
              ? {
                  true: styles.colors.greyDisabled,
                }
              : {
                  true: undefined,
                }
          }
        />
      </View>
    </View>
  );
};
