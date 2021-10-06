import { Image, StyleSheet } from "react-native";
import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";
import { StyledTextBigBold } from "../../components/StyledText";
import { theme } from "../../theme";
import styled from "styled-components/native";
import IlluOnboarding from "../../theme/images/onboarding/illu_onboardingv4_opt.png";

import { CustomButton } from "../../components/CustomButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { SafeAreaView } from "react-native-safe-area-context";

const MainView = styled(SafeAreaView)`
  background-color: ${theme.colors.darkBlue};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const ElementsContainer = styled.View`
  padding: ${theme.margin * 3}px;
`;

const styles = StyleSheet.create({
  backgroundImage: {
    height: 370,
    width: "100%",

    position: "absolute",
    top: 0,
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
      <HeaderWithBack navigation={navigation} />
      <Image
        source={IlluOnboarding}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ElementsContainer>
        <StyledText marginBottom={`${theme.margin * 8}px`}>
          {t("Onboarding.bonjour", "trad")}
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
