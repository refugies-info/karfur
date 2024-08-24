import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "../../../../hooks/useTranslationWithRTL";
import { styles } from "../../../../theme";
import Map from "../../../../theme/images/localizedWarning/france_map.svg";
import Pin from "../../../../theme/images/localizedWarning/pin_traffic_cone.svg";
import { PropsOf } from "../../../../utils";
import { RTLView } from "../../../BasicComponents";
import { FixSafeAreaView } from "../../../FixSafeAreaView";
import { Columns } from "../../../layout";
import { SmallButton } from "../../../SmallButton";
import { TextDSFR_MD, TextDSFR_MD_Bold, TextDSFR_XL } from "../../../StyledText";

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
const CloseButton: React.FC<Partial<PropsOf<typeof SmallButton>>> = (props) => {
  const { t } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();
  const Button = styled(SmallButton)<{ top: number }>`
    position: absolute;
    top: ${({ top }) => top}px;
    ${({ theme }) => (theme.i18n.isRTL ? "left: 0" : "right: 0")};
  `;

  return <Button iconName="close-outline" label={t("global.close", "Fermer")} top={insets.top} {...props} />;
};

// TODO Put in icons/MonitorIcon
const MonitorIcon: React.FC<Partial<PropsOf<typeof Icon>> & { size: number }> = ({ size, ...other }) => {
  const theme = useTheme();
  return <Icon fill={theme.colors.black} width={size} height={size} name="monitor-outline" {...other} />;
};

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
            <Map width={102} height={104} style={{ marginBottom: styles.margin }} />
            <TextDSFR_MD_Bold style={stylesheet.subtitle}>
              {t("explorer_screen.nb_content", {
                nbContent: props.nbGlobalContent,
              })}
            </TextDSFR_MD_Bold>
            <TextDSFR_MD_Bold style={stylesheet.subtitle}>{t("explorer_screen.country_content")}</TextDSFR_MD_Bold>
          </View>
          <Icon
            name="plus-outline"
            height={24}
            width={24}
            fill={styles.colors.darkBlue}
            style={{ marginHorizontal: styles.margin * 2 }}
          />
          <Pressable accessibilityRole="button" accessible={true} onPress={goTo}>
            <Pin width={114} height={104} style={{ marginBottom: styles.margin }} />
            <TextDSFR_MD_Bold
              style={{
                ...stylesheet.subtitle,
                textDecorationLine: props.nbLocalizedContent > 0 ? "underline" : "none",
              }}
            >
              {t("explorer_screen.nb_content", {
                nbContent: props.nbLocalizedContent,
              })}
            </TextDSFR_MD_Bold>
            <TextDSFR_MD_Bold style={stylesheet.subtitle}>
              {t("explorer_screen.city_content", {
                city: props.city,
              })}
            </TextDSFR_MD_Bold>
          </Pressable>
        </RTLView>

        <View style={{ marginTop: styles.margin * 5 }}>
          <TextDSFR_XL style={stylesheet.centerText}>{t("explorer_screen.development_in_progress")}</TextDSFR_XL>
          <TextDSFR_MD
            style={{
              marginVertical: styles.margin * 2,
            }}
          >
            {t("explorer_screen.adding_new_content")}
          </TextDSFR_MD>
          <Columns RTLBehaviour layout="auto" horizontalAlign="center" verticalAlign="center">
            <MonitorIcon size={24} />
            <TextDSFR_MD_Bold onPress={() => Linking.openURL("https://www.refugies.info")} accessibilityRole="link">
              www.refugies.info
            </TextDSFR_MD_Bold>
          </Columns>
        </View>
      </FixSafeAreaView>
    </Modal>
  );
};

export default LocationWarningModal;
