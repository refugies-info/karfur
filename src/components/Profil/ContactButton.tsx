import * as React from "react";
import { View, Linking } from "react-native";
import { styles } from "../../theme";
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
      backgroundColor={styles.colors.black}
      textColor={styles.colors.white}
      onPress={() => {Linking.openURL("mailto://contact@refugies.info")}}
      iconFirst={true}
      notFullWidth={true}
    />
  </View>
);
