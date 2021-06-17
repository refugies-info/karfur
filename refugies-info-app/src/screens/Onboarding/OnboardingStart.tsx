import { Image, StyleSheet } from "react-native";
import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";
import { Header } from "../../components/Header";
import { StyledTextBigBold } from "../../components/StyledText";
import { theme } from "../../theme";
import styled from "styled-components/native";
import IlluOnboarding from "../../theme/images/onboarding/illu-onboarding.png";
import { CustomButton } from "../../components/CustomButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const MainView = styled.View`
  background-color: ${theme.colors.darkBlue};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const ImageContainer = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
`;

const ElementsContainer = styled.View`
  padding: ${theme.margin * 3}px;
`;

const styles = StyleSheet.create({
  backgroundImage: {
    // flex: 1,
    resizeMode: "cover", // or 'stretch'
    width: "100%",
    // height: "370",
  },
});

const StyledText = styled(StyledTextBigBold)`
  color: ${theme.colors.white};
  text-align: center;
  margin-top: ${(props: { marginTop: string }) => props.marginTop || "0px"};
  margin-bottom: ${(props: { marginBottom: string }) =>
    props.marginBottom || "0px"};
`;

export const OnboardingStart = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "OnboardingStart">) => {
  const { t } = useTranslationWithRTL();
  return (
    <MainView>
      <Header hideLogo={true} hideLanguageSwitch={true} />
      <ImageContainer>
        <Image source={IlluOnboarding} style={styles.backgroundImage} />
      </ImageContainer>
      <ElementsContainer>
        <StyledText>{t("Onboarding.bonjour", "trad")}</StyledText>
        <StyledText
          marginBottom={`${theme.margin * 5}px`}
          marginTop={`${theme.margin * 2}px`}
        >
          {t("Onboarding.bonjour_desc", "trad")}
        </StyledText>

        <CustomButton
          i18nKey={"Onboarding.parti"}
          defaultText="C'est parti"
          textColor={theme.colors.darkBlue}
          onPress={() => navigation.navigate("OnboardingSteps")}
        />
      </ElementsContainer>
    </MainView>
  );
};
