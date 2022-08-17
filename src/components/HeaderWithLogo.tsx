import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import styled from "styled-components/native";

import { styles } from "../theme";
import Logo from "../theme/images/logo.svg";

import { logEventInFirebase } from "../utils/logEvent";
import { FirebaseEvent } from "../utils/eventsUsedInFirebase";

import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

import { SmallButton } from "./SmallButton";
import { RowContainer, RTLView } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";
import NotificationsIcon from "./Notifications/NotificationsIcon";
import { StyledTextSmallBold } from "./StyledText";

const MainContainer = styled(RowContainer)`
  padding-horizontal: ${styles.margin * 3}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  padding-top: ${styles.margin}px;
`;
const StyledText = styled(StyledTextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
`;

const LOGO_WIDTH = 58;
const LOGO_HEIGHT = 40;
const ICON_SIZE = 24;

interface Props {
  onLongPressSwitchLanguage?: () => void;
  hideLanguageSwitch?: boolean;
  hideLogo?: boolean;
  text?: string;
  iconName?: string;
}
export const HeaderWithLogo = ({
  onLongPressSwitchLanguage,
  hideLanguageSwitch,
  hideLogo,
  text,
  iconName,
}: Props) => {
  const { isRTL } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();
  const { name: routeName } = useRoute();

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: styles.margin }}>
      <MainContainer isRTL={false}>
        {!hideLogo ? (
          <Logo
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            accessible={true}
            accessibilityLabel="Réfugiés point info"
          />
        ) : (
          <View />
        )}
        {text && (
          <RTLView
            style={{
              flex: 1,
              marginRight: hideLanguageSwitch && !isRTL ? styles.margin * 7 : 0,
              marginLeft: hideLanguageSwitch && isRTL ? styles.margin * 7 : 0,
              justifyContent: "center",
            }}
          >
            {iconName && (
              <Icon
                name={iconName}
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={styles.colors.black}
              />
            )}
            <StyledText isRTL={isRTL}>{text}</StyledText>
          </RTLView>
        )}
        <RowContainer>
          {routeName === "ExplorerScreen" && <NotificationsIcon />}
          {!hideLanguageSwitch && (
            <LanguageSwitch
              onLongPressSwitchLanguage={() => {
                logEventInFirebase(
                  FirebaseEvent.LONG_PRESS_CHANGE_LANGUAGE,
                  {}
                );
                if (onLongPressSwitchLanguage) {
                  onLongPressSwitchLanguage();
                }
              }}
            />
          )}
        </RowContainer>
      </MainContainer>
    </View>
  );
};

interface PropsBack {
  onLongPressSwitchLanguage?: () => void;
  navigation: any;
  backScreen?: string;
}
export const HeaderWithBackForWrapper = ({
  onLongPressSwitchLanguage,
  navigation,
  backScreen,
}: PropsBack) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslationWithRTL();

  return (
    <View style={{ paddingTop: insets.top }}>
      <MainContainer isRTL={false}>
        <SmallButton
          iconName="arrow-back-outline"
          onPress={
            !!backScreen
              ? () => {
                  navigation.popToTop();
                  navigation.navigate(backScreen);
                }
              : navigation.goBack
          }
          label={t("global.back_button_accessibility")}
        />
        <RowContainer>
          <LanguageSwitch
            onLongPressSwitchLanguage={() => {
              logEventInFirebase(FirebaseEvent.LONG_PRESS_CHANGE_LANGUAGE, {});
              if (onLongPressSwitchLanguage) {
                onLongPressSwitchLanguage();
              }
            }}
          />
        </RowContainer>
      </MainContainer>
    </View>
  );
};
