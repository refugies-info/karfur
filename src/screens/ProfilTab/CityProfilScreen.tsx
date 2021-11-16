import * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { FilterCityComponent } from "../../components/Geoloc/FilterCityComponent";

export const CityProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "CityProfilScreen">) => {
  const { t } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top
      }}
    >
      <HeaderWithBack
        navigation={navigation}
        text={t("Profil.Ville", "Ville")}
        iconName="pin-outline"
      />
      <FilterCityComponent navigation={navigation} isOnboardingScreen={false} />
    </View>
  );
};
