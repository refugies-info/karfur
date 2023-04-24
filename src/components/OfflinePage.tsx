import React from "react";
import { Image, Linking, Platform, Text } from "react-native";
import styled from "styled-components/native";
import { Rows } from "./layout";
import { Button } from "./buttons";
import { useTheme } from "styled-components";
import { useTranslationWithRTL } from "../hooks";
import Logo from "../theme/images/logo.svg";
import AppInPhone from "../theme/images/app-in-phone.png";
import { TextNormalBold } from "./StyledText";

const MainContainer = styled.View`
  padding-horizontal: 30px;
  max-width: 100%;
  width: 100%;
  min-height: 100%;
  padding-top: 50px;
`;

const ratio = 40 / 58;
const LOGO_WIDTH = 100;
const LOGO_HEIGHT = 100 * ratio;

const storeUrl =
  Platform.OS === "android"
    ? "https://play.google.com/store/apps/details?id=com.refugiesinfo.app"
    : "https://apps.apple.com/app/id1595597429";

const OfflinePage = () => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();

  const goToStore = () => {
    Linking.canOpenURL(storeUrl).then((supported) => {
      if (!supported) {
        return;
      }
      Linking.openURL(storeUrl);
    });
  };
  return (
    <MainContainer>
      <Rows layout="auto 1 1 1" horizontalAlign="center" verticalAlign="center">
        <Image style={{ height: 250, width: 125 }} source={AppInPhone} />
        <Logo
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          accessible={true}
          accessibilityLabel="Réfugiés point info"
        />
        <TextNormalBold style={{ textAlign: "center" }}>
          {t(
            "global.new_app_version",
            "Une nouvelle version de l'application Réfugiés.info est disponible."
          )}
        </TextNormalBold>
        <Button
          accessibilityLabel="Mettre à jour sur le Store"
          backgroundColor={theme.colors.darkBlue}
          color={theme.colors.darkBlue}
          iconAfter
          iconColor={theme.colors.white}
          iconName="arrow-forward-outline"
          onPress={goToStore}
          title="Télécharger"
        />
      </Rows>
    </MainContainer>
  );
};

export default OfflinePage;
