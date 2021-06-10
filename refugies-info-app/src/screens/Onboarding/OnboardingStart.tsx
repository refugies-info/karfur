import { Button, Image, ImageBackground, StyleSheet } from "react-native";
import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";
import { t } from "../../services/i18n";
import { Header } from "../../components/Header";
import { TextNormal } from "../../components/StyledText";
import { theme } from "../../theme";
import styled from "styled-components/native";
// import IlluOnboarding from "../../theme/images/onboarding/illu_onboarding.svg";
import IlluOnboarding from "../../theme/images/onboarding/illu-onboarding.png";

const MainView = styled.View`
  background-color: ${theme.colors.darkBlue};
  display: flex;
  flex: 1;
`;

const ImageContainer = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  background-color: red;
  left: 0;
`;

const styles = StyleSheet.create({
  backgroundImage: {
    // flex: 1,
    resizeMode: "cover", // or 'stretch'
    width: "100%",
    // height: "370",
  },
});

export const OnboardingStart = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "OnboardingStart">) => {
  return (
    <MainView>
      {/* <ImageBackground source={IlluOnboarding} style={styles.backgroundImage}>
        <Header hideLanguageSwitch={true} hideLogo={true} />
      </ImageBackground> */}
      <ImageContainer>
        <Image source={IlluOnboarding} style={styles.backgroundImage} />
      </ImageContainer>
      {/* <TextNormal>
        {t("Onboarding1.welcome", "onboarding1 trad not loaded")}
      </TextNormal>
      <Button
        title="Suivant"
        onPress={() => {
          navigation.navigate("Onboarding2");
        }}
      /> */}
    </MainView>
  );
};
