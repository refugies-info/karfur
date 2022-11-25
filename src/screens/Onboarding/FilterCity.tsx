import React from "react";
import { StackScreenProps } from "@react-navigation/stack";

import { OnboardingParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { FilterCityComponent } from "../../components/Geoloc/FilterCityComponent";
import { Page } from "../../components";

export const FilterCity = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterCity">) => {
  const { t } = useTranslationWithRTL();

  return (
    <Page
      headerIconName={"person-outline"}
      headerTitle={t("onboarding_screens.me", "Créer mon profil")}
      hideLanguageSwitch
      noBottomMargin
    >
      <FilterCityComponent navigation={navigation} isOnboardingScreen={true} />
    </Page>
  );
};
