import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../../components/Onboarding/BottomButtons";
import { Title } from "../../components/Onboarding/SharedStyledComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ageFilters } from "../../data/filtersData";
import { FilterButton } from "../../components/Onboarding/FilterButton";
import { Explaination } from "../../components/Onboarding/Explaination";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserAgeActionCreator,
  removeUserAgeActionCreator,
} from "../../services/redux/User/user.actions";
import { userAgeSelector } from "../../services/redux/User/user.selectors";
import { Page } from "../../components";
import { useTheme } from "styled-components/native";

export const FilterAge = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterAge">) => {
  const theme = useTheme();
  const [selectedAge, setSelectedAge] = React.useState<string | null>(null);
  const navigateToNextScreen = () => navigation.navigate("FilterFrenchLevel");

  const dispatch = useDispatch();

  const userAge = useSelector(userAgeSelector);

  useEffect(() => {
    if (userAge) {
      setSelectedAge(userAge);
    }
  }, [userAge]);

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
    dispatch(removeUserAgeActionCreator(false));
    return navigateToNextScreen();
  };

  const onAgeClick = (age: string) => {
    if (selectedAge && selectedAge === age) {
      return setSelectedAge(null);
    }
    return setSelectedAge(age);
  };

  const { t } = useTranslationWithRTL();
  return (
    <Page
      disableAutomaticScroll
      headerIconName={"person-outline"}
      headerTitle={t("onboarding_screens.me", "Créer mon profil")}
      hideLanguageSwitch
    >
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-between",
          padding: theme.margin * 3,
          flexGrow: 1,
        }}
      >
        <View>
          <Title>{t("onboarding_screens.age", "Quel âge as-tu ?")}</Title>
          <Explaination
            step={2}
            defaultText="C’est pour te montrer les démarches et les activités pour ton âge."
          />
          <View accessibilityRole="radiogroup">
            {ageFilters.map((age) => (
              <FilterButton
                key={age.name}
                text={age.name}
                isSelected={age.key === selectedAge}
                onPress={() => onAgeClick(age.key)}
              />
            ))}
          </View>
        </View>
        <View>
          <OnboardingProgressBar step={2} />
          <BottomButtons
            isRightButtonDisabled={!selectedAge}
            onLeftButtonClick={onValidate}
            onRightButtonClick={onValidate}
          />
        </View>
      </ScrollView>
    </Page>
  );
};
