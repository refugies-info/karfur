import { StackScreenProps } from "@react-navigation/stack";
import { GetContentsForAppRequest } from "@refugies-info/api-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rows } from "~/components";
import PageOnboarding from "~/components/layout/PageOnboarding";
import { OnboardingProgressBar } from "~/components/Onboarding/OnboardingProgressBar";
import { FilterAgeComponent } from "~/components/Profil/FilterAgeComponent";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { removeUserAgeActionCreator, saveUserAgeActionCreator } from "~/services/redux/User/user.actions";
import { userAgeSelector } from "~/services/redux/User/user.selectors";
import { OnboardingParamList } from "~/types/navigation";

export const FilterAge = ({ navigation }: StackScreenProps<OnboardingParamList, "FilterAge">) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();

  const [selectedAge, setSelectedAge] = useState<GetContentsForAppRequest["age"] | undefined>(undefined);
  const userAge = useSelector(userAgeSelector);

  useEffect(() => {
    if (userAge) setSelectedAge(userAge);
  }, [userAge]);

  const navigateToNextScreen = useCallback(() => navigation.navigate("FilterFrenchLevel"), [navigation]);

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
        }),
      );
      return navigateToNextScreen();
    }
    onSkip();
  };

  const onAgeClick = (age: GetContentsForAppRequest["age"]) => {
    if (selectedAge && selectedAge === age) return setSelectedAge(undefined);
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
        <FilterAgeComponent selectedAge={selectedAge} onAgeClick={onAgeClick} />
      </Rows>
    </PageOnboarding>
  );
};
