import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { OnboardingParamList } from "../../../types";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { Title } from "../../components/Onboarding/SharedStyledComponents";
import { frenchLevelFilters } from "../../data/filtersData";
import { Explaination } from "../../components/Onboarding/Explaination";
import {
  saveUserFrenchLevelActionCreator,
  removeUserFrenchLevelActionCreator,
} from "../../services/redux/User/user.actions";
import { userFrenchLevelSelector } from "../../services/redux/User/user.selectors";
import { FilterButton, RadioGroup, Rows } from "../../components";
import PageOnboarding from "../../components/layout/PageOnboarding";

export const FilterFrenchLevel = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterFrenchLevel">) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();

  const [selectedFrenchLevel, setSelectedFrenchLevel] =
    useState<null | MobileFrenchLevel>(null);
  const userFrenchLevel = useSelector(userFrenchLevelSelector);

  useEffect(() => {
    if (userFrenchLevel) {
      const formattedLevel = frenchLevelFilters.find(
        (frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel
      );
      if (formattedLevel) {
        setSelectedFrenchLevel(formattedLevel.key);
      }
    }
  }, [userFrenchLevel]);

  const navigateToNextScreen = useCallback(
    () => navigation.navigate("FinishOnboarding"),
    [navigation]
  );

  const onSkip = useCallback(() => {
    dispatch(removeUserFrenchLevelActionCreator(false));
    return navigateToNextScreen();
  }, [navigateToNextScreen]);

  const onValidate = () => {
    if (selectedFrenchLevel) {
      dispatch(
        saveUserFrenchLevelActionCreator({
          frenchLevel: selectedFrenchLevel,
          shouldFetchContents: false,
        })
      );
      return navigateToNextScreen();
    }
    onSkip();
  };

  const onSelectFrenchLevel = (frenchLevel: MobileFrenchLevel) => {
    if (selectedFrenchLevel === frenchLevel)
      return setSelectedFrenchLevel(null);
    return setSelectedFrenchLevel(frenchLevel);
  };

  return (
    <PageOnboarding
      onPrevious={() => navigation.navigate("FilterAge")}
      onNext={onValidate}
    >
      <OnboardingProgressBar step={3} onSkip={onSkip} />
      <Rows layout="1 auto" verticalAlign="space-between">
        <View>
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
                  frenchLevel.key === selectedFrenchLevel
                }
                onPress={() => {
                  onSelectFrenchLevel(frenchLevel.key);
                }}
                details={frenchLevel.cecrCorrespondency}
              />
            ))}
          </RadioGroup>
        </View>
      </Rows>
    </PageOnboarding>
  );
};
