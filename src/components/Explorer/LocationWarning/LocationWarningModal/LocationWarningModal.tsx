import * as React from "react";
import { Pressable, View } from "react-native";
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
import styled, { useTheme } from "styled-components/native";
import { withProps } from "../../../../utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Columns, ColumnsSpacing } from "../../../layout";
import { useNavigation } from "@react-navigation/native";

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

// TODO Put in icons/FloatingCloseButton ?
const CloseButton = withProps(() => {
  const { t } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();
  return {
    iconName: "close-outline",
    label: t("global.close", "Fermer"),
    top: insets.top,
  };
})(styled(SmallButton)<{ top: number }>`
  position: absolute;
  top: ${({ top }) => top}px;
  ${({ theme }) => (theme.i18n.isRTL ? "left: 0" : "right: 0")};
`);

// TODO Put in icons/MonitorIcon
const MonitorIcon = withProps(({ size }: { size: number }) => {
  const theme = useTheme();
  return {
    name: "monitor-outline",
    height: size,
    width: size,
    fill: theme.colors.black,
  };
})(Icon);

export const LocationWarningModal = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const navigation = useNavigation<any>();
  const goTo = () => {
    props.closeModal();
    navigation.navigate("NearMeCardsScreen");
  };

  return (
    <Modal
      isVisible={props.isVisible}
      statusBarTranslucent={true}
      backdropColor={styles.colors.greyF7}
      backdropOpacity={1}
    >
      <FixSafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <CloseButton onPress={props.closeModal} />
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
          <Pressable
            accessibilityRole="button"
            accessible={true}
            onPress={goTo}
          >
            <Pin
              width={114}
              height={104}
              style={{ marginBottom: styles.margin }}
            />
            <TextNormalBold
              style={{
                ...stylesheet.subtitle,
                textDecorationLine:
                  props.nbLocalizedContent > 0 ? "underline" : "none",
              }}
            >
              {t("explorer_screen.nb_content", {
                nbContent: props.nbLocalizedContent,
              })}
            </TextNormalBold>
            <TextSmallBold style={stylesheet.subtitle}>
              {t("explorer_screen.city_content", {
                city: props.city,
              })}
            </TextSmallBold>
          </Pressable>
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
          <Columns
            spacing={ColumnsSpacing.Default}
            RTLBehaviour
            layout="auto"
            horizontalAlign="center"
            verticalAlign="center"
          >
            <MonitorIcon size={24} />
            <TextNormalBold
              onPress={() => Linking.openURL("https://www.refugies.info")}
              accessibilityRole="link"
            >
              www.refugies.info
            </TextNormalBold>
          </Columns>
        </View>
      </FixSafeAreaView>
    </Modal>
  );
};

export default LocationWarningModal;
