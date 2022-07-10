import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { useQueryClient } from "react-query";
//@ts-expect-error
import moment from "moment/min/moment-with-locales";
import { useTranslation } from "react-i18next";

import { theme } from "../../theme";

import { Notification } from "../../hooks/useNotifications";
import { markNotificationAsSeen } from "../../utils/API";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    marginHorizontal: theme.margin * 2,
    marginVertical: theme.margin * 2,
    padding: theme.margin * 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius * 2,
    ...theme.shadowsStylesheet.lg,
  },
  leftContainer: {
    display: "flex",
    marginRight: theme.margin,
    marginTop: theme.margin / 2,
    alignItems: "flex-end",
  },
  rightContainer: {
    display: "flex",
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.black,
    marginBottom: 10,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: theme.fonts.sizes.verySmall,
    color: theme.colors.darkGrey,
    marginBottom: 10,
  },
  cta: {
    backgroundColor: theme.colors.darkBlue,
    paddingHorizontal: theme.margin * 2,
    paddingVertical: theme.margin,
    borderRadius: theme.radius * 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "#e8140f",
    width: 10,
    height: 10,
    borderRadius: 100,
  },
});

const CTA = ({ unseen, onPress }: { unseen: boolean; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.cta,
        !unseen && {
          backgroundColor: theme.colors.lightBlue,
        },
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={{
          color: unseen ? theme.colors.white : theme.colors.darkBlue,
          fontSize: 14,
          paddingRight: theme.margin,
          fontWeight: "bold",
          fontFamily: theme.fonts.families.circularBold,
        }}
      >
        Voir la fiche
      </Text>
      <Icon
        name="arrow-forward"
        fill={unseen ? theme.colors.white : theme.colors.darkBlue}
        width={20}
        height={20}
      />
    </TouchableOpacity>
  );
};

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const { data, _id, title, seen, createdAt } = notification;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const navigateToContent = async () => {
    navigation.navigate("Explorer", {
      screen: "ContentScreen",
      params: {
        contentId: data?.contentId,
      },
    });
    await markNotificationAsSeen(_id);
    queryClient.invalidateQueries("notifications");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={navigateToContent}
      style={[
        styles.container,
        !seen && {
          backgroundColor: theme.colors.lightBlue,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.dot,
            seen && {
              backgroundColor: theme.colors.white,
            },
          ]}
        />
      </View>
      <View style={styles.rightContainer}>
        <View>
          <Text
            style={[
              styles.title,
              !seen && {
                fontWeight: "bold",
              },
            ]}
          >
            {title}
          </Text>
          <Text style={styles.subtitle}>
            {moment(createdAt).locale(i18n.language).fromNow()}
          </Text>
        </View>
        <CTA unseen={!seen} onPress={navigateToContent} />
      </View>
    </TouchableOpacity>
  );
};
