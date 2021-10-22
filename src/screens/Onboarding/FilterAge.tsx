import * as React from "react";
import { View } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { OnboardingProgressBar } from "../../components/Onboarding/OnboardingProgressBar";
import { BottomButtons } from "../../components/Onboarding/BottomButtons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ContentContainer,
  Title,
} from "../../components/Onboarding/SharedStyledComponents";
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

export const FilterAge = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterAge">) => {
  const [selectedAge, setSelectedAge] = React.useState<string | null>(null);
  const navigateToNextScreen = () => navigation.navigate("FilterFrenchLevel");

  const dispatch = useDispatch();

  const userAge = useSelector(userAgeSelector);

  React.useEffect(() => {
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
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <HeaderWithBack
        navigation={navigation}
        iconName={"person-outline"}
        text={t("Onboarding.Créer mon profil", "Créer mon profil")}
      />
      <ContentContainer>
        <View>
          <Title>{t("Onboarding.age", "Quel âge as-tu ?")}</Title>
          <Explaination
            step={2}
            defaultText="C’est pour te montrer les démarches et les activités pour ton âge."
          />
          {ageFilters.map((age) => (
            <FilterButton
              key={age}
              text={age}
              isSelected={age === selectedAge}
              onPress={() => onAgeClick(age)}
            />
          ))}
        </View>
        <View>
          <OnboardingProgressBar step={2} />
          <BottomButtons
            isRightButtonDisabled={!selectedAge}
            onLeftButtonClick={onValidate}
            onRightButtonClick={onValidate}
          />
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
