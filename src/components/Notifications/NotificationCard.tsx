import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useQueryClient } from "react-query";
//@ts-expect-error
import moment from "moment/min/moment-with-locales";
import { useTranslation } from "react-i18next";

import { theme } from "../../theme";

import { Notification } from "../../hooks/useNotifications";
import { markNotificationAsSeen } from "../../utils/API";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

import { CustomButton } from "../CustomButton";

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
    marginTop: theme.margin,
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

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const { data, _id, title, seen, createdAt } = notification;
  const { t, isRTL } = useTranslationWithRTL();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const markAsSeen = async () => {
    await markNotificationAsSeen(_id);
    queryClient.invalidateQueries("notifications");
  };

  const navigateToContent = async () => {
    navigation.navigate("Explorer", {
      screen: "ContentScreen",
      params: {
        contentId: data?.contentId,
      },
    });
    markAsSeen();
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
        isRTL && {
          flexDirection: "row-reverse",
        },
      ]}
    >
      <View
        style={[
          styles.leftContainer,
          isRTL && {
            marginLeft: theme.margin,
            marginRight: 0,
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            seen && {
              backgroundColor: theme.colors.white,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.rightContainer,
          isRTL && {
            alignItems: "flex-end",
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.title,
              !seen && {
                fontWeight: "bold",
              },
              isRTL && {
                textAlign: "right",
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.subtitle &&
                isRTL && {
                  textAlign: "right",
                },
            ]}
          >
            {moment(createdAt).locale(i18n.language).fromNow()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <CustomButton
            i18nKey="notifications.viewFiche"
            backgroundColor={
              seen ? theme.colors.lightBlue : theme.colors.darkBlue
            }
            defaultText="Voir la fiche"
            textColor={seen ? theme.colors.darkBlue : theme.colors.white}
            isTextNotBold={seen}
            notFullWidth={true}
            isSmall={true}
            withShadows={false}
            iconName={isRTL ? "arrow-back" : "arrow-forward"}
            onPress={navigateToContent}
            style={{
              marginTop: theme.margin,
            }}
            textStyle={{
              fontSize: theme.fonts.sizes.verySmall,
            }}
            iconSize={16}
          />
          {!seen && (
            <CustomButton
              i18nKey="notifications.markAsSeen"
              defaultText="Marquer comme vu"
              textColor={theme.colors.darkBlue}
              backgroundColor={theme.colors.lightBlue}
              isTextNotBold={true}
              notFullWidth={true}
              isSmall={true}
              withShadows={false}
              onPress={markAsSeen}
              style={{
                marginTop: theme.margin,
                borderColor: theme.colors.darkBlue,
                borderWidth: 1,
              }}
              textStyle={{
                fontSize: theme.fonts.sizes.verySmall,
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
