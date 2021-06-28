import * as React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextNormal } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ProfilParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

export const LangueProfilScreen = ({
  navigation,
}: StackScreenProps<ProfilParamList, "LangueProfilScreen">) => {
  const { t } = useTranslationWithRTL();
  return (
    <SafeAreaView>
      <HeaderWithBack
        navigation={navigation}
        text={t("Profil.Langue choisie", "Langue choisie")}
        iconName="globe-2-outline"
      />
      <TextNormal>Langue</TextNormal>
    </SafeAreaView>
  );
};
