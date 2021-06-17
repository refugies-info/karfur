import * as React from "react";
import { View } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingHeader } from "./OnboardingHeader";
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
import { saveUserAgeActionCreator } from "../../services/redux/User/user.actions";
import { userAgeSelector } from "../../services/redux/User/user.selectors";

export const FilterAge = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterAge">) => {
  const [selectedAge, setSelectedAge] = React.useState("");
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
      dispatch(saveUserAgeActionCreator(selectedAge));
      navigateToNextScreen();
    }
  };

  const { t } = useTranslationWithRTL();
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <OnboardingHeader navigation={navigation} />
      <ContentContainer>
        <View>
          <Title>{t("Onboarding.age", "Quel âge as-tu ?")}</Title>
          {ageFilters.map((age) => (
            <FilterButton
              key={age}
              text={age}
              isSelected={age === selectedAge}
              onPress={() => setSelectedAge(age)}
            />
          ))}
          <Explaination
            step={2}
            defaultText="C’est pour te montrer les démarches et les activités pour ton âge."
          />
        </View>
        <View>
          <OnboardingProgressBar step={2} />
          <BottomButtons
            isRightButtonDisabled={!selectedAge}
            onLeftButtonClick={navigateToNextScreen}
            onRightButtonClick={onValidate}
          />
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
