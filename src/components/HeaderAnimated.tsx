import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import styled from "styled-components/native";
import { theme } from "../theme";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { HeaderWithLogo, HeaderWithBackForWrapper } from "./HeaderWithLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  title: string;
  onLongPressSwitchLanguage: () => void;
  showSimplifiedHeader: boolean;
  extraHeight?: number;
}

const styles = StyleSheet.create({
  simpleHeader: {
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
    <View style={styles.simpleHeader}>
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
                paddingBottom: textPaddingBottom,
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

interface HeaderBackProps {
  title: string;
  onLongPressSwitchLanguage: () => void;
  showSimplifiedHeader: boolean;
  navigation: any;
}

const MainContainer = styled.View`
  background-color: ${theme.colors.lightGrey};
  padding-bottom: ${theme.margin}px;
  z-index: 4;
  ${(props: { showShadow: boolean }) => (props.showShadow ? `
  box-shadow: 0px -1px 8px rgba(33, 33, 33, 0.08);
  elevation: 4;
  ` : "")}
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
    outputRange: [theme.margin * 4, theme.margin],
  });

  return (
    <MainContainer showShadow={props.showSimplifiedHeader}>
      <HeaderWithBackForWrapper
        onLongPressSwitchLanguage={props.onLongPressSwitchLanguage}
        navigation={props.navigation}
      />
      <View style={{
        paddingLeft: !isRTL ? theme.margin * 3 : 0,
        paddingRight: isRTL ? theme.margin * 3 : 0,
      }}>
        <Animated.Text
          style={[
            {
              fontFamily: theme.fonts.families.circularBold,
              textAlign: isRTL ? "right" : "left",
              color: theme.colors.black,
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
