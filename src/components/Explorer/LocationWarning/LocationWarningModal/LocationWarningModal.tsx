import * as React from "react";
import { View } from "react-native";
import * as Linking from "expo-linking";
import { Icon } from "react-native-eva-icons";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import { RTLView } from "../../../BasicComponents";
import { styles } from "../../../../theme";
import { SmallButton } from "../../../SmallButton";
import {
  TextBigBold,
  TextNormal,
  TextNormalBold,
  TextSmallBold,
} from "../../../StyledText";
import { FixSafeAreaView } from "../../../FixSafeAreaView";
import { useTranslationWithRTL } from "../../../../hooks/useTranslationWithRTL";
import Map from "../../../../theme/images/localizedWarning/france_map.svg";
import Pin from "../../../../theme/images/localizedWarning/pin_traffic_cone.svg";

interface Props {
  isVisible: boolean;
  closeModal: any;
  nbGlobalContent: number;
  nbLocalizedContent: number;
  city: string;
}

const stylesheet = StyleSheet.create({
  subtitle: {
    color: styles.colors.darkBlue,
    textAlign: "center",
  },
  centerText: {
    textAlign: "center",
  },
});

export const LocationWarningModal = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  return (
    <Modal
      isVisible={props.isVisible}
      statusBarTranslucent={true}
      backdropColor={styles.colors.greyF7}
      backdropOpacity={1}
    >
      <FixSafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <SmallButton
          iconName="close-outline"
          onPress={props.closeModal}
          style={{
            position: "absolute",
            top: styles.margin * 3,
            ...(!isRTL ? { right: 0 } : { left: 0 }),
          }}
          label={t("global.close", "Fermer")}
        />
        <RTLView style={{ justifyContent: "center", alignItems: "flex-end" }}>
          <View>
            <Map
              width={102}
              height={104}
              style={{ marginBottom: styles.margin }}
            />
            <TextNormalBold style={stylesheet.subtitle}>
              {t("explorer_screen.nb_content", {
                nbContent: props.nbGlobalContent,
              })}
            </TextNormalBold>
            <TextSmallBold style={stylesheet.subtitle}>
              {t("explorer_screen.country_content")}
            </TextSmallBold>
          </View>
          <Icon
            name="plus-outline"
            height={24}
            width={24}
            fill={styles.colors.darkBlue}
            style={{ marginHorizontal: styles.margin * 2 }}
          />
          <View>
            <Pin
              width={114}
              height={104}
              style={{ marginBottom: styles.margin }}
            />
            <TextNormalBold style={stylesheet.subtitle}>
              {t("explorer_screen.nb_content", {
                nbContent: props.nbLocalizedContent,
              })}
            </TextNormalBold>
            <TextSmallBold style={stylesheet.subtitle}>
              {t("explorer_screen.city_content", {
                city: props.city,
              })}
            </TextSmallBold>
          </View>
        </RTLView>

        <View style={{ marginTop: styles.margin * 5 }}>
          <TextBigBold style={stylesheet.centerText}>
            {t("explorer_screen.development_in_progress")}
          </TextBigBold>
          <TextNormal
            style={{
              ...stylesheet.centerText,
              marginVertical: styles.margin * 2,
            }}
          >
            {t("explorer_screen.adding_new_content")}
          </TextNormal>
          <RTLView style={{ justifyContent: "center" }}>
            <Icon
              name="monitor-outline"
              height={24}
              width={24}
              fill={styles.colors.black}
              style={{
                ...(!isRTL
                  ? { marginRight: styles.margin }
                  : { marginLeft: styles.margin }),
              }}
            />
            <TextNormalBold
              style={stylesheet.centerText}
              onPress={() => Linking.openURL("https://www.refugies.info")}
              accessibilityRole="link"
            >
              www.refugies.info
            </TextNormalBold>
          </RTLView>
        </View>
      </FixSafeAreaView>
    </Modal>
  );
};

export default LocationWarningModal;
