import { Image, Linking } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { storeUrl } from "~/data/storeLinks";
import { useTranslationWithRTL } from "~/hooks";
import AppInPhone from "~/theme/images/app-in-phone.png";
import Logo from "~/theme/images/logo.svg";
import { Button } from "./buttons";
import { Rows } from "./layout";
import { TextDSFR_L_Bold } from "./StyledText";

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
        <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} accessible={true} accessibilityLabel="Réfugiés point info" />
        <TextDSFR_L_Bold style={{ textAlign: "center" }}>
          {t("global.new_app_version", "Une nouvelle version de l'application Réfugiés.info est disponible.")}
        </TextDSFR_L_Bold>
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
