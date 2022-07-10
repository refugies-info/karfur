import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-eva-icons";

import { theme } from "../../theme";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useNotifications } from "../../hooks/useNotifications";

const ICON_WIDTH = 24;
const ICON_HEIGHT = 24;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 48,
    height: 48,
    marginRight: theme.margin,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius * 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadowsStylesheet.lg,
  },
  unseenContainer: {
    position: "absolute",
    top: theme.margin,
    right: theme.margin,
    backgroundColor: theme.colors.lighterRed,
    borderRadius: 10,
    width: theme.margin * 2,
    height: theme.margin * 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  unseenText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.verySmall,
    textAlign: "center",
    fontWeight: "500",
  },
});

const NotificationsIcon = () => {
  const { t } = useTranslationWithRTL();
  const { navigate } = useNavigation();
  const { data: notifications } = useNotifications();

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      accessibilityRole="button"
      accessibilityLabel={t("global.notifications")}
      onPress={() => navigate("NotificationsScreen")}
    >
      <Icon
        width={ICON_WIDTH}
        height={ICON_HEIGHT}
        name="bell-outline"
        fill={theme.colors.black}
      />
      {notifications && notifications.unseenCount > 0 && (
        <View style={styles.unseenContainer}>
          <Text style={styles.unseenText}>
            {notifications.unseenCount > 9 ? "9" : notifications.unseenCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationsIcon;
