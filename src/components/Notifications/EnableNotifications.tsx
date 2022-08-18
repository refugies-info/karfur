import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

import { theme } from "../../theme";

import { useNotificationsStatus } from "../../hooks/useNotificationsStatus";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

import {
  StyledTextBigBold,
  StyledTextNormal,
} from "../../components/StyledText";
import { CustomButton } from "../CustomButton";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginTop: theme.margin * 2,
    borderRadius: theme.radius * 2,
    backgroundColor: theme.colors.white,
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: theme.margin * 3,
  },
  lottieContainer: {
    height: 160,
    width: 160,
  },
  titles: {
    alignSelf: "center",
    marginBottom: theme.margin * 2,
  },
  separator: {
    marginVertical: theme.margin * 2,
  },
});

interface Props {
  withMargin?: boolean;
  fullSize?: boolean;
  onDismiss?: () => void | undefined;
}

export const EnableNotifications = ({
  withMargin = true,
  fullSize = true,
  onDismiss,
}: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const [, registerForNotifications] = useNotificationsStatus();

  return (
    <View
      style={[
        styles.container,
        !withMargin && {
          margin: 0,
        },
        fullSize && {
          flex: 1,
        },
        isRTL && {
          alignItems: "flex-end",
        },
      ]}
    >
      <LottieView
        colorFilters={[{ keypath: "bell icon", color: "#c8c8c8" }]}
        style={styles.lottieContainer}
        source={require("../../theme/lottie/notification-bell-animation.json")}
        autoPlay
        loop
        speed={1.2}
      />
      <View style={styles.titles}>
        <StyledTextBigBold isRTL={isRTL}>
          {t("notifications.newInfoEveryWeek")}
        </StyledTextBigBold>
        <View style={styles.separator} />
        <StyledTextNormal isRTL={isRTL}>
          {t("notifications.beInformed")}
        </StyledTextNormal>
      </View>
      <CustomButton
        i18nKey="notifications.enableNotifications"
        backgroundColor={theme.colors.darkBlue}
        iconName="checkmark-outline"
        defaultText="Activer les notifications"
        textColor={theme.colors.white}
        onPress={registerForNotifications}
        isTextNotBold={true}
      />
      {onDismiss && (
        <>
          <View
            style={{
              marginVertical: theme.margin,
            }}
          />
          <CustomButton
            i18nKey="notifications.notNow"
            backgroundColor={theme.colors.white}
            defaultText="Pas maintenant"
            textColor={theme.colors.black}
            onPress={onDismiss}
            isTextNotBold={true}
            withShadows={false}
          />
        </>
      )}
    </View>
  );
};
