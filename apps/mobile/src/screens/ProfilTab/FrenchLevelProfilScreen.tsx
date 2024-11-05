import { StackScreenProps } from "@react-navigation/stack";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "styled-components/native";
import { Page } from "~/components";
import { FilterFrenchLevelComponent } from "~/components/Profil/FilterFrenchLevelComponent";
import { frenchLevelFilters } from "~/data/filtersData";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { saveUserFrenchLevelActionCreator } from "~/services/redux/User/user.actions";
import { userFrenchLevelSelector } from "~/services/redux/User/user.selectors";
import { ProfileParamList } from "~/types/navigation";

export const FrenchLevelProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "FrenchLevelProfilScreen">) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const userFrenchLevel = useSelector(userFrenchLevelSelector);
  const selectedFrenchLevel: MobileFrenchLevel | null =
    frenchLevelFilters.find((frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel)?.key || null;

  const onValidateFrenchLevel = (frenchLevelKey: MobileFrenchLevel) => {
    if (selectedFrenchLevel && selectedFrenchLevel === frenchLevelKey) return;
    dispatch(
      saveUserFrenchLevelActionCreator({
        frenchLevel: frenchLevelKey,
        shouldFetchContents: true,
      }),
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
