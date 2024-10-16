import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { FilterCityComponent } from "~/components/Geoloc/FilterCityComponent";
import PageOnboarding from "~/components/layout/PageOnboarding";
import { OnboardingProgressBar } from "~/components/Onboarding/OnboardingProgressBar";
import {
  removeUserLocalizedWarningHiddenActionCreator,
  removeUserLocationActionCreator,
  saveUserLocationActionCreator,
} from "~/services/redux/User/user.actions";
import { OnboardingParamList } from "~/types/navigation";

export const FilterCity = ({ navigation }: StackScreenProps<OnboardingParamList, "FilterCity">) => {
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");

  const navigateToNextScreen = useCallback(() => navigation.navigate("FilterAge"), [navigation]);

  const onSkip = useCallback(() => {
    dispatch(removeUserLocationActionCreator(false));
    return navigateToNextScreen();
  }, [navigateToNextScreen]);

  const onValidate = () => {
    dispatch(removeUserLocalizedWarningHiddenActionCreator());
    if (selectedCity && selectedDepartment) {
      dispatch(
        saveUserLocationActionCreator({
          city: selectedCity,
          dep: selectedDepartment,
          shouldFetchContents: false,
        }),
      );
      return navigateToNextScreen();
    }
    onSkip();
  };

  return (
    <PageOnboarding
      onNext={onValidate}
      onPrevious={() => navigation.navigate("OnboardingSteps")}
      disableNext={selectedDepartment === ""}
    >
      <OnboardingProgressBar step={1} onSkip={onSkip} />
      <FilterCityComponent
        selectedCity={selectedCity}
        selectedDepartment={selectedDepartment}
        setSelectedCity={setSelectedCity}
        setSelectedDepartment={setSelectedDepartment}
      />
    </PageOnboarding>
  );
};
