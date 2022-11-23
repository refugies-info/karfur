import React from "react";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { Icon } from "react-native-eva-icons";

import { styles } from "../theme";

import { useNotifications, Notification } from "../hooks/useNotifications";
import { useNotificationsStatus } from "../hooks/useNotificationsStatus";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

import { NotificationCard } from "../components/Notifications/NotificationCard";
import { EnableNotifications } from "../components/Notifications/EnableNotifications";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabParamList, ExplorerParamList } from "../../types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Page } from "../components";
import { withProps } from "../utils";
import { HeaderContentTitle } from "../components/layout/Header";

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
  unseenCount: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: styles.margin,
    fontSize: styles.fonts.sizes.small,
    backgroundColor: styles.colors.lighterRed,
    borderRadius: 100,
    height: 24,
    width: 24,
  },
  noNotifications: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: styles.margin * 2,
  },
  noNotificationsTitle: {
    fontSize: styles.fonts.sizes.normal,
    color: styles.colors.darkGrey,
    fontFamily: styles.fonts.families.circularBold,
    lineHeight: 24,
    marginVertical: styles.margin * 2,
    textAlign: "center",
  },
  noNotificationsSubtitle: {
    fontSize: styles.fonts.sizes.small,
    color: styles.colors.darkGrey,
    fontFamily: styles.fonts.families.circularStandard,
    textAlign: "center",
    lineHeight: 20,
  },
});

const renderCard = (notification: Notification) => {
  return <NotificationCard notification={notification} />;
};

export const NotificationsScreen = () => {
  const { t, isRTL } = useTranslationWithRTL();
  const navigation = useNavigation();
  const { data: notifications, isLoading } = useNotifications();

  const [accessGranted] = useNotificationsStatus();

  const count = notifications ? notifications?.unseenCount : null;

  const goToNotificationsSettingsScreen = () =>
    // FIXME : remove ts-ignore
    //@ts-ignore
    navigation.navigate("Profil", {
      screen: "NotificationsSettingsScreen",
      initial: false,
    });

  return (
    <Page
      headerTitle={t("notifications.notifications")}
      HeaderContent={withProps({
        title: t("notifications.notifications"),
        headerTooltip: (
          <TouchableOpacity
            style={stylesheet.settingsButton}
            activeOpacity={0.8}
            onPress={goToNotificationsSettingsScreen}
          >
            <Icon
              name="settings-outline"
              width={ICON_SIZE}
              height={ICON_SIZE}
              fill={styles.colors.black}
            />
          </TouchableOpacity>
        ),
      })(HeaderContentTitle)}
    >
      {!accessGranted && <EnableNotifications />}
      {!!accessGranted && (
        <View
          style={[
            {
              display: "flex",
              marginTop: styles.margin,
              marginHorizontal: styles.margin * 3,
              marginBottom: styles.margin * 4,
            },
            !isLoading &&
              !notifications?.notifications?.length && {
                justifyContent: "center",
                flex: 1,
              },
          ]}
        >
          {isLoading && (
            <ActivityIndicator size="small" color={styles.colors.black} />
          )}
          {!isLoading && !notifications?.notifications.length && (
            <View style={stylesheet.noNotifications}>
              <Icon
                name="bell-off-outline"
                width={60}
                height={60}
                fill={styles.colors.darkGrey}
              />
              <Text style={stylesheet.noNotificationsTitle}>
                {t("notifications.noneYet")}
              </Text>
              <Text style={stylesheet.noNotificationsSubtitle}>
                {t("notifications.noneYetSubtitle1")}
                <Text
                  onPress={goToNotificationsSettingsScreen}
                  style={{
                    fontFamily: styles.fonts.families.circularBold,
                    textDecorationLine: "underline",
                  }}
                >
                  {t("notifications.settings")}
                </Text>
                {t("notifications.noneYetSubtitle2")}
              </Text>
            </View>
          )}
          {!isLoading && !!notifications?.notifications.length && (
            <FlatList
              contentContainerStyle={{
                marginBottom: styles.margin * 2,
                paddingBottom: styles.margin * 4,
              }}
              data={notifications?.notifications || []}
              renderItem={({ item }) => renderCard(item)}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </Page>
  );
};
