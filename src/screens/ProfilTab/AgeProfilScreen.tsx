import * as React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextBigBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { theme } from "../../theme";
import { ageFilters } from "../../data/filtersData";
import { FilterButton } from "../../components/Onboarding/FilterButton";
import { Explaination } from "../../components/Onboarding/Explaination";
import { useDispatch, useSelector } from "react-redux";
import { userAgeSelector } from "../../services/redux/User/user.selectors";
import {
  saveUserAgeActionCreator,
  removeUserAgeActionCreator,
} from "../../services/redux/User/user.actions";

const ContentContainer = styled.View`
  padding: ${theme.margin * 3}px;
`;

const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 2}px;
`;

export const AgeProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "AgeProfilScreen">) => {
  const [selectedAge, setSelectedAge] = React.useState<string | null>(null);

  const dispatch = useDispatch();

  const userAge = useSelector(userAgeSelector);

  React.useEffect(() => {
    if (userAge) {
      setSelectedAge(userAge);
    }
  }, [userAge]);

  const removeAge = () => {
    if (!selectedAge) return;
    dispatch(removeUserAgeActionCreator(true));
    return navigation.goBack();
  };

  const onValidateAge = (age: string) => {
    if (selectedAge === age) return;
    dispatch(saveUserAgeActionCreator({ age, shouldFetchContents: true }));
    return navigation.goBack();
  };

  const { t } = useTranslationWithRTL();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderWithBack
        navigation={navigation}
        text={t("Profil.Âge", "Âge")}
        iconName="calendar-outline"
      />
      <ContentContainer>
        <Title>{t("Onboarding.age", "Quel âge as-tu ?")}</Title>
        <Explaination
          step={2}
          defaultText="C’est pour te montrer les démarches et les activités pour ton âge."
        />
        <View accessibilityRole="radiogroup">
          {ageFilters.map((age) => (
            <FilterButton
              key={age}
              text={age}
              isSelected={age === selectedAge}
              onPress={() => onValidateAge(age)}
            />
          ))}
          <FilterButton
            text={"Ne pas filtrer selon mon âge"}
            isSelected={!selectedAge}
            onPress={removeAge}
          />
        </View>
      </ContentContainer>
    </SafeAreaView>
  );
};
