import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { Icon } from "react-native-eva-icons";

import { theme } from "../theme/index";

import { useNotifications, Notification } from "../hooks/useNotifications";
import { useNotificationsStatus } from "../hooks/useNotificationsStatus";

import { StyledTextBigBold } from "../components/StyledText";
import { HeaderWithBack } from "../components/HeaderWithBack";
import { NotificationCard } from "../components/Notifications/NotificationCard";
import { EnableNotifications } from "../components/Notifications/EnableNotifications";

const ICON_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    margin: theme.margin * 2,
    flex: 1,
  },
  settingsButton: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadowsStylesheet.lg,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: theme.margin * 2,
  },
  unseenCount: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.margin,
    fontSize: theme.fonts.sizes.small,
    backgroundColor: theme.colors.lighterRed,
    borderRadius: 100,
    height: 24,
    width: 24,
  },
  unseenCountText: {
    fontSize: theme.fonts.sizes.small,
    fontFamily: theme.fonts.families.circularBold,
    color: theme.colors.white,
  },
  noNotifications: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: theme.margin * 2,
  },
  noNotificationsTitle: {
    fontSize: theme.fonts.sizes.normal,
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.families.circularBold,
    lineHeight: 24,
    marginVertical: theme.margin * 2,
    textAlign: "center",
  },
  noNotificationsSubtitle: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.families.circularStandard,
    textAlign: "center",
    lineHeight: 20,
  },
});

const renderCard = (notification: Notification) => {
  return <NotificationCard notification={notification} />;
};

export const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { data: notifications, isLoading } = useNotifications();
  const [accessGranted] = useNotificationsStatus();

  const count = notifications ? notifications?.unseenCount : null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <HeaderWithBack navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <StyledTextBigBold>Notifications</StyledTextBigBold>
            {!!count && (
              <View style={styles.unseenCount}>
                <Text style={styles.unseenCountText}>
                  {count > 9 ? "9" : count}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("Profil", {
                screen: "NotificationsSettingsScreen",
                initial: false,
              })
            }
          >
            <Icon
              name="settings-outline"
              width={ICON_SIZE}
              height={ICON_SIZE}
              fill={theme.colors.black}
            />
          </TouchableOpacity>
        </View>

        {!accessGranted && (
          <View
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <EnableNotifications />
          </View>
        )}
        {!!accessGranted && (
          <View
            style={[
              {
                display: "flex",
              },
              !isLoading &&
                !notifications?.notifications?.length && {
                  justifyContent: "center",
                  flex: 1,
                },
            ]}
          >
            {isLoading && (
              <ActivityIndicator size="small" color={theme.colors.black} />
            )}
            {!isLoading && !notifications?.notifications.length && (
              <View style={styles.noNotifications}>
                <Icon
                  name="bell-off-outline"
                  width={60}
                  height={60}
                  fill={theme.colors.darkGrey}
                />
                <Text style={styles.noNotificationsTitle}>
                  Il n’y a pas encore de notifications !
                </Text>
                <Text style={styles.noNotificationsSubtitle}>
                  {
                    "Quand tu recevras des notifications, elles apparaîtront ici. Va dans les "
                  }
                  <Text
                    onPress={() => navigation.navigate("Profil")}
                    style={{
                      fontFamily: theme.fonts.families.circularBold,
                      textDecorationLine: "underline",
                    }}
                  >
                    {"paramètres"}
                  </Text>
                  {" pour choisir celles que tu souhaites recevoir."}
                </Text>
              </View>
            )}
            {!isLoading && !!notifications?.notifications.length && (
              <FlatList
                contentContainerStyle={{
                  marginBottom: theme.margin * 2,
                  paddingBottom: theme.margin * 2,
                }}
                data={notifications?.notifications || []}
                renderItem={({ item }) => renderCard(item)}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
