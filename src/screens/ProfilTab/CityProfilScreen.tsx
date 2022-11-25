import * as React from "react";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { FilterCityComponent } from "../../components/Geoloc/FilterCityComponent";
import { Page } from "../../components";

export const CityProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "CityProfilScreen">) => {
  const { t } = useTranslationWithRTL();
  return (
    <Page
      headerTitle={t("profile_screens.city", "Ville")}
      headerIconName="pin-outline"
      noBottomMargin
    >
      <FilterCityComponent navigation={navigation} isOnboardingScreen={false} />
    </Page>
  );
};
