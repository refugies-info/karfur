import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { FilterCityComponent } from "../../components/Geoloc/FilterCityComponent";

export const CityProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "CityProfilScreen">) => {
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
        text={t("Profil.Ville", "Ville")}
        iconName="pin-outline"
      />
      <FilterCityComponent navigation={navigation} isOnboardingScreen={false} />
    </SafeAreaView>
  );
};
