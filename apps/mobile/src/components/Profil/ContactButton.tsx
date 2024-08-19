import * as React from "react";
import { View, Linking } from "react-native";
import { ButtonDSFR } from "../buttons";

interface Props {
  isRTL: boolean;
}

export const ContactButton = (props: Props) => (
  <View
    style={{
      alignItems: !props.isRTL ? "flex-start" : "flex-end",
    }}
  >
    <ButtonDSFR
      accessibilityLabel={"Envoyer un email à contact@refugies.info"}
      title="contact@refugies.info"
      onPress={() => {
        Linking.openURL("mailto://contact@refugies.info");
      }}
      iconName="email-outline"
      priority="primary"
      style={{ width: "100%" }}
    ></ButtonDSFR>
  </View>
);
