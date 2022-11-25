import { useNavigation, useRoute } from "@react-navigation/native";
import React, { ComponentType } from "react";
import { View } from "react-native";
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
import { ReadableText } from "../../ReadableText";
import Columns, { ColumnsSpacing } from "../Columns";
import { IconButton } from "../../iconography";
import { upperFirst } from "lodash";
import { HeaderContentProps } from "./HeaderContentProps";
import Spacer from "../Spacer";

const Container = styled.View`
  min-height: ${({ theme }) => theme.layout.header.minHeight}px;
  padding-bottom: ${({ theme }) => theme.layout.header.paddingBottom}px;
`;

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
  darkBackground: boolean;
  headerIconName?: string;
  headerTitle?: string;
  hideBack?: boolean; // TODO Maintain this ?
  hideLanguageSwitch?: boolean;
  showTitle?: boolean; // TODO Handle this directly in Page component ?
  showLogo?: boolean;

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

  HeaderComponent,
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
            />
          ) : null}
          {showLogo || hideBack ? null : (
            <View>
              <IconButton
                accessibilityLabel={t("global.back_button_accessibility")}
                iconName="arrow-back-outline"
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
                    >
                      <ReadableText>{upperFirst(headerTitle)}</ReadableText>
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
            spacing={ColumnsSpacing.NoSpace}
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
      />
    </>
  );
};

export default Header;
