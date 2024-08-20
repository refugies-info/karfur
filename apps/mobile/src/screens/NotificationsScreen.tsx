import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React, { ComponentType, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";

import { styles } from "../theme";

import { Notification, useNotifications } from "../hooks/useNotifications";
import { useNotificationsStatus } from "../hooks/useNotificationsStatus";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { BottomTabParamList, ExplorerParamList } from "../../types";
import { Page, Rows } from "../components";
import { HeaderContentProps, HeaderContentTitle } from "../components/layout/Header";
import { EnableNotifications } from "../components/Notifications/EnableNotifications";
import { NotificationCard } from "../components/Notifications/NotificationCard";
import { withProps } from "../utils";

const ICON_SIZE = 24;

const stylesheet = StyleSheet.create({
  settingsButton: {
    width: 40,
    height: 40,
    backgroundColor: styles.colors.white,
    borderRadius: styles.radius,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...styles.shadowsStylesheet.lg,
  },
  noNotifications: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: styles.margin * 2,
  },
  noNotificationsTitle: {
    fontSize: styles.fonts.sizes.l,
    color: styles.colors.darkGrey,
    fontFamily: styles.fonts.families.marianneBold,
    lineHeight: 24,
    marginVertical: styles.margin * 2,
    textAlign: "center",
  },
  noNotificationsSubtitle: {
    fontSize: styles.fonts.sizes.md,
    color: styles.colors.darkGrey,
    fontFamily: styles.fonts.families.marianneReg,
    textAlign: "center",
    lineHeight: 20,
  },
});

const renderCard = (notification: Notification) => (
  <NotificationCard key={notification._id} notification={notification} />
);

type NotificationsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ExplorerParamList, "NotificationsScreen">,
  BottomTabNavigationProp<BottomTabParamList>
>;

export const NotificationsScreen = () => {
  const { t } = useTranslationWithRTL();
  const theme = useTheme();
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  let { data: notifications, isLoading } = useNotifications();

  const [accessGranted] = useNotificationsStatus();

  const goToNotificationsSettingsScreen = () =>
    // FIXME : remove ts-ignore
    //@ts-ignore
    navigation.navigate("Profil", {
      screen: "NotificationsSettingsScreen",
      initial: false,
    });

  const HeaderContent = useMemo(
    () =>
      withProps({
        title: t("notifications.notifications"),
        headerTooltip: (
          <TouchableOpacity
            style={stylesheet.settingsButton}
            activeOpacity={0.8}
            onPress={goToNotificationsSettingsScreen}
          >
            <Icon name="settings-outline" width={ICON_SIZE} height={ICON_SIZE} fill={theme.colors.black} />
          </TouchableOpacity>
        ),
      })(HeaderContentTitle) as ComponentType<HeaderContentProps>,
    [theme],
  );

  return (
    <Page headerTitle={t("notifications.notifications")} HeaderContent={HeaderContent} loading={isLoading}>
      {!accessGranted ? (
        <EnableNotifications />
      ) : !notifications?.notifications.length ? (
        <View style={stylesheet.noNotifications}>
          <Icon name="bell-off-outline" width={60} height={60} fill={styles.colors.darkGrey} />
          <Text style={stylesheet.noNotificationsTitle}>{t("notifications.noneYet")}</Text>
          <Text style={stylesheet.noNotificationsSubtitle}>
            {t("notifications.noneYetSubtitle1")}
            <Text
              onPress={goToNotificationsSettingsScreen}
              style={{
                fontFamily: styles.fonts.families.marianneBold,
                textDecorationLine: "underline",
              }}
            >
              {t("notifications.settings")}
            </Text>
            {t("notifications.noneYetSubtitle2")}
          </Text>
        </View>
      ) : (
        <Rows style={{ paddingBottom: styles.margin * 3 }}>{(notifications?.notifications || []).map(renderCard)}</Rows>
      )}
    </Page>
  );
};
