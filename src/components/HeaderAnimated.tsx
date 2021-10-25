import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { theme } from "../theme";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { HeaderWithLogo } from "./HeaderWithLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  title: string;
  onLongPressSwitchLanguage: () => void;
  showSimplifiedHeader: boolean;
}

const styles = StyleSheet.create({
  bodyBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.margin,
  },
  headerText: {
    fontSize: theme.fonts.sizes.big,
    fontFamily: theme.fonts.families.circularBold,
    lineHeight: 32,
    position: "absolute",
    left: theme.margin * 3
  },
});

export const HeaderAnimated = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();

  const animatedController = React.useRef(new Animated.Value(0)).current;

  const toggleSimplifiedHeader = (displayHeader: boolean) => {
    Animated.timing(animatedController, {
      duration: 200,
      toValue: displayHeader ? 1 : 0, // show or hide header
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    toggleSimplifiedHeader(props.showSimplifiedHeader)
  }, [props.showSimplifiedHeader])

  const headerHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 50],
  });

  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  return (
    <View style={styles.bodyBackground}>
      <View style={{ paddingTop: insets.top }}>
        <Animated.View
          style={
            [{
              justifyContent: "flex-end",
              paddingLeft: theme.margin * 3,
              position: "relative"
            },
            { height: headerHeight }
          ]}
        >
          <Animated.Text
            style={[
              styles.headerText,
              {
                textAlign: isRTL ? "right" : "left",
                marginRight: isRTL ? 0 : theme.margin,
                marginLeft: isRTL ? theme.margin : 0,
                fontSize: headerFontSize,
                color: theme.colors.black,
              },
            ]}
          >
            {props.title}
          </Animated.Text>
        </Animated.View>
      </View>
      <HeaderWithLogo
        onLongPressSwitchLanguage={props.onLongPressSwitchLanguage}
        hideLogo={true}
      />
    </View>
  );
};
