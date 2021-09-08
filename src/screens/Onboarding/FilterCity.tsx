import * as React from "react";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { HeaderWithBack } from "../../components/HeaderWithBack";

import { FilterCityComponent } from "../../components/Geoloc/FilterCityComponent";

export const FilterCity = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterCity">) => {
  const { t } = useTranslationWithRTL();

  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <HeaderWithBack
        navigation={navigation}
        iconName={"person-outline"}
        text={t("Onboarding.Créer mon profil", "Créer mon profil")}
      />
      <FilterCityComponent navigation={navigation} isOnboardingScreen={true} />
    </SafeAreaView>
  );
};
