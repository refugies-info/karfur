import { StackScreenProps } from "@react-navigation/stack";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rows } from "~/components";
import PageOnboarding from "~/components/layout/PageOnboarding";
import { OnboardingProgressBar } from "~/components/Onboarding/OnboardingProgressBar";
import { FilterFrenchLevelComponent } from "~/components/Profil/FilterFrenchLevelComponent";
import { frenchLevelFilters } from "~/data/filtersData";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import {
  removeUserFrenchLevelActionCreator,
  saveUserFrenchLevelActionCreator,
} from "~/services/redux/User/user.actions";
import { userFrenchLevelSelector } from "~/services/redux/User/user.selectors";
import { OnboardingParamList } from "~/types/navigation";

export const FilterFrenchLevel = ({ navigation }: StackScreenProps<OnboardingParamList, "FilterFrenchLevel">) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();

  const [selectedFrenchLevel, setSelectedFrenchLevel] = useState<null | MobileFrenchLevel>(null);
  const userFrenchLevel = useSelector(userFrenchLevelSelector);

  useEffect(() => {
    if (userFrenchLevel) {
      const formattedLevel = frenchLevelFilters.find((frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel);
      if (formattedLevel) {
        setSelectedFrenchLevel(formattedLevel.key);
      }
    }
  }, [userFrenchLevel]);

  const navigateToNextScreen = useCallback(() => navigation.navigate("ActivateNotificationsScreen"), [navigation]);

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
        }),
      );
      return navigateToNextScreen();
    }
    onSkip();
  };

  const onSelectFrenchLevel = (frenchLevel: MobileFrenchLevel) => {
    if (selectedFrenchLevel === frenchLevel) return setSelectedFrenchLevel(null);
    return setSelectedFrenchLevel(frenchLevel);
  };

  return (
    <PageOnboarding
      onPrevious={() => navigation.navigate("FilterAge")}
      onNext={onValidate}
      disableNext={selectedFrenchLevel === null}
    >
      <OnboardingProgressBar step={3} onSkip={onSkip} />
      <Rows layout="1 auto" verticalAlign="space-between">
        <FilterFrenchLevelComponent
          selectedFrenchLevel={selectedFrenchLevel}
          onSelectFrenchLevel={onSelectFrenchLevel}
        />
      </Rows>
    </PageOnboarding>
  );
};
