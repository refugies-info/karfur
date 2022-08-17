import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useQueryClient } from "react-query";
//@ts-expect-error
import moment from "moment/min/moment-with-locales";

import { styles } from "../../theme";

import { Notification } from "../../hooks/useNotifications";
import { markNotificationAsSeen } from "../../utils/API";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

import { CustomButton } from "../CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { ExplorerParamList } from "../../../types";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    marginHorizontal: styles.margin * 2,
    marginVertical: styles.margin * 2,
    padding: styles.margin * 2,
    backgroundColor: styles.colors.white,
    borderRadius: styles.radius * 2,
    ...styles.shadowsStylesheet.lg,
  },
  leftContainer: {
    display: "flex",
    marginRight: styles.margin,
    marginTop: styles.margin / 2,
    alignItems: "flex-end",
  },
  rightContainer: {
    display: "flex",
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: styles.fonts.sizes.small,
    color: styles.colors.black,
    marginBottom: 10,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: styles.fonts.sizes.verySmall,
    color: styles.colors.darkGrey,
    marginBottom: 10,
  },
  cta: {
    backgroundColor: styles.colors.darkBlue,
    paddingHorizontal: styles.margin * 2,
    paddingVertical: styles.margin,
    marginTop: styles.margin,
    borderRadius: styles.radius * 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "#e8140f",
    width: 10,
    height: 10,
    borderRadius: 100,
    position: "absolute",
    left: theme.margin,
    top: theme.margin * 3
  },
});

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const { data, _id, title, seen, createdAt } = notification;
  const { isRTL, i18n } = useTranslationWithRTL();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

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
          backgroundColor: styles.colors.lightBlue,
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
            marginLeft: styles.margin,
            marginRight: 0,
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            seen && {
              backgroundColor: styles.colors.white,
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
              seen ? styles.colors.lightBlue : styles.colors.darkBlue
            }
            defaultText="Voir la fiche"
            textColor={seen ? styles.colors.darkBlue : styles.colors.white}
            isTextNotBold={seen}
            notFullWidth={true}
            isSmall={true}
            withShadows={false}
            iconName={isRTL ? "arrow-back" : "arrow-forward"}
            onPress={navigateToContent}
            style={{
              marginTop: styles.margin,
            }}
            textStyle={{
              fontSize: styles.fonts.sizes.verySmall,
            }}
            iconSize={16}
          />
          {!seen && (
            <CustomButton
              i18nKey="notifications.markAsSeen"
              defaultText="Marquer comme vu"
              textColor={styles.colors.darkBlue}
              backgroundColor={styles.colors.lightBlue}
              isTextNotBold={true}
              notFullWidth={true}
              isSmall={true}
              withShadows={false}
              onPress={markAsSeen}
              style={{
                marginTop: styles.margin,
                borderColor: styles.colors.darkBlue,
                borderWidth: 1,
                flexGrow: 1
              }}
              textStyle={{
                fontSize: styles.fonts.sizes.verySmall,
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
