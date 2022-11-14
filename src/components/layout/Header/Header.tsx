import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, ImageBackground, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import useToggle from "react-use/lib/useToggle";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { LanguageChoiceModal } from "../../../screens/Modals/LanguageChoiceModal";
import { FirebaseEvent } from "../../../utils/eventsUsedInFirebase";
import { logEventInFirebase } from "../../../utils/logEvent";
import { RowContainer, RTLView } from "../../BasicComponents";
import { LanguageSwitch } from "../../Language/LanguageSwitch";
import { SmallButton } from "../../SmallButton";
import { StyledTextSmallBold } from "../../StyledText";
import Logo from "../../../theme/images/logo.svg";
import NotificationsIcon from "../../Notifications/NotificationsIcon";
import SafeAreaViewTopInset from "../SafeAreaViewTopInset";
import { firstLetterUpperCase } from "../../../libs";
import { ReadableText } from "../../ReadableText";
import { StreamlineIcon } from "../../StreamlineIcon";
import { Picture } from "../../../types/interface";
import { withProps } from "../../../utils";
import { getImageUri } from "../../../libs/getImageUri";
import Columns from "../Columns";

const MainContainer = Animated.createAnimatedComponent(styled(
  SafeAreaViewTopInset
)<{
  backgroundColor: string;
  showShadow: boolean;
  showSimplifiedHeader: boolean;
}>`
  padding-bottom: ${({ showSimplifiedHeader, theme }) =>
    showSimplifiedHeader ? 0 : theme.margin * 2}px;
  z-index: 4;
  ${({ showShadow, theme }) => (showShadow ? theme.shadows.xs : "")}
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding-horizontal: ${({ theme }) => theme.layout.content.normal};
`);

const HeaderContainer = styled(RowContainer)`
  justify-content: space-between;
`;

const HeaderTitle = styled(StyledTextSmallBold)`
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
`;

const HeaderIconView = styled(RTLView)`
  flex: 1;
  margin-right: ${({ theme }) => (!theme.i18n.isRTL ? theme.margin * 7 : 0)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? theme.margin * 7 : 0)}px;
  justify-content: center;
`;

const ICON_SIZE = 24;
const LOGO_WIDTH = 58;
const LOGO_HEIGHT = 40;

const TitleContainer = styled(Animated.View)<{ showSimplifiedHeader: boolean }>`
  margin-bottom: ${({ showSimplifiedHeader, theme }) =>
    showSimplifiedHeader ? 0 : theme.margin * 2}px;
`;

const Title = styled(Animated.Text)<{
  hasBackgroundImage?: boolean;
  invertedColor: boolean;
}>`
  font-family: ${({ theme }) => theme.fonts.families.circularBold};
  text-align: ${({ theme }) => (theme.i18n.isRTL ? "right" : "left")};
  color: ${({ invertedColor, theme }) =>
    invertedColor ? theme.colors.white : theme.colors.black};
  line-height: 40px;

  ${({ hasBackgroundImage, theme }) =>
    hasBackgroundImage &&
    `opacity: 0.9;
background-color: ${theme.colors.white};
padding: ${theme.margin}px;`}
`;

export interface HeaderProps {
  backScreen?: string;
  headerBackgroundColor?: string;
  headerBackgroundImage?: Picture;
  headerIconName?: string;
  headerTitle?: string;
  hideBack?: boolean; // TODO Maintain this ?
  hideLanguageSwitch?: boolean;
  showLogo?: boolean;
  showSimplifiedHeader?: boolean; // TODO Handle this directly in Page component ?
  title?: string;
  titleIcon?: Picture;
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
  showSimplifiedHeader = false,
  title,
  titleIcon,
}: HeaderProps) => {
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

  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  const headerTop = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.margin * 4, theme.margin],
  });

  const headerHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [90, 40],
  });

  const headerBottomRadius = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const headerPaddingTop = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  const Container =
    !showSimplifiedHeader && headerBackgroundImage
      ? withProps({
          resizeMode: "cover",
          source: { uri: getImageUri(headerBackgroundImage.secure_url) },
        })(ImageBackground)
      : React.Fragment;

  return (
    <Container>
      <MainContainer
        backgroundColor={
          headerBackgroundImage !== undefined && !showSimplifiedHeader
            ? "transparent"
            : headerBackgroundColor
        }
        showSimplifiedHeader={showSimplifiedHeader}
        showShadow={showSimplifiedHeader && !!title}
        style={{
          borderBottomRightRadius: title ? headerBottomRadius : 0,
          borderBottomLeftRadius: title ? headerBottomRadius : 0,
        }}
      >
        <HeaderContainer>
          {showLogo && (
            <Logo
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              accessible={true}
              accessibilityLabel="Réfugiés point info"
            />
          )}

          {showLogo || hideBack ? (
            <View />
          ) : (
            <SmallButton
              iconName="arrow-back-outline"
              onPress={onPress}
              label={t("global.back_button_accessibility")}
            />
          )}

          {headerIconName && headerTitle && (
            <HeaderIconView>
              <Icon
                name={headerIconName}
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={theme.colors.black}
              />
              <HeaderTitle>{headerTitle}</HeaderTitle>
            </HeaderIconView>
          )}
          <RowContainer>
            {routeName === "ExplorerScreen" && <NotificationsIcon />}
            {!hideLanguageSwitch && (
              <LanguageSwitch
                onLongPressSwitchLanguage={showSwitchLanguageModal}
              />
            )}
          </RowContainer>
        </HeaderContainer>
        {title && (
          <TitleContainer
            showSimplifiedHeader={showSimplifiedHeader}
            style={[
              {
                marginTop: headerPaddingTop,
              },
            ]}
          >
            <Columns
              RTLBehaviour
              layout="auto"
              horizontalAlign="flex-start"
              verticalAlign="center"
            >
              <Title
                invertedColor={
                  (headerBackgroundColor !== "transparent" &&
                    headerBackgroundImage === undefined) ||
                  (headerBackgroundColor !== "transparent" &&
                    showSimplifiedHeader)
                }
                hasBackgroundImage={
                  !showSimplifiedHeader && headerBackgroundImage !== undefined
                }
                style={{
                  fontSize: headerFontSize,
                }}
              >
                <ReadableText overridePosY={0}>
                  {firstLetterUpperCase(title)}
                </ReadableText>
              </Title>
              {titleIcon && (
                <StreamlineIcon
                  icon={titleIcon}
                  size={showSimplifiedHeader ? 16 : 24}
                />
              )}
            </Columns>
          </TitleContainer>
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
