import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Platform, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import useToggle from "react-use/lib/useToggle";
import styled, { useTheme } from "styled-components/native";
import {
  hasUserSeenOnboardingSelector,
  initialUrlSelector,
} from "../../../services/redux/User/user.selectors";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { LanguageChoiceModal } from "../../../screens/Modals/LanguageChoiceModal";
import { FirebaseEvent } from "../../../utils/eventsUsedInFirebase";
import { logEventInFirebase } from "../../../utils/logEvent";
import { LanguageSwitch } from "../../Language/LanguageSwitch";
import { TextDSFR_MD_Bold } from "../../StyledText";
import Logo from "../../../theme/images/logo.svg";
import NotificationsIcon from "../../Notifications/NotificationsIcon";
import Columns from "../Columns";
import { IconButton } from "../../iconography";
import upperFirst from "lodash/upperFirst";
import { HeaderContentProps } from "./HeaderContentProps";
import Spacer from "../Spacer";
import { getLocaleFromUrl } from "../../../libs/getScreenFromUrl";
import { selectedContentSelector } from "../../../services";

const Container = styled.SafeAreaView`
  min-height: ${({ theme }) => theme.layout.header.minHeight}px;
  padding-top: ${({ theme }) =>
    theme.insets.top === 0 && Platform.OS === "android"
      ? Math.max(theme.insets.top, 40)
      : theme.insets.top}px;
  padding-bottom: ${({ theme }) => theme.layout.header.paddingBottom}px;
`;

const HeaderTitle = styled(TextDSFR_MD_Bold)<{
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
  darkBackground: boolean;
  headerIconName?: string;
  headerTitle?: string;
  hideBack?: boolean; // TODO Maintain this ?
  hideLanguageSwitch?: boolean;
  showTitle?: boolean; // TODO Handle this directly in Page component ?
  showLogo?: boolean;
  changeLanguageCallback?: () => void;
  HeaderComponent?: ComponentType<HeaderContentProps>;
}

export const Header = ({
  backScreen,
  darkBackground,
  headerIconName,
  headerTitle,
  hideBack,
  hideLanguageSwitch = false,
  showTitle = false,
  showLogo = false,
  changeLanguageCallback,
  HeaderComponent,
}: HeaderProps) => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();
  const { name: routeName } = useRoute();
  const navigation = useNavigation<any>(); // FIXME
  const onPress = useCallback(
    !!backScreen
      ? () => {
          navigation.popToTop();
          navigation.navigate(backScreen);
        }
      : navigation.goBack,
    [navigation, backScreen]
  );

  const [isLanguageModalVisible, toggleLanguageModal] = useToggle(false);

  const showSwitchLanguageModal = () => {
    logEventInFirebase(FirebaseEvent.LONG_PRESS_CHANGE_LANGUAGE, {});
    toggleLanguageModal();
  };

  // if initialUrl (deeplink) and FR: wait 2 sec and show language modal
  const initialUrl = useSelector(initialUrlSelector);
  const initialUrlLocale = useMemo(
    () => (initialUrl ? getLocaleFromUrl(initialUrl) : null),
    [initialUrl]
  );
  const selectedContent = useSelector(
    selectedContentSelector(initialUrlLocale)
  );
  const hasUserSeenOnboarding = useSelector(hasUserSeenOnboardingSelector);
  const isFocused = useIsFocused();
  const [languageSelected, setLanguageSelected] = useState(false);
  useEffect(() => {
    if (
      initialUrl &&
      initialUrlLocale === "fr" &&
      !hasUserSeenOnboarding &&
      selectedContent &&
      isFocused &&
      !languageSelected
    ) {
      setLanguageSelected(true);
      setTimeout(() => {
        toggleLanguageModal();
      }, 3000);
    }
  }, [
    initialUrl,
    initialUrlLocale,
    selectedContent,
    hasUserSeenOnboarding,
    isFocused,
  ]);

  return (
    <>
      <Container>
        <Columns
          layout="1 auto"
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          {showLogo ? (
            <Logo
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              accessible={true}
              accessibilityLabel="Réfugiés point info"
              accessibilityRole="image"
            />
          ) : null}
          {showLogo || hideBack ? null : (
            <View>
              <IconButton
                accessibilityLabel={t("global.back_button_accessibility")}
                iconName={!initialUrl ? "arrow-back-outline" : "close-outline"}
                onPress={onPress}
              />
            </View>
          )}

          {HeaderComponent ? (
            showTitle ? (
              <HeaderComponent darkBackground={darkBackground} />
            ) : (
              <View />
            )
          ) : (
            <>
              {(headerIconName || headerTitle) && showTitle ? (
                <Columns
                  RTLBehaviour
                  layout="auto"
                  verticalAlign="center"
                  horizontalAlign={
                    !(showLogo || hideBack) ? "center" : "flex-start"
                  }
                >
                  {headerIconName && (
                    <Icon
                      name={headerIconName}
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                      fill={
                        darkBackground ? theme.colors.white : theme.colors.black
                      }
                    />
                  )}
                  {headerTitle && (
                    <HeaderTitle
                      ellipsizeMode="tail"
                      invertedColor={darkBackground}
                      numberOfLines={2}
                      accessibilityRole="header"
                    >
                      {upperFirst(headerTitle)}
                    </HeaderTitle>
                  )}
                </Columns>
              ) : (
                <View />
              )}
            </>
          )}

          <Columns
            layout="auto"
            horizontalAlign="flex-end"
            verticalAlign="center"
          >
            {routeName === "ExplorerScreen" && <NotificationsIcon />}
            {!hideLanguageSwitch ? (
              <LanguageSwitch
                onLongPressSwitchLanguage={showSwitchLanguageModal}
              />
            ) : (
              <Spacer width={48} />
            )}
          </Columns>
        </Columns>
      </Container>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
        changeLanguageCallback={changeLanguageCallback}
      />
    </>
  );
};

export default Header;
