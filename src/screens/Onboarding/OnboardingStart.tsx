import React from "react";
import { Image, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { OnboardingParamList } from "../../../types";
import { StyledTextBigBold } from "../../components/StyledText";
import { styles } from "../../theme";
import styled from "styled-components/native";
import IlluOnboarding from "../../theme/images/onboarding/illu_onboardingv4_opt.png";

import { CustomButton } from "../../components/CustomButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Content, Rows } from "../../components";

const MainView = styled(SafeAreaView)`
  background-color: ${styles.colors.darkBlue};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  max-height: 100%;
  padding-bottom: ${({ theme }) => theme.insets.bottom}px;
`;

const StyledText = styled(StyledTextBigBold)`
  color: ${styles.colors.white};
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
      <HeaderWithBack />
      <Image
        source={IlluOnboarding}
        style={{
          height: 370,
          width: "100%",
          position: "absolute",
          top: 0,
        }}
        resizeMode="cover"
      />
      <Content>
        <Rows verticalAlign="flex-end">
          <ScrollView contentContainerStyle={{ justifyContent: "flex-start" }}>
            <StyledText marginBottom={`${styles.margin * 8}px`}>
              {t("onboarding_screens.bonjour", "trad")}
            </StyledText>
          </ScrollView>

          <CustomButton
            i18nKey="onboarding_screens.startonboarding_screens.start"
            defaultText="C'est parti"
            textColor={styles.colors.darkBlue}
            onPress={() => navigation.navigate("OnboardingSteps")}
            iconName="arrow-forward-outline"
          />
        </Rows>
      </Content>
    </MainView>
  );
};
