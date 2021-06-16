import * as React from "react";
import { View } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../../components/Onboarding/BottomButtons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ContentContainer,
  Title,
} from "../../components/Onboarding/SharedStyledComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

export const FilterAge = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterAge">) => {
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
          <Title>{t("Onboarding.age", "Quel âge as-tu ?")}</Title>
        </View>
        <View>
          <OnboardingProgressBar step={2} />
          <BottomButtons
            isRightButtonDisabled={false}
            onButtonClick={() => navigation.navigate("FilterFrenchLevel")}
          />
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
