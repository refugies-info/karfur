import * as React from "react";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useDispatch, useSelector } from "react-redux";
import { userFrenchLevelSelector } from "../../services/redux/User/user.selectors";
import { frenchLevelFilters } from "../../data/filtersData";
import {
  saveUserFrenchLevelActionCreator,
  removeUserFrenchLevelActionCreator,
} from "../../services/redux/User/user.actions";
import { Explaination } from "../../components/Onboarding/Explaination";
import { FilterButton, Page, RadioGroup, Title } from "../../components";

export const FrenchLevelProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "FrenchLevelProfilScreen">) => {
  const dispatch = useDispatch();

  const userFrenchLevel = useSelector(userFrenchLevelSelector);
  const selectedFrenchLevel = frenchLevelFilters.find(
    (frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel
  );

  const onValidateFrenchLevel = (frenchLevelKey: string) => {
    if (selectedFrenchLevel && selectedFrenchLevel.key === frenchLevelKey)
      return;
    dispatch(
      saveUserFrenchLevelActionCreator({
        frenchLevel: frenchLevelKey,
        shouldFetchContents: true,
      })
    );
    navigation.goBack();
  };

  const removeFrenchLevel = () => {
    if (!selectedFrenchLevel) return;
    dispatch(removeUserFrenchLevelActionCreator(true));
    navigation.goBack();
  };

  const { t } = useTranslationWithRTL();
  return (
    <Page
      headerTitle={t("profile_screens.french_level", "Niveau de français")}
      headerIconName="message-circle-outline"
    >
      <Title>
        {t(
          "onboarding_screens.french_level",
          "Quel est ton niveau en français ?"
        )}
      </Title>
      <Explaination
        step={3}
        defaultText="C’est pour te montrer les formations faites pour ton niveau de français."
      />
      <RadioGroup>
        {frenchLevelFilters.map((frenchLevel) => (
          <FilterButton
            key={frenchLevel.name}
            text={frenchLevel.name}
            isSelected={
              !!selectedFrenchLevel &&
              frenchLevel.key === selectedFrenchLevel.key
            }
            onPress={() => onValidateFrenchLevel(frenchLevel.key)}
            details={frenchLevel.cecrCorrespondency}
          />
        ))}
        <FilterButton
          text="no_french_level_filter"
          isSelected={!selectedFrenchLevel}
          onPress={removeFrenchLevel}
        />
      </RadioGroup>
    </Page>
  );
};
