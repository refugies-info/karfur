import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { GetContentsForAppRequest } from "@refugies-info/api-types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { Title } from "../../components/Onboarding/SharedStyledComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ageFilters } from "../../data/filtersData";
import { Explaination } from "../../components/Onboarding/Explaination";
import {
  saveUserAgeActionCreator,
  removeUserAgeActionCreator,
} from "../../services/redux/User/user.actions";
import { userAgeSelector } from "../../services/redux/User/user.selectors";
import { FilterButton, RadioGroup, ReadableText, Rows } from "../../components";
import PageOnboarding from "../../components/layout/PageOnboarding";

export const FilterAge = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterAge">) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();

  const [selectedAge, setSelectedAge] = useState<
    GetContentsForAppRequest["age"] | null
  >(null);
  const userAge = useSelector(userAgeSelector);

  useEffect(() => {
    if (userAge) setSelectedAge(userAge);
  }, [userAge]);

  const navigateToNextScreen = useCallback(
    () => navigation.navigate("FilterFrenchLevel"),
    [navigation]
  );

  const onSkip = useCallback(() => {
    dispatch(removeUserAgeActionCreator(false));
    return navigateToNextScreen();
  }, [navigateToNextScreen]);

  const onValidate = () => {
    if (selectedAge) {
      dispatch(
        saveUserAgeActionCreator({
          age: selectedAge,
          shouldFetchContents: false,
        })
      );
      return navigateToNextScreen();
    }
    onSkip();
  };

  const onAgeClick = (age: GetContentsForAppRequest["age"]) => {
    if (selectedAge && selectedAge === age) return setSelectedAge(null);
    return setSelectedAge(age);
  };

  return (
    <PageOnboarding
      onPrevious={() => navigation.navigate("FilterCity")}
      onNext={onValidate}
      disableNext={selectedAge === null}
    >
      <OnboardingProgressBar step={2} onSkip={onSkip} />

      <Rows layout="1 auto" verticalAlign="space-between">
        <View>
          <Title>
            <ReadableText>
              {t("onboarding_screens.age", "Quel âge as-tu ?")}
            </ReadableText>
          </Title>
          <Explaination
            step={2}
            defaultText="C’est pour te montrer les démarches et les activités pour ton âge."
          />
          <RadioGroup>
            {ageFilters.map((age) => (
              <FilterButton
                key={age.name}
                text={age.name}
                isSelected={age.key === selectedAge}
                onPress={() => onAgeClick(age.key)}
              />
            ))}
          </RadioGroup>
        </View>
      </Rows>
    </PageOnboarding>
  );
};
