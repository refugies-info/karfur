import React from "react";
import { OnboardingParamList, FrenchLevel } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../../components/Onboarding/BottomButtons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { Title } from "../../components/Onboarding/SharedStyledComponents";
import { frenchLevelFilters } from "../../data/filtersData";
import { Explaination } from "../../components/Onboarding/Explaination";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserFrenchLevelActionCreator,
  removeUserFrenchLevelActionCreator,
} from "../../services/redux/User/user.actions";
import { userFrenchLevelSelector } from "../../services/redux/User/user.selectors";
import { FilterButton, Page, RadioGroup } from "../../components";

export const FilterFrenchLevel = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterFrenchLevel">) => {
  const [selectedFrenchLevel, setSelectedFrenchLevel] =
    React.useState<null | FrenchLevel>(null);
  const { t } = useTranslationWithRTL();

  const navigateToNextScreen = () => navigation.navigate("FinishOnboarding");

  const dispatch = useDispatch();

  const userFrenchLevel = useSelector(userFrenchLevelSelector);

  React.useEffect(() => {
    if (userFrenchLevel) {
      const formattedLevel = frenchLevelFilters.filter(
        (frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel
      );
      if (formattedLevel.length > 0) {
        setSelectedFrenchLevel(formattedLevel[0]);
      }
    }
  }, [userFrenchLevel]);

  const onValidate = () => {
    if (selectedFrenchLevel) {
      dispatch(
        saveUserFrenchLevelActionCreator({
          frenchLevel: selectedFrenchLevel.key,
          shouldFetchContents: false,
        })
      );
      return navigateToNextScreen();
    }
    dispatch(removeUserFrenchLevelActionCreator(false));
    return navigateToNextScreen();
  };

  const onSelectFrenchLevel = (frenchLevel: FrenchLevel) => {
    if (selectedFrenchLevel && selectedFrenchLevel.key === frenchLevel.key) {
      setSelectedFrenchLevel(null);
      return;
    }

    setSelectedFrenchLevel(frenchLevel);
    return;
  };
  return (
    <Page
      headerIconName={"person-outline"}
      headerTitle={t("onboarding_screens.me", "Créer mon profil")}
      hideLanguageSwitch
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
            onPress={() => onSelectFrenchLevel(frenchLevel)}
            details={frenchLevel.cecrCorrespondency}
          />
        ))}
      </RadioGroup>
      <OnboardingProgressBar step={3} />
      <BottomButtons
        isRightButtonDisabled={!selectedFrenchLevel}
        onLeftButtonClick={onValidate}
        onRightButtonClick={onValidate}
      />
    </Page>
  );
};
