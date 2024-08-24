import * as React from "react";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useDispatch, useSelector } from "react-redux";
import { userFrenchLevelSelector } from "../../services/redux/User/user.selectors";
import { frenchLevelFilters } from "../../data/filtersData";
import { saveUserFrenchLevelActionCreator } from "../../services/redux/User/user.actions";
import { Page } from "../../components";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { useTheme } from "styled-components/native";
import { FilterFrenchLevelComponent } from "../../components/Profil/FilterFrenchLevelComponent";

export const FrenchLevelProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "FrenchLevelProfilScreen">) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const userFrenchLevel = useSelector(userFrenchLevelSelector);
  const selectedFrenchLevel: MobileFrenchLevel | null =
    frenchLevelFilters.find(
      (frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel
    )?.key || null;

  const onValidateFrenchLevel = (frenchLevelKey: MobileFrenchLevel) => {
    if (selectedFrenchLevel && selectedFrenchLevel === frenchLevelKey) return;
    dispatch(
      saveUserFrenchLevelActionCreator({
        frenchLevel: frenchLevelKey,
        shouldFetchContents: true,
      })
    );
    navigation.goBack();
  };

  const { t } = useTranslationWithRTL();
  return (
    <Page
      headerTitle={t("profile_screens.french_level", "Niveau de français")}
      headerIconName="message-circle-outline"
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
    >
      <FilterFrenchLevelComponent
        selectedFrenchLevel={selectedFrenchLevel}
        onSelectFrenchLevel={onValidateFrenchLevel}
      />
    </Page>
  );
};
