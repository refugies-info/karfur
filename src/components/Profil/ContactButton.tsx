import * as React from "react";
import { View, Linking } from "react-native";
import { theme } from "../../theme";
import { CustomButton } from "../../components/CustomButton";

interface Props {
  isRTL: boolean;
}

export const ContactButton = (props: Props) => (
  <View
    style={{
      alignItems: !props.isRTL ? "flex-start" : "flex-end"
    }}
  >
    <CustomButton
      i18nKey={"contact@refugies.info"}
      defaultText="contact@refugies.info"
      iconName="email-outline"
      backgroundColor={theme.colors.black}
      textColor={theme.colors.white}
      onPress={() => {Linking.openURL("mailto://contact@refugies.info")}}
      iconFirst={true}
      notFullWidth={true}
    />
  </View>
);
