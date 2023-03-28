import React from "react";
import { View, Switch, StyleSheet } from "react-native";

import { styles } from "../../theme";
import styled from "styled-components/native";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

import { TextSmallBold, TextVerySmallNormal } from "../StyledText";
import { StreamlineIcon } from "../StreamlineIcon";
import { Picture } from "@refugies-info/api-types";

const ICON_SIZE = 24;

const stylesheet = StyleSheet.create({
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

const SwitchContainer = styled(View)`
  ${({ theme }) =>
    theme.i18n.isRTL ? "marginRight: 20px" : "marginLeft: 20px"};
`;

interface Props {
  enabled?: boolean; // Switch state
  title: string;
  subtitle?: string;
  icon?: Picture;
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
        stylesheet.container,
        isRTL && {
          flexDirection: "row-reverse",
        },
      ]}
    >
      <View
        style={[
          stylesheet.leftContainer,
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
              icon={icon}
              size={ICON_SIZE}
              stroke={
                disabled ? styles.colors.greyDisabled : styles.colors.black
              }
            />
          </View>
        )}
        <View
          style={[
            stylesheet.titleContainer,
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
                  marginTop: styles.margin,
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
      <SwitchContainer>
        <Switch
          onValueChange={onToggleSwitch}
          value={enabled}
          disabled={disabled}
          trackColor={{
            true: disabled ? styles.colors.greyDisabled : undefined,
          }}
        />
      </SwitchContainer>
    </View>
  );
};
