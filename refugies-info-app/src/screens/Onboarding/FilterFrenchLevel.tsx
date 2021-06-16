import * as React from "react";
import { View } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../../components/Onboarding/BottomButtons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import {
  ContentContainer,
  Title,
} from "../../components/Onboarding/SharedStyledComponents";

export const FilterFrenchLevel = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterFrenchLevel">) => {
  const { t } = useTranslationWithRTL();
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <OnboardingHeader navigation={navigation} />
      <ContentContainer>
        <View>
          <Title>
            {t(
              "Onboarding.niveauFrancais",
              "Quel est ton niveau en français ?"
            )}
          </Title>
        </View>
        <View>
          <OnboardingProgressBar step={3} />
          <BottomButtons
            isRightButtonDisabled={false}
            onButtonClick={() => navigation.navigate("FinishOnboarding")}
          />
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
