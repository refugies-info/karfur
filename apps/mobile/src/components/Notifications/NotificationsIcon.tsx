import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";

import { styles } from "~/theme";

import { useNotifications } from "~/hooks/useNotifications";
import { useNotificationsStatus } from "~/hooks/useNotificationsStatus";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { FirebaseEvent } from "~/utils/eventsUsedInFirebase";
import { logEventInFirebase } from "~/utils/logEvent";

const ICON_WIDTH = 24;
const ICON_HEIGHT = 24;

const stylesheet = StyleSheet.create({
  buttonContainer: {
    width: 48,
    height: 48,
    marginRight: styles.margin,
    backgroundColor: styles.colors.white,
    borderRadius: styles.radius * 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...styles.shadowsStylesheet.lg,
  },
  unseenContainer: {
    position: "absolute",
    top: styles.margin,
    right: styles.margin,
    backgroundColor: styles.colors.lighterRed,
    borderRadius: 10,
    width: styles.margin * 2,
    height: styles.margin * 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  unseenText: {
    color: styles.colors.white,
    fontSize: styles.fonts.sizes.xs,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: styles.margin * 2,
  },
});

const NotificationsIcon = () => {
  const { t } = useTranslationWithRTL();
  const { navigate } = useNavigation();
  const { data: notifications } = useNotifications();
  const [accessGranted] = useNotificationsStatus();

  return (
    <TouchableOpacity
      style={stylesheet.buttonContainer}
      accessibilityRole="button"
      accessibilityLabel={t("notifications.settings")}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_NOTIFICATION_ICON, {});
        //@ts-ignore
        navigate("NotificationsScreen");
      }}
    >
      <Icon width={ICON_WIDTH} height={ICON_HEIGHT} name="bell-outline" fill={styles.colors.black} />
      {accessGranted && notifications && notifications.unseenCount > 0 && (
        <View style={stylesheet.unseenContainer}>
          <Text style={stylesheet.unseenText}>{notifications.unseenCount > 9 ? "9" : notifications.unseenCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationsIcon;
