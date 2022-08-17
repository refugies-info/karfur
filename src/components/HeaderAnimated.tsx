import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import styled from "styled-components/native";
import { styles } from "../theme";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { HeaderWithLogo, HeaderWithBackForWrapper } from "./HeaderWithLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReadableText } from "./ReadableText";

interface Props {
  title: string;
  onLongPressSwitchLanguage: () => void;
  showSimplifiedHeader: boolean;
  extraHeight?: number;
  useShadow?: boolean;
}

const MainSimpleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${styles.margin}px;
  background-color: ${styles.colors.lightGrey};
  z-index: 4;
  ${(props: { useShadow: boolean, showSimplifiedHeader: boolean }) =>
    props.useShadow && props.showSimplifiedHeader ? styles.shadows.xs : ""}
`;

const stylesheet = StyleSheet.create({
  headerText: {
    fontSize: styles.fonts.sizes.big,
    fontFamily: styles.fonts.families.circularBold,
    lineHeight: 32,
    position: "absolute",
    left: styles.margin * 3
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
    outputRange: [100 + (props.extraHeight || 0), 50],
  });

  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  const textPaddingBottom = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [(props.extraHeight || 0), 0],
  });

  return (
    <MainSimpleContainer
      useShadow={props.useShadow}
      showSimplifiedHeader={props.showSimplifiedHeader}
    >
      <View style={{ paddingTop: insets.top }}>
        <Animated.View
          style={
            [{
              justifyContent: "flex-end",
              paddingLeft: styles.margin * 3,
              position: "relative"
            },
            { height: headerHeight }
          ]}
        >
          <Animated.Text
            style={[
              stylesheet.headerText,
              {
                textAlign: isRTL ? "right" : "left",
                marginRight: isRTL ? 0 : styles.margin,
                marginLeft: isRTL ? styles.margin : 0,
                fontSize: headerFontSize,
                paddingBottom: textPaddingBottom,
                color: styles.colors.black,
              },
            ]}
          >
            <ReadableText overridePosY={0}>
              {props.title}
            </ReadableText>
          </Animated.Text>
        </Animated.View>
      </View>
      <HeaderWithLogo
        onLongPressSwitchLanguage={props.onLongPressSwitchLanguage}
        hideLogo={true}
      />
    </MainSimpleContainer>
  );
};

interface HeaderBackProps {
  title: string;
  onLongPressSwitchLanguage: () => void;
  showSimplifiedHeader: boolean;
  navigation: any;
}

const MainContainer = styled.View`
  background-color: ${styles.colors.lightGrey};
  padding-bottom: ${styles.margin}px;
  z-index: 4;
  ${(props: { showShadow: boolean }) =>
    props.showShadow ? styles.shadows.xs : ""}
`;

export const HeaderWithBackAnimated = (props: HeaderBackProps) => {
  const { isRTL } = useTranslationWithRTL();

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

  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  const headerTop = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [styles.margin * 4, styles.margin],
  });

  return (
    <MainContainer showShadow={props.showSimplifiedHeader}>
      <HeaderWithBackForWrapper
        onLongPressSwitchLanguage={props.onLongPressSwitchLanguage}
        navigation={props.navigation}
      />
      <View style={{ paddingHorizontal:styles.margin * 3 }}>
        <Animated.Text
          style={[
            {
              fontFamily: styles.fonts.families.circularBold,
              textAlign: isRTL ? "right" : "left",
              color: styles.colors.black,
            },
            {
              fontSize: headerFontSize,
              marginTop: headerTop
            },
          ]}
        >
          {props.title}
        </Animated.Text>
      </View>
    </MainContainer>
  );
};
