import * as React from "react";
import { Text } from "react-native";
import { Icon } from "react-native-eva-icons";
import { RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { TextSmallNormal } from "../StyledText";

interface Props {
  text: string;
  isRTL: boolean;
}

export const ReadingTime = (props: Props) => (
  <RTLView>
    <Icon
      name="clock-outline"
      height={24}
      width={24}
      fill={theme.colors.darkGrey}
      style={{
        marginRight: !props.isRTL ? theme.margin : 0,
        marginLeft: props.isRTL ? theme.margin : 0
      }}
    />
    <TextSmallNormal style={{color: theme.colors.darkGrey}}>
      Temps de lecture : <Text style={{ color: theme.colors.green }}>{props.text}</Text>
    </TextSmallNormal>
  </RTLView>
);
