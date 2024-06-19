import * as React from "react";
import { Text } from "react-native";
import { Icon } from "react-native-eva-icons";
import { RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { TextDSFR_MD } from "../StyledText";

interface Props {
  text: string;
  isRTL: boolean;
}

export const UpdatedDate = (props: Props) => (
  <RTLView style={{ marginVertical: styles.margin * 7 }}>
    <Icon
      name="refresh-outline"
      height={24}
      width={24}
      fill={styles.colors.darkGrey}
      style={{
        marginRight: !props.isRTL ? styles.margin : 0,
        marginLeft: props.isRTL ? styles.margin : 0,
      }}
    />
    <TextDSFR_MD style={{ color: styles.colors.darkGrey }}>
      Mise à jour :{" "}
      <Text style={{ color: styles.colors.green }}>{props.text}</Text>
    </TextDSFR_MD>
  </RTLView>
);
