import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

import { styles } from "../../theme";

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
    margin: styles.margin * 2,
    borderRadius: styles.radius * 2,
    backgroundColor: styles.colors.white,
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: styles.margin * 2,
  },
  lottieContainer: {
    height: 160,
    width: 160,
  },
  titles: {
    alignSelf: "center",
    marginBottom: styles.margin * 2,
  },
  separator: {
    marginVertical: styles.margin * 2,
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
        backgroundColor={styles.colors.darkBlue}
        iconName="checkmark-outline"
        defaultText="Activer les notifications"
        textColor={styles.colors.white}
        onPress={registerForNotifications}
        isTextNotBold={true}
      />
      {onDismiss && (
        <>
          <View
            style={{
              marginVertical: styles.margin,
            }}
          />
          <CustomButton
            i18nKey="notifications.notNow"
            backgroundColor={styles.colors.white}
            defaultText="Pas maintenant"
            textColor={styles.colors.black}
            onPress={onDismiss}
            isTextNotBold={true}
            withShadows={false}
          />
        </>
      )}
    </View>
  );
};
