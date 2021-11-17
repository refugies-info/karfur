import * as React from "react";
import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import { RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { SmallButton } from "../SmallButton";
import {
  TextBigBold,
  TextNormal,
  TextNormalBold,
  TextSmallBold
} from "../StyledText";
import { FixSafeAreaView } from "../FixSafeAreaView";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import Map from "../../theme/images/localizedWarning/france_map.svg";
import Pin from "../../theme/images/localizedWarning/pin_traffic_cone.svg";

interface Props {
  isVisible: boolean;
  closeModal: any;
  nbGlobalContent: number;
  nbLocalizedContent: number;
  city: string;
}

const styles = StyleSheet.create({
  subtitle: {
    color: theme.colors.darkBlue,
    textAlign: "center",
  },
  centerText: {
    textAlign: "center"
  },
});

export const LocalizedWarningModal = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <Modal
      isVisible={props.isVisible}
      statusBarTranslucent={true}
      backdropColor={theme.colors.greyF7}
      backdropOpacity={1}
    >
      <FixSafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <SmallButton
          iconName="close-outline"
          onPress={props.closeModal}
          style={{
            position: "absolute",
            top: theme.margin * 3,
            ...(!isRTL ? {right: 0} : {left: 0})
          }}
        />
        <RTLView style={{ justifyContent: "center", alignItems: "flex-end" }}>
          <View>
            <Map width={102} height={104} style={{ marginBottom: theme.margin }} />
            <TextNormalBold style={styles.subtitle}>{props.nbGlobalContent} fiches</TextNormalBold>
            <TextSmallBold style={styles.subtitle}>nationales</TextSmallBold>
          </View>
          <Icon
            name="plus-outline"
            height={24}
            width={24}
            fill={theme.colors.darkBlue}
            style={{ marginHorizontal: theme.margin * 2 }}
          />
          <View>
            <Pin width={114} height={104} style={{ marginBottom: theme.margin }} />
            <TextNormalBold style={styles.subtitle}>{props.nbLocalizedContent} fiches</TextNormalBold>
            <TextSmallBold style={styles.subtitle}>pour {props.city}</TextSmallBold>
          </View>
        </RTLView>

        <View style={{ marginTop: theme.margin * 5 }}>
          <TextBigBold style={styles.centerText}>Réfugiés.info est en cours de développement</TextBigBold>
          <TextNormal
            style={{ ...styles.centerText, marginVertical: theme.margin * 2 }}
          >
            Nous ajoutons de nouvelles fiches chaque semaine. Rendez-vous sur votre ordinateur pour nous aider à écrire et à traduire des fiches !
          </TextNormal>
          <RTLView style={{justifyContent: "center"}}>
            <Icon
              name="monitor-outline"
              height={24}
              width={24}
              fill={theme.colors.black}
              style={{
                ...(!isRTL ? { marginRight: theme.margin } : { marginLeft: theme.margin })
              }}
            />
            <TextNormalBold style={styles.centerText}>
              www.refugies.info
            </TextNormalBold>
          </RTLView>
        </View>
      </FixSafeAreaView>
    </Modal>
  );
};
