import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { RowContainer, RTLView } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";
import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { logEventInFirebase } from "../utils/logEvent";
import { FirebaseEvent } from "../utils/eventsUsedInFirebase";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { StyledTextSmallBold } from "./StyledText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MainContainer = styled(RowContainer)`
  padding-horizontal: ${theme.margin * 3}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  padding-top: ${theme.margin}px;
`;
const StyledText = styled(StyledTextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
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
  iconName
}: Props) => {
  const { isRTL } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: theme.margin }}>
      <MainContainer isRTL={false}>
        {!hideLogo ?
          <Logo
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            accessibilityLabel="Réfugiés point info"
          /> :
          <View />
        }
        {text &&
          <RTLView>
            {iconName &&
              <Icon
                name={iconName}
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={theme.colors.black}
              />}
            <StyledText isRTL={isRTL}>{text}</StyledText>
          </RTLView>
        }
        <RowContainer>
          {!hideLanguageSwitch && (
            <LanguageSwitch
              onLongPressSwitchLanguage={() => {
                logEventInFirebase(FirebaseEvent.LONG_PRESS_CHANGE_LANGUAGE, {});
                if (onLongPressSwitchLanguage) {
                  onLongPressSwitchLanguage();
                }
              }}
            />
          )}
          <SmallButton iconName="volume-up-outline" />
        </RowContainer>
      </MainContainer>
    </View>
  )
}

interface PropsBack {
  onLongPressSwitchLanguage?: () => void;
  navigation: any;
  backScreen?: string
}
export const HeaderWithBackForWrapper = ({
  onLongPressSwitchLanguage,
  navigation,
  backScreen
}: PropsBack) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslationWithRTL();

  return (
    <View style={{ paddingTop: insets.top }}>
      <MainContainer isRTL={false}>
        <SmallButton
          iconName="arrow-back-outline"
          onPress={!!backScreen ?
            () => {
              navigation.popToTop()
              navigation.navigate(backScreen)
            } :
            navigation.goBack
          }
          label={t("Retour à la page précédente")}
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

          <SmallButton iconName="volume-up-outline" />
        </RowContainer>
      </MainContainer>
    </View>
  );
};
