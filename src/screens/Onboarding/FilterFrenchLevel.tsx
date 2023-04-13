import React from "react";
import { OnboardingParamList } from "../../../types";
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
import { FilterButton, Page, RadioGroup, Rows } from "../../components";
import { View } from "react-native";
import { MobileFrenchLevel } from "@refugies-info/api-types";

export const FilterFrenchLevel = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterFrenchLevel">) => {
  const [selectedFrenchLevel, setSelectedFrenchLevel] =
    React.useState<null | MobileFrenchLevel>(null);
  const { t } = useTranslationWithRTL();

  const navigateToNextScreen = () => navigation.navigate("FinishOnboarding");

  const dispatch = useDispatch();

  const userFrenchLevel = useSelector(userFrenchLevelSelector);

  React.useEffect(() => {
    if (userFrenchLevel) {
      const formattedLevel = frenchLevelFilters.find(
        (frenchLevelFilter) => frenchLevelFilter.key === userFrenchLevel
      );
      if (formattedLevel) {
        setSelectedFrenchLevel(formattedLevel.key);
      }
    }
  }, [userFrenchLevel]);

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
    dispatch(removeUserFrenchLevelActionCreator(false));
    return navigateToNextScreen();
  };

  const onSelectFrenchLevel = (frenchLevel: MobileFrenchLevel) => {
    if (selectedFrenchLevel === frenchLevel) {
      setSelectedFrenchLevel(null);
    } else {
      setSelectedFrenchLevel(frenchLevel);
    }
  };

  return (
    <Page
      headerIconName={"person-outline"}
      headerTitle={t("onboarding_screens.me", "Créer mon profil")}
      hideLanguageSwitch
    >
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
        <View>
          <OnboardingProgressBar step={3} />
          <BottomButtons
            isRightButtonDisabled={!selectedFrenchLevel}
            onLeftButtonClick={onValidate}
            onRightButtonClick={onValidate}
          />
        </View>
      </Rows>
    </Page>
  );
};
