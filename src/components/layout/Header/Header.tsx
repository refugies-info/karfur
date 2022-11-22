import { useNavigation, useRoute } from "@react-navigation/native";
import React, { ComponentType, ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  LayoutAnimation,
  Platform,
  UIManager,
  View,
} from "react-native";
import { Icon } from "react-native-eva-icons";
import useToggle from "react-use/lib/useToggle";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { LanguageChoiceModal } from "../../../screens/Modals/LanguageChoiceModal";
import { FirebaseEvent } from "../../../utils/eventsUsedInFirebase";
import { logEventInFirebase } from "../../../utils/logEvent";
import { LanguageSwitch } from "../../Language/LanguageSwitch";
import { StyledTextSmallBold } from "../../StyledText";
import Logo from "../../../theme/images/logo.svg";
import NotificationsIcon from "../../Notifications/NotificationsIcon";
import SafeAreaViewTopInset from "../SafeAreaViewTopInset";
import { ReadableText } from "../../ReadableText";
import { Picture } from "../../../types/interface";
import { withProps } from "../../../utils";
import { getImageUri } from "../../../libs/getImageUri";
import Columns from "../Columns";
import { IconButton } from "../../iconography";
import { HeaderContentProps } from "./HeaderContentProps";
import { isNull, upperFirst } from "lodash";
import HeaderContentTitle from "./HeaderContentTitle";

const MainContainer = Animated.createAnimatedComponent(styled(
  SafeAreaViewTopInset
)<{
  backgroundColor: string;
  showShadow: boolean;
  showSimplifiedHeader: boolean;
}>`
  z-index: 4;
  ${({ showShadow, theme }) => (showShadow ? theme.shadows.xs : "")}
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding-horizontal: ${({ theme }) => theme.layout.content.normal};
  min-height: ${({ theme }) => 65 + theme.insets.top}px;
  max-width: 100%;
  width: 100%;
  position: relative;
`);

const HeaderTitle = styled(StyledTextSmallBold)<{
  invertedColor: boolean;
}>`
  color: ${({ invertedColor, theme }) =>
    invertedColor ? theme.colors.white : theme.colors.black};
`;

const ICON_SIZE = 24;
const LOGO_WIDTH = 58;
const LOGO_HEIGHT = 40;

export interface HeaderProps {
  backScreen?: string;
  headerBackgroundColor?: string;
  headerBackgroundImage?: Picture;
  headerIconName?: string;
  headerTitle?: string;
  headerTooltip?: ReactNode;
  hideBack?: boolean; // TODO Maintain this ?
  hideLanguageSwitch?: boolean;
  showLogo?: boolean;
  showSimplifiedHeader?: boolean; // TODO Handle this directly in Page component ?

  /** title props is a shortcut to use HeaderContentTitle with only one title  */
  title?: string;

  HeaderContent?: ComponentType<HeaderContentProps> | null;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Header = ({
  backScreen,
  headerBackgroundColor = "transparent",
  headerBackgroundImage,
  headerIconName,
  headerTitle,
  hideBack,
  hideLanguageSwitch = false,
  showLogo = false,
  showSimplifiedHeader = true,
  title,
  HeaderContent = null,
}: HeaderProps) => {
  if (title && isNull(HeaderContent)) {
    HeaderContent = withProps({ title })(
      HeaderContentTitle
    ) as ComponentType<HeaderContentProps>;
    headerTitle = title;
  }

  LayoutAnimation.easeInEaseOut();
  const theme = useTheme();
  const { t } = useTranslationWithRTL();
  const { name: routeName } = useRoute();
  const navigation = useNavigation<any>(); // FIXME
  const onPress = !!backScreen
    ? () => {
        navigation.popToTop();
        navigation.navigate(backScreen);
      }
    : navigation.goBack;

  const [isLanguageModalVisible, toggleLanguageModal] = useToggle(false);

  const showSwitchLanguageModal = () => {
    logEventInFirebase(FirebaseEvent.LONG_PRESS_CHANGE_LANGUAGE, {});
    toggleLanguageModal();
  };

  const animatedController = useRef(new Animated.Value(0)).current;

  const toggleSimplifiedHeader = (displayHeader: boolean) => {
    Animated.timing(animatedController, {
      duration: 200,
      toValue: displayHeader ? 1 : 0, // show or hide header
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    toggleSimplifiedHeader(showSimplifiedHeader);
  }, [showSimplifiedHeader]);

  const headerBottomRadius = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const backgroundColorInterpolation = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [
      headerBackgroundImage ? "transparent" : headerBackgroundColor,
      headerBackgroundColor,
    ],
  });

  const Container =
    !showSimplifiedHeader && headerBackgroundImage
      ? withProps({
          resizeMode: "cover",
          source: { uri: getImageUri(headerBackgroundImage.secure_url) },
        })(ImageBackground)
      : View;

  return (
    <Container>
      <MainContainer
        backgroundColor={
          headerBackgroundImage !== undefined && !showSimplifiedHeader
            ? "transparent"
            : backgroundColorInterpolation
        }
        showSimplifiedHeader={showSimplifiedHeader}
        showShadow={showSimplifiedHeader}
        style={{
          borderBottomRightRadius:
            headerBackgroundImage || headerBackgroundColor
              ? headerBottomRadius
              : 0,
          borderBottomLeftRadius:
            headerBackgroundImage || headerBackgroundColor
              ? headerBottomRadius
              : 0,
          //   paddingBottom: headerPaddingBottom,
        }}
      >
        <Columns
          layout="1 auto 1"
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          {showLogo && (
            <Logo
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              accessible={true}
              accessibilityLabel="Réfugiés point info"
            />
          )}

          {showLogo || hideBack ? (
            <></>
          ) : (
            <View>
              <IconButton
                accessibilityLabel={t("global.back_button_accessibility")}
                iconName="arrow-back-outline"
                onPress={onPress}
              />
            </View>
          )}

          {(headerIconName || headerTitle) &&
          (showSimplifiedHeader || HeaderContent === null) ? (
            <Columns
              layout="auto"
              verticalAlign="center"
              horizontalAlign={
                !!(!showLogo && !hideBack) ? "center" : "flex-start"
              }
            >
              {headerIconName && (
                <Icon
                  name={headerIconName}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={theme.colors.black}
                />
              )}
              {headerTitle && (
                <HeaderTitle
                  invertedColor={headerBackgroundColor !== "transparent"}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  <ReadableText>{upperFirst(headerTitle)}</ReadableText>
                </HeaderTitle>
              )}
            </Columns>
          ) : (
            <View />
          )}

          {routeName === "ExplorerScreen" && <NotificationsIcon />}
          {!hideLanguageSwitch && (
            <LanguageSwitch
              onLongPressSwitchLanguage={showSwitchLanguageModal}
            />
          )}
        </Columns>
        {HeaderContent && (
          <HeaderContent
            animatedController={animatedController}
            showSimplifiedHeader={showSimplifiedHeader}
          />
        )}
      </MainContainer>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </Container>
  );
};

export default Header;
