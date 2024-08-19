import React, { ReactNode, memo, useMemo } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { currentItemSelector } from "../services/redux/VoiceOver/voiceOver.selectors";
import { styles } from "../theme";

interface Props {
  children?: string | ReactNode;
  text?: string;
  darkBg?: boolean;
  id: string;
}

const activeStyleLightBg = { backgroundColor: styles.colors.lightBlue };
const activeStyleDarkBg = { backgroundColor: "rgba(255,255,255, 0.35)" };

const ReadableColoredTextComponent = React.forwardRef(
  (props: Props, ref: any) => {
    const currentReadingItem = useSelector(currentItemSelector);
    const textBackground = useMemo(() => {
      if (currentReadingItem?.id === props.id) {
        return props.darkBg ? activeStyleDarkBg : activeStyleLightBg;
      }
      return {};
    }, [props.id, currentReadingItem]);

    return props.text ? ( // if text given as prop, include content in a View
      <View
        ref={ref}
        style={[{ maxWidth: "100%" }, textBackground]}
        collapsable={false}
      >
        {props.children}
      </View>
    ) : (
      // else, include content in a Text
      <>
        <Text style={textBackground}>{props.children}</Text>
        <View ref={ref}></View>
      </>
    );
  }
);

ReadableColoredTextComponent.displayName = "ReadableColoredText";

export const ReadableColoredText = memo(ReadableColoredTextComponent);
