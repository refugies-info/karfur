import * as React from "react";
import { Text } from "react-native";
import { Icon } from "react-native-eva-icons";
import { RTLView } from "../BasicComponents";
import { TextSmallNormal } from "../StyledText";
import { useTheme } from "styled-components/native";

interface Props {
  text: string;
}

export const ReadingTime = (props: Props) => {
  const theme = useTheme();
  return (
    <RTLView>
      <Icon
        name="clock-outline"
        height={24}
        width={24}
        fill={theme.colors.darkGrey}
        style={{
          marginRight: !theme.i18n.isRTL ? theme.margin : 0,
          marginLeft: theme.i18n.isRTL ? theme.margin : 0,
        }}
      />
      <TextSmallNormal style={{ color: theme.colors.darkGrey }}>
        Temps de lecture :{" "}
        <Text style={{ color: theme.colors.green }}>{props.text}</Text>
      </TextSmallNormal>
    </RTLView>
  );
};
